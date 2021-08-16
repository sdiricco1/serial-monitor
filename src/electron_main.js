const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
const {SerialMonitor} = require("./modules/serialMonitor")

let mainWindow;

ipcMain.handle("get-port-list", async (event) => {
  let portList = undefined;
  try {
    portList = await SerialMonitor.getDevics();
    console.log(portList)
  } catch (error) {
    console.log(error)
  }
  return portList;
});

ipcMain.handle("get-baudrate-values", async (event) => {
  let baudRateValues = undefined;
  try {
    baudRateValues = await SerialMonitor.getBaudRateValues();
    console.log(baudRateValues)
  } catch (error) {
    console.log(error)
  }
  return baudRateValues;
});

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 720,
    show: false,
    title: "Serial Monitor App ",
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
