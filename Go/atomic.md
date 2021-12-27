# atomic包 

* 一个进行原子操作的包，简单介绍功能。

## Value

* 有四个方法

* `func (v *Value) Load() (val interface{})`

  > 加载最近一次存储的值

* `func (v *Value) Store(val interface{})` 

  > 存储一个值，在对象的这个方法被调用后，Value对象不能被复制，并且之后调用`Store/CompareAndSwap`时，`val/new`参数的类型必须与第一次相同，否则会报错panic。val为nil也会报错panic。

* `func (v *Value) Swap(new interface{}) (old interface{})`

  > 从源码来看，是将传入的new和之前存储的old进行了值交换。

* `func (v *Value) CompareAndSwap(old, new interface{}) (swapped bool)`

  > 在内存中对比后调用CompareAndSwapPointer

* 简单可靠的并发安全