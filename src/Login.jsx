/* eslint-disable no-alert */
import { Component } from 'react';
import { LarCognitoLogin } from '@larva.io/webcomponents-cognito-login-react';
import PropTypes from 'prop-types';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.onLoading = this.onLoading.bind(this);
    this.onLoginError = this.onLoginError.bind(this);
    this.onLoginDone = this.onLoginDone.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onLoginError(event) {
    alert(event.detail);
  }

  onLoginDone() {
    const { onLoginDone } = this.props;
    onLoginDone();
  }

  onLoading(event) {
    this.setState({
      loading: !!event.detail,
    });
  }

  render() {
    const { loading } = this.state;
    const Loading = loading ? <div>Loading...</div> : <span />;
    return (
      <div>
        {Loading}
        <LarCognitoLogin
          cognitoUsernameAttribute="email"
          onLoading={this.onLoading}
          onLoginDone={this.onLoginDone}
          onLoginError={this.onLoginError}
        />
      </div>
    );
  }
}

Login.propTypes = {
  onLoginDone: PropTypes.func.isRequired,
};
