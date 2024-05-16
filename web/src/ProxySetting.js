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
      ...this.state,
      port: e.target.value
    })
  }

  editAddress(e, val) {
    this.setState({
      ...this.state,
      proxyIPAddress: e.target.value
    })
  }
  stopServe() {
    window.versions.send('stop-serve');
    window.versions.listen('stop-serve-ok' , (data) => {
      this.setState({
        status: 'stop',
        runningTime: 0
      })
    })
  }
  startServe() {
    window.versions.listen('start-serve-ok' , (data) => {
      const startTime = Date.now();
      this.setState({
        status: 'running',
        runningTime: 0
      })
      const refresh = () => {
        const now = Date.now();
        this.setState({
          runningTime: Math.floor((now - startTime)/1000) + '秒'
        })
        if (this.state.status === 'running') {
          window.requestAnimationFrame(refresh);
        }
      }
      window.requestAnimationFrame(refresh)
    })
    window.versions.send('start-serve', {
      ...this.state
    });
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        目标端口：<input value={this.state.port} onChange={this.editHost.bind(this)}/>
        本机主机：<input value={this.state.proxyIPAddress} onChange={this.editAddress.bind(this)}/>
        <p>
          <button onClick={this.startServe.bind(this)}>代理启动</button>
          <button onClick={this.stopServe.bind(this)}>代理结束</button>
        </p>
        {
          this.state.status === 'running' && 
          <p>运行时间: {this.state.runningTime}</p>
        }
      </div>
    )
  }
  
}