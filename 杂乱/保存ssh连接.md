# 保持ssh连接

* ssh连接一会不发送数据就会被掐短。解决办法是发送心跳包。以下为客户端发送心跳包方案。

>  linux-mint 在`/etc/ssh/sshd_config`文件中
>
> 解除`ClientAliveInterval`和`ClientAliveCountMax`的注释
>
> 如果没有可以添加

* `ClientAliveInterval`是发送心跳包的间隔，`ClientAliveCountMax`是最多多少心跳包没有回复后断开连接。
* 一般设置为60，5即可。
* 重启ssh服务或者重启机器。`systemctl restart sshd`