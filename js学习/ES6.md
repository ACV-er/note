# ES6

## 注释

* `// /**/ <-- -->`

>  另：`-->`是单行注释，仅当`-->`在首行。

## break & continue

* break和continue的特殊用法，标签指定区块

```javascript
--> break, continue 可以指定到外面的循环体
--> 下面是continue演示，break一样
top:
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 3; j++){
            if (i === 1) continue top;
            console.log('i=' + i + ', j=' + j);
        }
        console.log(i);
    }
/*
i=0, j=0
i=0, j=1
i=0, j=2
0
i=2, j=0
i=2, j=1
i=2, j=2
2
*/
```

* break可以跳出代码块

```javascript
test: {
	console.log(1);
	break test;
	console.log(2);
}
console.log(3);
/*
1
3
*/
```

## 构析赋值

```javascript
let { bar, foo } = { foo: 'aaa', barr: 'bbb' };
foo // "aaa"
bar // undefined

const node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

let { loc, loc: { start }, loc: { start: { line }} } = node;
line // 1
loc  // Object {start: Object}
start // Object {line: 1, column: 5}
```

* 赋值到内部

```javascript
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj // {prop:123}
arr // [true]
```

* 指定导入模块

```
const { SourceMapConsumer, SourceNode } = require("source-map");
```



* 其他

```javascript
// 交换值
let x = 1;
let y = 2;

[x, y] = [y, x];
// 函数返回多个值
// 返回一个数组

function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();

// 提取json
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]

```



## 圆括号注意

* 变量声明和函数参数不能用`()`包裹。

```javascript
// 全部报错
let [(a)] = [1];

let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};

let { o: ({ p: p }) } = { o: { p: 2 } };

// 报错
function f([(z)]) { return z; }
// 报错
function f([z,(x)]) { return x; }

// 全部报错
({ p: a }) = { p: 42 };
([a]) = [5];
```

* 只要有可能，不要在这些地方使用圆括号。

## 标签模板

* 标签紧跟函数名

```javascript
// {function}{模板字符串}  等于 {function}([{模板字符串}])

alert`hello`
// 等同于
alert(['hello'])

// 会对语句进行处理

tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
```

## BigInt

* 大数类型，精确整数
* 定义时加后缀`n`。

```javascript
const a = 2172141653n;
const b = 15346349309n;

// BigInt 可以保持精度
a * b // 33334444555566667777n

// 普通整数无法保持精度
Number(a) * Number(b) // 33334444555566670000
```

* 和普通整数是两种值

```javascript
42n === 42 // false
typeof 123n // 'bigint'

-42n // 正确
+42n // 报错 与asm.js冲突
```

* 不能和`Number`类型进行计算，不能传入预期为`Number`的地方。

```javascript
1n + 1.3 // 报错

// 错误的写法
Math.sqrt(4n) // 报错

// 正确的写法
Math.sqrt(Number(4n)) // 2
```

* 与字符串混合计算时，先转化为字符串，然后拼接。

* 类型转换

```javascript
BigInt(123) // 123n
BigInt('123') // 123n
BigInt(false) // 0n
BigInt(true) // 1n

new BigInt() // TypeError
BigInt(undefined) //TypeError
BigInt(null) // TypeError
BigInt('123n') // SyntaxError
BigInt('abc') // SyntaxError
```

## ？.

* 是否存在，存在则继续执行，否则返回undefined

```
if (myForm.checkValidity?.() === false) {
  // 表单校验失败
  return;
}
```

