/*Vue.config
Vue.config={
    silent : true,//取消 Vue 所有的日志与警告。
    devtools : true,//配置是否允许 vue-devtools 检查代码。开发版本默认为 true，生产版本默认为 false。生产版本设为 true 可以启用检查。
    errorHandler:Function,//指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。
    ignoredElements:[string | RegExp],//使 Vue 忽略在 Vue 之外的自定义元素 (e.g. 使用了 Web Components APIs)
    keyCodes:{ [key: string]: number | Array<number> },//给 v-on 自定义键位别名
    performance:boolean,//设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器上。
    productionTip:boolean,//设置为 false 以阻止 vue 在启动时生成生产提示。
}

//Vue.extend
Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
});
new Profile().$mount('#mount-point')

Vue.nextTick({Function} [callback])

Vue.set( target, key, value )

//自定义指令
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
组件内部定义，作为局部指令使用
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}

//Vue.filter( id, [definition] );
使用:{{ message | capitalize }}或<div v-bind:id="rawId | formatId"></div>或{{ message | filterA | filterB }}
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
};
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

//Vue.component( id, [definition] {Function | Object})
// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({  ...  }))

// 注册组件，传入一个选项对象 (自动调用 Vue.extend)
Vue.component('my-component', {  ...  })

// 获取注册的组件 (始终返回构造器)
var MyComponent = Vue.component('my-component')

Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子元素数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})

//Vue.use( plugin {Object | Function})
安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。
该方法需要在调用 new Vue() 之前被调用。

//props
    props: {
        // 检测类型
        height: Number,
        // 检测类型 + 其他验证
        age: {
        type: Number,
        default: 0,
        required: true,
        validator: function (value) {
            return value >= 0
        }
        }
    }


*/
