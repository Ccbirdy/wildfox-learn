$ErrorActionPreference = 'Stop'

$url = 'http://127.0.0.1:8080/index.php'
$apiUrl = 'http://127.0.0.1:8080/src/main.php?action=getFileList&pathName=resource%2Fsgf'
$phpCommand = Get-Command php -CommandType Application -ErrorAction SilentlyContinue

if ($phpCommand) {
    $phpPath = $phpCommand.Source
} elseif (Test-Path 'C:\php\php.exe') {
    $phpPath = 'C:\php\php.exe'
} else {
    throw '找不到 PHP。请将 php.exe 所在目录加入 PATH，或将 PHP 安装到 C:\php。'
}

function Test-LocalPort {
    $client = [System.Net.Sockets.TcpClient]::new([System.Net.Sockets.AddressFamily]::InterNetwork)
    try {
        $client.Connect([System.Net.IPAddress]::Loopback, 8080)
        return $true
    } catch {
        return $false
    } finally {
        $client.Close()
    }
}

function Test-WildFoxServer {
    try {
        $response = Invoke-RestMethod -Uri $apiUrl -TimeoutSec 2 -ErrorAction Stop
        return ($response.status -eq '0000' -and $response.body.fileList -contains 'fight')
    } catch {
        return $false
    }
}

if (Test-LocalPort) {
    if (-not (Test-WildFoxServer)) {
        throw '8080 端口已被其他服务占用，且未检测到 WildFox 棋谱接口。请关闭占用 8080 端口的程序后重新双击启动。'
    }
    Write-Host '已检测到 WildFox 服务，正在打开本地页面。'
    Start-Process $url
    exit 0
}

$serverProcess = Start-Process `
    -FilePath $phpPath `
    -ArgumentList @('-S', '127.0.0.1:8080', '-t', ('"{0}"' -f $PSScriptRoot)) `
    -WorkingDirectory $PSScriptRoot `
    -PassThru

$deadline = (Get-Date).AddSeconds(15)
while ((Get-Date) -lt $deadline) {
    if ($serverProcess.HasExited) {
        throw "PHP 服务启动失败，进程已退出。请检查 PHP 安装和 8080 端口。"
    }
    if (Test-WildFoxServer) {
        Start-Process $url
        Write-Host 'PHP 服务已启动，浏览器正在打开 WildFox。关闭 PHP 服务窗口即可停止服务。'
        exit 0
    }
    Start-Sleep -Milliseconds 300
}

throw '等待 WildFox 棋谱接口启动超时。请检查 PHP 是否正常，以及 8080 端口是否被占用。'
