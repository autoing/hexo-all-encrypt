### HEXO全站加密插件，忘记是哪位大佬写的了。

### 安装
```
npm install https://github.com/autoing/hexo-all-encrypt.git
```
### 站点配置
```
all_encrypt:
  password: 123456
  trigger_event:
    # 解密后触发window.onload事件
    window_onload: true
    # 解密后触发document.DOMContentLoaded事件
    document_DOMContentLoaded: true
```
