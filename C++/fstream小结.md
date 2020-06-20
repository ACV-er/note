# fstream小结

* 只用了读取追加写

* `seekg`、`seekp` 函数

  >  接收两个参数，第一个是偏移量，第二个是基准位。
  >
  > ```
  > std::fstream::seekg(0, std::ios::end) //移动到结尾处偏移0字节的位置
  > std::fstream::seekg(3, std::ios::cur) //移动到当前位置偏移3字节的位置
  > std::fstream::seekg(3, std::ios::beg) //移动到开始位置偏移3字节的位置
  > 
  > 其中seekg控制的是get指针，即读指针。seekp控制的是put指针，即写指针。
  > ```
  >
  > 单参数使用时为绝对位置，`std::fstream::seekg(5)`直接到达5字节处。亦可直接传`ios::end`等常量。

