# URL 及访问规则

* `{协议}://{域名}/index.php?m={模块}&c={控制器}&a={方法}&{参数对}`

> 上述方式为普通模式，比较落后。

* `{协议}://{域名}/index.php/{模块}/{控制器}/{方法}/{参数名}/{参数值}`

> 上述方式为PATHINFO模式

* REWRITE模式为PATHINFO模式去除`index.php`，最为常用。