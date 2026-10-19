---
title: SortColors异或交换学习笔记
date: 2026-10-15 18:40:00
comments: true
tags:
  - 算法
  - 数组
  - 双指针
  - 学习笔记
categories:
  - 算法学习
---

# Sort Colors：四种分区写法与异或交换

本文围绕 LeetCode 75「颜色分类」，整理四种原地排序写法（两轮分区、三指针荷兰国旗、p0/p1 双指针单次扫描、p0/p2 两端收缩），并在其中把交换操作改为异或交换。重点是理解：异或交换为什么可行、为什么下标相同时必须跳过，以及按位与和按位或为什么不能代替异或来交换。

## 对应力扣题目

[75. 颜色分类（Sort Colors）](https://leetcode.cn/problems/sort-colors/)

题目给定一个只包含 `0`、`1`、`2` 的数组，要求原地排序，使相同颜色相邻，顺序为 `0、1、2`。

例如：

```text
输入：[2, 0, 2, 1, 1, 0]
输出：[0, 0, 1, 1, 2, 2]
```

---

## 一、异或交换原理

设两个不同位置上的值分别是 `a` 和 `b`。异或交换通过三次异或，先把两个值合并编码，再逐步恢复：

```java
nums[i] ^= nums[j];
nums[j] ^= nums[i];
nums[i] ^= nums[j];
```

推导过程：

```text
初始：nums[i] = a，nums[j] = b

第 1 步：nums[i] = a ^ b
第 2 步：nums[j] = b ^ (a ^ b) = a
第 3 步：nums[i] = (a ^ b) ^ a = b
```

用二进制举例，`5 = 0101`，`3 = 0011`：

```text
第一步：nums[i] = 0101 ^ 0011 = 0110（6）
第二步：nums[j] = 0011 ^ 0110 = 0101（5）
第三步：nums[i] = 0110 ^ 0101 = 0011（3）
```

### 为什么要判断两个下标不能相同？

异或满足 `x ^ x == 0`。当 `i == j` 时，第一句就会把该位置改成 `0`，所以交换方法必须先判断：

```java
private void xorSwap(int[] nums, int i, int j) {
    if (i == j) {
        return;
    }

    nums[i] ^= nums[j];
    nums[j] ^= nums[i];
    nums[i] ^= nums[j];
}
```

### 为什么不能用按位与或按位或交换？

按位与 `&` 和按位或 `|` 也满足交换律和结合律，但它们会丢失信息，不能从计算结果恢复原来的两个值。例如 `1 & 2 == 0`，`1 | 2 == 3`，结果都不足以还原原数对。异或则可以利用 `a ^ b ^ b == a` 逐步恢复两个值。

---

## 二、写法一：两轮扫描，先放 0，再放 1

用 `index` 表示下一个待填入的位置：

1. 第一轮扫描，把所有 `0` 放到数组前面。
2. 第二轮从 `index` 开始扫描，把所有 `1` 放到 `0` 后面。
3. 剩下的位置自然都是 `2`。

### Java 实现：使用异或交换

```java
class Solution {
    public void sortColors(int[] nums) {
        int index = 0;

        // 第一轮：把 0 放到前面
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 0) {
                xorSwap(nums, index, i);
                index++;
            }
        }

        // 第二轮：把 1 放到 0 后面
        for (int i = index; i < nums.length; i++) {
            if (nums[i] == 1) {
                xorSwap(nums, index, i);
                index++;
            }
        }
        // 剩余元素都是 2
    }

    private void xorSwap(int[] nums, int i, int j) {
        if (i == j) {
            return;
        }

        nums[i] ^= nums[j];
        nums[j] ^= nums[i];
        nums[i] ^= nums[j];
    }
}
```

第一轮必须从左向右扫描。这样 `index` 指向已确定的 `0` 区间之后；当扫描到一个 `0` 时，把它换到 `index`，然后扩大已确定的 `0` 区间。第二轮使用同样的分区方式放置 `1`。

- 时间复杂度：`O(n)`，扫描数组两次。
- 额外空间复杂度：`O(1)`。

---

## 三、写法二：荷兰国旗问题，三指针一次扫描

使用三个指针维护三个区域：

```text
[0, low)       全是 0
[low, mid)     全是 1
[mid, high]    尚未判断
(high, n - 1]  全是 2
```

每次检查 `nums[mid]`：

- 是 `0`：与 `low` 交换，`low` 和 `mid` 都右移。
- 是 `1`：它已处于中间区域，`mid` 右移。
- 是 `2`：与 `high` 交换，`high` 左移。`mid` 暂时不动，因为换过来的数还没有检查。

### Java 实现：使用异或交换

```java
class Solution {
    public void sortColors(int[] nums) {
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                xorSwap(nums, low, mid);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else { // nums[mid] == 2
                xorSwap(nums, mid, high);
                high--;
                // 不增加 mid：换到 mid 的元素还没有检查
            }
        }
    }

    private void xorSwap(int[] nums, int i, int j) {
        if (i == j) {
            return;
        }

        nums[i] ^= nums[j];
        nums[j] ^= nums[i];
        nums[i] ^= nums[j];
    }
}
```

- 时间复杂度：`O(n)`，每个元素最多被扫描常数次。
- 额外空间复杂度：`O(1)`。

---

## 四、写法三：p0/p1 双指针，一次扫描

只用两个指针从左往右推进，维护三个区域：

```text
[0, p0)       全是 0
[0, p1)       0 和 1（已处理过的前缀）
[p1, i)       已处理…… 实际上 p1 之前的都已放好
[i, n - 1]    尚未判断
```

更直观地说：`p0` 是下一个 `0` 应放的位置，`p1` 是下一个 `1` 应放的位置。从左往右扫描每个元素：

- 是 `1`：直接与 `p1` 位置交换，`p1` 右移。
- 是 `0`：先与 `p0` 位置交换。注意 `p0` 位置上原本的数（若 `p0 < p1`）可能是一个 `1`，换到当前位置后还要再与 `p1` 交换一次，把它送回 `1` 区域。然后 `p0`、`p1` 同时右移。
- 是 `2`：什么都不做。所有 `0` 和 `1` 都会被交换到前缀区域，扫描结束后 `[p1, n)` 自然全是 `2`。

### Java 实现：临时变量交换

```java
class Solution {
    public void sortColors(int[] nums) {
        int n = nums.length;
        int p0 = 0, p1 = 0;
        for (int i = 0; i < n; ++i) {
            if (nums[i] == 1) {
                int temp = nums[i];
                nums[i] = nums[p1];
                nums[p1] = temp;
                ++p1;
            } else if (nums[i] == 0) {
                int temp = nums[i];
                nums[i] = nums[p0];
                nums[p0] = temp;
                if (p0 < p1) {
                    temp = nums[i];
                    nums[i] = nums[p1];
                    nums[p1] = temp;
                }
                ++p0;
                ++p1;
            }
        }
    }
}
```

### 为什么要"换两次"？

这是本写法最容易出错的地方。当 `nums[i] == 0` 且 `p0 < p1` 时：

```text
初始：… 0 区(p0) … 1 区 … 待处理的 0（位置 i）

第 1 步：nums[i] 与 nums[p0] 交换
  → 0 到位；p0 位置上原来的 1 被换到了位置 i

第 2 步：位置 i 上这个 1 再与 nums[p1] 交换
  → 1 也归位
```

如果不做第 2 步，那个 `1` 就会遗留在 `0` 区域和当前位置之间的"夹缝"里，之后只有当 `i` 扫描到它时才会被纠正——虽然算法最终仍能正确，但单次扫描的"边扫边归位"语义就被破坏了。标准写法里显式完成这两次交换，保证扫过的前缀始终有序。

### 用异或交换改写

把三处 `temp` 交换替换为 `xorSwap` 即可：

```java
class Solution {
    public void sortColors(int[] nums) {
        int n = nums.length;
        int p0 = 0, p1 = 0;
        for (int i = 0; i < n; ++i) {
            if (nums[i] == 1) {
                xorSwap(nums, i, p1);
                ++p1;
            } else if (nums[i] == 0) {
                xorSwap(nums, i, p0);
                if (p0 < p1) {
                    xorSwap(nums, i, p1);
                }
                ++p0;
                ++p1;
            }
        }
    }

    private void xorSwap(int[] nums, int i, int j) {
        if (i == j) {
            return;
        }

        nums[i] ^= nums[j];
        nums[j] ^= nums[i];
        nums[i] ^= nums[j];
    }
}
```

注意第一次 `xorSwap(nums, i, p0)` 之后，位置 `i` 上已经是原来 `p0` 位置的 `1`，所以第二次交换传入的仍是同一个 `i`——异或交换天然支持这种"先换一半、再换另一半"的连续操作。

- 时间复杂度：`O(n)`，只扫描一次。
- 额外空间复杂度：`O(1)`。

---

## 五、写法四：p0/p2 两端收缩，异或交换

与写法三不同，这个写法把 `2` 交给**右指针**处理，而不是留在原地：

```text
[0, p0)       全是 0
[p0, i)       1（中间区域）
[i, p2]       尚未判断
(p2, n - 1]   全是 2
```

从左往右扫描 `i`（只扫到 `p2` 为止）：

- `nums[i] == 2`：与 `p2` 交换，`p2` 左移。**注意要 `while` 循环**——从右端换过来的数可能还是 `2`，必须继续检查当前位置，不能直接推进 `i`。
- `nums[i] == 0`：与 `p0` 交换，`p0` 右移。`1` 会自然留在中间区域。
- `nums[i] == 1`：什么都不做。

### Java 实现：异或交换

```java
class Solution {
    public void sortColors(int[] nums) {
        int n = nums.length;
        int p0 = 0;
        int p2 = n - 1;
        for (int i = 0; i <= p2; i++) {
            // 从右往左换过来的元素可能也是 2，必须循环检查
            while (i <= p2 && nums[i] == 2) {
                xorSwap(nums, i, p2);
                --p2;
            }

            if (nums[i] == 0) {
                xorSwap(nums, i, p0);
                ++p0;
            }
        }
    }

    private void xorSwap(int[] nums, int i, int j) {
        if (i == j) {
            return;
        }

        nums[i] ^= nums[j];
        nums[j] ^= nums[i];
        nums[i] ^= nums[j];
    }
}
```

### 两个关键细节

1. **`while` 而非 `if`**：`i` 与 `p2` 交换时，右边换过来的值可能是 `2`，甚至 `i == p2` 时交换后 `p2` 继续左移就会越界——所以 `while` 里必须同时判断 `i <= p2`。`xorSwap` 里的 `i == j` 保护在这里正好兜底了 `i == p2` 的场景（交换本身是空操作，直接左移 `p2` 即可）。
2. **`0` 与 `p0` 交换后为什么不用检查换过来的数**：`p0 <= i`，且扫描过的 `[0, p0)` 区域全是 `0`；`p0` 位置上只可能是 `1` 或尚未检查过的 `0`，不可能是 `2`（`2` 全被 `p2` 挡在右端）。因此一次交换即可，无需循环。

- 时间复杂度：`O(n)`，`i`、`p0`、`p2` 各移动不超过 `n` 次。
- 额外空间复杂度：`O(1)`。

---

## 六、四种写法对比

| 写法 | 扫描次数 | 交换方式 | 主要思路 | 特点 |
|---|---:|---|---|---|
| 两轮分区 | 2 轮 | 异或交换 | 先把 `0` 放前面，再把 `1` 放到 `0` 后面 | 步骤直观，适合练习分区 |
| 三指针荷兰国旗 | 1 轮 | 异或交换 | 同时维护 `0`、`1`、待处理、`2` 四个区域 | 更紧凑，是这道题的经典解法 |
| p0/p1 双指针 | 1 轮 | 临时变量 | `p0` 放 `0`、`p1` 放 `1`，遇到 `0` 且 `p0 < p1` 时换两次 | 思路清晰，"换两次"是易错点 |
| p0/p2 两端收缩 | 1 轮 | 异或交换 | `2` 交给右指针，`while` 处理右端换来的 `2` | 对称美，`while` 是易错点 |

四种实现中的交换方法都必须处理 `i == j`。两轮分区和 p0/p1 里，元素经常已经位于目标位置；三指针写法中 `low` 和 `mid` 经常相等；p0/p2 写法里 `i` 和 `p2` 收缩到相遇时也会触发保护。

---

## 七、实际代码中是否推荐异或交换？

异或交换可以工作，但它比临时变量交换更难一眼看懂，也更容易漏掉 `i == j` 的保护。实际项目里一般优先写：

```java
int temp = nums[i];
nums[i] = nums[j];
nums[j] = temp;
```

学习位运算时可以练习异或交换；日常业务代码中，清晰易读通常比省略一个临时变量更重要。

## 总结

异或交换不是因为异或能任意移动数组元素，而是因为它能通过 `a ^ b ^ b == a` 恢复原来的值。使用时要确保两个下标不同。

颜色分类这道题至少有四种等价的原地解法：

1. **两轮分区**：先把 `0` 放前面，再把 `1` 放到 `0` 后面。最直观的入门写法。
2. **三指针荷兰国旗**：`low/mid/high` 同时维护四个区域，`2` 的处理必须用 `mid` 不动、`high` 左移的方式。
3. **p0/p1 双指针**：`p0` 放 `0`、`p1` 放 `1`，一次扫描。遇到 `0` 且 `p0 < p1` 时**换两次**是最易错的细节。
4. **p0/p2 两端收缩**：`2` 交给右指针，遇到 `2` 时必须用 `while` 循环处理右端换来的数。

面试中三指针荷兰国旗是最常被期望的解法；p0/p2 写法代码最短；p0/p1 写法适合考察"边界推理"能力。无论哪种写法，交换逻辑都是可替换的——临时变量交换与异或交换在正确性上完全等价。
