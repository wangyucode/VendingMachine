package cn.wycode.vendingmachine

import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.net.wifi.WifiConfiguration
import android.net.wifi.WifiManager
import android.os.Bundle
import android.os.SystemClock
import android.provider.Settings
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.Date

class MainActivity : Activity() {

    private val scope = MainScope()
    private lateinit var webView: WebView
    private lateinit var alarmManager: AlarmManager
    private lateinit var wifiManager: WifiManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION

        window.decorView.setOnSystemUiVisibilityChangeListener { visibility ->
            if (visibility and View.SYSTEM_UI_FLAG_FULLSCREEN == 0) {
                window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                        View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                        View.SYSTEM_UI_FLAG_FULLSCREEN or
                        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            }
        }

        alarmManager = this.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        wifiManager = this.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager

        if (!Settings.System.canWrite(this)) {
            val requestIntent = Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS)
            requestIntent.data = Uri.parse("package:" + this.packageName)
            requestIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            this.startActivity(requestIntent)
        }

        loadWebPage()

        setupRestartWifiAp()
    }

    private fun setupRestartWifiAp(){
        val intent = this.packageManager.getLaunchIntentForPackage(this.packageName)
        intent?.putExtra("isEnableAp", true)
        val pendingIntent = PendingIntent.getActivity(
            this, 200, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )
        val now = Date()
        alarmManager.set(AlarmManager.RTC, now.time + 8 * 3600 * 1000, pendingIntent)
    }


    private suspend fun enableWifiAp() {
        try {
            val methodWifiApConfiguration =
                wifiManager.javaClass.getMethod("getWifiApConfiguration")
            val mWifiConfiguration = methodWifiApConfiguration.invoke(wifiManager)
            val setWifiApEnabled = wifiManager.javaClass.getMethod(
                "setWifiApEnabled", WifiConfiguration::class.java,
                java.lang.Boolean.TYPE
            )
            setWifiApEnabled.invoke(wifiManager, mWifiConfiguration, false)
            delay(5000)
            setWifiApEnabled.invoke(wifiManager, mWifiConfiguration, true)
            setupRestartWifiAp()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        if (intent?.getBooleanExtra("isEnableAp", false) == true) {
            scope.launch { enableWifiAp() }
        }
    }

    override fun onStart() {
        super.onStart()
        val intent = this.packageManager.getLaunchIntentForPackage(this.packageName)
        val pendingIntent = PendingIntent.getActivity(
            this, 100, intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )
        if (pendingIntent != null) alarmManager.cancel(pendingIntent)
    }

    override fun onStop() {
        super.onStop()
        val intent = this.packageManager.getLaunchIntentForPackage(this.packageName)
        val pendingIntent = PendingIntent.getActivity(
            this, 100, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        alarmManager.set(
            AlarmManager.ELAPSED_REALTIME,
            SystemClock.elapsedRealtime() + 30000,
            pendingIntent
        )
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun loadWebPage() {
        webView = findViewById(R.id.web_view) as WebView
        webView.setWebViewClient(WebViewClient())
        webView.settings.javaScriptEnabled = true
        //WebView.setWebContentsDebuggingEnabled(true)
        webView.addJavascriptInterface(MessageHandler(webView), "Android")

        webView.loadUrl("https://wycode.cn/upload/vending/vite/")
    }

    fun upgrade() {
        scope.launch {
            withContext(Dispatchers.Main) {
                webView.clearCache(true)
                webView.reload()
            }
        }
    }

}