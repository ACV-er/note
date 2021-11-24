# Promise

* 异步操作

## 处理

* `resolve`表示异步操作完成，并且将参数作为结果传递出去。`reject`表示失败。均只有第一次调用时生效。生效后，后续代码继续执行，并不终止。但不建议这样操作，后续有处理因该写入`then`。

```
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

* `Promise`实例生成以后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数。

```
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

* 用`catch`处理`reject`

```javascript
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```

## finally

* 无论Promise对象最后的状态如何，都会执行操作。一般可以用来执行关闭连接等操作。

```
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

