import React, { Component } from "react";
import { Form, Input, DatePicker, Button, message } from "antd";
import moment from "moment";

import { format } from "./../../helpers/date";

export default class Compose extends Component {
  state = {
    date: moment(),
    userName: this.props.user.profile.real_name,
    message: "",
  };

  onSelectDate = (date, dateString) => {
    if (!date) {
      return;
    }
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
    const channelId = this.props.user.channelId;
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
    return (
      <div>
        <Form style={{ marginTop: "1rem" }} onSubmit={this.handleSubmit}>
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
      </div>
    );
  }
}
