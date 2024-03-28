# 备忘 - 解决 Gravatar 头像问题


将 var/Typecho/Common.php 中的第 939 行中的 [http://www.gravatar.com/](http://www.gravatar.com/) 改为 [http://gravatar.duoshuo.com/](http://gravatar.duoshuo.com/) 即可！

```php
$url = $isSecure ? 'https://secure.gravatar.com' : 'http://gravatar.duoshuo.com/ ';
```

