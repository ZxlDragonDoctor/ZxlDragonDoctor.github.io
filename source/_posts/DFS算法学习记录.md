---
title: DFS算法学习记录
date: 2026-09-17 17:40:00
comments: true
tags:
  - DFS
  - 算法
  - 回溯
categories:
  - 算法学习
---

# DFS 算法学习记录

> 整理时间：2026年9月
> 主题：深度优先搜索（DFS）的三种应用场景

## DFS 核心思想

```
DFS = 一条路走到黑，走不通再回头
递归调用 → 深入探索
递归返回 → 回溯到上一步

三要素：
1. 递归出口（什么时候停）
2. 递归调用（往下走）
3. 状态处理（记录/判断）
```

## 三道题与 DFS 的关系

| 题目 | DFS 用法 | 核心考点 |
|------|---------|---------|
| 图的DFS遍历 | 标准的图遍历 | 邻接表、visited、排序 |
| 数列递推 | 递推思维（可看作特殊DFS） | 窗口处理、排序取极值 |
| 受限任务分配 | DFS + 记忆化 | 状态转移、最优选择 |

---

---

## 题目一：图的 DFS 遍历

### 题目描述

给定一个无向图，顶点编号 1 到 n。从顶点 1 出发进行深度优先搜索（DFS），当某个顶点有多个邻接点时，按编号从小到大的顺序访问，输出遍历过程中访问顶点的顺序。

- `1≤n≤100, 0≤m≤100`
- 若不连通，只输出从顶点 1 可达的顶点
- 无自环，无重边

### 输入输出示例

```
输入：n=6, edges=[[1,2],[1,3],[2,4],[3,5],[3,6]]
输出：[1, 2, 4, 3, 5, 6]
```

图结构：
```
        1
       / \
      2   3
      |   / \
      4  5   6
```

### 解题思路

```
1. 建邻接表（无向图双向加边）
2. 每个顶点的邻居列表排序（保证从小到大访问）
3. 从顶点1开始DFS，用 visited[] 标记已访问
```

### 参考代码

```java
import java.util.*;

public class GraphDFS {
    static List<Integer> result = new ArrayList<>();
    static List<Integer>[] graph;
    static boolean[] visited;

    public static void dfs(int u) {
        visited[u] = true;
        result.add(u);

        for (int v : graph[u]) {
            if (!visited[v]) {
                dfs(v);
            }
        }
    }

    public static int[] solve(int n, int[][] edges) {
        // 1. 初始化邻接表
        graph = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) {
            graph[i] = new ArrayList<>();
        }

        // 2. 双向加边
        for (int[] e : edges) {
            graph[e[0]].add(e[1]);
            graph[e[1]].add(e[0]);
        }

        // 3. 邻居排序
        for (int i = 1; i <= n; i++) {
            Collections.sort(graph[i]);
        }

        // 4. DFS
        visited = new boolean[n + 1];
        result.clear();
        dfs(1);

        // 5. 转数组返回
        int[] ans = new int[result.size()];
        for (int i = 0; i < ans.length; i++) {
            ans[i] = result.get(i);
        }
        return ans;
    }
}
```

### 踩坑记录

| 错误写法 | 问题 | 正确写法 |
|---------|------|---------|
| `g = new ArrayList[n+1]` 后直接用 | 每个元素是 null，NPE | 先循环 `g[i] = new ArrayList<>()` |
| for-each 中 `list.remove()` | 抛 ConcurrentModificationException | 用 visited[] 标记，不删元素 |
| 只查 `edge[0]==x` | 无向图漏掉反向边 | 双向加边 `graph[u].add(v)` + `graph[v].add(u)` |
| 排序从 i=0 开始 | g[0] 是 null，NPE | 从 i=1 遍历 |
| visited 类成员不重置 | 多次调用结果错误 | solve 里重新 `new boolean[n+1]` |

### 核心记忆

```
建图三步：创建数组 → 逐个初始化 → 加边排序
DFS 两件事：标记 visited → 递归邻居
```

---

## 题目二：数列递推（最近连续7个数）

### 题目描述

有一个连续数列，前 7 个数为 1,2,3,4,5,6,7。从第 8 个数开始，每个数的值等于**它所在位置前面最近连续 7 个数中，最大的两个数之和减去最小的两个数之和**。

给定位置 n，返回该位置上的数值。

- `1≤n≤1000`

### 输入输出示例

```
输入：n=8
输出：10
解释：前面7个数 [1,2,3,4,5,6,7]
      最大两数之和：6+7=13
      最小两数之和：1+2=3
      结果：13-3=10
```

### 手动推演

| 位置 | 最近7个数 | 最大两数 | 最小两数 | 结果 |
|------|----------|---------|---------|------|
| 8 | 1,2,3,4,5,6,7 | 6+7=13 | 1+2=3 | **10** |
| 9 | 2,3,4,5,6,7,10 | 7+10=17 | 2+3=5 | **12** |
| 10 | 3,4,5,6,7,10,12 | 12+10=22 | 3+4=7 | **15** |
| 11 | 4,5,6,7,10,12,15 | 15+12=27 | 4+5=9 | **18** |
| ... | ... | ... | ... | ... |
| 19 | 22,27,32,37,42,46,48 | 48+46=94 | 22+27=49 | **45** |
| 20 | 27,32,37,42,46,48,45 | 48+46=94 | 27+32=59 | **35** |

**注意：第19项=45 < 第18项=48，序列不是一直递增的！**

### 解题思路

```
1. 前7个数直接返回 n
2. 从第8个开始，每次取前面最近7个数
3. 对这7个数排序
4. 结果 = (排序后最大两个之和) - (排序后最小两个之和)
```

### 参考代码

```java
import java.util.*;

public class Sequence {
    public static int getResult(int n) {
        if (n <= 7) return n;

        int[] arr = new int[n + 1];
        for (int i = 1; i <= 7; i++) {
            arr[i] = i;
        }

        for (int i = 8; i <= n; i++) {
            // 取前面最近7个数
            int[] window = new int[7];
            for (int j = 0; j < 7; j++) {
                window[j] = arr[i - 7 + j];
            }

            // 排序后计算
            Arrays.sort(window);
            arr[i] = (window[6] + window[5]) - (window[0] + window[1]);
        }

        return arr[n];
    }
}
```

### 踩坑记录

| 错误写法 | 问题 | 为什么错 |
|---------|------|---------|
| `arr[r] + arr[r-1]` 作为最大两数 | 假设序列递增 | 序列会下降（如第19项45<第18项48） |
| `arr[l] + arr[l+1]` 作为最小两数 | 假设窗口有序 | 窗口可能乱序 |
| `int l = 1,int r = 7` | 语法错误 | 应为 `int l = 1, r = 7` |

### 反例验证

```
你的代码：n=20 输出 34（错误）
正确答案：n=20 输出 35

原因：第19项=45插在48后面，窗口变成 [27,32,37,42,46,48,45]
      最大两数是 48+46=94，不是 45+48=93
```

### 核心记忆

```
不能假设窗口有序，每次必须排序或扫描找最大最小
```

---

## 题目三：受限任务分配（DFS + 记忆化）

### 题目描述

某部门有 x 个待处理任务，系统按轮次处理，每次平分后只保留一组进入下一轮，直到 x=1 结束。

**每轮规则：**

| x 的情况 | 操作 | 任务变化 | 成本 | 操作次数 |
|---------|------|---------|------|---------|
| 偶数 | 直接平分 | x → x/2 | 1 | +1 |
| 奇数 | 先调整为偶数，再平分 | 见下 | | |

**奇数时的两种调整：**

| 选择 | 变化 | 额外成本 |
|------|------|---------|
| 新增1个任务 | x → x+1（变偶数） | `add_cost` |
| 减少1个任务 | x → x-1（变偶数） | `return_cost` |

**优化目标：**
1. 第一优先：总成本最少
2. 第二优先：成本相同时，操作次数最少
3. 约束：总成本 ≤ budget

### 输入输出

| 参数 | 含义 | 范围 |
|------|------|------|
| new_tasks | 初始任务数 | 1≤n≤10000 |
| budget | 成本预算上限 | 1≤budget≤50 |
| add_cost | 加1个任务的成本 | 1≤add_cost≤10 |
| return_cost | 减1个任务的成本 | 1≤return_cost≤10 |

输出：`成本 操作次数`，预算不足输出 `-1`

### 示例推演

```
输入：new_tasks=7, budget=20, add_cost=3, return_cost=2

从 7 出发（奇数）：

方案A：加1 → 8
  成本：3(加)+1(平分)=4，到 4
  4→2→1：成本再+2
  总成本=6，操作=4次

方案B：减1 → 6
  成本：2(减)+1(平分)=3，到 3
  3是奇数，选减1→2：成本再+3
  2→1：成本再+1
  总成本=7，操作=5次

最优：方案A，成本=6，操作=4
输出：6 4
```

### 解题思路：DFS + 记忆化

```
状态定义：dfs(x) = 从 x 个任务减到 1 的最优解 [成本, 操作次数]

递归出口：x == 1 时返回 [0, 0]

转移：
  x 为偶数：dfs(x) = dfs(x/2) + [1, 1]
  x 为奇数：
    方案1（加1）：dfs(x) = dfs((x+1)/2) + [add_cost+1, 2]
    方案2（减1）：dfs(x) = dfs((x-1)/2) + [return_cost+1, 2]
    取更优：先比成本，成本相同再比操作

记忆化：memo[x] 存结果，computed[x] 标记是否算过
```

### 参考代码

```java
import java.util.*;

public class TaskSplit {

    static int addCost, returnCost;
    static long[][] memo;      // memo[x] = {最小成本, 最少操作}
    static boolean[] computed;

    static long[] dfs(int x) {
        // 递归出口
        if (x == 1) return new long[]{0, 0};

        // 记忆化查询
        if (computed[x]) return memo[x];
        computed[x] = true;

        long bestCost = Long.MAX_VALUE;
        long bestOps = Long.MAX_VALUE;

        if (x % 2 == 0) {
            // 偶数：直接平分
            long[] next = dfs(x / 2);
            long cost = 1 + next[0];
            long ops = 1 + next[1];
            if (cost < bestCost || (cost == bestCost && ops < bestOps)) {
                bestCost = cost;
                bestOps = ops;
            }
        } else {
            // 奇数：两种选择

            // 方案1：加1再平分
            long[] next1 = dfs((x + 1) / 2);
            long cost1 = addCost + 1 + next1[0];
            long ops1 = 2 + next1[1];
            if (cost1 < bestCost || (cost1 == bestCost && ops1 < bestOps)) {
                bestCost = cost1;
                bestOps = ops1;
            }

            // 方案2：减1再平分
            long[] next2 = dfs((x - 1) / 2);
            long cost2 = returnCost + 1 + next2[0];
            long ops2 = 2 + next2[1];
            if (cost2 < bestCost || (cost2 == bestCost && ops2 < bestOps)) {
                bestCost = cost2;
                bestOps = ops2;
            }
        }

        // 存入记忆化表
        memo[x] = new long[]{bestCost, bestOps};
        return memo[x];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int newTasks = sc.nextInt();
        int budget = sc.nextInt();
        addCost = sc.nextInt();
        returnCost = sc.nextInt();

        int maxSize = newTasks + 2;
        memo = new long[maxSize][2];
        computed = new boolean[maxSize];

        long[] result = dfs(newTasks);

        if (result[0] > budget) {
            System.out.println(-1);
        } else {
            System.out.println(result[0] + " " + result[1]);
        }
    }
}
```

### 踩坑记录

| 错误写法 | 问题 | 正确写法 |
|---------|------|---------|
| `ops = 1 + next[0]` | next[0] 是成本，不是操作 | `ops = 1 + next[1]` |
| `long[] next` 声明两次 | 同作用域重复声明，编译报错 | 用 `next1`、`next2` 或复用变量 |
| `return new long{a,b}` | 缺方括号，编译报错 | `return new long[]{a,b}` |
| 计算完不存 memo | 记忆化失效 | `memo[x] = ...` 后再 return |

### 关键问题解答

**Q：maxSize 为什么是 newTasks+2？**

严格来说 `+1` 就够了。因为递归只会走到更小的数：
```
dfs(7) → dfs(4) 或 dfs(3)  // 都 < 7
```
访问 `(x+1)/2` 而不是 `x+1`，所以不会超过 `newTasks`。写 `+2` 是保险习惯。

**Q：memo 有必要用 long 吗？**

这题 `int` 够用（最大成本约154），但 `long` 是防溢出的好习惯，不影响正确性。

### 执行流程图（x=7）

```
dfs(7)  奇数
├── 方案1 加1: dfs(4)
│   └── 偶数: dfs(2)
│       └── 偶数: dfs(1) → [0, 0]
│       → memo[2] = [1, 1]
│   → memo[4] = [2, 2]
│   方案1: 成本 = 3+1+2 = 6，操作 = 2+2 = 4
│
├── 方案2 减1: dfs(3)  奇数
│   ├── 加1: dfs(2) → [1,1]，成本=3+1+1=5
│   ├── 减1: dfs(1) → [0,0]，成本=2+1+0=3  ← 更优
│   → memo[3] = [3, 2]
│   方案2: 成本 = 2+1+3 = 6，操作 = 2+2 = 4
│
└── 成本相同(6)，操作相同(4)，任选一个
    memo[7] = [6, 4]
```

### 核心记忆

```
DFS + 记忆化三要素：
1. 递归出口（x==1）
2. 记忆化查询（computed[x] 判断）
3. 存入 memo 再返回

比较规则：
先比成本（cost < bestCost）
成本相同再比操作（cost == bestCost && ops < bestOps）
```

---

## DFS 三种应用场景对比

| 对比项 | 图的DFS遍历 | 数列递推 | 任务分配 |
|--------|------------|---------|---------|
| DFS 角色 | 标准图遍历 | 递推思想 | DFS + 记忆化 |
| 搜索什么 | 图中的顶点 | 数列每个位置 | 任务数的决策分支 |
| 递归出口 | 所有邻居已访问 | 递推到目标位置 | x == 1 |
| 状态记录 | visited[] 数组 | arr[] 数组 | memo[] + computed[] |
| 时间复杂度 | O(n+m) | O(n) | O(n) |
| 最大坑点 | 邻接表未初始化 | 误以为序列递增 | next[0]/next[1] 混淆 |

## DFS 通用模板

```java
// 基础 DFS 框架
void dfs(状态参数) {
    // 1. 递归出口
    if (满足结束条件) {
        记录/返回结果;
        return;
    }

    // 2. 记忆化查询（可选）
    if (已经算过) return 存的结果;

    // 3. 遍历所有选择
    for (每个可能的下一步) {
        if (合法选择) {
            更新状态;
            dfs(下一步);      // 递归深入
            // 恢复状态（回溯，可选）
        }
    }

    // 4. 存入记忆化（可选）
    memo[当前状态] = 结果;
}
```

## DFS 解题步骤

```
1. 确定「状态」是什么（当前位置？任务数？访问集合？）
2. 确定「递归出口」（什么时候停）
3. 确定「分支」有哪些（走哪条路？加还是减？）
4. 决定是否需要「记忆化」（重复子问题才需要）
5. 手动推演小样例验证逻辑
```

```
1. 读题 → 画图/举例 → 手动推演小样例
2. 识别问题类型（图论/DP/模拟/搜索）
3. 先写暴力/直观解法，跑通样例
4. 优化（记忆化、贪心、数据结构）
5. 检查边界（n=1、空输入、溢出）
```

## 常见 Java 踩坑清单

| 坑 | 现象 | 预防 |
|----|------|------|
| `new ArrayList[n]` 不初始化元素 | NPE | 循环 `g[i] = new ArrayList<>()` |
| 数组下标越界 | ArrayIndexOutOfBounds | 数组大小 = 最大下标 + 1 |
| for-each 中删除元素 | ConcurrentModificationException | 用 iterator 或标记法 |
| `new long{...}` 缺 `[]` | 编译错误 | 数组初始化必须 `new long[]{...}` |
| 变量重复声明 | 编译错误 | 不同作用域或改名 |
| 记忆化不存结果 | 重复计算/错误答案 | `memo[x] = result` 后 return |
| 成本/操作下标混淆 | 结果错误 | `next[0]`=成本，`next[1]`=操作 |

---

*学习贵在理解思路，代码只是表达方式。多手算、多画图、多调试。*
