# PHP杂记

* 杂乱知识，之后汇总

## or 与 ||

* 基本等效，但是or的优先级低于||。

```
$a = true || false;
$b = false or true;

// $a 为 true，$b 为false。
// 尽量不要用or，不符合编程直觉。
```

