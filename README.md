# SilentPrint

> 网页实现静默打印

<p align="center">
  <img src="https://raw.githubusercontent.com/wxingheng/images/master/picGologo_color.png" alt="">
</p>

## 应用说明

**主要用于业务系统类型的web页面，为网页提供静默打印服务。**

SilentPrint目前支持了

- `指定用户打印设备` v1.0.0
- `指定打印页面` v1.0.0

未来将继续增加对更多打印 ['图片', 'PDF', '网页部分内容' ... ] 形式的支持。欢迎有兴趣的小伙伴一同开发。

支持windows 32位 64位（>= v1.0.0）。

## 应用截图
![](https://raw.githubusercontent.com/wxingheng/images/master/picGoscreen001.gif)

## 开发说明

> 目前仅针对Windows。Mac、Linux平台并未测试。

如果你想要学习、开发、修改或自行构建SilentPrint，可以依照下面的指示：

> 如果想学习Electron-vue的开发，可以查看我写的系列教程——[Electron-vue开发实战](https://molunerfinn.com/tags/Electron-vue/)

1. 你需要有node、git环境。需要了解npm的相关知识。
2. `git clone https://github.com/wxingheng/SilentPrint.git` 并进入项目
3. `npm install` 下载依赖
4. Mac需要有Xcode环境，Windows需要有VS环境。

### 开发模式

输入`npm run dev`进入开发模式，开发模式具有热重载特性。不过需要注意的是，开发模式不稳定，会有进程崩溃的情况。此时需要：

```bash
ctrl+c # 退出开发模式
npm run dev # 重新进入开发模式
```

### 生产模式

如果你需要自行构建，可以`npm run build`开始进行构建。构建成功后，会在`build`目录里出现构建成功的相应安装文件。

**注意**：如果你的网络环境不太好，可能会出现`electron-builder`下载`electron`二进制文件失败的情况。这个时候需要在`npm run build`之前指定一下`electron`的源为国内源：

```bash
export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
npm run build
```

只需第一次构建的时候指定一下国内源即可。后续构建不需要特地指定。二进制文件下载在`~/.electron/`目录下。如果想要更新`electron`构建版本，可以删除`~/.electron/`目录，然后重新运行上一步，让`electron-builder`去下载最新的`electron`二进制文件。

## 需要帮助

联系我 wxingheng@outlook.com

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018 Molunerfinn
