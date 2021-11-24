# 尾递归优化

* 纪念一下。

```javascript
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];

  return function accumulator() {
    // 每次调用该函数都留下参数，如果active被置为true，会直接跳过下面的循环，返回undefined。
    accumulated.push(arguments);
      
    // 只有第一次调用的时候才能进入这个代码块，第一次调用进入之后active被置为true。
    // 直到while循环结束，这个代码块才能再次进入。后面的调用会直接结束。
    if (!active) {
      active = true;
      while (accumulated.length) {
        // 第一次进入或之后进入。该长度都为1，因为每次循环（除最后一次）都调用了该函数，留下了参数。
        // shift() 删除上一次留下的参数。此时accumulated长度为0。
        // f.apply调用匿名函数，匿名函数内调用sum即accumulator，将参数留下。此时accumulated长度为1。
        // 直到匿名函数运行到 return x 处，不调用accumulator，此时accumulated长度为0。跳出循环。
        value = f.apply(this, accumulated.shift());
      }
        
      // 此次优化尾递归结束。重置状态。
      active = false;
        
      // 返回计算结果
      return value;
    }
  };
}

var sum = tco(function(x, y) { // sum 其实是accumulator函数，即tco函数的返回值。
  if (y > 0) {
    // 调用的是accumulator(x + 1, y - 1)而不是该匿名函数本身，所以这里不是一个递归。
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

// 这一行代码只有两层额外调用栈，sum自身一层，在内部会调用accumulator，但是这一次调用不会递归，会一次一次调用，可视为改成了循环。
sum(1, 100000)
// 100001
```

