package cn.wycode.vendingmachine

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.MainScope
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

    @Suppress("DEPRECATION")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        scope.launch {
            val htmlPath = checkWebProject()
            loadWebPage(htmlPath)
        }
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION


    }

    override fun onStop() {
        super.onStop()
        window.decorView.postDelayed({
            startActivity(
                this.packageManager.getLaunchIntentForPackage(
                    this.packageName
                )
            )
        }, 60000)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun loadWebPage(htmlPath: String) {
        webView = findViewById(R.id.web_view)
        webView.webViewClient = WebViewClient()
        webView.settings.javaScriptEnabled = true
        webView.settings.allowFileAccess = true
        WebView.setWebContentsDebuggingEnabled(true)
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

    private fun downloadWebPackage() {
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
                    file.parentFile?.mkdirs()
                    zipInputStream.copyTo(file.outputStream())
                }
                entry = zipInputStream.nextEntry
            }
        }
    }

    fun upgrade() {
        runBlocking {
            withContext(Dispatchers.IO) {
                downloadWebPackage()
            }
            withContext(Dispatchers.Main) {
                webView.reload()
            }
        }
    }

}