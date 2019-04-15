//鉴权与缓存问题

utils文件夹中创建一个class Storage的类， 定义好set, get, init, destroy的方法，在app.js中用作缓存操作；
app.js中可以定义waitedRequestList:[]用作等待队列，因为app.js的onLoad()或者onReady()生命周期中调用初始化数据等等方法时会同步发送请求；可以把login方法之前的请求先加入请求队列，在完成基础信息初始化后在操作；方法二就是async/await；
根据业务，app.js可以定义logined，authorized两种状态来判断登录与授权；
