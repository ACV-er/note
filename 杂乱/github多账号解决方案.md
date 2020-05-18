# github多账号解决方案

* github 单客户端多账号切换问题。（私有仓库下未找到及多账号ssh文件保存）

## https连接解决方案

> git clone 或 git remote 时指定用户
>
> * git remote add https https://**username**@github.com/username/repository.git
> * github提供的https没有指定连接的用户。公共仓库会提示输入用户名，私有仓库会提示未找到，添加ausernme即可解决。

* 例：

  > 用户名为Joey，仓库名为demo
  >
  > 从github下复制的https链接为`https://github.com/Joey/demo.git`
  >
  > 需改为`https://Joey@github.com/Joey/demo.git`

## ssh连接解决方案

> 多私钥管理（解决github多账号无法使用同一公钥问题）
>
> linux下：有Joey、Tom两个账号，先各自生成证书joey_id_rsa、tom_id_rsa。并分别上传公钥
>
> 关键：使用host区分用户
>
> `~/.ssh/config`文件
>
> ```
> # Joey
> Host Joey.github.com
>  Hostname github.com
>  User Joy
>  IdentityFile ~/.ssh/joye_id_rsa
> 
> # Tom
> Host Tom.github.com
>  Hostname github.com
>  User Tom
>  IdentityFile ~/.ssh/tom_id_rsa
> ```
> 用户名为Joey，仓库名为demo
>
> 从github复制链接为：`git@github.com:Joey/demo.git`
>
> clone、push、remote add时使用`git@Joey.github.com:Joey/demo.git`
>
> 使用ssh配置文件中的host替换原有域名
>
> Tom账号亦可配置，互不干扰
>
> ps: host可以自定义，无需使用xxx.github.com，`usernam.git` 亦可，链接做相应变化即可（主机名后仍需跟 :username。不建议这样使用，本机测试发现速度略有变慢，推测它先使用自定义host请求过一遍，有兴趣可以抓包验证，也有可能是网络波动）。

