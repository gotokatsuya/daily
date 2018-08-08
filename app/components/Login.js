import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Card, Form, Select, message } from "antd";
import { authorize } from "./../helpers/oauth";
import { pararels } from "./../helpers/promise";
import { fetchMeProfile, fetchDailyChannels } from "./../helpers/slack";
import { clearStorage, reloadWebContents } from "./../helpers/electron";

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  state = {
    loggedIn: false,
    accessToken: "",
    id: "",
    profile: {},
    channels: [],
    channel: {},
  };

  handleLogin = async () => {
    const authorizeRes = await authorize();
    if (!authorizeRes.ok) {
      return;
    }
    const accessToken = authorizeRes.access_token;
    const id = authorizeRes.user_id;
    this.setState({
      loggedIn: true,
      accessToken: accessToken,
      id: id,
    });
    await pararels(
      async () => {
        const profile = await fetchMeProfile(accessToken);
        this.setState({
          profile: profile,
        });
      },
      async () => {
        const channels = await fetchDailyChannels(accessToken);
        this.setState({
          channels: channels,
        });
      }
    );
  };

  onSelectChannel = channelId => {
    for (var channel of this.state.channels) {
      if (channel.id == channelId) {
        this.setState({
          channel: channel,
        });
        break;
      }
    }
  };

  toLoggedin = () => {
    if (this.state.channel.id.length == 0) {
      message.warn("Select channel");
      return;
    }
    this.props.onLogin({
      accessToken: this.state.accessToken,
      id: this.state.id,
      profile: this.state.profile,
      loggedIn: this.state.loggedIn,
      channel: this.state.channel,
    });
  };

  render() {
    const channelOptions = this.state.channels.map(channel => {
      return (
        <Select.Option value={channel.id} key={channel.id}>
          {channel.name}
        </Select.Option>
      );
    });
    return (
      <div className="container login">
        <Card title="daily" className="card">
          <div className="submit">
            <div className={this.state.loggedIn ? "" : "hide"}>
              <Form style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                <Form.Item>
                  <Select onChange={this.onSelectChannel}>
                    {channelOptions}
                  </Select>
                </Form.Item>
              </Form>
              <Button type="primary" onClick={this.toLoggedin}>
                Start
              </Button>
            </div>
            <div className={this.state.loggedIn ? "hide" : ""}>
              <a onClick={this.handleLogin}>
                <img
                  src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                  srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
                />
              </a>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
