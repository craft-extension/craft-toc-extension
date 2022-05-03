# 用途

Craft 插件标准开发环境，本组织的插件都是基于该开发工具开发

# 重要！！！

1. Web 版的 Craft 的 storageApi 存储的键值对是非加密的，因此务必在使用该 API 的时候告知用户，出处见 [这里](https://documentation.developer.craft.do/extensions/craft-api/storageapi)

# 开发

1. npm i
2. npm start
3. 打开浏览器 localhost:8080 查看

# 打包

运行 `npm run build` 会在 `dist` 目录生成一个以后缀名 `.craftx` 命名的文件，此即为 Craft 插件。其他内容均为被打包到该插件中的内容

# 使用说明（必读）

1. 项目基本抄的是官方的 [typescript-react 示例](https://github.com/craftdocs/craft-extension-project-templates/tree/master/typescript-react)，添加了一点配置项如 Antd 主题配置、html 模板使用 utf8 编码（没有的话实测 Mac 端加载的时候中文会乱码）等
2. 使用 React 的 Antd 组件库作为 View 层
3. 使用 Typescript 方便开发
4. Craft 插件只要求包含一个 `.html` 的文件作为界面，因此将全部的 js 放入 index.html 中
5. Craft 加载插件后必须要修改下 `manifest.json` 中的 `id` 否则可能跟其他插件冲突造成无法加载，id 的命名规则建议是业内通用的域名倒写的方式来命名
