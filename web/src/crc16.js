export function crc16(hex){
    const bytes = hexToBytes(hex);
    const len = bytes.length;
    if (len > 0) {
        let crc = 0xFFFF;

        for (let i = 0; i < len; i++) {
            crc = (crc ^ (bytes[i]));
            for (let j = 0; j < 8; j++) {
                crc = (crc & 1) !== 0 ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
            }
        }
        const hi = ((crc & 0xFF00) >> 8);
        const lo = (crc & 0x00FF);

        return `${lo.toString(16).padStart(2,'0')} ${hi.toString(16).padStart(2,'0')}`;
    }
    return '00 00';
}

function hexToBytes(hex){
    hex = hex.replace(/\s/g,"");
    const bytes = [];  
    for (let i = 0; i < hex.length; i += 2) {  
        bytes.push(parseInt(hex.substr(i, 2), 16));  
    }
    return bytes;
}