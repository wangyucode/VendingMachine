import "core-js/actual";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@nutui/nutui-react/dist/style.css";
import { sendMsg } from "./android";
import { postLog } from "./utils";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.addEventListener(
  "error",
  (e) => {
    console.error("onerror->", e);
    if (e.error) postLog(JSON.stringify(e.error), "ERROR");
  },
  true
);
window.addEventListener(
  "unhandledrejection",
  (e) => {
    console.error("unhandledrejection->", e);
    if (e.reason) postLog(JSON.stringify(e.reason), "ERROR");
  },
  true
);

setTimeout(() => {
  const path = "/dev/ttyS1";
  const baudRate = 9600;
  const msg = JSON.stringify({
    type: 1,
    body: JSON.stringify({ path, baudRate }),
  });
  window.logs = `i:${msg}\n`;
  sendMsg(msg, (result) => (window.logs += `r:${result}\n`));
  window.fromAndroid = function (msg) {
    window.logs += `r:${msg}\n`;
    return "js ok";
  };
}, 1000);
