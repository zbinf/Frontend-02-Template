
function NumberToString(num, type) {
    if (typeof num !== 'number') {
        console.log('请输入数字')
        return;
    }
    // 检测是否是十进制数
    const textReg = /^([0]|[1-9])\d*$/;
    if (!textReg.test(num.toString())) {
        console.log('请输入正确的十进制数字')
        return;
    }
    // 10转10
    if (type === 10) {
        result = num.toString();
        console.log('十进制数字:', num ,'转十进制string结果为:', result);
        return;
    }

    let result = '', arr = [];
    const obj = {
        10: 'A',
        11: 'B',
        12: 'C',
        13: 'D',
        14: 'E',
        15: 'F'
    };

    while (num !== 0) {
        arr.unshift(num % type);
        num = Math.floor(num / type);
    }

    // 十进制整数转换为二进制整数采用"除2取余，逆序排列"法。
    // 具体做法是：用2整除十进制整数，可以得到一个商和余数；
    // 再用2去除商，又会得到一个商和余数，如此进行，直到商为小于1时为止，
    // 然后把先得到的余数作为二进制数的低位有效位，
    // 后得到的余数作为二进制数的高位有效位，依次排列起来。
    if (type === 2) {
        result = arr.join('');
        console.log('十进制数字:', num ,'转二进制string结果为:', result);
        return;
    }
    // 8
    if (type === 8) {
        result = `0o${arr.join('')}`;
        console.log('十进制数字:', num ,'转八进制string结果为:', result);
        return;
    }
    // 16
    if (type === 16) {
        let str = '';
        for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (obj[el]) {
                str += obj[el]
            } else {
                str += el;
            }
        }
        result = str;
        console.log('十进制数字:', num ,'转十六进制string结果为:', result);
        return;
    }
}
NumberToString(10, 2);
NumberToString(8, 8);
NumberToString(255, 16);