# C++同名类特性

* c++标准中只规定了同一个cpp文件只能看见同一个类被实现一次

> 所以是可以通过一些办法来达到一个类被实现多次的e

* 测试代码如下

`main.cpp`

```
#include "iostream"
#include "b.h"

class A { // 此处为A的第一次定义，类函数返回值为2
public:
    int f();
};

int A::f() {
    return 2;
}

int main(void) {
    A * test = new A();
    std::cout << test->f() << std::endl; // 此处为A的f第一次定义，类函数返回值为2

    B * test_1 = new B();
    std::cout << test_1->f() << std::endl; // 此处为调用A的f第二次定义，定义为返回值2，其实为1

    return 0;
}
```

`b.h`

```
class B {
public:
    int f();
};
```

`b.cpp`

```
#include "iostream"
#include "a.cpp"
#include "b.h"

int B::f() {
    A *t = new A();
    int rel = t->f(); //仅仅调用a.cpp中的实现
    delete t;
    return rel;
}
```

`a.cpp`

```
class A { //第二次实现，f返回值应该为1，再实际调用时为2
public:
    int f() {
        return 1;
    }
};
```

* 执行 `g++ main.cpp b.cpp -o test && ./test`

* 输出为

```
2
2
```

## 结论

> 可以存在不同实现的同名类，同名类如果有不同实现，编译器可能会选定某一实现，而不是使用编写时理论上各自的实现。
>
> 此实现为未定义行为，编译器可任选一个具体成员函数实现。
>
> 不要使用未定义行为，可能会带来bug。

## 类似情况补充

> c++ 允许定义inline同名函数（只要没有cpp文件感知该函数被重复定义）。类成员函数默认为inline。所以inline函数也可以由上述写法被重复定义。
>
> 
>
> 在我的机器上，类重复定义后，随机选择了main.cpp中的定义。普通inline函数重复定义后，与所写的情况一致（引入谁就执行了谁）。但是这是一个未定义行为。
>
> inline函数、类成员函数执行结果错误就有可能是这个问题。

