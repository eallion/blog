# Memos 简介


### 前言

> DEMO：[https://memos.eallion.com](https://memos.eallion.com/)

我从接触独立博客开始，就一直在博客的子栏目中部署了一个类似 [嘀咕](https://eallion.com/memos/) 的微博客。  
最初的作用是备份 QQ 空间、Twitter 和微博等。  
最早用到的微博客程序是 PageCookery。甚至有点怀念……

现在在独立博客圈少部博主中流行的这种“B 言 B 语”，最早来源于少数派上的一篇文章——[《保卫表达：用后端 BaaS 快速搭建专属无点赞评论版微博——b 言 b 语》](https://sspai.com/post/60024)，“B 言 B 语”也叫“废话胶囊”。

由此也衍生出了：

- [LeanCloud 版](https://github.com/daibor/nonsense.fun)（原版）
- [Golang 版](https://github.com/songquanpeng/microblog)
- [腾讯云 CloudBase 版](https://github.com/ibearye/talk)
- [木木老师修改版](https://immmmm.com/bb-by-wechat-pro/) 《「哔哔点啥」微信公众号 2.0》
- [BBTalk](https://github.com/BBtalkJS/BBtalk)Vercel 版
- 我个人短暂修改使用过的 [Algolia](https://github.com/eallion/eallion.com/blob/30ff6b67c3c072994f8be957c3996e546b38131c/themes/hello-friend/layouts/_default/algoliaTalk.html) 版。

目前以上版本均可使用，不过可能有些版本的使用成本有点高。

今天要介绍的是另一个能提供类似功能的应用——[Memos](https://github.com/usememos/memos)  
Memos 自己对标的竞品是 Flomo ，我们是不是把它用歪了？

### 部署 Memos

> 前置条件：
>
> 1. 一台 VPS 服务器或本地电脑（或 Docker SaaS 平台）
> 2. 一点点 WebStack 技能（Docker、Nginx）

安装`docker-compose-plugin`插件后，`docker compose`命令可以去掉中间的"`-`"，Docker Compose V1 版本已经结束生命周期。

暂时不建议把 Memos 部署到网站二级目录，如：[https://example.com/memos](https://example.com/memos)
而应该部署到一个二级域名，如：[https://memos.example.com](https://memos.example.com)

1. **新建 `docker-compose.yml`**

一般在准备用于 Memos 的域名的目录下新建`docker-compose.yml`文件：

```bash
cd /www/wwwroot/memos.example.com
vim docker-compose.yml
```

输入以下内容：

```yml
version: "3.0"
services:
    memos:
        image: neosmemo/memos
        container_name: memos
        volumes:
            - ./memos/:/var/opt/memos
        ports:
            - 5230:5230
        restart: always
```

1. **启动 Memos**

启动 Memos

```bash
docker compose up -d
```

等待镜像拉取完成，Memos 就运行在服务器的`5230`端口了。  
此时，打开`http://127.0.0.1:5230`就能访问 Memos 了。  
如果有公网 IP，那就打开`IP`+`端口`，如： `http://119.29.29.29:5230` 。
用域名反代 IP 见下文第 4 点。
常用的命令有：

```bash
docker compose up -d
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

1. **升级 Memos**

> 参考：[https://memos.eallion.com/m/5454](https://memos.eallion.com/m/5454)

Memos 官方提供的升级命令

```bash
docker-compose down && docker image rm neosmemo/memos:latest && docker-compose up -d
```

会导致 Memos 在升级期间掉线，因为 `down` 了，特别是境内服务器网速不好的情况下，掉线时间会随着 `pull` 时间无限延长。

最新版 Docker 升级 Memos 的命令有改进空间：

```bash
docker compose pull && docker compose up -d --force-recreate
```

但是如果用了镜像加速服务，因为缓存的原因也可能有 `pull` 不到最新镜像的问题。

1. **Nginx 反代**

如果打算对互联网提供 Memos 访问服务，就需要反代 Memos，一般都是用 Nginx，反代`5230`端口即可。

```nginx
location ^~ /
{
    proxy_pass http://127.0.0.1:5230;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    add_header X-Cache $upstream_cache_status;
    # cache
    add_header Cache-Control no-cache;
    expires 12h;
}
```

一些主机管理面板提供可视化反代设置，那更简单。

![](/assets/images/posts/2022/11/bt_proxy.png)

1. **备份数据**

在第 1 步中的`docker-compose.yml`文件中，

```yml
    volumes:
      - ./memos/:/var/opt/memos
```

这段就是数据持久化配置，如果不做数据持久化，Docker 容器重启后，所有 Memos 都会消失。
“`:`”冒号前面的内容是物理宿主机上的目录，例子中对应的目录为：

```bash
/www/wwwroot/memos.example.com/memos
```

需要备份的数据是此目录下的`memos_prod.db`文件，是一个 SQLite 数据库文件，Memos 的所有设置、用户信息、附件和 Memos 都保存在这个文件中。  
官方提供的示例中，数据卷为家目录`/home/username`下的`.memos`目录，是一个隐藏目录，注意对比。

### Memos Awesome

- [https://memos.top](https://memos.top)
- Discuss in [Telegram](https://t.me/+-_tNF1k70UU4ZTc9) 👾
- Docker Hub：[https://hub.docker.com/r/neosmemo/memos](https://hub.docker.com/r/neosmemo/memos)
- Docker Hub Nightly：[https://hub.docker.com/r/eallion/memos](https://hub.docker.com/r/eallion/memos)
- Moe Memos 客户端：[https://memos.moe/](https://memos.moe/)
- Memos-bber Chrome 扩展：[https://github.com/lmm214/memos-bber](https://github.com/lmm214/memos-bber)
- Memos 微信小程序：[https://github.com/Rabithua/memos_wmp](https://github.com/Rabithua/memos_wmp)
- Telegram Bot：[https://github.com/qazxcdswe123/telegramMemoBot](https://github.com/qazxcdswe123/telegramMemoBot)
- [哔哔广场](https://immmmm.com/bbs-by-memos/)：[https://immmmm.com/bbs/](https://immmmm.com/bbs/)
- [「分享」Android 使用 HTTP Shortcuts 录入笔记](https://github.com/usememos/memos/discussions/315)
- [「分享」使用 iOS 快捷指令录入笔记，支持多图上传，支持标签选择](https://github.com/usememos/memos/discussions/52)
- [「分享」在 Fly.io 平台上搭建 memos 并自动备份到 B2/S3](https://github.com/usememos/memos/discussions/451)

### 一点点建议

1. 发图尽量把图片传到第三方图床，（至少近期版本）别上传到 Memos 资源库。
2. 附件也一样别传到 Memos 资源库，可以传到第三方网盘，贴上分享链接。
3. 备份`memos_prod.db`数据库遵循两地三中心原则，多处备份，且是单向的。
4. 如果你意识不到数据对你有多珍贵或重要，用 SaaS 服务即可，不用自建。
5. 没有那么多人来看你的 Memos，自娱自乐即可。

