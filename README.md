### A Proxy Server Configuration Management System

## 基本教程

package.json 中指定的 main 文件是 Electron 应用的入口。 这个文件控制 主程序 (main process)，它运行在 Node.js 环境里，负责控制您应用的生命周期、显示原生界面、执行特殊操作并管理渲染器进程 (renderer processes)

![](C:\Users\zhangjialu6\AppData\Roaming\marktext\images\2024-04-13-14-00-34-image.png)

### 将网页装载到 BrowserWindow

应用中的每个页面都在一个单独的进程中运行，我们称这些进程为 渲染器 (renderer)。渲染进程使用与常规Web开发相同的JavaScript API和工具，例如使用 webpack来打包和压缩您的代码，或使用 React 构建用户界面。

### 预加载脚本

Electron 的主进程是一个拥有着完全操作系统访问权限的 Node.js 环境。 除了 Electron 模组 之外，您也可以访问 Node.js 内置模块 和所有通过 npm 安装的包。 另一方面，出于安全原因，渲染进程默认跑在网页页面上，而并非 Node.js里。为了将 Electron 的不同类型的进程桥接在一起，我们需要使用被称为 预加载 的特殊脚本。

BrowserWindow 的预加载脚本运行在具有 HTML DOM 和 Node.js、Electron API 的有限子集访问权限的环境中。

如果你想为渲染器添加需要特殊权限的功能，可以通过 contextBridge 接口定义 全局对象。
