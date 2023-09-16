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
        var readed = 0
        try {
            serialPort.outputStream.write(bytes)
            Thread.sleep(100)
            readed = serialPort.inputStream.read(bytes)
        } catch (e: Exception) {
            return "serial port error->${e.message}"
        }
        return "readed -> $readed: ${bytes.toString()}"
    }


    private fun hexToBytes(msg: String): ByteArray {
        val hexArray = msg.split(" ")
        val result = ByteArray(hexArray.size)

        for (i in hexArray.indices) {
            result[i] = Integer.parseInt(hexArray[i], 16).toByte()
        }
        return result
    }

    private fun bytesToHex(msg: ByteArray): String {
        val sb = StringBuffer()
        for (byte in msg) {
            val hex = Integer.toHexString(byte.toInt());
            if (hex.length < 2) {
                sb.append(0)
            }
            sb.append(hex)
            sb.append(" ")
        }
        return sb.toString()
    }
}