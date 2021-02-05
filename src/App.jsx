/* eslint-disable react/destructuring-assignment */
import './App.css';
import { Component } from 'react';
import { Device as CloudDevice } from '@larva.io/clouddevice';
import Login from './Login';
import Device from './Device';

const DEVICE_ID = '76696365-733a-5465-7374-446576696365';
const UNIT_ID = '00000000-0000-0000-0000-000000000000';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.token = '';
    this.state = {
      loggedIn: false,
      opened: false,
    };
    this.logout = this.logout.bind(this);
    this.setToken = this.setToken.bind(this);
    this.setToken = this.setToken.bind(this);
    this.getToken = this.getToken.bind(this);
    this.device = new CloudDevice(DEVICE_ID, UNIT_ID, this.getToken, {
      server: 'wss://broker.larva.io',
      timeout: 8000,
    });
  }

  async componentDidMount() {
    await this.device.open()
      // eslint-disable-next-line no-alert
      .catch((err) => alert(err.message));
    this.setToken();
    this.setState({
      opened: true,
    });
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
    this.setState({
      loggedIn: !!this.token,
    });
  }

  logout() {
    this.setToken('');
  }

  render() {
    const { loggedIn } = this.state;
    const SubComponent = loggedIn
      ? (
        <div>
          <button type="button" onClick={this.logout}>Logout</button>
          <Device device={this.device} />
        </div>
      )
      : <Login device={this.device} onLoginDone={this.setToken} />;
    return (
      <div className="App">
        {!this.state.opened && <span>Opening connection to broker....</span>}
        {this.state.opened && SubComponent}
      </div>
    );
  }
}
