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

* 相较前两个，这一个的功能比较多。

# 阅读源码卡死，先去研究一下atomic包