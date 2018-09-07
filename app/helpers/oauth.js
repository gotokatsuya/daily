import queryString from "querystring";
import url from "url";
import got from "got";
import electron from "electron";

const BrowserWindow = electron.remote.BrowserWindow;

const config = {
  clientId: process.env.SLACK_OAUTH_ID,
  clientSecret: process.env.SLACK_OAUTH_SECRET,
  scope:
    "channels:read,users.profile:read,chat:write:user,channels:history,users:read",
  authorizationUrl: "https://slack.com/oauth/authorize",
  tokenUrl: "https://slack.com/api/oauth.access",
  redirectUri: process.env.SLACK_OAUTH_REDIRECT_URI,
};

const windowParams = {
  alwaysOnTop: true,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: false,
  },
};

export const authorize = async () => {
  const code = await getAuthorizationCode();
  const token = await fetchToken(code);
  return token;
};

const getAuthorizationCode = () => {
  const urlParams = {
    client_id: config.clientId,
    scope: config.scope,
    redirect_uri: config.redirectUri,
  };
  const urlStr =
    config.authorizationUrl + "?" + queryString.stringify(urlParams);
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow(
      windowParams || { "use-content-size": true }
    );

    authWindow.loadURL(urlStr);
    authWindow.show();

    authWindow.on("closed", () => {
      reject(new Error("window was closed by user"));
    });

    function onCallback(urlStr) {
      const urlStrParts = url.parse(urlStr, true);
      const query = urlStrParts.query;
      const code = query.code;
      const error = query.error;
      if (error !== undefined) {
        reject(error);
        authWindow.removeAllListeners("closed");
        setImmediate(() => {
          authWindow.close();
        });
      } else if (code) {
        resolve(code);
        authWindow.removeAllListeners("closed");
        setImmediate(() => {
          authWindow.close();
        });
      }
    }

    authWindow.webContents.on("will-navigate", (event, urlStr) => {
      onCallback(urlStr);
    });

    authWindow.webContents.on(
      "did-get-redirect-request",
      (event, oldUrl, newUrlStr) => {
        onCallback(newUrlStr);
      }
    );
  });
};

const fetchToken = async code => {
  const urlParams = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code: code,
    redirect_uri: config.redirectUri,
  };
  const urlStr = config.tokenUrl + "?" + queryString.stringify(urlParams);
  const res = await got(urlStr);
  return JSON.parse(res.body);
};
