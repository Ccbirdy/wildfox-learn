# WildFox 围棋学习平台

这是一个本地 SGF 棋谱浏览工具，直接打开本地目录里的棋谱文件即可看棋谱，不需要登录。

## 一键启动（Windows）

1. 确认电脑已安装 PHP。启动器会自动使用 PATH 中的 `php`，或查找 `C:\php\php.exe`。
2. 在项目文件夹中双击 [`start-local.bat`](./start-local.bat)。
3. 等待 PHP 服务启动并确认棋谱接口正常，浏览器会自动打开 `http://127.0.0.1:8080/index.php`。

关闭 PHP 服务窗口即可停止服务。如果浏览器没有自动打开，可以手动访问：

```text
http://127.0.0.1:8080/index.php
```

### 手动启动（备用）

如果启动器提示找不到 PHP，先将 PHP 安装目录加入当前 PowerShell 的 PATH（例如 PHP 安装在 `C:\php` 时）：

```powershell
$env:Path = "$env:Path;C:\php"
php -v
```

然后在项目根目录运行：

```powershell
php -S 127.0.0.1:8080
```

再打开：

```text
http://127.0.0.1:8080/index.php
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
- 本地服务使用 8080 端口；如果端口已被其他程序占用，启动器会提示关闭该程序后再启动。

## 常见问题

### 我想看某个棋谱怎么办？

直接在页面中选择对应目录，再点击 `.sgf` 文件就可以打开。