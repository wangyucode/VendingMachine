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
    const index = Number.parseInt(pipeIndex - 1)
      .toString(16)
      .padStart(2, "0");
    const data = `01 05 ${index} 0${pipeType} 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
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
    <div className="tw-px-2">
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
        <Button type="primary" onClick={send}>
          发送
        </Button>
        <Button type="info" onClick={upgrade}>
          升级
        </Button>
      </Space>
      <p
        id="log"
        ref={p}
        className="tw-max-h-96 tw-overflow-y-scroll tw-text-sm"
      >
        {window.logs}
      </p>
      <div className="tw-text-sm tw-fixed tw-right-4 tw-bottom-4">
        {packageJson.version}
      </div>
    </div>
  );
}
