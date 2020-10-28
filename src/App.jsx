import './App.css';
import { Component, createRef } from 'react';
import { isReady, LarCognitoConfig } from '@larva.io/webcomponents-cognito-login-react';
import Login from './Login';
import Device from './Device';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.Cognito = createRef();
    this.state = {
      loggedIn: false,
    };
    this.logout = this.logout.bind(this);
    this.changeLoggedInState = this.changeLoggedInState.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  async componentDidMount() {
    await isReady();
    this.changeLoggedInState();
  }

  async getToken() {
    const token = await this.Cognito.current.getAccessToken();
    return token;
  }

  async logout() {
    await this.Cognito.current.logout();
    this.changeLoggedInState();
  }

  // eslint-disable-next-line class-methods-use-this
  async changeLoggedInState() {
    try {
      const token = await this.Cognito.current.getAccessToken();
      this.setState({
        loggedIn: !!token,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  render() {
    const { loggedIn } = this.state;
    const SubComponent = loggedIn
      ? (
        <div>
          <button type="button" onClick={this.logout}>Logout</button>
          <Device deviceId="af88a67d-39f7-4fc0-adaa-2b97c633cac9" unitId="0657b857-2532-4d32-826d-508834b88196" getToken={this.getToken} />
        </div>
      )
      : <Login onLoginDone={this.changeLoggedInState} />;
    return (
      <div className="App">
        <LarCognitoConfig
          ref={this.Cognito}
          cognito-region="eu-central-1"
          cognito-pool-id="eu-central-1_iBzUxlCpJ"
          cognito-client-id="5lrklc6frlg4sik3dnr0koq70h"
          storage-type="local"
        />
        {SubComponent}
      </div>
    );
  }
}
