# 模板字符串

* 示例

```
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
let name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
```

* 在模板字符串中使`` `来转移字符串，如果需要使用`，需要用转义字符串 \

* 函数可返回模板字符串

  ```
  let func = (name) => `Hello ${name}!`;
  func('Jack') // "Hello Jack!"
  ```

  