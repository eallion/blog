# Umami Docker 部署及优化


[Umami](https://umami.is/) 是一个开源的 Self-hosted 的轻量网站统计分析工具。可替代 Google Analytics、百度统计这些工具。适合个人博客、小型网站使用。

本博客已稳定使用 Umami 两年多。现在正值 Umami 大升级到 2.0 版本。因为是个人网站，统计数据并不是那么重要，索性我就全新安装了 Umami，这里记录一下安装过程，备忘及分享。目前已发布 2.0.1 版本，修复了一些 BUG。

如果需要保留数据升级 Umami，请参考官方文档：<https://umami.is/docs/migrate-v1-v2>

> **优化** 部分在文末。

### 安装

> 服务器有 Node.js 运行时的，可以安装 Node.js 版本。官网有文档介绍，在此略过。

推荐使用 Docker 安装。

在域名目录下新建 `docker-compose.yml`文件：

```bash
vim docker-compose.yml
```

**注意**：中国大陆的服务器可能打不开官方示例中的 `ghcr.io` 域名，这里改为了`docker.umami.dev`

```yaml
---
version: '3'
services:
  umami:
    image: docker.umami.dev/umami-software/umami:postgresql-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: replace-me-with-a-random-string
      TRACKER_SCRIPT_NAME: random-string.js
    depends_on:
      - db
    restart: always
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami
    volumes:
      - ./sql/schema.postgresql.sql:/docker-entrypoint-initdb.d/schema.postgresql.sql:ro
      - umami-db-data:/var/lib/postgresql/data
    restart: always
volumes:
  umami-db-data:
```

基本上不用修改什么，只需要注意端口是否占用。如果端口被占用，把`ports`中冒号前的`3000`改为其他的。

启用 Docker 容器：

```bash
docker compose up -d
```

此时，打开 `http://server_ip:3000`即可登录 Umami 开始使用了。

- 默认账号：`admin`
- 默认密码：`umami`

### Nginx 反代

如果不想直接使用服务器的 IP 登录和暴露端口，可以利用 Nginx 反代。假设使用 `tongji.notumami.com` 这个二级域名来当作 Umami 的域名。

反代配置：

```
server
{
    listen 80;
	listen 443 ssl http2;
    server_name tongji.notumami.com;
    root /www/wwwroot/tongji.notumami.com;
    if ($server_port !~ 443){
        rewrite ^(/.*)$ https://$host$1 permanent;
    }

    ####################
    # 其他配置
    ####################

    # 反代配置
    location ^~ /   {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header REMOTE-HOST $remote_addr;
    add_header X-Cache $upstream_cache_status;
    # 缓存
    add_header Cache-Control no-cache;
    expires 12h;
  }
}
```

宝塔面板反代设置：

![](/assets/images/posts/2023/04/umami_bt.png)

配置 Nginx 反代后，就可以通过域名登录 Umami 了。如：`https://tongji.notumami.com`

### 添加被统计网站

通过域名 `https://tongji.notumami.com` 登录 Umami 后台。
在设置中添加需要被统计的网站，先点🌐地球图标，切换为中文。再点`设置`，`添加网站`：

![](/assets/images/posts/2023/04/umami_add_site.png)

### 获取跟踪代码

在刚才添加的网站上点击`编辑`，`跟踪代码`，就能获取到跟踪代码了：

```html
<script
    async
    src="https://tongji.notumami.com/random-string.js"
    data-website-id="cbd4s67a-82e8-481d-9104-a0e3815466f0">
</script>
```

![](/assets/images/posts/2023/04/umami_get_analytics_code.png)

### 安装跟踪代码

到需要被统计的网站上，找一个合适的位置，粘贴上面获取到的跟踪代码即可使用。

一些静态博客 Hexo、Hugo 的主题已经支持 Umami 了，只需要在主题的 `config` 中配置即可。
比如本博客用的 DoIt 主题的 [`config.toml`](https://github.com/eallion/eallion.com/blob/7a21a68f4447aa2256ce983ebc01b06ef07c2401/config.toml#L1039-L1044) 配置：

```toml
    # Umami Analytics
    [params.analytics.umami]
      data_website_id = "cbd4a55a-81e8-42ed-5d04-a0e2315433f0"
      src = "https://api.eallion.com/umami/69d6ffe.js?v=2.0.1"
      data_host_url ="https://a.eallion.com"
      data_domains = "eallion.com,www.eallion.com"
```

### 优化

#### 1. 优化一：广告插件反屏蔽

Umami 的默认跟踪代码是被大多数的广告插件屏蔽的，被屏蔽了你就统计不到访客信息了。如果需要反屏蔽，需要在 `docker-compose.yml` 文件中添加环境变量：`TRACKER_SCRIPT_NAME`，如：

```yml
    environment:
      TRACKER_SCRIPT_NAME: random-string.js
```

然后获取到的跟踪代码的 `src` 会变成：

~~`srcipt.js`~~ => `random-string.js`

```diff
- https://tongji.notumami.com/script.js
+ https://tongji.notumami.com/random-string.js
```

官方文档提供了更多的环境变量配置：<https://umami.is/docs/environment-variables>

#### 2. 优化二：跟踪代码部署到自己的 CDN

如果自己的 VPS 是小水管，会因为跟踪代码的延迟加载影响到网站的加载速度，为了更好的用户体验可以把跟踪代码`random-string.js`下载下来，放到自己或者朋友的 CDN 上。比如放到腾讯云的 COS 里。
此时 `src` 就变成了：`https://cdn.notumami.com/random-string.js`，只放了跟踪代码的链接还没有成功，还需要配置收集数据的服务器。
所以需要添加 `data_host_url` ，它的值为 Umami 实际的网址 `https://tongji.notumami.com`，完整配置如下：

```html
<script
    async
    defer
    data-website-id="cbd4a55a-81e8-42ed-5d04-a0e2315433f0"
    src="https://cdn.notumami.com/random-string.js"
    data-host-url="https://tongji.notumami.com"
    data-domains="eallion.com">
</script>
```

`data-domains` 的意思是只在特定的网站上运行跟踪代码。比如在本地用 `hugo server` 测试 Hugo 博客时就不会统计 `127.0.0.1:1313` 的访问了。
官方文档中有更多的可配置参数：<https://umami.is/docs/tracker-configuration>

#### 3. 优化三：如何集成到 API

有人问到如何把 Umami 集成到 API 里。如：

- <https://api.eallion.com/umami/69d6ffe.js?v=2.0.1>

这其实不算优化，只是我个人的洁癖，网络请求里会减少一个 Domain host。也间接达到了隐藏真实 Umami 域名的效果。
简单说下思路。我的 API 暂时用的是腾讯云的全站加速（其他云服务商的都可以）。配置全站加速 CDN 的源站里，用二级目录 `/umami` 反代 Umami 的 `3000` 端口。

CDN 源站的 Nginx 反代配置：

```nginx
location ^~ /umami
{
    # ......

    proxy_pass http://127.0.0.1:3000/;

    # ......
}
```

而 `69d6ffe.js` 是用 API 域名的 `/umami/69d6ffe.js` 做了 301 重定向转发。

CDN 源站的 Nginx 重定向配置：

```nginx
rewrite ^/umami/69d6ffe.js(.*) https://a.eallion.com/69d6ffe.js permanent;
```

### 其他

如果切换到中文，发现无法删除网站。需要输入 `DELETE`。

![](/assets/images/posts/2023/04/umami_delete_site.png)

