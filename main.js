
const prompt = require('prompt-sync')();
const {SerialMonitor} = require('./src/modules/serialMonitor')

let sm = undefined;

function onData(data){
  process.stdout.write(data);
}

const main = async () => {
  sm = new SerialMonitor();
  sm.baudRate = 9600;
  sm.port = 'COM3';
  sm.connect();
  sm.onData(onData);
}

main();

