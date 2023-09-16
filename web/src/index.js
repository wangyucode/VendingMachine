import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@nutui/nutui-react/dist/style.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

setTimeout(() => {
  const p = document.getElementById("log");
  const path = "/dev/ttyS1";
  const baudRate = 9600;
  const msg = JSON.stringify({
    type: 1,
    body: JSON.stringify({ path, baudRate }),
  });
  p.innerText = `init-->${msg}\n`;
  try {
    const result = window.Android.fromJs(msg);
    p.innerText += `received-->${result}\n`;
  } catch (e) {
    p.innerText += `not in shell\n`;
  }
  window.fromAndroid = function (msg) {
    p.innerText += `received --->  ${msg}\n`;
    return "js ok";
  };
}, 2000);

