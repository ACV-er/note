# bind

> 参考: **https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind**

* 作用：创建绑定函数（使函数内部可以使用其他作用域的值，类似`PHP`中的``function() use`` 写法）

* 语法: `function.bind(thisArg[, arg1[, arg2[, ...]]])`

* 参数

> ```
> thisArg
> ```
>
> 调用绑定函数时作为`this`参数传递给目标函数的值。 如果使用[`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符构造绑定函数，则忽略该值。当使用`bind`在`setTimeout`中创建一个函数（作为回调提供）时，作为`thisArg`传递的任何原始值都将转换为`object`。如果`bind`函数的参数列表为空，执行作用域的`this`将被视为新函数的`thisArg`。
>
> ```
> arg1, arg2, ...
> ```
>
> 当目标函数被调用时，预先添加到绑定函数的参数列表中的参数。

* 返回值

>  返回一个原函数的拷贝，并拥有指定的**this**值和初始参数。

* 示例

```js
// this.x = 9;    // 在浏览器中，this指向全局的 "window" 对象
x = 9; // 在本地使用node跑this不指向全局，需要这样写
var module = {
  x: 81,
  getX: function() { return this.x; }
};

console.log(module.getX()); // 81

let retrieveX = module.getX;
console.log(retrieveX());   
// 返回9 - 因为函数是在全局作用域中调用的

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
let boundGetX = retrieveX.bind(module);
console.log(boundGetX()); // 81

// 创建一个新的对象，任何对象都可以被绑定进来
let test = {
    x: 123
};

let testGetX = retrieveX.bind(test);
console.log(testGetX()); // 123

// 创建一个新的对象，任何对象都可以被绑定进来, 没有值会返回 undefined
let test1 = {
    y: 123
};

testGetX = retrieveX.bind(test1);
console.log(testGetX()); // undefined
```

