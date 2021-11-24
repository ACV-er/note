# ThinkPHP学习  

## L方法

* 语言

## 生成模块目录

* 可手动生成，也可以写在入口文件然后自动生成

```
define('BIND_MODULE','{模块名}');
define('BUILD_MODEL_LIST','{模块名},{模块名},{模块名}');
require './ThinkPHP/ThinkPHP.php';
```

```
// 生成Admin模块的Role控制器类
// 默认类库为Admin\Controller\RoleController
// 如果已经存在则不会重新生成
\Think\Build::buildController('Admin','Role');

// 生成Admin模块的Role模型类
// 默认类库为Admin\Model\RoleModel
// 如果已经存在则不会重新生成
\Think\Build::buildModel('Admin','Role');
```

## URL生成

* 涉及多个域名或者迁移时不受影响

```
// [模块/控制器/操作#锚点@域名]?参数1=值1&参数2=值2...

// 在模块中，模块名可省略，也可写
U('{控制器}/{方法}?{参数}={值}')
U('{控制器}/{方法}', '{参数}={值}')
U('{控制器}/{方法}', [{参数} => {值}])
// 上述三种写法等效
```

