/**
 * Node.js Proxy Server
 * Date: 'Fri Apr 22 2022 10:01:20 GMT+0800 (中国标准时间)'
 * Author: zhangjialu6
 */
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParse = require('body-parser');
const multiparty = require('multiparty');
const fs = require('fs');
// const zlib = require('zlib');
const expressStaticGzip = require('express-static-gzip');
const app = express();
// const mock = require('../mock');
//  mock(app);
app.use(bodyParse.json());
// app.use(bodyParse.urlencoded({
//   extends: false
// }));




const initApp = (portId, GATEWAY_IP) => {
  app.use('/', expressStaticGzip(path.resolve(__dirname, './web_dist/dist'), { 
    extensions: ['gz','html'],
    // setHeaders: function(res, path, stat) {
    //   // console.log(res);
    //   res.set('Content-Encoding', 'gzip')
    // }
  }));
  // GET请求转发到设备
  app.get(/.*\.(json|cgi)(.*)$/, async function (req, res, next) {
    try {
      let url = req.originalUrl.split('/')[1];
      url = url.split('?')[0];
      console.log('GET URL：', url);
      const { headers } = req;
      headers.origin = `http://${GATEWAY_IP}`;
      headers.referer = `http://${GATEWAY_IP}`;
      headers.host = `http://${GATEWAY_IP}`;
      console.log('Get 请求头：', headers);
      http.get(
        `http://${GATEWAY_IP}/${url}`,
        {
          headers,
          timeout: 60 * 1000
        },
        (proxy_res) => {
          const { statusCode } = proxy_res;
          const contentType = proxy_res.headers['content-type'];
          let error;
          // 任何 2xx 状态码都表示成功响应，但这里只检查 200。
          if (statusCode !== 200) {
            error = new Error('Request Failed.\n'
              + `Status Code: ${statusCode}`);
          } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n'
              + `Expected application/json but received ${contentType}`);
          }
          if (error) {
            console.error(error.message);
            // 消费响应数据以释放内存
            proxy_res.resume();
            res.sendStatus(statusCode);
            return;
          }
          proxy_res.setEncoding('utf8');
          let rawData = '';
          // 接收服务器响应
          proxy_res.on('data', (chunk) => {
            rawData += chunk;
          });
          proxy_res.on('end', () => {
            // const parsedData = JSON.parse(rawData);
            const parsedData = rawData;
            //  console.log(parsedData);
            // res.headers = proxy_res.headers;
            res.header(proxy_res.headers);
            // console.log('GET res.headers', res.headers);
            res.send(parsedData);
          });
        }
      ).on('error', (e) => {
        console.error(`Get error: ${e.message}`);
        res.send(e);
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  })
  // post 转发到设备
  app.post(/.*\.(json|cgi)(.*)$/, async function (req, res, next) {
    console.log(`post:${req.url} proxyed to true device`);
    try {
      let url = req.originalUrl.split('/')[1];
      url = url.split('?')[0];
      // 转发前复制请求头
      const { headers } = req;
      headers.origin = `http://${GATEWAY_IP}`;
      headers.referer = `http://${GATEWAY_IP}`;
      headers.host = `http://${GATEWAY_IP}`;
      //  console.log('请求头：', headers);
      const options = {
        hostname: GATEWAY_IP,
        port: 80,
        path: '/' + url,
        method: 'POST',
        headers: Object.assign({}, headers),
        timeout: 60 * 1000
      };
      let postBody = JSON.stringify(req.body);
      let resTxt = '';
      if (headers['content-type'].includes('multipart/form-data')) {
        const boundaryStr = '----W3X' + Date.now();  // 自定义边界字符串
        const form = new multiparty.Form();
        Object.assign(options.headers, {
          'content-type': `multipart/form-data; boundary=${boundaryStr}`,
          'connection': 'keep-alive'
        })
        // options.headers['content-length'] = 149;
        console.log('multipart/form-data header', options.headers);
        const deviceReq = http.request(options, deviceRes => {
          deviceRes.on('data', chunk => {
            resTxt += chunk;
          })
          deviceRes.on('end', () => {
            const { statusCode } = deviceRes;
            console.log('statusCode:', statusCode);
            if (statusCode != '200') {
              res.sendStatus(statusCode);
            } else {
              res.send(resTxt);
              console.log('Proxy: ', resTxt);
            }
          })
        });
        form.parse(req, (err, fields, files) => {
          console.log(files, fields);
          for (let key of Object.keys(files)) {
            const { path, fieldName, originalFilename } = files[key][0];
            deviceReq.write('--' + boundaryStr + '\r\n'
              + `Content-Disposition: form-data; name="${fieldName}"; filename="${originalFilename}"\r\n`
              + `Content-Type: application/octet-stream\r\n\r\n`
            );
            console.log(boundaryStr + '\r\n'
              + `Content-Disposition: form-data; name="${fieldName}"; filename="${originalFilename}"\r\n`
              + `Content-Type: application/octet-stream\r\n\r\n`);
            // 设置 30 M 缓冲区
            console.log(path);
            // const fileStream = fs.createReadStream(path, { bufferSize: 1024 * 1024 });
            // fileStream.pipe(deviceReq, { end: false });
            // fileStream.on('end', () => {
            //   deviceReq.end('\r\n' + '--' + boundaryStr + '--');
            // });
            // deviceReq.end('hello\r\n' + '--' + boundaryStr + '--\r\n')
            // fileStream.on('error', (e) => {
            //   console.log('fileStream error', e)
            // });
            // fs.readFile('./1.txt', (err, data) => {
            //   console.log('read file done!!! \n', data);
            //   try {

            //     // deviceReq.write('hello');
            //     deviceReq.end('hello\r\n' + '--' + boundaryStr + '--' + '\r\n');
            //   } catch (error) {
            //     console.log(error);
            //   }
            // })
            const fileData = fs.readFileSync(path);
            console.log(fileData);
            deviceReq.write(fileData + '\r\n');
          }
          // 最后的分
          deviceReq.end('--' + boundaryStr + '--\r\n');
          deviceReq.on('error', error => {
            console.error(error);
          })
        })
        return;
      }
      const deviceReq = http.request(options, deviceRes => {
        deviceRes.on('data', chunk => {
          resTxt += chunk;
        })
        deviceRes.on('error', error => {
          console.error(error);
        })
        deviceRes.on('end', () => {
          const { statusCode } = deviceRes;
          console.log(`POST res.headers`, deviceRes.headers);
          res.header(deviceRes.headers);
          console.error(statusCode);
          if (statusCode != '200') {
            res.sendStatus(statusCode);
          } else {
            res.send(resTxt);
            console.log('Proxy: ', resTxt);
          }
        })
      });
      deviceReq.on('error', error => {
        console.error(error);
        res.send(error);
      })
      deviceReq.write(postBody);
      deviceReq.end();
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  })
  app.listen(portId, _ => {
    console.log('Proxy Server running in port ' + portId);
  })
}

// initApp(12345, '192.168.7.1');

// setTimeout(() => {
//   // app.close();
// }, 3 * 1000)

// script.js
console.log(process.argv); 
/*
  '/Users/jialuzhang/.nvm/versions/node/v14.21.3/bin/node',
  '/Users/jialuzhang/MyCode/electron_playground/electron-proxyserver-app/proxy.js',
  '--port',
  '32',
  '--ip',
  '192.168.7.1'
*/
if (process.argv.length > 5) {
    initApp(process.argv[3], process.argv[5])
}
module.exports = { app, initApp }


