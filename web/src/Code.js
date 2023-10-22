import { useState } from "react";
import { Button, NumberKeyboard, Toast } from "@nutui/nutui-react";

export default function Code({
  setDialogContent,
  countDown,
  setSendingGoods,
  setUpDialogTimeout,
}) {
  const [code, setCode] = useState("");
  const [disabled, setDisabled] = useState(false);

  async function check() {
    if (!code) return;
    setDisabled(true);
    const res = await fetch(
      `${process.env.REACT_APP_HOST_NAME}/api/v1/vending/code?code=${code}`,
      { headers: { "X-API-Key": process.env.REACT_APP_API_KEY } }
    );
    const data = await res.json();
    console.log(data);
    if (data && data.success && !data.payload.usedTime) {
      setSendingGoods(data.payload.goods);
      setDialogContent("出货");
    } else {
      Toast.show("取货码不存在或已被使用");
      setUpDialogTimeout(10);
    }
    setDisabled(false);
  }

  function onChange(value) {
    setCode(code + value);
  }

  function onDelete() {
    setCode(code.slice(0, -1));
  }

  return (
    <div className="code tw-flex tw-flex-col tw-w-full tw-h-full tw-text-2xl tw-bg-slate-100 tw-overflow-hidden">
      <div className="tw-bg-white tw-p-4 tw-border-b tw-border-slate-300 tw-shadow">
        <h1 className="tw-text-center">
          提货码取货
          {countDown < 11 && (
            <span className="tw-text-xl tw-ml-2">{`(${countDown}秒后返回)`}</span>
          )}
        </h1>
      </div>
      <div className="tw-w-full tw-overflow-y-scroll tw-p-4 tw-flex-1 tw-items-center tw-flex tw-flex-col">
        <div className="tw-border tw-p-2 tw-my-4 tw-text-center tw-h-12 tw-w-full tw-bg-white">
          {code}
        </div>
        <Button
          type="success"
          className="tw-w-full"
          onClick={check}
          disabled={disabled}
        >
          取货
        </Button>
        <NumberKeyboard visible onChange={onChange} onDelete={onDelete} />
      </div>
    </div>
  );
}
