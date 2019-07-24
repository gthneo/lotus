import React from 'react';
import FullNode from "./FullNode";
import ConnMgr from "./ConnMgr";

class NodeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      existingLoaded: false,
      nodes: {},

      showConnMgr: false,
    }

    // This binding is necessary to make `this` work in the callback
    this.spawnNode = this.spawnNode.bind(this)
    this.connMgr = this.connMgr.bind(this)

    this.getNodes()
  }

  async getNodes() {
    const nds = await this.props.client.call('Pond.Nodes')
    const nodes = nds.reduce((o, i) => {o[i.ID] = i; return o}, {})
    console.log('nds', nodes)
    this.setState({existingLoaded: true, nodes: nodes})
  }

  async spawnNode() {
    const node = await this.props.client.call('Pond.Spawn')
    console.log(node)
    this.setState(state => ({nodes: {...state.nodes, [node.ID]: node}}))
  }

  connMgr() {
    this.setState({showConnMgr: true})
  }

  render() {
    let connMgr
    if (this.state.showConnMgr) {
      connMgr = (<ConnMgr nodes={this.state.nodes}/>)
    }

    return (
      <div>
        <div>
          <button onClick={this.spawnNode} disabled={!this.state.existingLoaded}>Spawn Node</button>
          <button onClick={this.connMgr} disabled={!this.state.existingLoaded && !this.state.showConnMgr}>Connections</button>
        </div>
        <div>
          {
            Object.keys(this.state.nodes).map(n => {
              const node = this.state.nodes[n]

              return (<FullNode key={node.ID}
                                node={{...node}}
                                pondClient={this.props.client}
                                onConnect={conn => this.setState(prev => ({nodes: {...prev.nodes, [n]: {...node, conn: conn}}}))}/>)
            })
          }
          {connMgr}
        </div>
      </div>
    );
  }
}

export default NodeList