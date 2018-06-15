import React, { Component } from "react";
import { Form, Select, List, Avatar } from "antd";

import {
  fetchDailyChannels,
  fetchChannelMessagesWithUserProfile,
} from "./../../helpers/slack";

export default class Inbox extends Component {
  state = {
    channels: [],
    messages: [],
  };

  fetchChannels = async () => {
    const token = this.props.user.accessToken;
    const channels = await fetchDailyChannels(token);
    return channels;
  };

  fetchMessages = async channelId => {
    const token = this.props.user.accessToken;
    const messages = await fetchChannelMessagesWithUserProfile(
      token,
      channelId
    );
    return messages;
  };

  onSelectChannel = channelId => {
    this.fetchMessages(channelId).then(messages => {
      this.setState({
        messages: messages,
      });
    });
  };

  componentDidMount() {
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
    const channelOptions = this.state.channels.map(channel => {
      return (
        <Select.Option value={channel.id} key={channel.id}>
          {channel.name}
        </Select.Option>
      );
    });
    return (
      <div>
        <Form style={{ marginTop: "1rem" }}>
          <Form.Item {...formItemLayout} label="Channel">
            <Select onChange={this.onSelectChannel}>{channelOptions}</Select>
          </Form.Item>
        </Form>
        <List
          itemLayout="horizontal"
          dataSource={this.state.messages}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.profile.image_48} />}
                title={item.profile.display_name}
                description={item.message.text}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
