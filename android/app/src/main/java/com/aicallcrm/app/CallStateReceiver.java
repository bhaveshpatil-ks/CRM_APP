package com.aicallcrm.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;
import android.util.Log;

public class CallStateReceiver extends BroadcastReceiver {
    private static final String TAG = "CallStateReceiver";
    private static int lastState = TelephonyManager.CALL_STATE_IDLE;
    private static boolean isIncoming = false;
    private static String savedNumber = "";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || intent.getAction() == null) return;

        if (intent.getAction().equals(TelephonyManager.ACTION_PHONE_STATE_CHANGED)) {
            String stateStr = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
            String number = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);

            int state = TelephonyManager.CALL_STATE_IDLE;
            if (TelephonyManager.EXTRA_STATE_RINGING.equals(stateStr)) {
                state = TelephonyManager.CALL_STATE_RINGING;
            } else if (TelephonyManager.EXTRA_STATE_OFFHOOK.equals(stateStr)) {
                state = TelephonyManager.CALL_STATE_OFFHOOK;
            } else if (TelephonyManager.EXTRA_STATE_IDLE.equals(stateStr)) {
                state = TelephonyManager.CALL_STATE_IDLE;
            }

            onCustomCallStateChanged(context, state, number);
        }
    }

    private void onCustomCallStateChanged(Context context, int state, String number) {
        if (lastState == state) {
            return;
        }

        if (number != null && !number.isEmpty()) {
            savedNumber = number;
        }

        switch (state) {
            case TelephonyManager.CALL_STATE_RINGING:
                isIncoming = true;
                Log.d(TAG, "Call Ringing from: " + savedNumber);
                break;

            case TelephonyManager.CALL_STATE_OFFHOOK:
                Log.d(TAG, "Call Started with: " + savedNumber);
                break;

            case TelephonyManager.CALL_STATE_IDLE:
                // Call Ended / Hung Up -> Trigger Auto-Sync
                if (lastState == TelephonyManager.CALL_STATE_OFFHOOK) {
                    Log.d(TAG, "Call Ended with: " + savedNumber + ". Triggering AI sync...");
                    Intent syncIntent = new Intent("com.aicallcrm.app.CALL_ENDED");
                    syncIntent.putExtra("phoneNumber", savedNumber);
                    syncIntent.putExtra("timestamp", System.currentTimeMillis());
                    context.sendBroadcast(syncIntent);
                }
                isIncoming = false;
                savedNumber = "";
                break;
        }
        lastState = state;
    }
}
