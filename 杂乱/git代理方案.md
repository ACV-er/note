# git代理方案

* 测试git版本 **2.25.1**
* https协议与git协议方法均测试通过。ssh协议没有使用过，搬运网上方法。

## http&https协议代理

```
// socks5代理
git config --global http.https://github.com.proxy socks5://127.0.0.1:1080
git config --global https.https://github.com.proxy socks5://127.0.0.1:1080

// http&https代理
git config --global http.https://github.com.proxy https://127.0.0.1:1081
git config --global https.https://github.com.proxy https://127.0.0.1:1081

// 非指定域名写法
git config --global [http|https].proxy [scheme]://[proxy_address]:[proxy_address_port]
```

## git协议代理

* 新建可执行文件`/opt/bin/socks5proxywrapper`任意名字

* ```
  // 指定域名
  // git config --global core.gitProxy '/opt/bin/socks5proxywrapper for [url]'
  git config --global core.gitProxy '/opt/bin/socks5proxywrapper for github.com'
  
  // 全局
  git config --global core.gitProxy '/opt/bin/socks5proxywrapper'
  ```

## ssh协议代理

* 没用过ssh协议连接git仓库，在此写下网上通用方法，不保证可用

修改`~/.ssh/config`配置文件。（该文件为指定文件，不可任意）

```
Host github.com #git repository hostname
        Hostname      github.com       #git repository hostname
        Port          22
        # Other configuration
        
        Proxycommand  /usr/bin/ncat --proxy 127.0.0.1:1080 --proxy-type [socks5|http|https] %h %p
```



### 参考链接

* https://blog.systemctl.top/2017/2017-09-28_set-proxy-for-git-and-ssh-with-socks5/