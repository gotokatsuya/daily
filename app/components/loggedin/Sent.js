import React, { Component } from "react";
import { List, Avatar } from "antd";

import { fetchMeChannelMessages } from "./../../helpers/slack";

export default class Sent extends Component {
  state = {
    messages: [],
  };

  fetchMessages = async () => {
    const token = this.props.user.accessToken;
    const channelId = this.props.user.channelId;
    const meId = this.props.user.id;
    const messages = await fetchMeChannelMessages(token, channelId, meId);
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
                avatar={<Avatar src={this.props.user.profile.image_48} />}
                title={this.props.user.profile.display_name}
                description={item.message.text}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
