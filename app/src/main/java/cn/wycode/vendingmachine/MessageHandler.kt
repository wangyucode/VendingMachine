package cn.wycode.vendingmachine

import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebView
import com.google.gson.Gson
import kotlinx.coroutines.runBlocking


class MessageHandler(
    private val webView: WebView
) {

    private val serialPortManager = SerialPortManager()
    private val gson = Gson()

    @JavascriptInterface
    fun fromJs(msg: String): String {
        val jsMessage = gson.fromJson(msg, CommonMessage::class.java)
        return gson.toJson(handleJsMessage(jsMessage))
    }

    fun sendToJs(msg: String, callback: ValueCallback<String>) {
        webView.evaluateJavascript("fromAndroid('${msg}')", callback)
    }

    private fun handleJsMessage(jsMessage: CommonMessage): CommonMessage {
        val result = when (jsMessage.type) {
            MSG_TYPE_INIT_SERIAL_PORT -> serialPortManager.initSerialPort(gson.fromJson(jsMessage.body, SerialPortInfo::class.java))
            MSG_TYPE_SERIAL_SEND -> serialPortManager.send(jsMessage.body)
            MSG_TYPE_UPGRADE ->  {
                val activity = webView.context as MainActivity
                runBlocking {
                    activity.upgrade()
                }
                "ok"
            }
            else -> "ok"
        }

        return CommonMessage(jsMessage.type, result)
    }


}