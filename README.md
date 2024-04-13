### A Proxy Server Configuration Management System

## 基本教程

package.json 中指定的 main 文件是 Electron 应用的入口。 这个文件控制 主程序 (main process)，它运行在 Node.js 环境里，负责控制您应用的生命周期、显示原生界面、执行特殊操作并管理渲染器进程 (renderer processes)

![](C:\Users\zhangjialu6\AppData\Roaming\marktext\images\2024-04-13-14-00-34-image.png)

### 将网页装载到 BrowserWindow

应用中的每个页面都在一个单独的进程中运行，我们称这些进程为 渲染器 (renderer)。渲染进程使用与常规Web开发相同的JavaScript API和工具，例如使用 webpack来打包和压缩您的代码，或使用 React 构建用户界面。