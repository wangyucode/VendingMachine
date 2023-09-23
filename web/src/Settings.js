import {
  Space,
  InputNumber,
  Button,
  Loading,
  Dialog,
  Divider,
  Range,
} from "@nutui/nutui-react";
import { useState, useRef } from "react";

import { sendMsg, sendSerialMsg, sleep } from "./android";
const packageJson = require("../package.json");
let pipeIndex = 1;


export default function Settings() {
  
  const [disabledSerial, setDisabledSerial] = useState(false);
  const p = useRef(null);

  async function send() {
    setDisabledSerial(true);
    const pipeType = pipeIndex > 53 ? 0 : 3;
    const index = Number.parseInt(pipeIndex - 1)
      .toString(16)
      .padStart(2, "0");
    const data = `01 05 ${index} 0${pipeType} 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    sendSerialMsg(
      data,
      (req, res) =>
        (p.current.innerText += `\nsend-->${req}\nreceived-->${res}`)
    );
    const sleepTime = pipeType === "0" ? 100 : 2000;
    await sleep(sleepTime);
    const queryData = `01 03 ${index} 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    sendSerialMsg(
      queryData,
      (req, res) =>
        (p.current.innerText += `\nsend-->${req}\nreceived-->${res}`)
    );
    await sleep(100);
    setDisabledSerial(false);
  }

  async function open() {
    setDisabledSerial(true);
    const data = "01 05 4f 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
    sendSerialMsg(
      data,
      (req, res) =>
        (p.current.innerText += `\nsend-->${req}\nreceived-->${res}`)
    );
    await sleep(100);
    const queryData = "01 03 4f 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
    sendSerialMsg(
      queryData,
      (req, res) =>
        (p.current.innerText += `\nsend-->${req}\nreceived-->${res}`)
    );
    await sleep(100);
    setDisabledSerial(false);
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

  function exit() {
    const msg = JSON.stringify({ type: 4 });
    p.current.innerText += `\nsend-->${msg}`;
    sendMsg(msg, (result) => (p.current.innerText += `\nreceived-->${result}`));
  }

  return (
    <div className="tw-w-full tw-h-full tw-p-4 tw-text-2xl tw-text-slate-700">
      <h1 className="tw-text-center">系统设置</h1>
      <Divider />
      <Range
        className="tw-mb-8 tw-mt-10"
        min="1"
        max="120"
        defaultValue={pipeIndex}
        onEnd={(v) => (pipeIndex = v)}
      />
      <Button
        type="primary"
        onClick={send}
        className="tw-w-full"
        disabled={disabledSerial}
      >
        发送
      </Button>
      <p
        id="log"
        ref={p}
        className="tw-h-2/3 tw-overflow-y-scroll tw-text-sm tw-bg-slate-200 tw-my-4 tw-p-2"
      >
        {window.logs}
      </p>
      <Button
        type="success"
        onClick={open}
        className="tw-w-full"
        disabled={disabledSerial}
      >
        开门
      </Button>
      <div className="tw-h-4" />
      <Button type="info" onClick={upgrade} className="tw-w-full">
        升级
      </Button>
      <div className="tw-h-4" />
      <Button onClick={exit} className="tw-w-full">
        退出
      </Button>
      <div className="tw-text-sm tw-fixed tw-right-4 tw-bottom-4">
        {packageJson.version}
      </div>
    </div>
  );
}
