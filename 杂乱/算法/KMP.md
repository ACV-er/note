# KMP

* 既然写了AC自动机，顺手写下KMP。

  > 原理看AC自动机，就是一个单字符串的AC自动机，失配指针写在next数组内。

```go
package main

import "fmt"

func build_next(pattern string) []int {
	next := make([]int, len(pattern))
	next[0] = -1
	for i := 1; i < len(pattern); i++ {
		j := next[i-1]
		for j >= 0 && pattern[i] != pattern[j+1] {
			j = next[j]
		}
		if pattern[i] == pattern[j+1] {
			next[i] = j + 1
		}
	}
	return next
}

func query(pattern string, text string) bool {
	next := build_next(pattern)
	i, j := 0, 0
	for i < len(text) && j < len(pattern) {
		if j == -1 || text[i] == pattern[j] {
			i++
			j++
		} else {
			j = next[j]
		}
	}
	return j == len(pattern)
}

func main() {
	pattern := "aabaaa"
	words := []string{"ab", "abab", "ababab", "aabaabaabaaa", "ababababab"}
	for _, word := range words {
		if query(pattern, word) {
			fmt.Println(word)
		}
	}
}

```

