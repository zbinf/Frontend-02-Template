
// 1. 在一串字符串中，找到‘a'
function getA(str) {
    const strArr = str.split('');
    console.log(strArr);
    const aArr = strArr.filter(el => el === 'a');
    if (aArr.length > 0) return true;
    return false;
}
// getA('abfjgjadf')

// 2. 不准使用正则表达式，纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“ab”
function getAB(str) {
    const strArr = str.split('');
    console.log(strArr);
    strArr.forEach((el, i, arr) => {
        if (el === 'a' && (arr[i + 1] && arr[i + 1] === 'b')) {
            console.log(1);
            return true
        }
    });
    return false;
}
// getAB('afb fjg jadf')

// 3. 不准使用正则表达式，纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“abcdef”

function getABCDEF(str) {
    let foundA = false;
    let foundB = false;
    let foundC = false;
    let foundD = false;
    let foundE = false;
    let foundF = false;

    for (const char of str) {
        if (char === 'a') {
            foundA = true;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
            foundF = false;
        } else if (foundA && foundB == false && char === 'b') {
            foundB = true;
            foundC = false;
            foundD = false;
            foundE = false;
            foundF = false;
        } else if (foundB && foundC == false && char === 'c') {
            foundC = true;
            foundD = false;
            foundE = false;
            foundF = false;
        } else if (foundC && foundD == false && char === 'd') {
            foundD = true;
            foundE = false;
            foundF = false;
        } else if (foundD && foundE == false && char === 'e') {
            foundE = true;
            foundF = false;
        } else if (foundE && char === 'f') {
            return true;
        } else {
            foundA = false;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
            foundF = false;
        }

    }

    return false;
}
// getABCDEF('abcdef')

// 4. 用状态机实现：字符串“abcabx”的解析
// function match(string) {
//     let state = start;
//     for (let c of string) {
//         state = state(c);
//     }
//     return state === end;
// }

// function start(c) {
//     if (c === 'a') {
//         return foundA;
//     } else {
//         return start;
//     }
// }

// function end(c) {
//     return end;
// }

// function foundA(c) {
//     if (c === 'b')
//         return foundB;
//     else   
//         return start;
// }
// function foundB(c) {
//     if (c === 'c')
//         return foundC;
//     else   
//         return start;
// }
// function foundC(c) {
//     if (c === 'a')
//         return foundA2;
//     else   
//         return start;
// }
// function foundA2(c) {
//     if (c === 'b')
//         return foundB2;
//     else   
//         return start;
// }

// function foundB2(c) {
//     if (c === 'x')
//         return end;
//     else   
//         return start;
// }
// console.log(match('I amabcabx'));


// 5. 用状态机实现：字符串“abababx”的解析
// function match2(string) {
//     let state = start;
//     for (let c of string) {
//         state = state(c);
//     }
//     return state === end;
// }

// function start(c) {
//     if (c === 'a') {
//         return foundA;
//     } else {
//         return start;
//     }
// }

// function end(c) {
//     return end;
// }

// function foundA(c) {
//     if (c === 'b')
//         return foundA2;
//     else   
//         return start;
// }
// function foundA2(c) {
//     if (c === 'a')
//         return foundB2;
//     else   
//         return start;
// }
// function foundB2(c) {
//     if (c === 'a')
//         return foundA3;
//     else   
//         return start;
// }
// function foundA3(c) {
//     if (c === 'b')
//         return foundX;
//     else   
//         return start;
// }

// function foundX(c) {
//     if (c === 'x')
//         return end;
//     else   
//         return start;
// }

// console.log(match2('I abababxab'));

// 6. 可选作业：我们如何用状态机处理完全未知的 pattern？ 
//（参考资料：字符串 KMP 算法 https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm）

const pattern = 'cmcmmf';
let i = 0;
function match3(string) {
    let state = start;
    for (let c of string) {
        state = state(c);
    }
    return state === end;
}
function start(c) {
    if (c === pattern[i]) {
        i++;
        if (i === pattern.length) {
            return end;
        }
    }
}
function end(c) {
    return end;
}
console.log(match3('adcmcmmfded'));
