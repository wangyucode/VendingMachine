import { useState } from "react";
import { Input, Divider, Button } from "@nutui/nutui-react";

const secret = process.env.REACT_APP_PASSWORD;

export default function Login({ setDialogContent }) {
  const [password, setPassword] = useState("");
  function login() {
    if (password === secret) {
      setDialogContent("系统设置");
    }
  }

  return (
    <div className="tw-w-full tw-h-full tw-p-4 tw-text-2xl tw-text-slate-700">
      <h1 className="tw-text-center">管理员登录</h1>
      <Divider />
      <Input
        placeholder="管理员密码"
        type="password"
        className="tw-mb-4"
        onChange={(password) => setPassword(password)}
        value={password}
      />
      <Button type="success" className="tw-w-full" onClick={login}>
        登录
      </Button>
    </div>
  );
}
