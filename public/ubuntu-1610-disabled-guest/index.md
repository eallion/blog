# Ubuntu 16.10 禁用 Guest 访客


修改：

```
sudo vim /usr/share/lightdm/lightdm.conf.d/50-guest-wrapper.conf
```

```
[Seat:*] 
allow-guest=false
```

并非以前版本的 `/etc/lightdm/lightdm.conf.d` 位置，而是 `/usr/share/lightdm/lightdm.conf.d`

