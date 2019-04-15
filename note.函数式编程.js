function compose() {
	var args = arguments;
	var start = args.length - 1;
	return function() {
		var i = start - 1;
		var result = args[start].apply(this, arguments);
		while (i >= 0) {
			result = args[i].call(this, result);
			i--;
		}
		return result;
	};
}

let aCompose = function(r) {
	let result = r || null;
	let t = function(fn, ...list) {
		if (typeof fn == 'function') {
			result = fn.apply(this, [...result, ...list]);
			return t;
		} else {
			result = fn;
			return t;
		}
	};
	return t;
};

function sum(...l) {
	console.log(l);
	let r = 0;
	l.map(item => {
		r += item;
	});
	return r;
}
console.log(aCompose([1, 2, 3])(sum)(sum, 5));

// curry
function sub_curry(fn) {
	var args = [].slice.call(arguments, 1);
	return function() {
		return fn.apply(this, args.concat([].slice.call(arguments)));
	};
}

function curry(fn, length) {
	length = length || fn.length;

	var slice = Array.prototype.slice;

	return function() {
		if (arguments.length < length) {
			var combined = [fn].concat(slice.call(arguments));
			return curry(sub_curry.apply(this, combined), length - arguments.length);
		} else {
			return fn.apply(this, arguments);
		}
	};
}

//函子

class Container {
	constructor({ value }) {
		this.__value = value;
	}
	// 函数式编程一般约定，函子有一个of方法
	of = x => new Container(x);
	// 一般约定，函子的标志就是容器具有map方法。该方法将容器
	// 里面的每一个值， 映射到另一个容器。
	map = function(f) {
		return Container.of(f(this.__value));
	};
	isNothing = function() {
		return this.__value === null || this.__value === undefined;
	};
}
Container.of(3)
	.map(x => x + 1) //=> Container(4)
	.map(x => 'Result is ' + x); //=> Container('Result is 4')

class Either extends Functor {
	constructor(left, right) {
		this.left = left;
		this.right = right;
	}
	map(f) {
		return this.right ? Either.of(this.left, f(this.right)) : Either.of(f(this.left), this.right);
	}
	of = function(left, right) {
		return new Either(left, right);
	};
}
Either.of(
	{
		address: 'xxx',
	},
	currentUser.address
).map(updateField);

class Ap extends Functor {
	ap(F) {
		return Ap.of(this.__value(F.__value));
	}
}
function addOne(x) {
	return x + 1;
}
Ap.of(addOne).ap(Functor.of(1));

class IO extends Monad {
	map(f) {
		return IO.of(
			compose(
				f,
				this.__value
			)
		);
	}
}

class Monad extends Functor {
	join() {
		return this.val;
	}
	flatMap(f) {
		return this.map(f).join();
	}
}
Monad.of(1).flatMap(addOne);

//可缓存性（Cacheable）
var memoize = function(f) {
	var cache = {};

	return function() {
		var arg_str = JSON.stringify(arguments);
		cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
		return cache[arg_str];
	};
};
