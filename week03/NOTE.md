##### 学习总结

###### JS表达式-运算符和表达式

* 语法树与运算符优先级的关系

    优先级排名-从高到低
    1. Expressions - Member运算
       ```eg：a.b、a[b]、foo`string`、new Foo()```

    2. Expressions - New表达式
       ```eg： new Foo```

    3. Reference - 
        ```Object、Key```

    4. Expressions - call 函数调用
       ```foo()、super()、foo()['b']、foo().b、foo()`b`此时后面的点运算已经降级了（要根据上下文来看此时是什么优先级）```

    5. Update Expression
      ```eg：a++，a--, --a, ++a```

    6. Unary Expression 单目运算符
      ```eg：delete a.b，void foo()， typeof a, + a, await a, ....```

    7. Exponental Expression 乘方
      ``` ** （右结合）```

    8. Multiplicative 乘除
      ``` * / %```

    9. Additive 加减
      ``` + -```

    10. Shif - 移位运算
      ```<>>> >>>```

    11. Relationship 关系表达式
      ``` <， >， <=， >=， instanceof ，in```

    12. Equality 相等的比较
       ``` ==，!=, ===, !== ```

    13. Bitwise 位运算
        ``` &, ^, | ```

    14. Logical 逻辑运算
        ```&& ||```

    15. Conditional 三目运算符
        ``` ?:```

    *注意-从第五点开始 为右手运算 不能放到=号左边的：* 

###### JS表达式-类型转换

* == 类型相同正常比较，类型不同都转为number在比较，所以时常会出现问题，最好使用 ===，或者类型转换成相同的。

```
x: 无法转换
-: 本身
Boxing: 装箱转换
valueOf: 调用valueOf成员函数
```

||Number|String|Boolean|Undefined|Null|Object|Symbol|
--|--|:--:|--:|--|:--:|--:|--:|
Number|-|(有复杂的规则)| 0=>false,其他数字=>true|x|x|Boxing|x|
String|(有复杂的规则)|-|''=>false,其他=>true|x|x|Boxing|x|
Boolean|true=>1,false=>0|'true','false'|-|x|x|Boxing|x|
Undefined|NaN|'undefined'|false|-|x|x|x|
Null|0|'null'|false|x|-|x|x|
Object|valueOf|1.valueOf，2.tostring|true|x|x|-|x|
Symbol|x|x|x|x|x|Boxing|-|


* Unboxing 拆箱转换：object->普通(基础)类型

* Boxing 装箱转换：普通(基础)类型 -> object


|类型|对象|值|
|--|:--:|--:|--:|
|Number|new Number(1)|1|
|String|new String('a')|'a'|
|Boolean|new Boolean(true)|true|
|Symbol|new Object(Symbol('a'))|Symbol('a')|



###### JS语句-运行时相关概念
###### JS语句-简单语句和复合语句
###### JS语句-声明
###### JS结构化-宏任务和微任务
###### JS结构化-函数调用