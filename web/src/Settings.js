import {
  Space,
  InputNumber,
  Radio,
  Button,
  Loading,
  Dialog,
  Divider,
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
    const index = Number.parseInt(pipeIndex - 1)
      .toString(16)
      .padStart(2, "0");
    const data = `01 05 ${index} 0${pipeType} 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    const crc = crc16(data);
    const msg = JSON.stringify({ body: `${data} ${crc}`, type: 2 });
    p.current.innerText += `\nsend-->${msg}`;
    sendMsg(msg, (result) => (p.current.innerText += `\nreceived-->${result}`));
  }

  function open() {
    const data = '01 05 79 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00';
    const crc = crc16(data);
    const msg = JSON.stringify({ body: `${data} ${crc}`, type: 2 });
    p.current.innerText += `\nsend-->${msg}`;
    sendMsg(msg, (result) => (p.current.innerText += `\nreceived-->${result}`));
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
    p.current.innerText += `\nsend-->${msg}`;
    sendMsg(msg, (result) => (p.current.innerText += `\nreceived-->${result}`));
  }

  return (
    <div className="tw-w-full tw-h-full tw-p-4 tw-text-2xl tw-text-slate-700">
      <h1 className="tw-text-center">系统设置</h1>
      <Divider />
      <Space>
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
        <Button type="primary" onClick={send} className="tw-w-56">
          发送
        </Button>
      </Space>
      <div className="tw-h-2"/>
      <Button type="success" onClick={open} className="tw-w-full">
        开门
      </Button>
      <div className="tw-h-2"/>
      <Button type="info" onClick={upgrade} className="tw-w-full">
        升级
      </Button>
      <p
        id="log"
        ref={p}
        className="tw-h-3/4 tw-overflow-y-scroll tw-text-sm tw-bg-slate-200 tw-mt-4"
      >
        {window.logs}
      </p>
      <div className="tw-text-sm tw-fixed tw-right-4 tw-bottom-4">
        {packageJson.version}
      </div>
    </div>
  );
}
