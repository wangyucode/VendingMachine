package cn.wycode.vendingmachine

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action.equals(Intent.ACTION_BOOT_COMPLETED)) {
            val toIntent = context.packageManager.getLaunchIntentForPackage(context.packageName);
            context.startActivity(toIntent);
        }
    }
}