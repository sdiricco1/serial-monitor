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
} from "antd";
import {
  RightSquareFilled,
  DownOutlined,
  UserOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";

import styles from "./App.module.css"

const { ipcRenderer } = window.require("electron");
const { TextArea } = Input;
const { Option } = Select;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.name = "Serial Monitor";
    this.state = {
      portSelected: undefined,
      baudRateSelected: undefined,
      portNameList: [],
      baudRateValues: [],
    };
    this.onClickShowPortList = this.onClickShowPortList.bind(this);
    this.onClickShowBauRateValues = this.onClickShowBauRateValues.bind(this);
    this.onChangePort = this.onChangePort.bind(this);
    this.onClickShowBauRateValues = this.onClickShowBauRateValues.bind(this);
  }

  onChangePort() {}

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
    let portNameList = [];
    const portList = await ipcRenderer.invoke("get-port-list");
    if (portList !== undefined) {
      portNameList = portList.map((el) => el.name);
      this.setState({ portNameList: portNameList });
    }
    console.log(portNameList);
  }

  render() {

    return (
      <div className={styles.mainContainer}>
        <Divider plain orientation="left">
          Options
        </Divider>
        <div>
          <Select
            defaultValue="Port"
            size='small'
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>

        </div>
        <Divider plain orientation="left">
          Send a message
        </Divider>
        <div>
          <Input size="small"></Input>
          <Button size="small">Send</Button>
        </div>
        <Divider plain orientation="left">
          Monitor
        </Divider>
        <div>
          <code>
            <TextArea size="small" autoSize={{ minRows: 10, maxRows: 10 }} />
          </code>
        </div>
      </div>
    );
  }
}

export default App;
