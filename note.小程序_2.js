//程序生命周期
/*onLaunch
Function
生命周期回调—监听小程序初始化
小程序初始化完成时（全局只触发一次）
onShow
Function
生命周期回调—监听小程序显示
小程序启动，或从后台进入前台显示时
onHide
Function
生命周期回调—监听小程序隐藏
小程序从前台进入后台时
onError
Function
错误监听函数
小程序发生脚本错误，或者 api 调用失败时触发，会带上错误信息
onPageNotFound
Function
页面不存在监听函数
小程序要打开的页面不存在时触发，会带上页面信息回调该函数
销毁
1.只有当小程序进入后台一定时间，或者系统资源占用过高，才会被真正的销毁。
2.当用户从扫一扫、转发等入口（场景值为1007, 1008, 1011, 1025）进入小程序，且没有置顶小程序的情况下退出，小程序会被销毁。


//页面生命周期
onLoad页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
onShow()页面显示/切入前台时触发。
onReady()页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
onHide()页面隐藏/切入后台时触发。 如 navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。
onUnload()页面卸载时触发。如redirectTo或navigateBack到其他页面时。


//页面处理函数
onPullDownRefresh()监听用户下拉刷新事件。
onReachBottom()监听用户上拉触底事件。
onPageScroll监听用户滑动页面事件。
onShareAppMessage({from,target,webViewUrl})监听用户点击页面内转发按钮

from String 转发事件来源。 button：页面内转发按钮； menu：右上角转发菜单
target Object 如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
webViewUrl String 页面中包含<web-view>组件时，返回当前<web-view>的url
此事件需要 return 一个 Object，用于自定义转发内容;{title:转发标题,path:转发路径以 / 开头的完整路径,mageUrl:自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。}

//getApp(Object)全局的 getApp() 函数可以用来获取到小程序 App 实例。
可以用于bind函数，给函数bind全局app对象


//页面路由
页面栈
初始化 新页面入栈
打开新页面 新页面入栈
页面重定向 当前页面出栈，新页面入栈
页面返回 页面不断出栈，直到目标返回页
Tab 切换 页面全部出栈，只留下新的 Tab 页面
重加载 页面全部出栈，只留下新的页面


路由方式           触发时机                                                         路由前页面    路由后页面
初始化      小程序打开的第一个页面                                                                onLoad, onShow
打开新页面 调用 API wx.navigateTo 或使用组件 <navigator open-type="navigateTo"/>      onHide      onLoad, onShow
页面重定向 调用 API wx.redirectTo 或使用组件 <navigator open-type="redirectTo"/>     onUnload     onLoad, onShow
页面返回 调用 API wx.navigateBack 或使用组件<navigator open-type="navigateBack">或用户按左上角返回按钮 onUnload onShow
Tab 切换 调用 API wx.switchTab 或使用组件 <navigator open-type="switchTab"/> 或用户切换 Tab
重启动    调用 API wx.reLaunch 或使用组件 <navigator open-type="reLaunch"/>          onUnload     onLoad, onShow


//事件属性
<view id="tapTest" data-hi="WeChat" bindtap="tapName">Click me!</view>
Page({
  tapName(event) {
    console.log(event)
  }
})
{
//事件类型
  "type": "tap",
  "timeStamp": 895,
  触发事件监听的对象
  "target": {
    "id": "tapTest",
    "dataset": {
      "hi": "WeChat"
    }
  },
  添加监听事件的对象
  "currentTarget": {
    "id": "tapTest",
    "dataset": {
      "hi": "WeChat"
    }
  },
  点击位置
  "detail": {
    "x": 53,
    "y": 14
  },
  数组，表示几根手指点击了屏幕
  "touches": [
    {
      "identifier": 0,
      "pageX": 53,
      "pageY": 14,
      "clientX": 53,
      "clientY": 14
    }
  ],
  表示有变化的触摸点，如从无变有（touchstart），位置变化（touchmove），从有变无（touchend、touchcancel）
"changedTouches": [
    {
      "identifier": 0,
      "pageX": 53,
      "pageY": 14,
      "clientX": 53,
      "clientY": 14
    }
  ]
}



////WXS响应事件
处理小程序中会高频率触发渲染的情况，如touchmove时写了会使页面重绘的代码；wxs可以让事件在视图层（Webview）响应；
const wxsFunction = function (event, ownerInstance) {
  const instance = ownerInstance.selectComponent('.classSelector') // 返回组件的实例
  instance.setStyle({
    'font-size': '14px' // 支持rpx
  })
  instance.getDataset()
  instance.setClass(className)
  instance.callMethod(funcName,args:object)
  // ...
  return false // 不往上冒泡，相当于调用了同时调用了stopPropagation和preventDefault
}
callMethod 是 WXS 里面调用逻辑层（App Service）开发者的代码的方法，而 WxsPropObserver 是逻辑层（App Service）开发者的代码调用 WXS 逻辑的机制。感觉其实违反了开发时的初衷，所以我觉得里面的逻辑不要高频触发，如change事件；
<wxs module="test" src="./test.wxs"></wxs>
<view
  change:prop="{{test.propObserver}}"
  prop="{{propValue}}"
  bindtouchmove="{{test.touchmove}}"
  class="movable"
></view>
bindtouchmove时不要使用callMethod，change时可以调用wxs的逻辑，记得双括号


//自定义组件
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持，须额外生命
    addGlobalClass  //app.wxss 或页面的 wxss 中使用了标签名选择器也会污染组件样式
  },
  properties: { ...  },
  methods: { ... }
})

组件对应 wxss 文件的样式，只对组件wxml内的节点生效。
#a {
}  在组件中不能使用 
[a] {
}  在组件中不能使用 
button {
}  在组件中不能使用 
.a > .b {
}  除非 .a 是 view 组件节点，否则不一定会生效 
尽量用一层的class选择器

构造器


组件间通信


注意点
Page({
  data: {
    text: 'init data',
    array: [{msg: '1'}, {msg: '2'}]
  }
})和vue不同，data是一个对象，vue里data是函数的原因是防止组件之间原型链指针指向同一个对象

当前页面的路径，类型为String,vue为对象;
Page({
  onShow() {
    console.log(this.route)
  }
})

Page.prototype.setData(Object data, Function callback)
Object 以 key: value 的形式表示，将 this.data 中的 key 对应的值改变成 value,和vue的$set不同，不需要制定target和value，也没有改写对象的get，set，但是可以直接改变data的数据，支持改变数组中的某一项或对象的某个属性，如 array[2].message，a.b.c.d，并且不需要在 this.data 中预先定义。
注意：
直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致。
仅支持设置可 JSON 化的数据。
单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
请不要把 data 中任何一项的 value 设为 undefined ，否则这一项将不被设置并可能遗留一些潜在问题。
使用模板时如果需要外部的data数据需要双括号。

<view data-alpha-beta="1" data-alphaBeta="2" bindtap="bindViewTap">
  DataSet Test
</view>
Page({
  bindViewTap(event) {
    event.currentTarget.dataset.alphaBeta === 1 // - 会转为驼峰写法
    event.currentTarget.dataset.alphabeta === 2 // 大写会转为小写
  }
})