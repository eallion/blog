# Ubuntu 配置 Guake


终端推荐安装 Guake ，又好看又方便：

### 安装 Guake

直接安装的 Guake 版本不够新，而且中文显示不全。
推荐源码安装：

```
sudo apt update
sudo apt -y install git curl wget
cd ~
git clone https://github.com/Guake/guake.git
cd guake
./scripts/bootstrap-dev-debian.sh run make
make
sudo make install
```

如果需要直接安装：

```
sudo apt install guake
```

