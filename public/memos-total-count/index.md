# Memos API 获取总条数


***更新**：Memos 官方 `amount` API 已弃用。（[Issues #1214](https://github.com/usememos/memos/issues/1214)）

获取 Memos 条数的新方法是利用 Json 返回的数据总条数从而计算 Memos 总条数。

```html
<span id="memosCount">0</span>
```

```js
//获取 Memos 总条数
function getTotal() {
    var totalUrl = "https://memos.example.com/api/memo/stats?creatorId=101"
    fetch(totalUrl).then(res => res.json()).then(resdata => {
        if (resdata.data) {
            var allnums = resdata.data.length
            var memosCount = document.getElementById('total');
            memosCount.innerHTML = allnums;
        }
    }).catch(err => {
        // Do something for an error here
    });
};
window.onload = getTotal();
```

