//·蹦床函数
//·尾递归优化
//·let&const暂时性死区
//·Symbol
//·set&map
//·Proxy
//·Reflect
//·Iterator
//·Generator 函数
//·async 函数
//·class类
//·Moudule
//·编程风格



//蹦床函数-把递归转化为循环
function trampoline(f) {
    while (f && f instanceof Function) {
        f = f();
    }
    return f;
}

//蹦床函数-深拷贝
function cloneLoop(x) {
    const root = {};

    // 栈
    const loopList = [{
        parent: root,
        key: undefined,
        data: x,
    }, ];

    while (loopList.length) {
        // 深度优先
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const data = node.data;

        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key];
        }

        for (let k in data) {
            if (typeof data[k] == 'object' && data[k] !== null) {
                if (toStr.call(data[k]) == '[object Array]') {
                    res[k] = [];
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k],
                    });
                } else {
                    res[k] = {};
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k],
                    });
                }
            } else if (typeof data[k] == 'string') {
                res[k] = data[k];
            } else if (typeof data[k] == 'number') {
                res[k] = data[k];
            }
        }
    }

    return root;
}

//尾递归优化,return的最后一帧是函数
function tco(f) {
    var value;
    var active = false;
    var accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
            active = true;
            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }
            active = false;
            return value;
        }
    };
}

var sum = tco(function (x, y) {
    if (y > 0) {
        return sum(x + 1, y - 1);
    } else {
        return x;
    }
});

sum(1, 100000);

//let&const暂时性死区
//在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。
function bar(x = y, y = 2) {
    //参数设置默认值时，约等于用let形成一个块级作用域进行赋值
    return [x, y];
}

bar(); // 报错
//const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了

//Symbol
let obj = {
    [Symbol('my_key')]: 1,
    enum: 2,
    nonEnum: 3,
};

Reflect.ownKeys(obj);
//  ["enum", "nonEnum", Symbol(my_key)]
const objectSymbols = Object.getOwnPropertySymbols(obj);

//·set&map
[...new Set('ababbc')].join('');
// set
// add(value)：添加某个值，返回 Set 结构本身。
// delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
// has(value)：返回一个布尔值，表示该值是否为Set的成员。
// clear()：清除所有成员，没有返回值。
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}

//ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
const map = new Map([
    ['name', '张三'],
    ['title', 'Author']
]);
map.set(['a'], 555);
map.get(['a']); // undefined,引用不同
const m = new Map();
const o = {
    p: 'Hello World'
};

m.set(o, 'content');
m.get(o); // "content"

m.has(o); // true
m.delete(o); // true
m.has(o); // false
//Map 转为数组
const myMap = new Map().set(true, 7).set({
    foo: 3
}, ['abc']);
[...myMap];
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ]
//对象转为 Map
function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

objToStrMap({
    yes: true,
    no: false
});
// Map {"yes" => true, "no" => false}

//Proxy
var handler = {
    get: function (target, name) {
        if (name === 'prototype') {
            return Object.prototype;
        }
        return 'Hello, ' + name;
    },

    apply: function (target, thisBinding, args) {
        return args[0];
    },

    construct: function (target, args) {
        return {
            value: args[1]
        };
    },
    has(target, name) {
        return Boolean;
    },
};

var fproxy = new Proxy(function (x, y) {
    return x + y;
}, handler);

fproxy(1, 2); // 1
new fproxy(1, 2); // {value: 2}
fproxy.prototype === Object.prototype; // true
fproxy.foo === 'Hello, foo'; // true

//Reflect
name in obj;
Reflect.has(obj, name);
delete obj[name];
Reflect.deleteProperty(obj, name);
//Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法
var loggedObj = new Proxy(obj, {
    get(target, name) {
        console.log('get', target, name);
        return Reflect.get(target, name);
    },
    deleteProperty(target, name) {
        console.log('delete' + name);
        return Reflect.deleteProperty(target, name);
    },
    has(target, name) {
        console.log('has' + name);
        return Reflect.has(target, name);
    },
});
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]); // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]); // 1
Reflect.apply(func, thisArg, args);
//使用 Proxy 实现观察者模式
const person = observable({
    name: '张三',
    age: 20,
});

function print() {
    console.log(`${person.name}, ${person.age}`);
}

observe(print);
person.name = '李四';
// 输出
// 李四, 20
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);

function observable(obj) {
    return new Proxy(obj, {
        set: function (target, key, value, re) {
            const result = Reflect.set(target, key, value, re);
            queuedObservers.forEach(observer => observer());
            return result;
        },
    });
}


//Iterator
//遍历器模拟，需要返回对象指针
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
    var nextIndex = 0;
    return {
        next: function () {
            return nextIndex < array.length ? {
                value: array[nextIndex++],
                done: false
            } : {
                value: undefined,
                done: true
            };
        }
    };
}


////Generator 函数
function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}
//调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。
var hw = helloWorldGenerator();
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }

var arr = [1, [
        [2, 3], 4
    ],
    [5, 6]
];

var flat = function* (a) {
    var length = a.length;
    for (var i = 0; i < length; i++) {
        var item = a[i];
        if (typeof item !== 'number') {
            yield* flat(item);
        } else {
            yield item;
        }
    }
};
//调用了遍历器，直到底done返回false才会停止;
for (var f of flat(arr)) {
    console.log(f);
}
// 1, 2, 3, 4, 5, 6

//
function* foo(x) {
    var y = 2 * (yield(x + 1));
    var z = yield(y / 3);
    return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var s1 = a.next()
var s2 = a.next(s1)
var s3 = a.next(s2)


var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }

//
function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

for (let n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
}

//
function* objectEntries(obj) {
    let propKeys = Reflect.ownKeys(obj);

    for (let propKey of propKeys) {
        yield [propKey, obj[propKey]];
    }
}

let jane = {
    first: 'Jane',
    last: 'Doe'
};

for (let [key, value] of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe


////async 函数
//async 函数是 Generator 函数的语法糖。
// async函数返回一个 Promise 对象。
// async函数内部return语句返回的值，会成为then方法回调函数的参数。
async function f() {
    return 'hello world';
}

f().then(v => console.log(v))
// "hello world"



////class类
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

typeof Point // "function"
Point === Point.prototype.constructor // true

//
class Point {
    constructor() {
        // ...
    }
}

Object.assign(Point.prototype, {
    toString() {},
    toValue() {}
});

//constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
class Foo {
    constructor() {
        return Object.create(null);
    }
}

new Foo() instanceof Foo
// false

class Logger {
    printName(name = 'there') {
        this.print(`Hello ${name}`);
    }

    print(text) {
        console.log(text);
    }
}

const logger = new Logger();
const {
    printName
} = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
//方案1
class Logger {
    constructor() {
        this.printName = this.printName.bind(this);
    }

    // ...
}
//方案2
class Logger {
    constructor() {
        this.printName = (name = 'there') => {
            this.print(`Hello ${name}`);
        };
    }

    // ...
}
//方案3
function selfish(target) {
    const cache = new WeakMap();
    const handler = {
        get(target, key) {
            const value = Reflect.get(target, key);
            if (typeof value !== 'function') {
                return value;
            }
            if (!cache.has(value)) {
                cache.set(value, value.bind(target));
            }
            return cache.get(value);
        }
    };
    const proxy = new Proxy(target, handler);
    return proxy;
}

const logger = selfish(new Logger());

//static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
class Foo {
    static classMethod() {
        return 'hello';
    }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function

//Foo类的classMethod方法前有static关键字，表明该方法是一个静态方法，可以直接在Foo类上调用（Foo.classMethod()），而不是在Foo类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。
//注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。
class Foo {
    static bar() {
        this.baz();
    }
    static baz() {
        console.log('hello');
    }
    baz() {
        console.log('world');
    }
}

Foo.bar() // hello
Foo.prototype.bar() // world

class Foo {
    static classMethod() {
        return 'hello';
    }
}

class Bar extends Foo {
    static classMethod() {
        return super.classMethod() + ', too';
    }
}
//静态方法也是可以从super对象上调用的。
Bar.classMethod() // "hello, too"

//通过symbol实现私有
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass {

    // 公有方法
    foo(baz) {
        this[bar](baz);
    }

    // 私有方法
    [bar](baz) {
        return this[snaf] = baz;
    }

    // ...
};

// Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。
// （1）子类的__proto__属性，表示构造函数的继承，总是指向父类。
// （2）子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
class A {}

class B extends A {}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true


//minxin
function mix(...mixins) {
    class Mix {
        constructor() {
            for (let mixin of mixins) {
                copyProperties(this, new mixin()); // 拷贝实例属性
            }
        }
    }

    for (let mixin of mixins) {
        copyProperties(Mix, mixin); // 拷贝静态属性
        copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
    }

    return Mix;
}

function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== 'constructor' &&
            key !== 'prototype' &&
            key !== 'name'
        ) {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}


////·Moudule

function v1() {  }
function v2() {  }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};

// 报错
// var m = 1;
// export m;

var m = 1;
export {m};

//由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。
/*// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}*/


////·编程风格参考了 Airbnb 公司的 JavaScript 风格规范

//（1）let 取代 var

//（2）全局常量和线程安全
// bad
var a = 1, b = 2, c = 3;

// good
const a = 1;
const b = 2;
const c = 3;

// best
const [a, b, c] = [1, 2, 3];

//静态字符串一律使用单引号或反引号，不使用双引号。动态字符串使用反引号。
// bad
const a = "foobar";
const b = 'foo' + a + 'bar';

// acceptable
const c = `foobar`;

// good
const a = 'foobar';
const b = `foo${a}bar`;

//解构赋值
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
// bad
function getFullName(user) {
    const firstName = user.firstName;
    const lastName = user.lastName;
  }
  
  // good
  function getFullName(obj) {
    const { firstName, lastName } = obj;
  }
  
  // best
  function getFullName({ firstName, lastName }) {
  }

  //对象尽量静态化，一旦定义，就不得随意添加新的属性。如果添加属性不可避免，要使用Object.assign方法。
  // bad
const a = {};
a.x = 3;

// if reshape unavoidable
const a = {};
Object.assign(a, { x: 3 });

// good
const a = { x: null };
a.x = 3;

//如果对象的属性名是动态的，可以在创造对象的时候，使用属性表达式定义。
// bad
const obj = {
    id: 5,
    name: 'San Francisco',
  };
  obj[getKey('enabled')] = true;
  
  // good
  const obj = {
    id: 5,
    name: 'San Francisco',
    [getKey('enabled')]: true,
  };


  //使用扩展运算符（...）拷贝数组
  // bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];

//所有配置项都应该集中在一个对象，放在最后一个参数，布尔值不可以直接作为参数。
// bad
function divide(a, b, option = false ) {
}

// good
function divide(a, b, { option = false } = {}) {
}

//函数体内使用 arguments 变量
// bad
function concatenateAll() {
    const args = Array.prototype.slice.call(arguments);
    return args.join('');
  }
  
  // good
  function concatenateAll(...args) {
    return args.join('');
  }

  //只有模拟现实世界的实体对象时，才使用 Object。如果只是需要key: value的数据结构，使用 Map 结构。因为 Map 有内建的遍历机制。
  let map = new Map(arr);

for (let key of map.keys()) {
  console.log(key);
}

for (let value of map.values()) {
  console.log(value);
}

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}


//总是用 Class，取代需要 prototype 的操作。因为 Class 的写法更简洁，更易于理解
// bad
function Queue(contents = []) {
    this._queue = [...contents];
  }
  Queue.prototype.pop = function() {
    const value = this._queue[0];
    this._queue.splice(0, 1);
    return value;
  }
  
  // good
  class Queue {
    constructor(contents = []) {
      this._queue = [...contents];
    }
    pop() {
      const value = this._queue[0];
      this._queue.splice(0, 1);
      return value;
    }
  }


  //Module 语法是 JavaScript 模块的标准写法，坚持使用这种写法。使用import取代require。
  // bad
const moduleA = require('moduleA');
const func1 = moduleA.func1;
const func2 = moduleA.func2;

// good
import { func1, func2 } from 'moduleA';

//使用export取代module.exports。
// commonJS的写法
var React = require('react');

var Breadcrumbs = React.createClass({
  render() {
    return <nav />;
  }
});

module.exports = Breadcrumbs;

// ES6的写法
import React from 'react';

class Breadcrumbs extends React.Component {
  render() {
    return <nav />;
  }
};

export default Breadcrumbs;
//如果模块只有一个输出值，就使用export default，如果模块有多个输出值，就不使用export default，export default与普通的export不要同时使用。
//不要在模块输入中使用通配符。因为这样可以确保你的模块之中，有一个默认输出（export default）。
// bad
import * as myObject from './importModule';

// good
import myObject from './importModule';
//如果模块默认输出一个函数，函数名的首字母应该小写。
function makeStyleGuide() {
}

export default makeStyleGuide;
//如果模块默认输出一个对象，对象名的首字母应该大写。
const StyleGuide = {
  es6: {
  }
};

export default StyleGuide;


//$ npm i -g eslint
//$ npm i -g eslint-config-airbnb
//$ npm i -g eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
//最后，在项目的根目录下新建一个.eslintrc文件，配置 ESLint。
// {
//   "extends": "eslint-config-airbnb"
// }


/*如果x不是正常值（比如抛出一个错误），中断执行。
如果y不是正常值，中断执行。
如果Type(x)与Type(y)相同，执行严格相等运算x === y。
如果x是null，y是undefined，返回true。
如果x是undefined，y是null，返回true。
如果Type(x)是数值，Type(y)是字符串，返回x == ToNumber(y)的结果。
如果Type(x)是字符串，Type(y)是数值，返回ToNumber(x) == y的结果。
如果Type(x)是布尔值，返回ToNumber(x) == y的结果。
如果Type(y)是布尔值，返回x == ToNumber(y)的结果。
如果Type(x)是字符串或数值或Symbol值，Type(y)是对象，返回x == ToPrimitive(y)的结果。
如果Type(x)是对象，Type(y)是字符串或数值或Symbol值，返回ToPrimitive(x) == y的结果。
返回false。*/