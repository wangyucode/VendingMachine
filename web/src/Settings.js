import { useState, useRef } from "react";
import {
  Button,
  Loading,
  Dialog,
  Divider,
  Radio,
  InputNumber,
} from "@nutui/nutui-react";

import { sendMsg, sendSerialMsg, sleep } from "./android";
const packageJson = require("../package.json");

export default function Settings() {
  const [disabledSerial, setDisabledSerial] = useState(false);
  const [trackIndex, setTrackIndex] = useState(1);
  const [trackType, setTrackType] = useState("0");
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
      (req, res) =>
        (p.current.innerText += `\nsend-->${req}\nreceived-->${res}`)
    );
    const sleepTime = Number.parseInt(trackType) < 2 ? 100 : 2000;
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
    const data = "01 05 4f 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
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

  async function sendMultiple() {
    for (let index = multipleStart; index <= multipleEnd; index++) {
      const indexData = Number.parseInt(index - 1)
        .toString(16)
        .padStart(2, "0");
      const data = `01 05 ${indexData} 0${trackType} 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
      sendSerialMsg(
        data,
        (req, res) =>
          (p.current.innerText += `\nsend-->${req}\nreceived-->${res}`)
      );
      const sleepTime = Number.parseInt(trackType) < 2 ? 100 : 2000;
      await sleep(sleepTime);
      const queryData = `01 03 ${indexData} 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
      sendSerialMsg(
        queryData,
        (req, res) =>
          (p.current.innerText += `\nsend-->${req}\nreceived-->${res}`)
      );
      await sleep(100);
      setDisabledSerial(false);
    }
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

    setTimeout(window.location.reload, 60000);
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
      <Radio.Group
        direction="horizontal"
        onChange={setTrackType}
        value={trackType}
      >
        <Radio value="0">无反馈电磁铁</Radio>
        <Radio value="1">有反馈电磁铁</Radio>
        <Radio value="2">两线制电机</Radio>
        <Radio value="3">三线制电机</Radio>
        <Radio value="6">强三履带</Radio>
      </Radio.Group>
      <div className="track tw-flex tw-mt-2">
        <InputNumber
          className="tw-mr-4"
          value={trackIndex}
          min="1"
          max="120"
          onChange={setTrackIndex}
        />
        <Button type="primary" onClick={send} disabled={disabledSerial}>
          单个测试
        </Button>
      </div>

      <div className="tw-flex tw-mt-4">
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
        <Button type="primary" onClick={sendMultiple} disabled={disabledSerial}>
          多个测试
        </Button>
        <div className="tw-w-4" />
        <Button onClick={() => (p.current.innerText = "")}>清理log</Button>
      </div>
      <p
        id="log"
        ref={p}
        className="tw-h-3/5 tw-overflow-y-scroll tw-text-sm tw-bg-slate-200 tw-my-4 tw-p-2"
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
