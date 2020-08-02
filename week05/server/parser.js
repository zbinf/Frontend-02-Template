// 解析 html
// 构建dom树的基本技巧是使用栈
// 遇到开始标签就入栈，结束标签就出栈
// 自封闭节点可视为入栈后立刻出栈
// 任何元素的父元素是它入栈前的栈顶


const css = require('css');
const { match } = require('assert');
const layout = require('./layout');
const EOF = Symbol("EOF"); // end of file
let currentToken = null;
let currentAttribute = null;
let stack = [{type: "document", children: []}];
let rules = [];


// css - 将css规则暂存到一个数组里
function addCssRules(text) {
    var ast = css.parse(text); // css包提供
    console.log(JSON.stringify(ast, null));
    rules.push(...ast.stylesheet.rules);
}

// 匹配
function computeCss(element) {
   console.log('computeCss- element',rules, element);
   var elements = stack.slice().reverse(); // 匹配顺序是从内向外
   if(!element.computedStyle) {
       element.computedStyle = {};

       for (const rule of rules) {
           var selectorParts = rule.selectors[0].split(' ').reverse();

           if (!match(element, selectorParts[0])) continue;

           let matched = false;
           var j = 1;
           for (let i = 0; i < elements.length; i++) {
                if(match[elements[i], selectorParts[j]]) {
                    j++;
                }               
           }
           if(j >= selectorParts.length) matched = true;

           if (matched) {
               // 如果匹配到，生成computed属性
               console.log('element', element);
               var sp = specificity(rule.selectors[0]);
               var computedStyle = element.computedStyle;
               for (const declaration of rule.declaration) {
                    if (!computedStyle[declaration.property]){
                        computedStyle[declaration.property] = {}
                    }
                    if (!computedStyle[declaration.property].specificity) {
                        computedStyle[declaration.property].value = declaration.value;
                        computedStyle[declaration.property].specificity = sp;
                    } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                        computedStyle[declaration.property].value = declaration.value;
                        computedStyle[declaration.property].specificity = sp;
                    }
               }
           }
       }
   }
}
// 简单选择器 .xx, #xx, div
// 复合选择器 div.a#a
function match(element, selector) {
    if(!selector || !element.attributes) return false;
    if (selector.charAt(0) == '#'){
        var attr = element.attributes.filter(attr => attr.name === 'id')[0];
        if (attr && attr.value === selector.replace('#', '')) return true;
    } else if (selector.charAt(0) == '.') {
        var attr = element.attributes.filter(attr => attr.name === 'class')[0];
        if (attr && attr.value === selector.replace('.', '')) return true;
    } else {
        if (element.tagName === selector) return true;
    }
    return false;
}

function specificity(selector) {
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(' ');
    for (const part of selectorParts) {
        if (part.charAt(0) == '#') {
            p[1] += 1;
        } else if (part.charAt(0) == '.') {
            p[2] += 1;
        } else {
            p[3] += 1
        }
    }
    return p;
}


function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) return sp1[0] - sp2[0];
    if (sp1[1] - sp2[1]) return sp1[1] - sp2[1];
    if (sp1[2] - sp2[2]) return sp1[2] - sp2[2];
    return sp1[3] - sp2[3];
}



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
        computeCss(element);

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
            // ------------如果遇到style标签时，执行添加css规则的操作----------
            if (top.tagName === 'style') {
                addCssRules(top.children[0].content);
            }
            layout(top)
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
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === "=") {
        return beforeAttributeValue;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF){

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
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