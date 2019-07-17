# API SESSION 

* api.php中的路由，在laravel中间件中 默认不启用session
* 在 /app/Http/Kernel.php 中 api 中间件组中加入

```php
\Illuminate\Session\Middleware\StartSession::class,
```

