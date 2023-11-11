import { Divider } from "@nutui/nutui-react";

import wechatUrl from "./wechat.jpg";

export default function About({ setDialogContent, countDown }) {
  let clickCount = 0;
  let clickTimeout = 0;

  function onclickPhone() {
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      clickCount = 0;
    }, 1000);
    clickCount++;
    console.log(clickCount);
    if (clickCount > 5) {
      setDialogContent("管理员登录");
    }
  }

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-full tw-h-full tw-p-4 tw-text-2xl">
      <h1 className="tw-text-center">联系客服{countDown < 11 && <span className="tw-text-xl tw-ml-2" >{`(${countDown}秒后返回)`}</span>}</h1>
      <Divider />
      <img src={wechatUrl} className="tw-w-1/2" alt="wechat"/>
      <ul className="tw-text-left tw-mt-4">
        <li>• 无人售货加盟</li>
        <li>• 售货机系统，定制开发，过户</li>
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
