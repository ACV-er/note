# Go的GC  

* 从GC的生命周期简述Go的GC过程。go 1.8

### 概念

* 栈对象：分配在栈上的对象
* 堆对象：分配在堆上的对象

* 三色标记：把对象分为三种颜色，黑灰白，黑色为已经扫描过的活跃对象，灰色对象为未扫描过的活跃对象，白色对象为未到达对象（标记结束时未到达则为不可达对象）

### GC

* 首先进行stw （Stop the World），将GC状态改变为标记阶段`_GCoff -> _GCmark`并开启混合写屏障。清理所有尚未被清理的内存（个人理解是上次GC后，应该清理但是没有清理完的内存。官方注释原文 `Sweep any unswept spans. There will only be unswept spans if this GC cycle was forced before the expected time.`）。

  * 混合写屏障，当指针发生改变时，将指针原先指向的对象标记为灰色，如果当前goroutine的栈的标记是灰色，那么还需要将新指向的对象标记为灰色。

    ```
    func gcmarkwb_m(slot *uintptr, ptr uintptr) {
    	if writeBarrier.needed {
    		// Note: This turns bad pointer writes into bad
    		// pointer reads, which could be confusing. We avoid
    		// reading from obviously bad pointers, which should
    		// take care of the vast majority of these. We could
    		// patch this up in the signal handler, or use XCHG to
    		// combine the read and the write. Checking inheap is
    		// insufficient since we need to track changes to
    		// roots outside the heap.
    		if slot1 := uintptr(unsafe.Pointer(slot)); slot1 >= minPhysPageSize {
    			if optr := *slot; optr != 0 {
    				shade(optr)
    			}
    		}
    		// TODO: Make this conditional on the caller's stack color.
    		if ptr != 0 && inheap(ptr) {
    			shade(ptr)
    		}
    	}
    }
    ```

    > 提案中：对新指向的对象标记为灰色的前提条件是调用栈的颜色为灰色。
    >
    > ```
    > writePointer(slot, ptr):
    >     shade(*slot)
    >     if current stack is grey:
    >     	shade(ptr)
    >     *slot = ptr
    > ```
    >
    > 实际上没有那个if，写了一个TODO的注释

    * 还可以看到，实际实现时，只有在新指向的对象在堆上的时候，才会标记为灰色。（个人理解为，栈上的对象要么是灰色，要么是黑色新对象，所以无需处理）

* 启动世界，即关闭stw状态。**从这个时间点开始，新分配的对象直接被标记为黑色**。

* 开始进行标记（此时所有对象为白色），扫描所有的栈对象、全局对象、在堆外内存的指针指向的对象，将它们标记为灰色。扫描时，对应的goroutine会停止。

* 然后开始进行经典的三色标记，取出灰色的对象，将其标记为黑色并将其白色子对象（如果有）标记为灰色，直到不存在灰色对象为止。

* 停止世界，将GC状态置为`_GCmarktermination`进行一些上述标记工作的收尾。

* 将GC状态置为`_GCoff`，关闭混合写屏障。

* 启动世界。**从这个时间点开始，新分配的对象直接被标记为白色**。后台并发清理垃圾。



### 删除写屏障

* 在指针改变指向时，将原指向对象标记为灰色，防止出现改变指向前被黑色对象引用，最终导致错误清理。（黑色对象引用白色对象（发生在标记阶段，如果整个标记阶段stw，该白色对象应该为灰色））
* 需要栈区开启写屏障，否则堆区的黑色对象可能指向白色对象，然后被清理。

### 插入写屏障

* 在指针改变指向时，将新指向对象标记为灰色。满足强三色不变性。
* 需要抉择
  * 在栈区开启写屏障 （否则栈区对象可能引用白色对象，如果栈区为灰色，可以不开，但是会有并发问题（我猜这就是为什么go1.8把判断调用栈颜色后再进行插入写屏障作为TODO的原因，实现起来可能比较复杂））
  * 在标记完成后重扫栈区
* go 1.8之前采用的就是标记完后重扫栈区。

### 混合写屏障

* 堆区对象同时开启插入写屏障和删除写屏障，栈区不开启。
* 解决了删除写屏障中栈区不开启写屏障的问题，堆区的黑色对象不可能指向白色对象。
* 解决了插入写屏障中的问题。



### 参考

* https://github.com/golang/go/blob/dev.boringcrypto.go1.8/src/runtime/mgc.go

* https://github.com/golang/go/blob/dev.boringcrypto.go1.8/src/runtime/mbarrier.go

* https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-garbage-collector/#%E5%9B%9E%E6%94%B6%E5%A0%86%E7%9B%AE%E6%A0%87