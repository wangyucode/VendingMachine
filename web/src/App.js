import { useState, useRef } from "react";
import {
  Button,
  Dialog,
  InputNumber,
  NavBar,
  Radio,
  Space,
  Loading,
} from "@nutui/nutui-react";
import "./App.css";
import { crc16 } from "./crc16";
import { sendMsg } from "./android";
const packageJson = require("../package.json");

function App() {
  const [pipeIndex, setPipeIndex] = useState(1);
  const [pipeType, setPipeType] = useState("3");
  const p = useRef(null);

  function send() {
    const index = Math.abs(pipeIndex).toString(16).padStart(2, "0");
    const data = `${index} 05 00 0${pipeType} 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    const crc = crc16(data);
    const msg = JSON.stringify({ body: `${data} ${crc}`, type: 2 });
    p.current.innerText += `send-->${msg}\n`;
    sendMsg(msg).then(result =>  p.current.innerText += `received-->${result}\n`);
  }

  function clear() {
    p.current.innerText = "";
  }

  function upgrade() {
    Dialog.alert({
      content: <Loading type="circular" />,
      hideConfirmButton: true,
      hideCancelButton: true,
      closeOnOverlayClick: false,
      title: "正在升级...",
    });

    const msg = JSON.stringify({ type: 3 });
    p.current.innerText += `send-->${msg}\n`;
    sendMsg(msg).then(result =>  p.current.innerText += `received-->${result}\n`);
  }

  return (
    <div className="App">
      <NavBar>系统设置</NavBar>
      <div className="content">
        <Space direction="vertical">
          <InputNumber
            value={pipeIndex}
            min="1"
            max="120"
            onMinus={() => setPipeIndex(pipeIndex - 1)}
            onPlus={() => setPipeIndex(pipeIndex + 1)}
            onChange={setPipeIndex}
          ></InputNumber>
          <Radio.Group
            direction="horizontal"
            value={pipeType}
            onChange={setPipeType}
          >
            <Radio value="0">无反馈电磁铁</Radio>
            <Radio value="3">三线制电机</Radio>
          </Radio.Group>

          <Button type="primary" onClick={send}>
            发送
          </Button>
          <Button type="info" onClick={upgrade}>
            升级
          </Button>
          <Button onClick={clear}>清除log</Button>
          <p id="log" ref={p}></p>
        </Space>
      </div>
      <div id="version">{packageJson.version}</div>
    </div>
  );
}

export default App;
