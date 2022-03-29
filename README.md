# 导出导入翻译资源脚本

## 依赖

初次使用时，先在脚本目录下执行 `yarn install` 安装依赖

## 自动化导出脚本

### 用法

- 将多语言文件夹放入项目 `exports` 目录下（不一定得是这个，可根据命令参数自定义路径），文件应遵循 CMD 格式
- 执行基本命令 `node export.js` 输出 excel 到同级目录

可以携带额外参数，格式为：`node export.js key1=value1 key2=value2`

| 参数名称       | 说明                                | 默认值      |
| -------------- | ----------------------------------- | ----------- |
| inputDir       | 要扫描的资源文件夹                  | `./exports` |
| base           | 基准语言名称                        | `zh-CN`     |
| outputFileName | 输出的 excel 文件名（无需带扩展名） | `file`      |
| sheetName      | excel 中的表名称                    | `i18n`      |

举例：`node export.js outputFileName=wpsadmin inputDir=i18n`

### 效果

输出 excel 的 sheet 的格式例子如下：

| key         | zh-CN  | zh-TW | en-US |
| ----------- | ------ | ----- | ----- |
| base.all    | 所有   |       | all   |
| base.close  | 关闭   | 關閉  |       |
| base.rename | 重命名 |       |       |

表头第一列是 `key`，下面是基准语言所有文案资源对应的路径（不存在送翻语言有而基准语言无的路径），第二列是基准语言名称，后面的所有列皆为送翻的语言名称，它们下面对应的是该语言在该 key 下的文案，如果存量文件存在翻译，则取之自动填充，否则置空。

## 自动化导入脚本

### 用法

- 执行基本命令 `node import.js inputFile=./xxx.xlsx` 输出文件至指定目录

可以携带额外参数，格式为：`node import.js key1=value1 key2=value2`

| 参数名称  | 说明                 | 默认值        |
| --------- | -------------------- | ------------- |
| inputFile | excel 文件路径       | `./file.xlsx` |
| outputDir | 输出的资源文件夹路径 | `./imports`   |

举例：`node import.js inputFile=./wpsadmin.xlsx outputDir=./lang`

### 效果

输出 excel 表格中所有资源到对应的语言包下，每个语言包均已其名称命名的文件夹包裹，里面有且只有 `index.js` 文件，以下是一个例子：

> imports
>
> > zh-CN
> >
> > > index.js
>
> > zh-TW
> >
> > > index.js
