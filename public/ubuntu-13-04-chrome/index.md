# Ubuntu 13.04 不能安装 Chrome


Ubuntu13.04 安装 google-chrome-stable 依赖问题：依赖于 libudev0 (>= 147)

使用 sudo apt-get install libudev0 提示 “未发现软件包 libudev0”。

Google 后找到 libudev0 下载地址，附列如下：

i386：[http://launchpadlibrarian.net/132294322/libudev0_175-0ubuntu19_i386.deb](http://launchpadlibrarian.net/132294322/libudev0_175-0ubuntu19_i386.deb)

amd64： [http://launchpadlibrarian.net/132294155/libudev0_175-0ubuntu19_amd64.deb](http://launchpadlibrarian.net/132294155/libudev0_175-0ubuntu19_amd64.deb)

安装后，Chrome 既可正常安装了。

