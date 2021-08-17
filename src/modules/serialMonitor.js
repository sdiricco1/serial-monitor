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

  async connect() {
    if (this.__baudRate !== undefined && this.__port !== undefined) {
      try {
        this.__sp = new serialport(this.__port, {
          baudRate: this.__baudRate,
        });
        this.__parser = this.__sp;
      } catch (e) {
        throw e
      }
      this.__isConnected = true;
    }
  }

  async disconnect() {
    this.__isConnected = false;
    try {
      this.__close();
    } catch (e) {
      throw e;
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

  onError(callback){
    if(this.__sp !== undefined && this.__isConnected){
      this.__sp.on('close', (data)=>{
        if(data !== null){
          callback(`Error: Port ${this.__port} closed. Try to reconnect`);
        }
      })
    }
  }

  async write(data) {
    await this.__writeAndDrain(data);
  }

  async __writeAndDrain(buffer) {
    try {
      await this.__write(buffer);
      await this.__drain();
    } catch (e) {
      throw e;
    }
    return true;
  }

  async __flush() {
    if (this.__sp !== undefined) {
      return new Promise((resolve, reject) => {
        this.__sp.flush((e) => (e ? reject(e) : resolve(true)));
      });
    }
  }

  async __drain() {
    if (this.__sp !== undefined) {
      return new Promise((resolve, reject) => {
        this.__sp.drain((e) => (e ? reject(e) : resolve(true)));
      });
    }
  }

  async __write(buffer) {
    if (this.__sp !== undefined) {
      return new Promise((resolve, reject) => {
        this.__sp.write(buffer, (e) => (e ? reject(e) : resolve(true)));
      });
    }
  }

  async __close() {
    if (this.__sp !== undefined) {
      return new Promise((resolve, reject) => {
        this.__sp.close((e) => (e ? reject(e) : resolve(true)));
      });
    }
    this.__sp = undefined;
  }
}

module.exports = { SerialMonitor };
