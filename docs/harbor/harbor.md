## 搭建harbor

下载harbor离线安装包：https://github.com/goharbor/harbor/releases

![image-20201223151811570](harbor.assets/image-20201223151811570.png)

解压安装包：

```
tar -zxvf harbor-offline-installer-v2.1.2.tgz
cd harbor
```

修改docker.yml配置：

```
cp harbor.yml.tmpl harbor.yml
vi harbor.yml
```

```sh
## Configuration file of Harbor

## The IP address or hostname to access admin UI and registry service.
## DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: 192.168.116.133

## http related config
http:
  ## port for http, default is 80. If https enabled, this port will redirect to https port
  port: 80

## https related config
#https:
  ## https port for harbor, default is 443
  ## port: 443
  ## The path of cert and key files for nginx
  ##  certificate: /your/certificate/path
  ##  private_key: /your/private/key/path

## ## Uncomment following will enable tls communication between all harbor components
## internal_tls:
##   ## set enabled to true means internal tls is enabled
##   enabled: true
##   ## put your cert and key files on dir
##   dir: /etc/harbor/tls/internal
```

更新harbor配置：

```
./prepare
```

开始安装：

```
./install.sh
```

使用ip验证登录harbor：

```
用户名：admin
密码：Harbor12345
```



## harbor api

