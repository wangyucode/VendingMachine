import "core-js/actual";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@nutui/nutui-react/dist/style.css";
import { sendMsg } from "./android";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

setTimeout(() => {
  const path = "/dev/ttyS1";
  const baudRate = 9600;
  const msg = JSON.stringify({
    type: 1,
    body: JSON.stringify({ path, baudRate }),
  });
  window.logs = `init-->${msg}\n`;
  sendMsg(msg, result => window.logs += `received-->${result}\n`);
  window.fromAndroid = function (msg) {
    window.logs += `received --->  ${msg}\n`;
    return "js ok";
  };
}, 1000);



