package cn.wycode.vendingmachine

import android.annotation.SuppressLint
import android.os.Bundle
import android.os.Environment
import android.os.Handler
import android.util.Log
import android.view.View
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.util.zip.ZipInputStream

const val TAG = "MainActivity"

class MainActivity : AppCompatActivity() {

    private val scope = MainScope()
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN
        scope.launch {
            val htmlPath = checkWebProject()
            loadWebPage(htmlPath)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun loadWebPage(htmlPath: String) {
        webView = findViewById<WebView>(R.id.web_view)
        webView.webViewClient = WebViewClient()
        webView.settings.javaScriptEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.cacheMode = WebSettings.LOAD_NO_CACHE
        webView.addJavascriptInterface(MessageHandler(webView), "Android")

        webView.loadUrl(htmlPath)
    }

    private suspend fun checkWebProject(): String {
        val path = cacheDir.absolutePath
        Log.d(TAG, "path->: $path")
        val htmlPath = "$path/vending/index.html"
        val file = File(htmlPath)
        withContext(Dispatchers.IO) {
            if (!file.exists()) {
                downloadWebPackage()
            }
        }
        return "file://$htmlPath"
    }

    private suspend fun downloadWebPackage() {
        val path = cacheDir.absolutePath
        val client = OkHttpClient()
        val request = Request.Builder().url("https://wycode.cn/upload/vending/build.zip").build()
        val response = client.newCall(request).execute()
        if (response.code == 200) {
            val zipFile = File("$path/vending/web.zip")
            zipFile.parentFile?.mkdirs()
            response.body?.byteStream()?.copyTo(zipFile.outputStream())

            val zipInputStream = ZipInputStream(zipFile.inputStream())
            var entry = zipInputStream.nextEntry
            while (entry != null) {
                val file = File(path + "/vending/" + entry.name)
                if (entry.isDirectory) {
                    file.mkdir()
                } else {
                    zipInputStream.copyTo(file.outputStream())
                }
                entry = zipInputStream.nextEntry
            }
        }
    }

    fun upgrade() {
        runBlocking {
            withContext(Dispatchers.IO){
                downloadWebPackage()
            }
            withContext(Dispatchers.Main){
                webView.reload()
            }
        }
    }

}