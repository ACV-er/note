# console

## log

* 常用。

## dir & dirxml

* 更详细。

## warn & error

* 显示为黄色 & 红色。

## assert

* `console.assert(false, '判断条件不成立')`断言，红色。

## trace

* 打印当前堆栈。

## clear

* 清空。

# debuger

* ```
  for(var i = 0; i < 5; i++){
    console.log(i);
    if (i === 2) debugger;
  }
  ```

* 运行到`debugger`时会打开源码界面。