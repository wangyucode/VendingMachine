package cn.wycode.vendingmachine

import org.junit.Test

import org.junit.Assert.*

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
class ExampleUnitTest {
    @Test
    fun addition_isCorrect() {
        val bytes = ByteArray(1)
        bytes[0]=-75
        assertEquals(SerialPortManager().bytesToHex(bytes), "b5")
    }
}