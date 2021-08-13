const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 720,
    show: false,
    title: "PumpLoggerCore App ",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.toggleDevTools();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.removeMenu();

}

app.allowRendererProcessReuse = false;
app.on("ready", createWindow);
