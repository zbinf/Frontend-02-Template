// 解析 html
// 构建dom树的基本技巧是使用栈
// 遇到开始标签就入栈，结束标签就出栈
// 自封闭节点可视为入栈后立刻出栈
// 任何元素的父元素是它入栈前的栈顶
//



const EOF = Symbol("EOF"); // end of file
let currentToken = null;
let currentAttribute = null;
let stack = [{type: "document", children: []}];


function emit(token) {
    let top = stack[stack.length - 1];
     
    if (token.type == 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        };
        element.tagName = token.tagName;

        for (const p in object) {
            if (p != 'type' && p != 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }
        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
            currentTextNode = null;
        }
    }

    if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("tag start end dosen't match!");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    }

    if (token.type === 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: 'text',
                content: '',
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function data(c) {
    if (c == '<') {
        return tagOpen; // 标签开始
    } else if (c == EOF) {
        emit({type: "EOF"}); 
        return;
    } else {
        emit({type: "text", content: c});
        return data;
    }
}

function tagOpen(c) {
    if (c == '/') {
        return endTagOpen; // 判断是为结束标签
    } else if (c.match(/^[a-zA-Z]/)) {
        // <a
        currentToken = {
            type : 'startTag',
            tagName: '',
        }
        return tagName(c);
    } else{
        return;
    }
}

// 结束标签开始
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]/)) {
        currentToken = {
            type : 'endTag',
            tagName: '',
        }
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
        currentToken.tagName += c;
        return tagName;
    }
    if (c == '>') {
        emit(currentToken)
        return data;
    }
    return tagName;
}

// 
function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f]/)) { // 空白符
        // <p class
        return beforeAttributeName;
    }
    if (c == '>' || c == '/' || c == EOF) {
        return afterAttributeName(c);
    }
    if (c == '=') {
        // 错误
        // return beforeAttributeName;
    }
    currentAttribute = {
        name: '',
        value: '',
    };
    return attributeName(c);
}

function afterAttributeName(c) {
    
}
function attributeName(c) {
    if (c.match(/^[\t\n\f]/) || c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c);
    }
    if (c == '=') {
        return beforeAttributeName;
    }
    if (c == '\u0000') {
        return;

    }
    if (c == "\"" || c == "'" || c == '<') {
        return;
    }
    currentAttribute.name += c;
    return attributeName;
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f]/) || c == '/' || c == '>' || c == EOF) {
        return beforeAttributeValue;
    }
    if (c == "\"") {
        return doubleQuoteAttributeValue;
    }
    if (c == "\'") {
        return singleQuoteAttributeValue
    }
    if (c == '>') {
        return;
    }
    return UnquoteAttributeValue(c);
}
// 找双引号结束
function doubleQuoteAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
    }
    if (c == '\u0000') {
        return;
    }
    if (c == EOF) {
        return;
    }
    currentAttribute.value += c;
    return doubleQuoteAttributeValue;
}
// 找单引号结束
function singleQuoteAttributeValue(c) {
    if (c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
    }
    if (c == '\u0000') {
        return;
    }
    if (c == EOF) {
        return;
    }
    currentAttribute.value += c; 
    return doubleQuoteAttributeValue;
}
// 找空白符结束
function UnquoteAttributeValue(c) {
    if (c.match(/^[\t\n\f]/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }
    if (c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }
    if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }
    if (c == '\u0000') {
        return;
    }
    if (c == "\"" || c == "'" || c == "<" || c == "=" || c =="`") {
        return;
    }
    if (c == EOF){
        return;
    }
    currentAttribute.value += c;
    return UnquoteAttributeValue;
}
function afterQuoteAttributeValue(c) {
    
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