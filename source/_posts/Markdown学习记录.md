---
title: "Markdown学习记录"
date: 2024-12-21 00:38:28
updated: 2024-12-21 00:38:28
categories:
  - 笔记

---

# markdown简易学习记录
一级标题
=  
二级标题
-
文本  
*斜体文本* _斜体文本_  
**文本加粗**  
***文本加粗斜体***
***~~混合文本~~***  
~~中划线~~  
分割线

***
* * *
- - - - -
<hr/>  

## 列表
### 无序列表
* 第一项
* 第二项
* 第三项
- 新第一项
- 新第二项
- 新第三项
### 有序列表
1. 第一项  
2. 第二项
3. 第三项
### 嵌套列表
1. 第一项
   * 无序列表
   * 2
   * 3
     1. 有序列表
     2. 2
     3. 3
2. 第二项
3. 第三项

### 勾选框
* [x] 第一项
* [ ] 第二项
* [ ] 第三项

1. [x] 第一项
2. [] 第二项
3. [] 第三项 

### 代码块
````java
public static void main(String[] args) {
int a, b;
Scanner sc = new Scanner(System.in);
a = sc.nextInt();
b = sc.nextInt();//注释
desparate(a, b);
}
````

### 引用
> SpringBoot 是框架的框架，在前面之上又封装了一层，
> 作用就是进一步简化开发。提出了约定大于配置，前面 SSM 中你得写大量的配置文件，SpringBoot 直接给你一套默认配置，并且你maven 导哪个包，对应的配置会自动生效，你只需要写你需要改的一小部分配置，就会自动替换掉默认配置。
> 此外还增加了指标监控 等功能。
> ````java
> public static void main(String[] args) {
> int a, b;
> Scanner sc = new Scanner(System.in);
> a = sc.nextInt();
> b = sc.nextInt();//注释
> desparate(a, b);
> }
> ````
> + 列表  
>   1.有序列表  
>   2.2  
>
>   3.3 
> + 2
> + 3

### 链接和标注
前往网站[百度](https://www.baidu.com)  
多个设置链接[链接1][a]和[链接2][b]

[a]:https://www.baidu.com

[b]:https://www.baidu.com
### 脚注
idea这里不支持这种写法，移步到Typora[^1]

[^1]:这是一个脚注

### 图片插入
方式一   

![image-20241013232500775](D:\program\Typora\md上传图片\image-20241013232500775.png)

方式二  
![图片][c]  

[c]:https://i0.hdslb.com/bfs/archive/aeae39c68cf66d41a1a06ae4d23c68d98ffe4611.jpg
方式三  
<img src="https://img0.baidu.com/it/u=2119299385,1997312824&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800" alt="网络图片" title="草神">

### 表格
|      姓名      | 年龄 | 性别 |
|:------------:| --- | --- |
|      小明      | 12 | 男 |
| 小红好好吃 | 21 | 女 |

### 嵌入html语言
<span style="color:red" >sapn标签</span>  设置字体样式

<p>Typora甚至支持ifame标签来嵌入网页</p>

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=1252624739&bvid=BV1eJ4m157kC&cid=1489694376&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="600" height="500"></iframe>



## 扩展功能

==我是高亮语法==

下标 H~2~O

上标 X^2^

标签 y<sub>2</sub>  x<sup>2</sup>

### 数学公式

**单行公式**

$x_1 = (y+1)$

多行公式
$$
\frac{1}{2} + \sqrt[3]{\{(4+x_1^2)\}}^2
$$
**数学符号**

 <img src="C:\Users\朱小龙\AppData\Roaming\Typora\typora-user-images\image-20241013165448928.png" alt="image-20241013165448928" style="zoom: 50%;" />

**常用模板**
$$
180^\circ 度数\\
\sin\pi 三角函数\\
\infty 无穷\\
\int  \iint  \iiint 积分\\
y\prime 导数\\
\lim 极限\\
$$

$$
\int_0^2x^2dx 定积分\\
\lim_{n\rightarrow+\infty}\frac{1}{2} 极限\\
f(x) = \frac{1}{x_1} + \frac{1}{x_2} + \cdots+ \frac{1}{x_n} 累加\\
$$



<hr/>



