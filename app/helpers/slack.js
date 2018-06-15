import { WebClient } from "@slack/client";

export const fetchMeProfile = async token => {
  const web = new WebClient(token);
  const res = await web.users.profile.get();
  return res.profile;
};

export const fetchProfile = async (token, user) => {
  const web = new WebClient(token);
  const res = await web.users.profile.get({
    user: user,
  });
  return res.profile;
};

export const fetchDailyChannels = async token => {
  const channels = [];
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

export const fetchChannelMessages = async (token, channelId) => {
  const web = new WebClient(token);
  const res = await web.channels.history({
    channel: channelId,
  });
  return res.messages;
};

var cacheUserProfiles = {};

export const fetchUserProfilesForCache = async token => {
  const web = new WebClient(token);
  const res = await web.users.list();
  for (var member of res.members) {
    if (member.deleted) {
      continue;
    }
    cacheUserProfiles[member.id] = member.profile;
  }
};

export const fetchChannelMessagesWithUserProfile = async (token, channelId) => {
  const messagesWithUserProfile = [];
  const messages = await fetchChannelMessages(token, channelId);
  for (var message of messages) {
    var profile = {};
    if (cacheUserProfiles[message.user]) {
      profile = cacheUserProfiles[message.user];
    } else {
      profile = await fetchProfile(token, message.user);
      cacheUserProfiles[message.user] = profile;
    }
    messagesWithUserProfile.push({
      message: message,
      profile: profile,
    });
  }
  return messagesWithUserProfile;
};
