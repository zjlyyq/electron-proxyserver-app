import React from 'react';
import ReactDom from 'react-dom';

export default class ProxySetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runningTime: null,
      status: 'stop',
      port: 2333,
      proxyIPAddress: '192.168.7.1',
      logs: []
    }
  }

  editHost(e, val) {
    this.setState({
      port: e.target.value
    })
  }

  editAddress(e, val) {
    this.setState({
      proxyIPAddress: e.target.value
    })
  }
  stopServe = () => {
    window.versions.send('stop-serve');
  }
  startServe = () => {
    console.log('startServer click')
    window.versions.send('start-serve', {
      ...this.state
    });
  }

  componentDidMount() {
    console.log('componentDidMount')
    window.versions.listen('stop-serve-ok' , (data) => {
      console.log('stop-serve-ok callback called');
      this.setState({
        status: 'stop',
        runningTime: 0
      })
    })

    window.versions.listen('start-serve-ok' , (data) => {
      console.log('start-serve-ok callback called');
      const startTime = Date.now();
      this.setState({
        status: 'running',
        runningTime: 0
      })
      console.log('start-serve-ok', 'status='+this.state.status, data)
      const refresh = () => {
        const now = Date.now();
        this.setState({
          runningTime: Math.floor((now - startTime)/1000) + '秒'
        })
        if (this.state.status === 'running') {
          window.requestAnimationFrame(refresh);
        } else {
          console.log(`refresh loop: status = ${this.state.status} offsetTime = ${now - startTime}`)
        }
      }
      window.requestAnimationFrame(refresh)
    })
  }

  render() {
    return (
      <div>
        目标端口：<input value={this.state.port} onChange={this.editHost.bind(this)}/>
        本机主机：<input value={this.state.proxyIPAddress} onChange={this.editAddress.bind(this)}/>
        <p>
          <button onClick={this.startServe}>代理启动</button>
          <button onClick={this.stopServe}>代理结束</button>
        </p>
        {
          this.state.status === 'running' && 
          <p>运行时间: {this.state.runningTime}</p>
        }
      </div>
    )
  }
  
}