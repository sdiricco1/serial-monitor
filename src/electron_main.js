const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
const {SerialMonitor} = require("./modules/serialMonitor");
const { ConsoleSqlOutlined } = require("@ant-design/icons");

let mainWindow;
let sm = new SerialMonitor();

const showMessageBox=(options) => {
  //dialog box
  let __options = {
    buttons: options.buttons || ["ok"],
    message: options.message || "Are you sure?",
    title: options.title || "Info",
    type: options.type || "question",
  };
  return dialog.showMessageBoxSync(mainWindow, __options);
}


const onSerialMonitorData = (dataStructure) => {
  mainWindow.webContents.send("on-serialmonitor-data", dataStructure);
}

const onSerialMonitorError = (data) =>{
  mainWindow.webContents.send("on-serialmonitor-error", data);
  console.log(data)
  showMessageBox({
    title: "Error",
    type: "error",
    message:data,
  });
}

ipcMain.handle("get-port-list", async (event) => {
  let portList = undefined;
  try {
    portList = await SerialMonitor.getDevics();
  } catch (e) {
    throw(e)
  }
  return portList;
});

ipcMain.handle("get-baudrate-values", async (event) => {
  let baudRateValues = undefined;
  try {
    baudRateValues = await SerialMonitor.getBaudRateValues();
  } catch (e) {
    return e
  }
  return baudRateValues;
});

ipcMain.handle("start-serialmonitor", async (event, baudRate, port) => {
  sm.baudRate = baudRate;
  sm.port = port;

  console.log("baud", baudRate);
  console.log("port", port)
  try {
    await sm.connect();
    sm.onData(onSerialMonitorData);
    sm.onError(onSerialMonitorError);
    return true;
  } catch (e) {
    onSerialMonitorError(e.message);
    return false;
  }
});

ipcMain.handle("stop-serialmonitor", async (event) => {
  try {
    await sm.disconnect();
    return true;
  } catch (e) {
    showMessageBox({
      title: "Error",
      type: "error",
      message:e.message,
    });
    return false
  }
  
});

ipcMain.handle("send-data", async (event, data) => {
  try {
    await sm.write(data);
    return true;
  } catch (e) {
    showMessageBox({
      title: "Error",
      type: "error",
      message:e.message,
    });
    return false;
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 400,
    minHeight: 600,
    show: true,
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
    // mainWindow.toggleDevTools();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.removeMenu();

}

app.allowRendererProcessReuse = false;
app.on("ready", createWindow);
