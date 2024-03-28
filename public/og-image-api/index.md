# 部署动态生成 OG Image 的 API


### 前言

> Deprecated：我现在已经手动生成 OG Image 了。

> DEMO: [`https://og.eallion.com/api/og?title=蜗牛` <i class="fas fa-external-link-alt"></i>](https://og.eallion.com/api/og?title=蜗牛)

Vercel 官方有提供 [@vercel/og](https://vercel.com/docs/functions/edge-functions/og-image-generation) 这个包，可以生成 OG Image（[The Open Graph protocol](https://ogp.me/)），有直接可用的 API [https://og-playground.vercel.app](https://og-playground.vercel.app/) 调用方式为：`https://og-image.vercel.app/eallion.png` 但是有个很大的问题，不支持中文。再加上「[得意黑](https://github.com/atelier-anchor/smiley-sans)」字体当时刚发布，很适合做标题，我就利用 @vercel/og 糊了一个 Next.js 的应用，部署到 Vercel，调用方式为：`https://og.eallion.com/api/og?title=蜗牛` 后来换成「思源宋体」了。不过如前文说所，我现在已经手动生成 OG Image 了，毕竟年更博客。

### 注意

🚨 **注意**：Vercel 免费套餐的 Edge 应用最大只支持 1M，而最小的中文字体就远远不止 1M。
不过后文有介绍仅提取用到的字符，压缩字体体积的方法，方法总比困难多，连摇一摇打开淘宝都能想出来，还有什么是不能实现的呢。
另外：Vercel 官方有文档，介绍得非常详细，不像我胡言乱语，连我这种门外汉都可以照着官方文档糊个应用出来，何况现在还有 ChatGPT 了，还是建议看官方文档：

- [https://vercel.com/docs/functions/edge-functions/og-image-generation](https://vercel.com/docs/functions/edge-functions/og-image-generation)

Cloudflare Pages 也有官方插件，但是我没有研究过：

- [https://github.com/cloudflare/pages-plugins/tree/main/packages/vercel-og](https://github.com/cloudflare/pages-plugins/tree/main/packages/vercel-og)

### 教程

#### 1. 准备

- `背景图`：需要准备一张 1200x630 分辨率的背景图，当然是体积越小越好，始终要想到最大只有 1M，然后把图片转换成 base64：[https://base64.guru/converter/encode/image](https://base64.guru/converter/encode/image) 这可以进一步压缩体积。
- `字体`：准备 `.ttf` 字体文件，我试过 Google fonts 在线字体，但在当时不能用，还要注意 Licence。

#### 2. 本地调试

Fork GitHub 仓库：[https://github.com/eallion/vercel.og](https://github.com/eallion/vercel.og)
Fork 后克隆自己的仓库到本地，安装依赖：

```bash
git clone https://github.com/XXXXXXX/vercel.og # XXXXXXX is your GitHub username
cd vercel.og
npm insatll --save
npm run dev
```

然后在浏览器打开 `http://localhost:3000/api/og?title=` 就能看到效果了。

自定义修改 `pages/api/og.tsx` 如下几个地方：

- `字体路径`：<i class="fab fa-github fa-fw"></i>[pages/api/og.tsx#L11](https://github.com/eallion/vercel.og/blob/0ccd5422a721e95888597e579b634859b3052eb5/pages/api/og.tsx#L11)
- `默认 Title`：<i class="fab fa-github fa-fw"></i>[pages/api/og.tsx#L21](https://github.com/eallion/vercel.og/blob/0ccd5422a721e95888597e579b634859b3052eb5/pages/api/og.tsx#L21) 没有传值时的缺省值
- `背景图`：<i class="fab fa-github fa-fw"></i>[pages/api/og.tsx#L53](https://github.com/eallion/vercel.og/blob/0ccd5422a721e95888597e579b634859b3052eb5/pages/api/og.tsx#L53)
- `大标题`：<i class="fab fa-github fa-fw"></i>[pages/api/og.tsx#L81](https://github.com/eallion/vercel.og/blob/0ccd5422a721e95888597e579b634859b3052eb5/pages/api/og.tsx#L81)
- `Author`：<i class="fab fa-github fa-fw"></i>[pages/api/og.tsx#L108](https://github.com/eallion/vercel.og/blob/0ccd5422a721e95888597e579b634859b3052eb5/pages/api/og.tsx#L108)
- `字体`：<i class="fab fa-github fa-fw"></i>[pages/api/og.tsx#L116-L120](https://github.com/eallion/vercel.og/blob/0ccd5422a721e95888597e579b634859b3052eb5/pages/api/og.tsx#L116-L120)

其他自定义的地方可自行修改，这是一个 Next.js 应用。

#### 3. 压缩字体

压缩字体的思路就是利用工具只提取博客标题使用到的字符，这大大减少了字体的体积。
提取标题使用到的字符，我用到的是 <i class="fab fa-github fa-fw"></i>[aui/font-spider](https://github.com/aui/font-spider) 这个工具，按照工具的文档就能很方便的处理了。
基于这个工具，我用的是 <i class="fab fa-github fa-fw"></i>[eallion/font-spider-smiley-opengraph](https://github.com/eallion/font-spider-smiley-opengraph)，是利用自己博客的 [摘要文件](https://github.com/eallion/eallion.com/blob/main/data/summary/summary.json) 来提取 Title 的，这只是一种提取字符集的思路。希望有更好的方式，一起探讨。
把压缩后的 `.ttf` 字体文件复制到 `public/` 目录。

PS：修改完，记得 push 到 GitHub 仓库。

#### 4. Vercel 部署

到 Vercel 控制台，选择 `Add New` `Project` `Import Git Repository` 选择自己仓库的 `vercel.og` 然后 `Import`，`Framework Preset` 要选择 `Next.js`，然后点击 `Deploy` 等待部署完成。
部署成功后，打开 “`域名 + /api/og?title= + 内容`” 就可以使用了，API path 是 `/api/og`。
完整API： `https://og.eallion.vercel.app/api/og?title=`
对于部分地区，可能需要绑定一个域名才能访问。

### 其他

我现在手动生成 OG Image 的工具是：[https://cover.eallion.com](https://cover.eallion.com/)
来自：<i class="fab fa-github fa-fw"></i>[youngle316/cover-paint](https://github.com/youngle316/cover-paint)

