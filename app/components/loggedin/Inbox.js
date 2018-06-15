import React, { Component } from "react";
import { List, Avatar } from "antd";

import { fetchChannelMessagesWithUserProfile } from "./../../helpers/slack";

export default class Inbox extends Component {
  state = {
    messages: [],
  };

  fetchMessages = async () => {
    const token = this.props.user.accessToken;
    const channelId = this.props.user.channelId;
    const messages = await fetchChannelMessagesWithUserProfile(
      token,
      channelId
    );
    this.setState({
      messages: messages,
    });
  };

  componentDidMount() {
    this.fetchMessages();
  }

  render() {
    return (
      <div>
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
