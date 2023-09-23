import { useState } from "react";
import { Divider, Button, NumberKeyboard } from "@nutui/nutui-react";

const secret = process.env.REACT_APP_PASSWORD;

export default function Login({ setDialogContent }) {
  const [password, setPassword] = useState("");
  function login() {
    if (password === secret) {
      setDialogContent("系统设置");
    }
  }

  function onPasswordChange(value) {
    setPassword(password+value);
  }

  function onPasswordDelete() {
    setPassword(password.slice(0, -1));
  }

  return (
    <div className="login tw-w-full tw-h-full tw-p-4 tw-text-2xl tw-text-slate-700">
      <h1 className="tw-text-center">管理员登录</h1>
      <Divider />
      <div className="tw-border tw-p-2 tw-my-4 tw-text-center tw-h-12">{password.replace(/./g,'*')}</div>
      <Button type="success" className="tw-w-full" onClick={login}>
        登录
      </Button>
      <NumberKeyboard visible onChange={onPasswordChange} onDelete={onPasswordDelete}/>
    </div>
  );
}
