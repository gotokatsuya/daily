import electron from "electron";

export const clearStorage = () => {
  const session = electron.remote.session;
  session.defaultSession.clearStorageData();
};
