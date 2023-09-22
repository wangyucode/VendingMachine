package cn.wycode.vendingmachine

data class CommonMessage(val type: Int, val body: String)

data class SerialPortInfo(val path: String, val baudRate: Int)

const val MSG_TYPE_INIT_SERIAL_PORT = 1
const val MSG_TYPE_SERIAL_SEND = 2
const val MSG_TYPE_UPGRADE = 3
const val MSG_TYPE_EXIT = 4