import {
  Space,
  InputNumber,
  Radio,
  Button,
  Loading,
  Dialog,
} from "@nutui/nutui-react";
import { useState, useRef } from "react";

import { crc16 } from "./crc16";
import { sendMsg } from "./android";
const packageJson = require("../package.json");

export default function Settings() {
  const [pipeIndex, setPipeIndex] = useState(1);
  const [pipeType, setPipeType] = useState("3");
  const p = useRef(null);

  function send() {
    const index = Math.abs(pipeIndex).toString(16).padStart(2, "0");
    const data = `${index} 05 00 0${pipeType} 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    const crc = crc16(data);
    const msg = JSON.stringify({ body: `${data} ${crc}`, type: 2 });
    p.current.innerText += `send-->${msg}\n`;
    sendMsg(msg, (result) => (p.current.innerText += `received-->${result}\n`));
  }

  function send1() {
    const msg = JSON.stringify({
      body: "01 05 00 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00 70 48",
      type: 2,
    });
    p.current.innerText += `send-->${msg}\n`;
    sendMsg(msg, (result) => (p.current.innerText += `received-->${result}\n`));
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
    sendMsg(msg, (result) => (p.current.innerText += `received-->${result}\n`));
  }

  return (
    <div className="px-2">
      <Space wrap>
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
        <Button type="primary" onClick={send1}>
          发送1号
        </Button>
        <Button type="primary" onClick={send}>
          发送
        </Button>
        <Button type="info" onClick={upgrade}>
          升级
        </Button>
      </Space>
      <p id="log" ref={p} className="max-h-96 overflow-y-scroll">
          {window.logs}
        </p>
      <div id="version">{packageJson.version}</div>
    </div>
  );
}
