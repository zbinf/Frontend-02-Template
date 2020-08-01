// 解析 html


const EOF = Symbol("EOF"); // end of file


function data(c) {
    if (c == '<') {
        return tagOpen; // 标签开始
    } else if (c == EOF) {
        return;
    } else {
        return data;
    }
}

function tagOpen(c) {
    if (c == '/') {
        return endTagOpen; // 判断是为结束标签
    } else if (c.match(/^[a-zA-Z]/)) {
        return tagName(c);
    } else{
        return;
    }
}

// 结束标签开始
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]/)) {
        return tagName(c);
    } 
    if (c == '>') {
        // 报错
    }
    if (c == EOF) {
        // 报错
    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f]/)) { // 空白符
        // <p class
        return beforeAttributeName;
    }
    if (c == '/') {
        return selfClosingStartTag;
    }
    if (c.match(/^[a-zA-Z]/)) {
        return tagName;
    }
    if (c == '>') {
        return data;
    }
    return tagName;
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f]/)) { // 空白符
        // <p class
        return beforeAttributeName;
    }
    if (c == '>') {
        return data;
    }
    if (c == '=') {
        return beforeAttributeName;
    }
    return beforeAttributeName;
}

function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = true;
        return data;
    }
    if (c == 'EOF') {
        // 报错
    }
    // 报错
}


module.exports.parseHTML = function parseHTML(html) {
    let state = data;
    for (const c of object) {
        state = state(c);
    }
    state = state(EOF);
}