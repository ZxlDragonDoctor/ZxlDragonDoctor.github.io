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

# Sort Colors：两种分区写法与异或交换

本文围绕 LeetCode 75「颜色分类」，整理两种原地排序写法，并将交换操作改为异或交换。重点是理解：异或交换为什么可行、为什么下标相同时必须跳过，以及按位与和按位或为什么不能代替异或来交换。

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

## 四、两种写法对比

| 写法 | 扫描次数 | 主要思路 | 特点 |
|---|---:|---|---|
| 两轮分区 | 2 轮 | 先把 `0` 放前面，再把 `1` 放到 `0` 后面 | 步骤直观，适合练习分区 |
| 三指针 | 1 轮 | 同时维护 `0`、`1`、待处理、`2` 四个区域 | 更紧凑，是这道题的经典解法 |

两种实现中的交换方法都必须处理 `i == j`。两轮分区里，元素经常已经位于目标位置；三指针写法中，`low` 和 `mid` 也经常相等。

---

## 五、实际代码中是否推荐异或交换？

异或交换可以工作，但它比临时变量交换更难一眼看懂，也更容易漏掉 `i == j` 的保护。实际项目里一般优先写：

```java
int temp = nums[i];
nums[i] = nums[j];
nums[j] = temp;
```

学习位运算时可以练习异或交换；日常业务代码中，清晰易读通常比省略一个临时变量更重要。

## 总结

异或交换不是因为异或能任意移动数组元素，而是因为它能通过 `a ^ b ^ b == a` 恢复原来的值。使用时要确保两个下标不同。颜色分类本身可以用两轮分区，也可以用三指针一次扫描；其中三指针写法在扫描次数上更少，而两轮写法更容易逐步理解。
