import { useState } from "react";
import { Divider, Button, NumberKeyboard } from "@nutui/nutui-react";

export default function Login({ setDialogContent, countDown }) {
  const [password, setPassword] = useState("");
  function login() {
    if (password === import.meta.env.VITE_APP_PASSWORD) {
      setDialogContent("系统设置");
    }
  }

  function onPasswordChange(value) {
    setPassword(password + value);
  }

  function onPasswordDelete() {
    setPassword(password.slice(0, -1));
  }

  return (
    <div className="login tw-w-full tw-h-full tw-p-4 tw-text-2xl tw-text-slate-700">
      <h1 className="tw-text-center">管理员登录{countDown < 11 && <span className="tw-text-xl tw-ml-2" >{`(${countDown}秒后返回)`}</span>}</h1>
      <Divider />
      <div className="tw-border tw-p-2 tw-my-4 tw-text-center tw-h-12">{password.replace(/./g,'*')}</div>
        <Button type="success" className="tw-w-full" onClick={login}>
          登录
        </Button>
      <NumberKeyboard visible onChange={onPasswordChange} onDelete={onPasswordDelete}/>
    </div>
  );
}
