# 网页黑白代码


1，确认使用最新的网页标准协议：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml">
```

2，添加 CSS 代码：

```html
html { filter:progid:DXImageTransform.Microsoft.BasicImage (grayscale=1); -webkit-filter: grayscale (1); }
```

若没有全站 CSS 代码，可在 < head > 和 </head > 之间添加 html 代码：

```html
<style>html { filter:progid:DXImageTransform.Microsoft.BasicImage (grayscale=1); -webkit-filter: grayscale (1); }</style>
```

