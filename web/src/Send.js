import { CircleProgress } from "@nutui/nutui-react";
import { useState, useEffect } from "react";

import { sendSerialMsg, sleep } from "./android";
import { postLog } from "./utils";

let sending = false;

export default function Send({
  sendingGoods,
  countDown,
  setSendingGoods,
  setUpDialogTimeout,
  fetchGoods,
  setCloseable
}) {
  const [info, setInfo] = useState("");
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [logs, setLogs] = useState("");
  const [color, setColor] = useState("#ef4444");

  useEffect(() => {
    sendAll();
  }, []);

  async function sendAll() {
    if (!sending) {
      sending = true;
      const flatGoods = sendingGoods.flatMap((g) => {
        let goodsArray = [];
        for (let i = 0; i < g.count; i++) {
          goodsArray.push(g.track);
        }
        return goodsArray;
      });
      setTotal(flatGoods.length);
      let logsBuilder = "请在：";
      for (let i = 0; i < flatGoods.length; i++) {
        const track = flatGoods[i];
        setCurrent(i);
        setInfo(`货道${track}正在出货`);
        logsBuilder += `${track}, `;
        await send(track);
      }
      setInfo("出货完成");
      setCurrent(flatGoods.length);
      logsBuilder += "号取出您的商品";
      setLogs(logsBuilder);
      setUpDialogTimeout(11);
      setSendingGoods([]);
      setColor("#22c55e");
      fetchGoods();
      setCloseable(true);
      sending = false;
    }
  }

  async function send(track) {
    const index = Number.parseInt(track - 1)
      .toString(16)
      .padStart(2, "0");
    const data = `01 05 ${index} 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    sendSerialMsg(data, (req, res) => postLog(`\ns:${req}\nr:${res}`));
    await sleep(4000);
    const queryData = `01 03 ${index} 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00`;
    sendSerialMsg(queryData, (req, res) => postLog(`\ns:${req}\nr:${res}`));
    await sleep(100);
    await fetch(
      `${process.env.REACT_APP_HOST_NAME}/api/v1/vending/reduce?track=${track}`,
      {
        headers: { "X-API-Key": process.env.REACT_APP_API_KEY },
      }
    );
  }

  return (
    <div className="cart tw-flex tw-flex-col tw-w-full tw-h-full tw-text-2xl tw-bg-slate-100 tw-overflow-hidden">
      <div className="tw-bg-white tw-p-4 tw-border-b tw-border-slate-300 tw-shadow">
        <h1 className="tw-text-center">
          出货
          {countDown < 11 && (
            <span className="tw-text-xl tw-ml-2">{`(${countDown}秒后返回)`}</span>
          )}
        </h1>
      </div>
      <div className="tw-w-full tw-overflow-y-scroll tw-p-4 tw-flex-1 tw-items-center tw-flex tw-flex-col tw-justify-center">
        <CircleProgress
          percent={(current / total) * 100}
          strokeWidth={10}
          radius={100}
          color={color}
          className="tw-mt-4"
        >
          <div className="tw-text-xl">{info}</div>
          <div
            className="tw-text-2xl tw-font-bold tw-mt-2"
            style={{ color }}
          >{`${current}/${total}`}</div>
        </CircleProgress>
        <div className="tw-mt-4">{logs}</div>
      </div>
    </div>
  );
}
