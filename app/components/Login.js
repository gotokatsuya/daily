import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import { authorize } from "./../helpers/oauth";

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  state = {};

  handleLogin = () => {
    authorize().then(res => {
      this.props.onLogin({
        accessToken: res.access_token,
        loggedIn: true,
      });
    });
  };

  render() {
    return (
      <div className="container login">
        <Card title="daily" className="card">
          <div className="submit">
            <a onClick={this.handleLogin}>
              <img
                src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
              />
            </a>
          </div>
        </Card>
      </div>
    );
  }
}
