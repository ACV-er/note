# session

* laravel 使用自己的session （区别于php 自带 session）
* laravel session配置文件在 config/session.php 中

## 坑点

* laravel session在cookie的键名和 .env 中的APP_NAME相关 可改为固定名字。

* laravel 使用session 需要引入一个中间件 （web.php 使用的中间件组默认引入该中间件）

  ```php
  \Illuminate\Session\Middleware\StartSession::class,
  ```

  

