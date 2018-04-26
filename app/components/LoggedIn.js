import React, { Component } from "react";
import { Layout, Form, Select, Input, DatePicker, Button, message } from "antd";

import { WebClient } from "@slack/client";
import { format } from "./../helpers/date";
import moment from "moment";

export default class LoggedIn extends Component {
  state = {
    channels: [],
    channelId: "",
    date: moment(),
    userName: "",
    message: "",
  };

  fetchUserName = async () => {
    const token = this.props.user.accessToken;
    const web = new WebClient(token);
    const res = await web.users.profile.get();
    return res.profile.real_name;
  };

  fetchChannels = async () => {
    const channels = [];
    const token = this.props.user.accessToken;
    const web = new WebClient(token);
    const res = await web.channels.list({
      exclude_archived: true,
      exclude_members: true,
    });
    for (var channel of res.channels) {
      if (channel.name.includes("daily")) {
        channels.push(channel);
      }
      if (channel.name.includes("sandbox")) {
        channels.push(channel);
      }
    }
    return channels;
  };

  onSelectChannel = channelId => {
    this.setState({
      channelId: channelId,
    });
  };

  onSelectDate = (date, dateString) => {
    if (!date) {
      return;
    }
    console.log(`selected ${format(date.toDate())}`);
    this.setState({
      date: date,
    });
  };

  onChangeUserName = e => {
    this.setState({ userName: e.target.value });
  };

  onChangeMessage = e => {
    this.setState({ message: e.target.value });
  };

  getPostText = () => {
    return `${format(this.state.date.toDate())} ${this.state.userName} 
${this.state.message}`;
  };

  validateForm = () => {
    if (this.state.channelId.length == 0) {
      message.warn("Select channel");
      return false;
    }
    if (this.state.userName.length == 0) {
      message.warn("Write username");
      return false;
    }
    if (this.state.message.length == 0) {
      message.warn("Write message");
      return false;
    }
    return true;
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    const channelId = this.state.channelId;
    const text = this.getPostText();
    const token = this.props.user.accessToken;
    const web = new WebClient(token);
    web.chat
      .postMessage({
        channel: channelId,
        text: text,
      })
      .then(res => {
        if (res.ok) {
          message.success("Message was sent successfully");
          this.setState({
            message: "",
          });
        } else {
          message.error("Failed");
        }
      });
  };

  componentDidMount() {
    this.fetchUserName().then(userName => {
      this.setState({
        userName: userName,
      });
    });

    this.fetchChannels().then(channels => {
      this.setState({
        channels: channels,
      });
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    };
    const channelOptions = this.state.channels.map(channel => {
      return (
        <Select.Option value={channel.id} key={channel.id}>
          {channel.name}
        </Select.Option>
      );
    });
    return (
      <Layout className="container loggedIn">
        <Layout style={{ background: "#fff" }}>
          <Layout.Content style={{ padding: "1rem" }}>
            <h2>daily</h2>
            <Form style={{ marginTop: "1rem" }} onSubmit={this.handleSubmit}>
              <Form.Item {...formItemLayout} label="Channel">
                <Select onChange={this.onSelectChannel}>
                  {channelOptions}
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Date">
                <DatePicker
                  defaultValue={this.state.date}
                  format={"YYYY/MM/DD"}
                  onChange={this.onSelectDate}
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="Username">
                <Input
                  value={this.state.userName}
                  onChange={this.onChangeUserName}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="Message">
                <Input.TextArea
                  autosize={{ minRows: 16, maxRows: 20 }}
                  value={this.state.message}
                  onChange={this.onChangeMessage}
                />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}
