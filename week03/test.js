// 转成4种进制的number
// 十进制-'1',二进制-'0b111',八进制-'0o10',十六进制-'0xFF'

function StringToNumber(str) {
    let result = 0;

    // 2
    if (str.startsWith('0b')) {
        const newStr = str.slice(2);
        const len = newStr.length;
        if (len === 0 || newStr.replace(/[0|1]*/g, '').length) {
            console.log('不是正确的二进制字符串')
            return;
        }
        for (let i = len - 1; i >= 0; i-- ){
            result += (newStr[i] * 2 ** (len - i - 1));
        }
        console.log('二进制字符串, 转十进制number结果为=', result);
        return;
    }
    // 8
    if (str.startsWith('0o')) {
        const newStr = str.slice(2);
        const len = newStr.length;
        if (len === 0 || newStr.replace(/[0-7]*/g, '').length) {
            console.log('不是正确的八进制字符串')
            return;
        }
        for (let i = len - 1; i >= 0; i-- ){
            result += (newStr[i] * 8 ** (len - i - 1));
        }
        console.log('八进制字符串, 转十进制number结果为=', result);
        return;
        
    }
    // 10
    if ((/^[1-9]/.test(str))) {
        result = Number(str);
        console.log('十进制字符串, 转十进制number结果为=', result);
        return;
    }
    // 16 0xFF
    if (str.startsWith('0x')) {
        const arr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
        const newStr = str.slice(2);
        const len = newStr.length;

        if (len === 0 || newStr.replace(/[0-9A-Fa-f]*/g, '').length) {
            console.log('不是正确的十六进制字符串')
            return;
        }
        for (let i = len - 1; i >= 0; i-- ) {
            const value = arr.indexOf(newStr[i]);
            if (value >= 0) {
                result += (value * 16 ** (len - i - 1));
            } else{
                result += (newStr[i] * 16 ** (len - i - 1));
            }
        }
        console.log('十六进制字符串, 转十进制number结果为=', result);
        return;
    }
}
StringToNumber('0b10001');
StringToNumber('10');
StringToNumber('0o10');
StringToNumber('0xFF');

