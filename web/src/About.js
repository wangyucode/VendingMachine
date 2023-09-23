import { Divider } from "@nutui/nutui-react";

import wechatUrl from "./wechat.jpg";

export default function About({ setDialogContent }) {
  let lastClickTime = 0;
  let clickCount = 0;

  function onclickPhone() {
    let now = Date.now();
    if (now - lastClickTime > 1000 && clickCount > 0) {
      lastClickTime = 0;
      clickCount = 0;
      return;
    } else {
      clickCount++;
      lastClickTime = now;
      if (clickCount > 5) {
        setDialogContent("管理员登录");
        lastClickTime = 0;
        clickCount = 0;
      }
    }
  }

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-full tw-h-full tw-p-4 tw-text-2xl">
      <h1 className="tw-text-center">联系客服</h1>
      <Divider />
      <img src={wechatUrl} className="tw-w-1/2" />
      <p className="tw-mt-8 tw-text-left tw-w-3/4">同时提供：</p>
      <ul className="tw-text-left tw-w-3/5">
        <li>• 永久免费的售货机系统</li>
        <li>• 售货机系统定制开发</li>
        <li>• 售货机换系统过户</li>
        <li>• 各种APP开发</li>
        <li>• 网站开发</li>
        <li>• 小程序开发</li>
        <li>• 技术咨询</li>
      </ul>
      <p
        className="tw-absolute tw-text-lg tw-text-slate-500 tw-right-4 tw-bottom-4"
        onClick={onclickPhone}
      >
        微信无响应时请打电话: 17792093491
      </p>
    </div>
  );
}
