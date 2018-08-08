import electron from "electron";

export const reloadWebContents = () => {
  electron.remote.getCurrentWebContents().reload();
};

export const clearStorage = () => {
  electron.remote.session.defaultSession.clearStorageData();
};

export const clearCache = () => {
  clearStorage();
  reloadWebContents();
};
