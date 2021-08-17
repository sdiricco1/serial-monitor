import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import React from "react";
import {
  Input,
  Divider,
  Menu,
  Dropdown,
  Button,
  message,
  Space,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
} from "antd";
import {
  RightSquareFilled,
  DownOutlined,
  UserOutlined,
  CaretDownOutlined,
  PlayCircleOutlined,
  PlaySquareOutlined,
  PauseOutlined,
  CaretRightOutlined,
  ClearOutlined,
  AlertTwoTone,
} from "@ant-design/icons";

import styles from "./App.module.css";

const { ipcRenderer } = window.require("electron");
const { TextArea } = Input;
const { Option } = Select;

const COLOR_ON = "#d3f261";
const COLOR_OFF = "#ff9c6e";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.name = "Serial Monitor";
    this.state = {
      isStarted: false,
      portSelected: undefined,
      baudRateSelected: undefined,
      portList: [],
      baudRateValues: [],
      serialMonitorData: [],
      dataToSend: "",
      status:{
        color:"#f5f5f5",
        label: ""
      } 
    };
    this.onClickShowPortList = this.onClickShowPortList.bind(this);
    this.onClickShowBauRateValues = this.onClickShowBauRateValues.bind(this);
    this.onChangePort = this.onChangePort.bind(this);
    this.onChangeBaudRate = this.onChangeBaudRate.bind(this);
    this.onClickStartStop = this.onClickStartStop.bind(this);
    this.onSerialMonitorData = this.onSerialMonitorData.bind(this);
    this.onClickClearMonitor = this.onClickClearMonitor.bind(this);
    this.onChangeDataToSend = this.onChangeDataToSend.bind(this);
    this.onClickSendData = this.onClickSendData.bind(this);
    this.onSerialMonitorError = this.onSerialMonitorError.bind(this);
  }

  onChangePort(port) {
    const portSelected = this.state.portList.find((el) => el.name === port);
    this.setState({ portSelected: portSelected.name });
  }

  onChangeBaudRate(baudRate) {
    this.setState({ baudRateSelected: parseInt(baudRate) });
    console.log(baudRate);
  }

  async onClickShowBauRateValues() {
    let baudRateValues = [];
    try {
      baudRateValues = await ipcRenderer.invoke("get-baudrate-values");
      console.log(baudRateValues);
    } catch (error) {
      console.log(error);
    }
    this.setState({ baudRateValues: baudRateValues });
  }

  async onClickShowPortList() {
    const portList = await ipcRenderer.invoke("get-port-list");
    this.setState({ portList: portList || [] });
  }

  async onClickStartStop() {
    if(!this.state.isStarted){
      const portObj = this.state.portList.find((el) => el.name === this.state.portSelected);
      try {
        await ipcRenderer.invoke(
          "start-serialmonitor",
          this.state.baudRateSelected,
          portObj.port
        );
      } catch (e) {
        console.log(e);
      }
      const status = {
        color: COLOR_ON,
        label: "Active"
      }
      this.setState({ isStarted: true, status: status});
    }else{

      await ipcRenderer.invoke("stop-serialmonitor");
      const status = {
        color: COLOR_OFF,
        label: "Stopped"
      }
      this.setState({ isStarted: false, status: status});
    }

  }

  async onClickClearMonitor() {
    this.setState({ serialMonitorData: [] });
  }

  async onClickSendData() {
    await ipcRenderer.invoke("send-data", this.state.dataToSend);
  }

  onChangeDataToSend(e) {
    this.setState({ dataToSend: e.target.value });
    console.log(e.target.value);
  }

  onSerialMonitorData(event, data) {
    const serialMonitorData = this.state.serialMonitorData;
    serialMonitorData.push(data);
    this.setState({ serialMonitorData: serialMonitorData });
  }

  onSerialMonitorError() {
    this.setState({
      isStarted: false,
      portSelected: undefined,
      portList: [],
      startStopColor: "#f5f5f5"
    });
  }

  componentDidMount() {
    ipcRenderer.on("on-serialmonitor-data", this.onSerialMonitorData);
    ipcRenderer.on("on-serialmonitor-error", this.onSerialMonitorError);
  }

  componentWillUnmount() {
    ipcRenderer.off("on-serialmonitor-data", this.onSerialMonitorData);
    ipcRenderer.off("on-serialmonitor-error", this.onSerialMonitorError);
  }

  render() {
    const baudRateValues = this.state.baudRateValues.map((el) => {
      return <Option value={el}>{el}</Option>;
    });

    const portNameList = this.state.portList.map((el) => {
      return <Option value={el.name}>{el.name}</Option>;
    });


    let iconStartStop = <CaretRightOutlined size="small" />
    if(this.state.isStarted){
      iconStartStop = <PauseOutlined size="small" />
    }

    return (
      <div className={styles.mainContainer}>
        <Divider size="small" plain orientation="left">
          Options
        </Divider>

        <div className={styles.options}>
          <Row>
            {/*Options*/}
            <Col span={16}>
              <Row gutter={4}>
                {/* Baud rate */}
                <Col flex="0 0 160px">
                  <Select
                    value={this.state.baudRateSelected}
                    className={styles.autoWidth}
                    onClick={this.onClickShowBauRateValues}
                    onChange={this.onChangeBaudRate}
                    defaultValue="Baud Rate"
                    size="small"
                  >
                    {baudRateValues}
                  </Select>
                </Col>

                {/* Port */}
                <Col flex="0 0 160px">
                  <Select
                    value={this.state.portSelected}
                    className={styles.autoWidth}
                    onClick={this.onClickShowPortList}
                    onChange={this.onChangePort}
                    defaultValue="Port"
                    size="small"
                  >
                    {portNameList}
                  </Select>
                </Col>
              </Row>
            </Col>

            {/* Buttons */}
            <Col span={8}>
              <Row justify="end">
          
                {/* Start / Stop */}
                <Col flex="0 0 40px">
                  <Button
                    onClick={this.onClickStartStop}
                    className={styles.autoWidth}
                    size="small"
                    disabled={
                      this.state.portSelected === undefined ||
                      this.state.baudRateSelected === undefined
                    }
                  >
                    {iconStartStop}
                  </Button>
                </Col>

                {/* Clear */}
                <Col flex="0 0 40px">
                  <Button
                    onClick={this.onClickClearMonitor}
                    className={styles.autoWidth}
                    size="small"
                  >
                    <ClearOutlined size="small" />
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <Divider size="small" plain orientation="left">
          Send a message
        </Divider>

        <div className={styles.sender}>
          <Row gutter={4}>
            {/* Input */}
            <Col flex="auto">
              <code>
                <Input onChange={this.onChangeDataToSend} size="small"></Input>
              </code>
            </Col>

            {/* Send button */}
            <Col flex="0 0 80px">
              <Button
                className={styles.autoWidth}
                size="small"
                onClick={this.onClickSendData}
              >
                Send
              </Button>
            </Col>
          </Row>
        </div>
        <Divider size="small" plain orientation="left">
          Monitor
        </Divider>
        <div className={styles.monitor}>
          <code>{this.state.serialMonitorData.join("")}</code>
        </div>
        <div className={styles.footer}>
          <Row gutter={4}>
            <Col> <div className={styles.status} style={{background: this.state.status.color}}> </div></Col>
            <Col> {this.state.status.label} </Col>
          </Row>
          
        </div>
      </div>
    );
  }
}

export default App;
