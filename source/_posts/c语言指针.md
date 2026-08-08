---
title: "c语言指针"
date: 2025-09-30 16:31:20
updated: 2025-09-30 16:31:20
categories:
  - 学习总结
---

## c语言指针

下面把 5 道“自测题”一口气讲透，每题都给：  
① 结论一句话 ② 内存图/规则 ③ 能直接跑的小例子 ④ 常见踩坑。

---

### 1. `int *p[3];` 与 `int (*p)[3];` 区别？
| 声明           | 类型                            | 含义                  | 宽度（64 位） |
| -------------- | ------------------------------- | --------------------- | ------------- |
| `int *p[3];`   | 数组 → 元素是 `int *`           | 存 3 个 `int *` 指针  | 3×8 = 24 B    |
| `int (*p)[3];` | 指针 → 指向含 3 个 `int` 的数组 | 一次偏移跳 3 个 `int` | 8 B           |

**助记**：括号 `()` 改变命运。  
“下标优先级高” → `*p[3]` 先组合成数组；`(*p)[3]` 先组合成指针。

**代码体验**：
```c
int a[2][3] = {{1,2,3},{4,5,6}};
int (*row)[3] = a;          // 指向一行 3 个 int
printf("%d\n", row[1][2]);  // 6

int *ptrs[3];               // 存 3 个 int*
for(int i=0;i<3;++i) ptrs[i] = &a[0][i];
printf("%d\n", *ptrs[2]);   // 3
```

---

### 2. `void *` 能否直接解引用？
**不能**。编译器不知道“解引用后该拿几个字节”，会报错：
```c
void *vp = malloc(4);
*vp = 10;     // error: dereferencing ‘void *’ pointer
```
**正确姿势**：先强制转换成具体类型再解引用。
```c
*(int*)vp = 10;
```
**例外**：`gcc -pedantic` 下即使强转后写再转回 `void *` 完全合法，是通用数据交换的惯用手段。

---

### 3. `free(p)` 后 p 还能不能用？应该怎样做？
- **语法上**：能访问，但属于 **Undefined Behaviour**（可能立即崩溃，也可能暂时正常）。  
- **正确做法**：马上置空，防止“野指针”二次释放。
```c
free(p);
p = NULL;   // 后续可用 if(p) 做判断
```
**二次 free 演示**：
```c
free(p);
free(p);    // 大概率 abort：double free or corruption
```
置空后即使误 `free(NULL)` 也是安全空操作。

---

### 4. `char *s = "abc"; s[0] = 'A';` 为什么崩溃？
- `"abc"` 是**字符串字面量**，放在**只读段（.rodata）**。  
- `s` 拿到的是 **const 地址**，写操作触发 **SIGSEGV**（段错误）。  
**修正**：用可写数组
```c
char s[] = "abc";  // 栈上复制一份
s[0] = 'A';        // OK
```
编译器警告：`warning: deprecated conversion from string constant to 'char*'` —— 现代 C 应写成 `const char *s = "abc";` 直接禁止写。

---

### 5. 用函数指针实现 C 版“策略模式”
**思路**：把“行为”抽成函数指针，运行期动态切换。

**示例**：两个排序策略（升序 / 降序），同一接口 `sort()`。

```c
#include <stdio.h>
#include <stdlib.h>

typedef int (*cmp_t)(int, int);   // 策略签名

int asc(int a, int b)  { return a - b; }
int desc(int a, int b) { return b - a; }

void sort(int *a, int n, cmp_t cmp){
    for(int i=0;i<n-1;++i)
        for(int j=0;j<n-1-i;++j)
            if(cmp(a[j], a[j+1]) > 0){
                int t = a[j]; a[j] = a[j+1]; a[j+1] = t;
            }
}

int main(void){
    int a[] = {3,1,4,2};
    sort(a, 4, asc);
    for(int i=0;i<4;++i) printf("%d ", a[i]); // 1 2 3 4
    putchar('\n');

    sort(a, 4, desc);
    for(int i=0;i<4;++i) printf("%d ", a[i]); // 4 3 2 1
}
```
**扩展**：把 `cmp_t` 放进结构体可做成“对象 + 虚表”风格，实现更复杂的插件体系。

---

### 30 秒速记卡
1. `[]` 优先级高 → `*p[3]` 是数组；`(*p)[3]` 是指向数组。  
2. `void *` 必须强转后解引用。  
3. `free(p); p = NULL;` 防二次释放。  
4. 字符串字面量只读；想改就写成 `char s[] = "...";`  
5. 函数指针 = C 的“多态”，把行为当参数传。