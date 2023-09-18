package cn.wycode.vendingmachine

import android.serialport.SerialPort
import java.io.File


class SerialPortManager {

    private lateinit var serialPort: SerialPort

    fun initSerialPort(info: SerialPortInfo): String {
        return try {
            serialPort = SerialPort(File(info.path), info.baudRate)
            "ok"
        } catch (e: Exception) {
            "fail"
        }
    }

    fun send(msg: String): String {
        val bytes = hexToBytes(msg)
        if (bytes.size != 20) return "invalid length"
        val read: Int
        try {
            serialPort.outputStream.write(bytes)
            Thread.sleep(100)
            read = serialPort.inputStream.read(bytes)
        } catch (e: Exception) {
            return "serial port error - ${e.message}"
        }

        return "read - $read: ${bytes.contentToString()}, ${bytesToHex(bytes)}"
    }


    private fun hexToBytes(msg: String): ByteArray {
        val hexArray = msg.split(" ")
        val result = ByteArray(hexArray.size)

        for (i in hexArray.indices) {
            result[i] = Integer.parseInt(hexArray[i], 16).toByte()
        }
        return result
    }

    fun bytesToHex(msg: ByteArray): String {
        return msg.joinToString(" ") { "%02x".format(it) }
    }
}