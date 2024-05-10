import React from 'react';
import ReactDom from 'react-dom';

export default class ProxySetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      port: 2333,
      proxyIPAddress: '192.168.7.1'
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

  startServe() {
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
        </p>
      </div>
    )
  }
  
}