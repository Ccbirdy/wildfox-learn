# WildFox 围棋学习平台

这是一个本地 SGF 棋谱浏览工具，直接打开本地目录里的棋谱文件即可看棋谱，不需要登录。

## 直接使用方法

### 1. 先准备 PHP

在 PowerShell 里执行：

```powershell
$env:Path = "$env:Path;C:\php"
```

再确认是否能用：

```powershell
php -v
```

### 2. 启动本地服务

在项目根目录运行：

```powershell
php -S localhost:8080
```

### 3. 打开页面

浏览器打开：

```text
http://localhost:8080/index.php
```

### 4. 浏览棋谱

页面会直接显示目录列表：

- 左边是目录
- 右边是当前目录下的棋谱文件
- 点击某个文件即可打开

你可以直接从 `resource/sgf` 开始选择，例如：

- `resource/sgf/fight`
- `resource/sgf/liveAndDie`
- `resource/sgf/curcia`

选择文件夹，进入子目录，再点击 `.sgf` 文件即可查看棋谱。

## 说明

- 不需要登录
- 不需要数据库
- 直接读取本地 SGF 文件
- 适合本地学习和浏览棋谱

## 常见问题

### 为什么有些旧菜单点了没反应？

因为项目里有部分旧菜单路径已失效，当前版本改成了直接从 `resource/sgf` 目录浏览。

### 为什么中文说明会乱码？

一些 SGF 文件和目录名是 GB2312/GBK 编码，当前版本已经做了转换处理，中文内容会正常显示。

### 我想看某个棋谱怎么办？

直接在页面中选择对应目录，再点击 `.sgf` 文件就可以打开。