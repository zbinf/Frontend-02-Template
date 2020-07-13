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

    *注意-以下 不能放到=号左边的：* 
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


###### JS表达式-类型转换
###### JS语句-运行时相关概念
###### JS语句-简单语句和复合语句
###### JS语句-声明
###### JS结构化-宏任务和微任务
###### JS结构化-函数调用