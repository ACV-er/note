# apidoc

## apiGroup 不能为 中文 变成 _

>  在项目中 npm apidoc包的文件夹  `node_modules/apidoc-core` 中搜索到 `replace` 函数
>
> `3.10.10` 版本在 `node_modules/apidoc-core/lib/workers/api_group.js`中
>
> 有一条`group = group.replace(/[^\w]/g, '_');` 注释即可  



## apiName 在锚中变_ 导致右侧菜单栏失效

> 同apiGroup 在任何地方变_ 解决同上
>
> `3.10.10` 版本在 `node_modules/apidoc-core/lib/workers/api_name.js` 中
>
> 有一条 `name = name.replace(/[^\w]/g, '_');` 注释即可

