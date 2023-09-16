export async function sendMsg(msg) {
  try {
    return await window.Android.fromJs(msg);
  } catch {
    return "not in shell\n";
  }
}
