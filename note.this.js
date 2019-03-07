// Reference 的构成
//base value 就是属性所在的对象或者就是 EnvironmentRecord，它的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种。
//测试1
var foo = 1;

// 对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

//测试2
var foo = {
    bar: function () {
        return this;
    }
};

foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
    base: foo,
    propertyName: 'bar',
    strict: false
};

/*1.GetBase
GetBase(V). Returns the base value component of the reference V.
返回 reference 的 base value。
2.IsPropertyReference
IsPropertyReference(V). Returns true if either the base value is an object or HasPrimitiveBase(V) is true; otherwise returns false.
简单的理解：如果 base value 是一个对象，就返回true。*/
var foo = 1;

var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

GetValue(fooReference) // 1;
//GetValue 返回对象属性真正的值，但是要注意：调用 GetValue，返回的将是具体的值，而不再是一个 Reference

//2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)

//2.2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)

//2.3 如果 ref 不是 Reference，那么 this 的值为 undefined

function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function () {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar



//测试3
var value = 1;

var foo = {
    value: 2,
    bar: function () {
        return this.value;
    }
}

foo.bar()
/*MemberExpression 计算的结果是 foo.bar
Reference = {
    base: foo,
    name: 'bar',
    strict: false
};
foo是对象:this = GetBase(ref)即是foo
*/
(foo.bar())()
/*MemberExpression 计算的结果是 function
Reference = {
    base: EnvironmentRecord,
    name: 'bar',
    strict: false
};
this的值为 ImplicitThisValue(ref)
ImplicitThisValue 方法的介绍：该函数始终返回 undefined。
*/
(foo.bar = foo.bar)()
// 看示例3，有赋值操作符，查看规范 11.13.1 Simple Assignment ( = ):
// 计算的第三步：
// 3.Let rval be GetValue(rref).
// 因为使用了 GetValue，所以返回的值不是 Reference 类型，
// 按照之前讲的判断逻辑：
// 2.3 如果 ref 不是Reference，那么 this 的值为 undefined
// this 为 undefined，非严格模式下，this 的值为 undefined 的时候，其值会被隐式转换为全局对象。
(false || foo.bar)()
// 看示例4，逻辑与算法，查看规范 11.11 Binary Logical Operators：
// 计算第二步：
// 2.Let lval be GetValue(lref).
// 因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined
(foo.bar, foo.bar)()
// 看示例5，逗号操作符，查看规范11.14 Comma Operator ( , )
// 计算第二步：
// 2.Call GetValue(lref).
// 因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined