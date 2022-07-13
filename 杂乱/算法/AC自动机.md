# AC自动机

* 简单介绍

  > 给定一组关键词（k个，平均长度m），建立AC自动机后在长度为n的字符串中查找是否含有上述关键词。
  >
  > 建立AC自动机复杂度为(m*k)
  >
  > 查找时间复杂度最差为O(n)，失配指针深度必定小于原指针，所以失配指针需要上浮必先下沉，而因为匹配成功才会下沉，所以下沉的次数最多为n。从而最差的复杂度也能保证在O(n)

* 使用场景

  > 敏感词过滤，字符串查找等

* 原理介绍

  > 首先需要一棵字典树，字典树建立不赘述。
  >
  > 从字典树开始。
  >
  > 字典树如果匹配失败，需要进行回溯，比如关键词`abbc,bba,bd`，目标字符串`abbd`,使用字典树会匹配到
  >
  > `abb c`
  >
  > `abb a`第四位不配配
  >
  > 然后需要回溯到`abba`从第二个`b`开始匹配。
  >
  > 平均时间复杂度O(m*n)
  >
  > 可以看出，如果已经成功匹配了`abb`，即使后续不是`c`，也可以去匹配`a|d`，只要在字典树上建立该信息，就可以避免回溯目标字符串！
  >
  > 现在的首要目标就是建立这个信息了，即**失配指针**。
  >
  > > 注意点（反正我踩坑了）：节点的失配指针指向的节点的值必定和节点相同。失配指针不是该节点不匹配，而是该节点是最后一个匹配成功的，当前路径无法继续下去，就需要找失配指针。
  >
  > 显然，如果我们要找到*匹配段*`abb`的失配指针，我们要指向`bb`|`b`。由于`bb`也会指向`b`，所以优先指向`bb`。
  >
  > 可以看出任务转变为，找到字典树上*匹配段*的**最长后缀**，然后将该段的失配指针指向这个最长后缀。
  >
  > 很容易想到一个朴素的办法，对每一个字符串，去字典树上找最长后缀。
  >
  > 标准的AC自动机想法：如匹配段的最长后缀成立，那么`最长后缀去掉最后一位`，肯定也是`匹配段去掉最后一位`的最长后缀。就可以利用这个特点快速找到匹配段的最长后缀。因为匹配段的最长后缀于匹配段的后续没有关系，所以可以在字典树上逐层查找最长后缀，建立失配指针。这也可以保证匹配段去掉最后一位的失配已经被找到。我们只需要一直找下一个失配指针，知道指针指向节点的字典的带有匹配段最后一位，这就是匹配段的最长后缀。

  * 易错

    > `abcd,bc`可能`bc`会被忽略，节点要继承失配指针指向节点的结束标记。
    >
    > 根节点也需要失配指针。
    >
    > 一般使用失配指针时，结束条件应该是当前节点是根节点，并且处理过根节点下的节点。
    >
    > 需要使用层序遍历来建立失配指针，否则会出现失配指针指向的节点的失配指针没有建立，导致程序逻辑错误。

```Go
package main

import "fmt"

type AcAutoNode struct {
	childNodes map[rune]*AcAutoNode
	faildNode  *AcAutoNode
	end        []string
}

func BuildTree(words []string) *AcAutoNode {
	root := buildTrie(words)
	setFail(root)
	return root
}

func buildTrie(words []string) *AcAutoNode {
	// 建立普通字典树，不添加失配指针
	root := &AcAutoNode{
		childNodes: make(map[rune]*AcAutoNode),
		end:        make([]string, 0),
	}
	for _, word := range words {
		st := root
		for _, c := range word {
			next, ok := st.childNodes[c]
			if !ok {
				next = &AcAutoNode{
					childNodes: make(map[rune]*AcAutoNode),
					end:        make([]string, 0),
				}
				st.childNodes[c] = next
			}
			st = next
		}
		st.end = append(st.end, word)
	}
	return root
}

func setFail(root *AcAutoNode) {
	// 添加失配指针，根节点的失配指针指向自身
	queue := []*AcAutoNode{root}
	root.faildNode = root
	for {
		length := len(queue)
		if length == 0 {
			break
		}
		// 层序遍历
		for i := 0; i < length; i++ {
			node := queue[0]
			queue = queue[1:]
			for k, childNode := range node.childNodes {
				queue = append(queue, childNode)
				if node == root {
					// 如果是根节点的子节点，则失配指针指向根节点
					node.childNodes[k].faildNode = root
					continue
				}
				// 初始化：失配指针指向失配节点（本身匹配成功，但是后续匹配失败的节点）的父节点
				// 循环：失配指针查找失配节点的父节点的失配指针，并指向该失配指针
				// 终止： 失配指针下找到目标k，此时节点的失配指针为目标k。失配指针指向root且root下无k
				fail := node
				for {
					fail = fail.faildNode
					if _, ok := fail.childNodes[k]; ok {
						fail = fail.childNodes[k]
						break
					}
					if fail == root {
						break
					}
				}
				// 更新失配指针
				node.childNodes[k].faildNode = fail
				node.childNodes[k].end = append(node.childNodes[k].end, fail.end...)
			}
		}
	}
}

func (a *AcAutoNode) Query(word string) []string {
	st := a
	rel := []string{}
	for _, c := range word {
		if next, ok := st.childNodes[c]; ok {
			st = next
		} else {
			for {
				st = st.faildNode
				if _, ok := st.childNodes[c]; ok {
					st = st.childNodes[c]
					break
				}
				if st == a {
					break
				}
			}
		}
		if len(st.end) > 0 {
			rel = append(rel, st.end...)
		}
	}
	return rel
}

func main() {
	words := []string{"bdcba", "aaab", "abab", "baa", "dc"}
	root := BuildTree(words)

	fmt.Println(root.Query("abab"))       // [abab]
	fmt.Println(root.Query("baabab"))     // [baa abab]
	fmt.Println(root.Query("bbababdcba")) // [abab bdcba]
	fmt.Println(root.Query("aabbabbad"))  // []
}

```

