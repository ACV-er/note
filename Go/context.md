# context

* **Context是一个接口**，所以默认是没有实现的

```
type Context interface {
	Deadline() (deadline time.Time, ok bool)
	Done() <-chan struct{}
	Err() error
	Value(key interface{}) interface{}
}
```

> 在任意go项目使用Context的地方，都可以使用工具追踪到context源码。

* 目前标准库里面的自有实现有是 emptyCtx、valueCtx

## emptyCtx

* empty 表示了它的一切，它什么都空的，什么方法都return 默认值，没有额外属性。
* 可以看到是小写字母开头，无法直接使用。
* Background、TODO都是生成一个emptyCtx，两者在代码层面没有区别，只是命名不同。

## valueCtx

```
type valueCtx struct {
	Context
	key, val interface{}
}

func (c *valueCtx) Value(key interface{}) interface{} {
	if c.key == key {
		return c.val
	}
	return c.Context.Value(key)
}
```

* 显然，实现了一个Value。只能保存一个键值对。

* 可以看到是小写字母开头，无法直接使用。

* 标准库提供了一个 `func WithValue(parent Context, key, val interface{}) Context`函数来获取它,除去防御性代码之后的代码如下。

  ```
  func WithValue(parent Context, key, val interface{}) Context {
  	if parent == nil {
  		panic("cannot create context from nil parent")
  	}
  	if key == nil {
  		panic("nil key")
  	}
  	if !reflectlite.TypeOf(key).Comparable() {
  		panic("key is not comparable")
  	}
  	return &valueCtx{parent, key, val}
  }
  ```

## cancelCtx

```
type cancelCtx struct {
	Context

	mu       sync.Mutex            // protects following fields
	done     atomic.Value          // of chan struct{}, created lazily, closed by first cancel call
	children map[canceler]struct{} // set to nil by the first cancel call
	err      error                 // set to non-nil by the first cancel call
}
```

* 这是一个可取消的context
* done是一个`atomic.Value`，这是一个用来保证并发安全的。children是子context，目前不重要，取消当前context，所有子context都会被取消。

* `func (c *cancelCtx) Value(key interface{}) interface{}`方法，在外部看来是结构体内Context的Value，即 `c.Context.Value`，如果这个Context也是cancelCtx，会继续寻找。

* `func (c *cancelCtx) Done() <-chan struct{}`，比较普通的Done实现，没有什么特别的，用双重验证的方式（锁是c.mu）给done赋值一个channel（并发安全），然后所有调用Done的地方都会返回这个channel。这个channel里面不会写东西，在外部会一直阻塞，context生命周期结束之后，channel被关闭，外部读到0值，解除阻塞。一般配合select使用，可以做一些超时或者默认处理。

* `func (c *cancelCtx) Err() error`，返回 c.err 。加了锁（c.mu）。

* `func (c *cancelCtx) cancel(removeFromParent bool, err error)`, 一个私有方法，用来取消当前context及其子context（有点知识循环，暂时不用管子context怎么来的）。传入一个err表示关闭原因。WithCancel新建一个cancelCtx的时候会同时返回它的cancel方法。

* 是timerCtx的基础。

* 打印（类似递归的操作）

  ```
  func (c *cancelCtx) String() string {
  	return contextName(c.Context) + ".WithCancel"
  }
  
  func contextName(c Context) string {
  	if s, ok := c.(stringer); ok {
  		return s.String()
  	}
  	return reflectlite.TypeOf(c).String()
  }
  
  type stringer interface {
  	String() string
  }
  ```

## WithCancel

```
func WithCancel(parent Context) (ctx Context, cancel CancelFunc) {
	if parent == nil {
		panic("cannot create context from nil parent")
	}
	c := newCancelCtx(parent)
	propagateCancel(parent, &c)
	return &c, func() { c.cancel(true, Canceled) }
}
```

## timerCtx

```
type timerCtx struct {
	cancelCtx
	timer *time.Timer

	deadline time.Time
}
```

* 一个带计时器的context，一般用于设置超时时间。

* timer，一个计时器，时间到了就会执行`c.cancel(true, DeadlineExceeded)`,如果设置的时间早于当前时间（不是特别稳定，要考虑代码执行时间，详见代码段），会执行 `c.cancel(false, Canceled)`。deadline，用来查询的结束时间。

  ```
  // 判断是否已经关闭的片段
  // d是
  func WithDeadline(parent Context, d time.Time) (Context, CancelFunc) {
      ......
      c := &timerCtx{
          cancelCtx: newCancelCtx(parent),
          deadline:  d,
      }
      propagateCancel(parent, c)
      dur := time.Until(d)
      if dur <= 0 {
          c.cancel(true, DeadlineExceeded) // deadline has already passed
          return c, func() { c.cancel(false, Canceled) }
      }
      ......
  }
  ```

* `func (c *timerCtx) Deadline() (deadline time.Time, ok bool) `

  ```
  func (c *timerCtx) Deadline() (deadline time.Time, ok bool) {
  	return c.deadline, true
  }
  ```

## WithDeadline & WithTimeout

* 本质上是一个函数

  ```
  func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc) {
  	return WithDeadline(parent, time.Now().Add(timeout))
  }
  ```

  

## context的一些理解

* 更多详细了解需要去看context包内propagateCancel的实现，很短。

* 像WithDeadline，需要传入一个context，那么传入的这个context就是返回的context的父context。

  > 应该有发现，context结构体内，只有cancelCtx保存了子context的信息，父context其实是结构体的cancelCtx/Context，作为子context的一部分。

* context只能是建议关闭，无法真实地进行超时结束操作或者达到调用返回的cancelFunc就结束线程\协程的效果，无法做到硬件层面的定时、中断，context生效方式比较软，只能是建议关闭。
