# weapp-promises
用Bluebird Promise封装微信小程序wx对象

# 如何使用
直接把`utils`和`vendor`文件夹放到小程序开发根目录，然后通过`require`引用：

```javascript
var wxp = require('./utils/wx_promises.js');

wxp.request({
  // options
}).then(res => {
  // code
});
```

`vendor`文件夹集成bluebird