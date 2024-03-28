# Windows10 WinSock


如果 Win10 系统能上 QQ 但是打不开网页，浏览器提示 “DNS_PROBE_FINISHED_DXDOMAIN"或者"DNS_PROBE_PROSSIBLE", 在尝试了各种卫士管家的修复后，仍然打不开网页的话，有可能是 WinSock 出问题了。
解决办法：
1、以管理员身份运行 CMD 或者 PowerShell；
2、输入 `netsh winsock reset` ；
3、输入 `netsh advfirewall reset`；
4、重启电脑。

