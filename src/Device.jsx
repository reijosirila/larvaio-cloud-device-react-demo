/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Device } from '@larva.io/clouddevice';
import PropTypes from 'prop-types';
import * as Components from '@larva.io/webcomponents-react';

export default class DeviceComponent extends Component {
  // component names are kebab-case, React Components are PascalCase
  static pascalize(s) {
    const name = s.replace(/-./g, (x) => x.toUpperCase()[1]);
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // device broadcast messages handler
  static async handleBroadcast(event /* @typeof CustomEvent */) {
    const detail = event && event.detail ? event.detail : {};
    const nodeId = detail.evt;
    const payload = detail.payload || {};
    if (!nodeId) {
      return;
    }
    // if we have lava node loaded to dom with this node id
    const node = document.querySelector(`*[node-id='${nodeId}']`);
    if (node) {
      node.input(payload.data);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      closed: false,
      nodes: [],
    };
    const { deviceId, getToken, unitId } = props;
    // create device instance
    this.device = new Device(deviceId, unitId, getToken, {
      server: 'wss://broker.larva.io',
      timeout: 8000,
    });
    this.deviceClosed = this.deviceClosed.bind(this);
    this.createReactComponent = this.createReactComponent.bind(this);
    // handle broadcasted changes
    this.device.addEventListener('broadcast', DeviceComponent.handleBroadcast);
    this.device.addEventListener('close', this.deviceClosed);
  }

  async componentDidMount() {
    try {
      // connect to device
      await this.device.open();
      const nodes = await this.device.getUINodes();
      this.setState({
        nodes,
        closed: false,
        loading: false,
      });
    } catch (err) {
      await this.device.close();
      alert(`Failed to connect to device: ${err.message}`);
    }
  }

  async componentWillUnmount() {
    this.device.removeEventListener('broadcast', DeviceComponent.handleBroadcast);
    this.device.removeEventListener('close', this.deviceClosed);
    await this.device.close();
  }

  async deviceClosed() {
    this.setState({
      loading: false,
      closed: true,
      nodes: [],
    });
  }

  createReactComponent(node) {
    if (!node || !node.ui || !node.node || !node.component) {
      throw new Error('Invalid node object');
    }
    return React.createElement(node.component, {
      color: 'primary',
      colorInputs: 'primary',
      colorModal: 'primary',
      mainTitle: node.ui.name,
      supTitle: node.ui.room ? node.ui.room.name : '',
      subTitle: node.ui.category ? node.ui.category.name : '',
      icon: node.ui.icon,
      nodeId: node.node.id,
      key: node.node.id,
      log: node.ui.log,
      onOutput: this.device.handleNodeOutput,
      onRequest: this.device.handleNodeRequest,
    });
  }

  render() {
    const { loading, nodes, closed } = this.state;
    const Loading = loading ? <div>Loading...</div> : <span />;
    const Closed = closed ? <div>Device connection closed</div> : <span />;
    // load WebComponents from getUINodes response
    const nodesWithComponents = nodes
      // filter nodes that should be visible
      .filter((e) => !!e.ui.visible)
      // sort by rating
      .sort((a, b) => parseInt(b.ui.rating, 10) - parseInt(a.ui.rating, 10))
      .map((item) => {
        const componentName = DeviceComponent.pascalize(item.node.type);
        if (typeof Components[componentName] === 'undefined') {
          console.error(`Cannot find Larva.io WebComonent for ${componentName}`);
          return item;
        }
        return { ...item, component: Components[componentName] };
      })
      // filter nodes that doesnt have WebComponent
      .filter((e) => !!e.component);

    // wrap it up, set props and event listeners
    const dynamicComponents = nodesWithComponents
      .filter((e) => !e.ui.favorite)
      .map(this.createReactComponent);

    const dynamicFavoriteComponents = nodesWithComponents
      .filter((e) => !!e.ui.favorite)
      .map(this.createReactComponent);

    return (
      <div>
        {Loading}
        {Closed}
        <Components.LarApp>
          <div className="favorites-grid">
            {dynamicFavoriteComponents}
          </div>
          <div className="grid">
            {dynamicComponents}
          </div>
        </Components.LarApp>
      </div>
    );
  }
}

DeviceComponent.propTypes = {
  getToken: PropTypes.func.isRequired,
  deviceId: PropTypes.string.isRequired,
  unitId: PropTypes.string.isRequired,
};
