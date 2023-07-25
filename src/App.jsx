import './App.css';
import { Component, createRef } from 'react';
import { isReady, LarCognitoConfig } from '@larva.io/webcomponents-cognito-login-react';
import { LarApp, i18n } from '@larva.io/webcomponents-react';
import Login from './Login';
import Device from './Device';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.Cognito = createRef();
    this.state = {
      loggedIn: false,
      lang: 'en',
    };
    this.logout = this.logout.bind(this);
    this.changeLoggedInState = this.changeLoggedInState.bind(this);
    this.getToken = this.getToken.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    i18n.addResourceBundle('et', 'larva', {
      door: {
        locked: 'Lukustatud',
        unlocked: 'Lukust lahti',
      },
    });
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

  changeLanguage(event) {
    const lang = event.target.value;
    this.setState({ lang });
    i18n.changeLanguage(lang);
  }

  render() {
    const { loggedIn, lang } = this.state;
    const LangComponent = (
      <select id="lang" onChange={this.changeLanguage} value={lang}>
        <option value="et">eesti keel</option>
        <option value="en">English</option>
      </select>
    );
    const SubComponent = loggedIn
      ? (
        <div>
          <button type="button" onClick={this.logout}>Logout</button>
          <Device deviceId="af88a67d-39f7-4fc0-adaa-2b97c633cac9" unitId="c2eecc51-a92a-4278-8ccb-90d92f2ef790" getToken={this.getToken} />
        </div>
      )
      : <Login onLoginDone={this.changeLoggedInState} />;
    return (
      <LarApp>
        {LangComponent}
        <div className="App">
          <LarCognitoConfig
            ref={this.Cognito}
            cognito-region="eu-central-1"
            cognito-pool-id="eu-central-1_dhuZEPbYR"
            cognito-client-id="1dao6iiu2s5t3sb1itoibv8tlr"
            storage-type="local"
          />
          {SubComponent}
        </div>
      </LarApp>
    );
  }
}
