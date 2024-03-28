# 网页跳转备忘


1、html 的实现：

```html
<head>
    <!-- 以下方式只是刷新不跳转到其他页面 -->
    <meta http-equiv="refresh" content="10">
    <!-- 以下方式定时转到其他页面 -->
    <meta http-equiv="refresh" content="5;url=hello.html"> 
</head>
```

2、javascript 的实现：

```js
<script language="javascript" type="text/javascript"> 
    // 以下方式直接跳转
    window.location.href='hello.html';
    // 以下方式定时跳转
    setTimeout ("javascript:location.href='hello.html'", 5000); 
</script>
```

