import { useState, useRef } from "react";
import {
  Button,
  Loading,
  Dialog,
  Divider,
  InputNumber,
} from "@nutui/nutui-react";

import { sendMsg, sendSerialMsg, sleep } from "./android";
const packageJson = require("../package.json");

let stopMultiple = false;

export default function Settings({ setDialogContent, countDown }) {
  const [disabledSerial, setDisabledSerial] = useState(false);
  const [trackIndex, setTrackIndex] = useState(1);
  const [trackType, setTrackType] = useState("3");
  const [multipleStart, setMultipleStart] = useState(60);
  const [multipleEnd, setMultipleEnd] = useState(120);
  const p = useRef(null);
  

  async function send() {
    setDisabledSerial(true);
    const index = Number.parseInt(trackIndex - 1)
      .toString(16)
      .padStart(2, "0");
    const data = `01 05 ${index} 0${trackType} 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    sendSerialMsg(
      data,
      (req, res) => (p.current.innerText += `\ns:${req}\nr:${res}`)
    );
    await sleep(3000);
    const queryData = `01 03 ${index} 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    sendSerialMsg(
      queryData,
      (req, res) => (p.current.innerText += `\ns:${req}\nr:${res}`)
    );
    await sleep(100);
    setDisabledSerial(false);
  }

  async function open() {
    setDisabledSerial(true);
    const data = "01 05 4f 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
    sendSerialMsg(
      data,
      (req, res) => (p.current.innerText += `\ns:${req}\nr:${res}`)
    );
    await sleep(4000);
    const queryData = "01 03 4f 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
    sendSerialMsg(
      queryData,
      (req, res) => (p.current.innerText += `\ns:${req}\nr:${res}`)
    );
    await sleep(100);
    setDisabledSerial(false);
  }

  async function sendMultiple() {
    setDisabledSerial(true);
    stopMultiple = false;
    for (let index = multipleStart; index <= multipleEnd; index++) {
      if (stopMultiple) break;
      const indexData = Number.parseInt(index - 1)
        .toString(16)
        .padStart(2, "0");
      const data = `01 05 ${indexData} 0${trackType} 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
      sendSerialMsg(
        data,
        (req, res) => (p.current.innerText += `\ns:${req}\nr:${res}`)
      );
      const sleepTime = Number.parseInt(trackType) < 2 ? 100 : 2000;
      await sleep(sleepTime);
      const queryData = `01 03 ${indexData} 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
      sendSerialMsg(
        queryData,
        (req, res) => (p.current.innerText += `\ns:${req}\nr:${res}`)
      );
      await sleep(100);
    }
    setDisabledSerial(false);
  }

  function upgrade() {
    const dialog = Dialog.alert({
      content: <Loading type="circular" />,
      hideConfirmButton: true,
      hideCancelButton: true,
      closeOnOverlayClick: false,
      title: "正在升级...",
    });

    const msg = JSON.stringify({ type: 3 });
    p.current.innerText += `\ns:${msg}`;
    sendMsg(msg, (result) => (p.current.innerText += `\nr:${result}`));

    setTimeout(dialog.close, 60000);
  }

  function exit() {
    const msg = JSON.stringify({ type: 4 });
    p.current.innerText += `\ns:${msg}`;
    sendMsg(msg, (result) => (p.current.innerText += `\nr:${result}`));
    setDialogContent(null);
  }

  return (
    <div className="Settings tw-w-full tw-h-full tw-p-4 tw-text-2xl tw-text-slate-700">
      <h1 className="tw-text-center">系统设置{countDown < 11 && <span className="tw-text-xl tw-ml-2" >{`(${countDown}秒后返回)`}</span>}</h1>
      <Divider />
      <div className="track tw-flex tw-mt-2 tw-text-lg tw-items-center">
        货道:
        <InputNumber
          className="tw-ml-4 tw-mr-16"
          value={trackIndex}
          min="1"
          max="120"
          onChange={setTrackIndex}
        />
        类型:
        <InputNumber
          className="tw-mx-4"
          value={trackType}
          min="0"
          max="6"
          onChange={setTrackType}
        />
        <Button type="success" onClick={send} disabled={disabledSerial}>
          单个测试
        </Button>
      </div>

      <div className="tw-flex tw-mt-4 tw-text-lg tw-items-center">
        从
        <InputNumber
          className="tw-mx-4"
          value={multipleStart}
          min="1"
          max="120"
          onChange={setMultipleStart}
        />
        到
        <InputNumber
          className="tw-mx-4"
          value={multipleEnd}
          min="1"
          max="120"
          onChange={setMultipleEnd}
        />
        <Button type="success" onClick={sendMultiple} disabled={disabledSerial}>
          多个测试
        </Button>
        <div className="tw-w-4" />
        <Button type="primary" onClick={() => (stopMultiple = true)}>
          停止
        </Button>
        <div className="tw-w-4" />
        <Button onClick={() => (p.current.innerText = "")}>清理log</Button>
      </div>
      <div
        id="log"
        ref={p}
        className="tw-h-3/5 tw-text-sm tw-bg-slate-200 tw-my-4 tw-p-2 tw-overflow-y-scroll"
      >
        {window.logs}
      </div>
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
