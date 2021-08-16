const serialport = require("serialport");
const Delimiter = require("@serialport/parser-delimiter");
const Readline = require("@serialport/parser-readline");
const Regex = require("@serialport/parser-regex");

class SerialMonitor {
  constructor() {
    this.__baudRate = undefined;
    this.__port = undefined;
    this.__sp = undefined;
    this.__parser = undefined;
    this.__isConnected = false;
  }

  static async getDevics() {
    let usbDevices = [];
    try {
      const splResult = await serialport.list();
      usbDevices = splResult.map((device) => {
        return {
          name: `${device.manufacturer} (${device.path})`,
          port: device.path,
        };
      });
    } catch (e) {
      throw `Error getting USB device list, ${e}`;
    }
    return usbDevices;
  }

  static async getBaudRateValues() {
    return [9600, 19200, 38400, 57600];
  }

  set baudRate(baudRate) {
    this.__baudRate = baudRate;
  }

  set port(port) {
    this.__port = port;
  }

  get baudRate() {
    return this.__baudRate;
  }

  get port() {
    return this.__port;
  }

  setNewDelimiter(delimiter = "\n") {
    this.__setParser(delimiter);
  }

  __setParser(delimiter) {
    if (this.__sp !== undefined) {
      this.__parser = this.__sp.pipe(new Delimiter({ delimiter: delimiter }));
    }
  }

  connect() {
    if (this.__baudRate !== undefined && this.__port !== undefined) {
      this.__sp = new serialport(this.__port, {
        baudRate: this.__baudRate,
      });
      this.__parser = this.__sp;
      this.__isConnected = true;
    }
  }

  onData(callback) {
    if (this.__isConnected) {
      console.log("on data");
      this.__parser.on("data", (data) => {
        callback(data.toString());
      });
    }
  }
}

module.exports = { SerialMonitor };
