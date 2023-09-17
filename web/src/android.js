export function sendMsg(msg, callback) {
  setTimeout(async () => {
    try {
      callback(await window.Android.fromJs(msg));
    } catch {
      callback("not in shell");
    }
  }, 0);
}
