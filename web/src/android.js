import { crc16 } from "./crc16";

export function sendMsg(req, callback) {
  setTimeout(async () => {
    try {
      callback(await window.Android.fromJs(req));
    } catch {
      callback("not in shell");
    }
  }, 0);
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sendSerialMsg(data, callback) {
  const crc = crc16(data);
  const req = JSON.stringify({ body: `${data} ${crc}`, type: 2 });
  sendMsg(req, (res) => callback(req, res));
}
