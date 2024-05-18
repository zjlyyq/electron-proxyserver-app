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

  editHost = (e, val) => {
    this.setState({
      port: e.target.value
    })
  }

  editAddress = (e, val) => {
    this.setState({
      proxyIPAddress: e.target.value
    })
  }
  stopServe = () => {
    window.versions.send('stop-serve');
    
  }
  startServe = () => {
    window.versions.send('start-serve', this.state);
  }

  refreshRunningTime = (startTime) => {
    const now = Date.now();
    console.log('refreshRunningTime:',  Math.floor((now - startTime)/1000) + '秒' )
    this.setState({
      runningTime: Math.floor((now - startTime)/1000) + '秒'
    });
    if (this.state.status === 'running') {
      window.requestAnimationFrame(() => this.refreshRunningTime.call(this, startTime));
    }
  }

  handleStartServe = () => {
    debugger
    this.setState({ status: 'running', runningTime: 0 });
    console.log('handleStartServe', this.state)
    this.refreshRunningTime(Date.now());
  }

  handleStopServe = () => {
    console.log('handleStopServe')
    this.setState({
      status: 'stop',
      runningTime: 0
    })
  }

  componentDidMount() {
    window.versions.listen('start-serve-ok' , () => this.handleStartServe.call(this));
    window.versions.listen('stop-serve-ok' , () => this.handleStopServe.call(this));
  }

  render() {
    return (
      <div>
        目标端口：<input value={this.state.port} onChange={this.editHost}/>
        本机主机：<input value={this.state.proxyIPAddress} onChange={this.editAddress}/>
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