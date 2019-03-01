//·蹦床函数
//·尾递归优化
//·let&const暂时性死区
//·Symbol
//·set&map
//·Proxy
//·Reflect

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
	const loopList = [
		{
			parent: root,
			key: undefined,
			data: x,
		},
	];

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

var sum = tco(function(x, y) {
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
const map = new Map([['name', '张三'], ['title', 'Author']]);
map.set(['a'], 555);
map.get(['a']); // undefined,引用不同
const m = new Map();
const o = { p: 'Hello World' };

m.set(o, 'content');
m.get(o); // "content"

m.has(o); // true
m.delete(o); // true
m.has(o); // false
//Map 转为数组
const myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc']);
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

objToStrMap({ yes: true, no: false });
// Map {"yes" => true, "no" => false}

//Proxy
var handler = {
	get: function(target, name) {
		if (name === 'prototype') {
			return Object.prototype;
		}
		return 'Hello, ' + name;
	},

	apply: function(target, thisBinding, args) {
		return args[0];
	},

	construct: function(target, args) {
		return { value: args[1] };
	},
	has(target, name) {
		return Boolean;
	},
};

var fproxy = new Proxy(function(x, y) {
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
		set: function(target, key, value, re) {
			const result = Reflect.set(target, key, value, re);
			queuedObservers.forEach(observer => observer());
			return result;
		},
	});
}
