/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-alert */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Device } from '@larva.io/clouddevice';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: '',
      password: '',
    };
    // eslint-disable-next-line react/destructuring-assignment
    this.device = this.props.device;
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value,
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    try {
      // console.warn('####', await this.device.request('iot-2/cmd/getUnits/fmt/json'));
      // https://docs.larva.io/base/users
      const res = await this.device.request('iot-2/cmd/login/fmt/json', {
        username: this.state.username,
        password: this.state.password,
      });
      if (!res.access_token) {
        throw new Error('Invalid login response');
      }
      this.props.onLoginDone(res.access_token);
    } catch (err) {
      alert(`Login Error: ${err.message}`);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { loading } = this.state;
    const Loading = loading ? <div>Loading...</div> : <span />;
    return (
      <div>
        {Loading}
        <form onSubmit={this.handleSubmit}>
          Username:
          <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
          <br />
          Paassword:
          <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          <br />
          <button disabled={this.state.loading} type="submit">Login</button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  onLoginDone: PropTypes.func.isRequired,
  device: PropTypes.instanceOf(Device).isRequired,
};
