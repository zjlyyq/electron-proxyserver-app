import React from 'react';
import ReactDom from 'react-dom';
import { Grid, Button, TextField, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Proxy.css';
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
    window?.versions?.listen && window.versions.listen('stop-serve-ok' , (data) => {
      console.log('stop-serve-ok callback called');
      this.setState({
        status: 'stop',
        runningTime: 0
      })
    })

    window?.versions?.listen && window.versions.listen('start-serve-ok' , (data) => {
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
      <div style={{width: '100%', height: '90%', paddingTop: 40}}>
        <Grid container spacing={1} style={{paddingLeft: 30, paddingRight: 30}}>
          <Grid item xs={4}>
            <TextField  value={this.state.port} label="本机端口" onChange={this.editHost.bind(this)} style={{width: "100%"}}/>
          </Grid>
          <Grid item xs={8}>
            <TextField  value={this.state.proxyIPAddress} label="目标地址" onChange={this.editAddress.bind(this)} style={{width: "100%"}}/>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button onClick={this.startServe}>代理启动</Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={this.stopServe}>代理结束</Button>
          </Grid>
        </Grid>
        {
          this.state.status === 'running' && 
          <Grid container spacing={1} style={{paddingLeft: 30, paddingRight: 30}}>
            <Grid item xs={4}>
              <p className='runText'>运行时间: </p>
            </Grid>
            <Grid item xs={8}>
              <p className='runText runTime'>{this.state.runningTime} </p>
            </Grid>
          </Grid>
        }
      </div>
    )
  }
  
}