# array_reduce & 中间件实现

* 函数原型：

  `array_reduce ( array $array , callable $callback [, mixed $initial = NULL ] ) : mixed`

* 将 `$initial`作为`$callback`数的第一个参数，`$array`的元素作为函数剩余的参数。之后的迭代，第一个参数为前一次`$callback`执行结果，可以为`null`。
* 例1：

```php
<?php
function sum($x, $y) {
    return $x + $y;
}

$arr = [1, 2, 3];

echo array_reduce($arr, "sum", 10); // 16
// 等于 sum(sum(sum(10 + 1), 2), 3);
```



* 例2: 来源PHP官网

  > `https://www.php.net/manual/zh/function.array-reduce.php`

```php
<?php
// 以下6条语句等效
array_reduce(array(1,2,3,4), 'f',         target             );
array_reduce(array(2,3,4),   'f',       f(target,1)          );
array_reduce(array(3,4),     'f',     f(f(target,1),2)       );
array_reduce(array(4),       'f',   f(f(f(target,1),2),3)    );
array_reduce(array(),        'f', f(f(f(f(target,1),2),3),4) );
f(f(f(f(target,1),2),3),4)
?>
```



## 中间件

* **中间件其实是一个装饰器**

* 参考上述例子，如果最后一行中的 1 2 3 4 都是装饰函数，`target`是被装饰函数，那么装饰器就可以完成。
* 例子

```php
<?php
function f($target, $decorator) {
    return $decorator($target);
}

function target() {
    echo "我是目标函数\n";
}

function decorator($fn) {
    echo "我是装饰器前置行为\n";
    $fn();
    echo "我是装饰器后置行为\n";
}

f(target, decorator);

// 我是装饰器前置行为
// 我是目标函数
// 我是装饰器后置行为
```

* 但是目前`f`外面不还可以套`f`，装饰器未完成。因为`f`需要两个函数作为参数，但是`f`不返回函数。
* 要对`f`函数改装，对应调用函数也需要改动。

```php
function f($target, $decorator) {
    return function() use ($target,$decorator) {
        return $decorator($target);
    };
}

f(target, addlog)();
// f(f(target, addlog), addlog)(); // 这样调用和array_reduce很接近了。
```

* 装饰器完成

### 中间件实现

* 参考laravel中间件

  > 以下代码从别人的博客复制的，根据上述装饰器实现原理实现了`laravel`的中间件，可以看看。
  >
  > `https://xychen.github.io/post/2019-08-06-decorator/`

```php
interface Middleware
{
  public static function handle(Closure $next);
}
class VerifyCsrfToken implements Middleware
{
  public static function handle(Closure $next)
  {
    echo "验证csrf-token\n";
    $next();
  }
}
class ShareErrorsFromSession implements Middleware
{
  public static function handle(Closure $next)
  {
    echo "如果session中有‘errors’变量，则共享它\n";
    $next();
  }
}
class StartSession implements Middleware
{
  public static function handle(Closure $next)
  {
    echo "开启session, 获取数据.\n";
    $next();
    echo "保存数据，关闭session\n";
  }
}
class AddQueuedCookiesToResponse implements Middleware
{
  public static function handle(Closure $next)
  {
    $next();
    echo "添加下一次请求需要的cookie\n";
  }
}
class EncryptCookies implements Middleware
{
  public static function handle(Closure $next)
  {
    echo "对输入请求的cookie进行解密\n";
    $next();
    echo "对输出响应的cookie进行加密\n";
  }
}
class CheckForMaintenanceMode implements Middleware
{
  public static function handle(Closure $next)
  {
    echo "确定当前程序是否处于维护状态\n";
    $next();
  }
}
function getSlice() // 返回一个函数，与上文的f一致
{
  return function($stack, $pipe)
  {
    return function() use ($stack, $pipe) 
    {
      return $pipe::handle($stack);
    };
  };
}
function then()
{
  $pipes = [
    "CheckForMaintenanceMode",
    "EncryptCookies",
    "AddQueuedCookiesToResponse",
    "StartSession",
    "ShareErrorsFromSession",
    "VerifyCsrfToken"
  ];
  $firstSlice = function() { // 上文的目标函数 target
    echo "请求向路由器传递，返回响应.\n";
  };
  $pipes = array_reverse($pipes);
    
  // 因为最终返回了一个函数，所以需要call_user_func
  call_user_func(array_reduce($pipes, getSlice(), $firstSlice));
}
then();
```

