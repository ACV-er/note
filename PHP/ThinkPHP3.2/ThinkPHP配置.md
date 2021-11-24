# 配置

* 配置不区分大小写，建议全大写下划线命名。使用字母数字下划线。

## 加载

* `惯例配置->应用配置->模式配置->调试配置->状态配置->模块配置->扩展配置->动态配置`

> 配置优先级如上

* 应用配置位于`Common/Conf/config.conf`
* 模式配置位于`Common/Conf/config_{应用模式名称}.php`

> TODO: 什么是应用模式

* 调试配置位于`ThinkPHP/Conf/debug.php` 和 `Common/Conf/debug.php`
* 状态配置

>  `define('APP_STATUS','{状态名}');`
>
>  可加载配置文件
>
>  `Application/Common/Conf/{状态名}.php`
>
>  可用来切换配置文件。

* 模块配置位于`Application/{模块名}/Conf/config.php`

> 模块还可以支持独立的状态配置文件，命名规范为： `Application/当前模块名/Conf/应用状态.php`

## 读取

> C函数两种用法

```
C('{配置参数名}'); // 不存在返回NULL
C('{配置参数名}', null, '{默认值}'); // 不存在返回默认值

// 其中参数名可使用二维配置
C('{模块名}_CONFIG.配置参数名')
```

## 动态配置

* 不存在则新增，存在则修改。

```
C('{配置参数名}', {配置值});
```

## 拓展配置

* 加载自定义配置文件。

> https://www.kancloud.cn/manual/thinkphp/1693
>
> 可能会逐级查找，需要测试。

## 批量配置

> https://www.kancloud.cn/manual/thinkphp/1694 需要测试

