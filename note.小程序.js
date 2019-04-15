//WeUI WXSS   原生ui框架
//vantWeapp   有赞的ui框架
//https://github.com/Tencent/weui-wxss

//·小程序-工程化

////小程序-工程化

//缺点
// 不支持 css预编译器,作为一种主流的 css解决方案，不论是 less,sass,stylus 都可以提升css效率
// 不支持引入npm包 （这一条，从微信公开课中听闻，微信准备支持）
// 不支持ES7等后续的js特性，好用的async await等特性都无法使用
// 不支持引入外部字体文件，只支持base64
// 没有 eslint 等代码检查工具

/*miniapps 工程化解决方案
安装：
npm i miniapps -g
miniapp -h//查看功能
miniapp init <project-name>//生成项目
miniapp build//编译,支持 sass -> wxss，stylus-wxss，ES6 -> ES5 的编译
miniapp build -w//-w 选项可以让我们在文件发生改动时自动重新编译
miniapp gen <page_name>//该命令可以快速生成符合微信小程序官方规范的目录结构，并且将新页面自动注册到 app.json 文件中


//mpvue 工程化解决方案
以vue的模板去开发小程序
优点：
减少写法的开发成本，尤其是多人开发；
缺点：
开发是需要遵守小程序的基本规则；
环境不一样，所以更需要注意优化，mpvue编译之后的页面会按照vue的模板形成页面结构，手机会找到最子组件后开始渲染，所以要防止子组件过深的情况；
WXML支持数据绑定，支持逻辑算术、运算，支持模板、引用，支持添加事件（bindtap），功能重复；element



package.json
{
    "name": "demo",
    "version": "0.0.1",
    "description": "A webchat app project generate by miniapps",
    "main": "dist/app.js",
    "scripts": {
      "dev": "miniapp build -w",
      "build": "miniapp build"   //只支持2种命令
    },
    "author": "phantvb",
    "license": "ISC",
    "dependencies": {
      "node-sass": "^4.1.1",
      "babel-preset-es2015": "^6.18.0"  //只有 sass -> wxss，stylus-wxss，ES6 -> ES5 的编译功能
    }
}
*/

////WXML

//// WXSS
//编译
//wxss>compiler>js>css
//wxss编译器：wcsc 把wxss文件转化为 js，src:url() 无论本地还是远程地址都不行，base64 值则都是可以显示的。
//尺寸单位 rpx
const dsWidth = 750;

export const screenHeightOfRpx = function () {
    return (750 / env.screenWidth) * env.screenHeight;
};

export const rpxToPx = function (rpx) {
    return (env.screenWidth / 750) * rpx;
};

export const pxToRpx = function (px) {
    return (750 / env.screenWidth) * px;
};

//内联样式
//静态的样式统一写到 class 中。style 接收动态的样式，在运行时会进行解析，请尽量避免将静态的样式写进 style 中，以免影响渲染速度。

//iconfont
/*小程序开发与平时 Web开发类似，也可以使用字体图标，但是 src:url() 无论本地还是远程地址都不行，base64 值则都是可以显示的。
将 ttf 文件转换成 base64。打开这个平台 transfonter.org/。点击 Add fonts 按钮，加载ttf格式的那个文件。将下边的 base64 encode 改为 on。点击 Convert 按钮进行转换，转换后点击 download 下载。
复制下载的压缩文件中的 stylesheet.css 的内容到 font.wxss ，并且将 icomoon 中的 style.css 除了 @font-face 所有的代码也复制到 font.wxss 并将i选择器换成 .iconfont，最后：
<text class="iconfont icon-home" style="font-size:50px;color:red"></text>*/

////问题
// 小程序仍然使用 WebView 渲染，并非原生渲染。（部分原生）

// 服务端接口返回的头无法执行，比如：Set-Cookie。

// 依赖浏览器环境的 JS 库不能使用。

// 不能使用 npm，但是可以自搭构建工具或者使用 mpvue。（未来官方有计划支持）

// 不能使用 ES7，可以自己用babel+webpack自搭或者使用 mpvue。

// 不支持使用自己的字体（未来官方计划支持）。

// 可以用 base64 的方式来使用 iconfont。

// 小程序不能发朋友圈（可以通过保存图片到本地，发图片到朋友前。二维码可以使用B接口）。

// 获取二维码/小程序接口的限制。

// B 接口 scene 最大32个可见字符。
// AC 接口总共生成的码数量限制为 100,000，请谨慎调用。
// 真机扫描二维码只能跳转到线上版本，所以测试环境下只可通过开发者工具的通过二维码编译进行调试。
// 没有发布到线上版本的小程序页面路径会导致生成二维码失败，需要先将添加了页面的小程序发布到线上版本。

// 小程序推送只能使用“服务通知” 而且需要用户主动触发提交 formId，formId 只有7天有效期。（现在的做法是在每个页面都放入form并且隐藏以此获取更多的 formId。后端使用原则为：优先使用有效期最短的）

// 小程序大小限制 2M，分包总计不超过 8M

// 转发（分享）小程序不能拿到成功结果，原来可以。链接（小游戏造的孽）

// 拿到相同的 unionId 必须绑在同一个开放平台下。开放平台绑定限制：

// 50个移动应用
// 10个网站
// 50个同主体公众号
// 5个不同主体公众号
// 50个同主体小程序
// 5个不同主体小程序

// 公众号关联小程序，链接

// 所有公众号都可以关联小程序。
// 一个公众号可关联10个同主体的小程序，3个不同主体的小程序。
// 一个小程序可关联500个公众号。
// 公众号一个月可新增关联小程序13次，小程序一个月可新增关联500次。

// 一个公众号关联的10个同主体小程序和3个非同主体小程序可以互相跳转

// 品牌搜索不支持金融、医疗

// 小程序授权需要用户主动点击

// 小程序不提供测试 access_token

// 安卓系统下，小程序授权获取用户信息之后，删除小程序再重新获取，并重新授权，得到旧签名，导致第一次授权失败

// 开发者工具上，授权获取用户信息之后，如果清缓存选择全部清除，则即使使用了wx.checkSession，并且在session_key有效期内，授权获取用户信息也会得到新的session_key

////优化

//加载优化,最好的优化方式就是减少代码包的大小。
// 代码压缩。
// 及时清理无用代码和资源文件。
// 减少代码包中的图片等资源文件的大小和数量。
// 分包加载。
// 提前请求: 异步数据请求不需要等待页面渲染完成。
// 利用缓存: 利用 storage API 对异步请求数据进行缓存，二次启动时先利用缓存数据渲染页面，在进行后台更新。
// 避免白屏：先展示页面骨架页和基础内容。

//使用分包加载优化
/*package.json
{
    "pages":[
      "pages/index",
      "pages/logs"
    ],
    "subPackages": [
      {
        "root": "packageA",
        "pages": [
          "pages/cat",
          "pages/dog"
        ]
      }, {
        "root": "packageB",
        "pages": [
          "pages/apple",
          "pages/banana"
        ]
      }
    ]
  }
分包原则

声明 subPackages 后，将按 subPackages 配置路径进行打包，subPackages 配置路径外的目录将被打包到 app（主包） 中
app（主包）也可以有自己的 pages（即最外层的 pages 字段
subPackage 的根目录不能是另外一个 subPackage 内的子目录
首页的 TAB 页面必须在 app（主包）内

引用原则

packageA 无法 require packageB JS 文件，但可以 require app、自己 package 内的 JS 文件
packageA 无法 import packageB 的 template，但可以 require app、自己 package 内的 template
packageA 无法使用 packageB 的资源，但可以使用 app、自己 package 内的资源*/