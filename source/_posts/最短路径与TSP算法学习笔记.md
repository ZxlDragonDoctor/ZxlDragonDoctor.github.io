---
title: 最短路径与TSP算法学习笔记
date: 2026-09-06 16:24:00
comments: true
tags:
  - 算法
  - Dijkstra
  - Floyd
  - TSP
  - 状态压缩DP
categories:
  - 算法学习
---

# 最短路径与 TSP 状压 DP 学习笔记

> 适用：华为 OD / 算法竞赛入门
> 涵盖：Dijkstra、Floyd、TSP 状压 DP

---

## 一、三种算法速览

| 算法 | 解决什么问题 | 时间复杂度 | 核心思想 |
|------|-------------|-----------|---------|
| Dijkstra | 一个起点 → 所有点的最短距离 | O(V²) 或 O(E log V) | 贪心 |
| Floyd | 所有点两两之间的最短距离 | O(V³) | 动态规划 |
| TSP 状压 DP | 访问所有点的最优顺序 | O(2ⁿ × n²) | 状态压缩 DP |

**如何选择：**

```
只要一个起点        → Dijkstra
要所有点对          → Floyd（节点少时）
访问所有点的最优顺序 → TSP 状压 DP
有负权边            → Floyd（Dijkstra 不支持）
```

---

## 二、Dijkstra 算法（单源最短路径）

### 2.1 问题定义

从一个起点出发，求到图中其他所有点的最短距离。

### 2.2 适用条件

- 边权 **非负**
- 单源（一个起点）
- 可用于有向图 / 无向图

### 2.3 核心思想（贪心）

```
1. 起点距离 = 0，其他 = ∞
2. 每次从未确定的点中，选距离最小的那个
3. 用它去「松弛」邻居：经它走过去会不会更近？
4. 标记为已确定，重复直到全部确定
```

**关键性质：** 一旦某点被「确定」，它的最短距离不会再变。

### 2.4 图解示例

```
        2
   A -------- B
   | \        |
  1|  \6      |3
   |    \     |
   C ---- D --+
     2    1
```

节点：A=0, B=1, C=2, D=3
边：A-B=2, A-C=1, A-D=6, B-D=3, C-D=2

**从 A 出发的手动推演：**

| 步骤 | 确定点 | 距离 | 松弛操作 |
|------|--------|------|---------|
| 1 | A | 0 | A→B=2, A→C=1, A→D=6 |
| 2 | C | 1 | C→D=1+2=3 < 6，更新 D=3 |
| 3 | B | 2 | B→D=2+3=5 > 3，不更新 |
| 4 | D | 3 | - |

**最终结果：** A→B=2, A→C=1, A→D=3

### 2.5 Java 实现

```java
import java.util.*;

public class Dijkstra {
    static final int INF = 1_000_000_000;

    /**
     * @param graph 邻接矩阵，graph[i][j] = 边权（无边为 INF）
     * @param start 起点编号
     * @return dist[i] = 起点到 i 的最短距离
     */
    public static int[] dijkstra(int[][] graph, int start) {
        int n = graph.length;
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];

        Arrays.fill(dist, INF);
        dist[start] = 0;

        for (int i = 0; i < n; i++) {
            // 1. 找未确定的最小距离点
            int u = -1;
            for (int j = 0; j < n; j++) {
                if (!visited[j] && (u == -1 || dist[j] < dist[u])) {
                    u = j;
                }
            }
            if (u == -1) break; // 剩余点不可达
            visited[u] = true;

            // 2. 用 u 松弛所有邻居
            for (int v = 0; v < n; v++) {
                if (!visited[v] && graph[u][v] < INF) {
                    if (dist[u] + graph[u][v] < dist[v]) {
                        dist[v] = dist[u] + graph[u][v];
                    }
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        int[][] graph = {
            {  0,   2,   1,   6},  // A
            {  2,   0, INF,   3},  // B
            {  1, INF,   0,   2},  // C
            {  6,   3,   2,   0}   // D
        };
        int[] dist = dijkstra(graph, 0);
        System.out.println(Arrays.toString(dist));
        // 输出: [0, 2, 1, 3]
    }
}
```

### 2.6 优先队列优化版（重点掌握）

**朴素版的问题：** 每次找最小距离点要遍历所有节点，O(V) 一次，总共 O(V²)。节点多时太慢。

**优化思路：** 用 **最小堆（PriorityQueue）** 自动维护最小值，找最小点从 O(V) 降到 O(log V)。

**和朴素版的区别：**

| | 朴素版 | 优化版 |
|--|--------|--------|
| 找最小点 | 遍历所有节点 O(V) | 堆顶弹出 O(log V) |
| 数据结构 | 邻接矩阵 | 邻接表 |
| 适用 | 稠密图 | 稀疏图（边少） |
| 复杂度 | O(V²) | O((V+E) log V) |

**优化版逻辑：**

```
1. 起点入堆：(距离=0, 节点=start)
2. 堆不为空时循环：
   a. 弹出堆顶 (d, u) —— 当前距离最小的点
   b. 如果 d > dist[u]，说明是「过期数据」，跳过
   c. 用 u 松弛所有邻居 v：
      如果 dist[u] + w(u,v) < dist[v]：
         更新 dist[v]，把 (新距离, v) 入堆
3. 堆空时，所有可达点的最短距离已确定
```

**为什么要跳过过期数据？**

一个点可能被多次「发现更短路径」，每次都入堆。弹出时如果 `d > dist[u]`，说明这不是当前最短距离，直接丢弃。

```java
// 过期数据检查（关键！）
if (d > dist[u]) continue;
```

**Java 实现（邻接表 + 优先队列）：**

```java
import java.util.*;

public class DijkstraPQ {
    static final int INF = 1_000_000_000;

    /**
     * @param graph 邻接表：graph[u] = List<int[]{v, w}>
     * @param start 起点
     * @return dist[i] = 起点到 i 的最短距离
     */
    public static int[] dijkstra(List<int[]>[] graph, int start) {
        int n = graph.length;
        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[start] = 0;

        // 最小堆：按距离排序，存 {距离, 节点}
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, start});

        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0];  // 当前弹出的距离
            int u = cur[1];  // 当前节点

            // 过期数据：不是最短距离，跳过
            if (d > dist[u]) continue;

            // 松弛 u 的所有邻居
            for (int[] edge : graph[u]) {
                int v = edge[0];
                int w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.offer(new int[]{dist[v], v});  // 新距离入堆
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        // 建邻接表：A=0, B=1, C=2, D=3
        int n = 4;
        List<int[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();

        // 无向图，双向加边
        graph[0].add(new int[]{1, 2}); graph[1].add(new int[]{0, 2});
        graph[0].add(new int[]{2, 1}); graph[2].add(new int[]{0, 1});
        graph[0].add(new int[]{3, 6}); graph[3].add(new int[]{0, 6});
        graph[1].add(new int[]{3, 3}); graph[3].add(new int[]{1, 3});
        graph[2].add(new int[]{3, 2}); graph[3].add(new int[]{2, 2});

        int[] dist = dijkstra(graph, 0);
        System.out.println(Arrays.toString(dist));
        // 输出: [0, 2, 1, 3]
    }
}
```

**邻接表 vs 邻接矩阵：**

```
邻接矩阵 graph[i][j]:
  适合稠密图（边多），O(1) 查边，空间 O(V²)

邻接表 graph[u] = [(v1,w1), (v2,w2), ...]:
  适合稀疏图（边少），遍历邻居只需 O(度数)，空间 O(V+E)
```

优先队列版配邻接表更搭，因为松弛时只遍历当前点的邻居，不用扫全图。

### 2.7 复杂度分析

| 实现方式 | 时间 | 空间 | 适用场景 |
|---------|------|------|---------|
| 朴素（邻接矩阵） | O(V²) | O(V²) | 稠密图、节点少（V ≤ 1000） |
| 优先队列（邻接表） | O((V+E) log V) | O(V+E) | 稀疏图、节点多 |

**选择建议：**

```
V ≤ 500 且边很多  → 朴素版（代码简单）
V 很大 或 边很稀疏 → 优先队列版（竞赛标配）
不确定            → 优先队列版（通用）
```

---

## 三、Floyd 算法（多源最短路径）

### 3.1 问题定义

求图中 **任意两点** 之间的最短距离。

### 3.2 适用条件

- 可以有 **负权边**（不能有负权环）
- 节点数较少（一般 V ≤ 500）
- 需要求全源最短路

### 3.3 核心思想（动态规划）

```
枚举中间点 k：
  对于每对 (i, j)：
    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

**一句话理解：** 允许经过 k 中转后，i→j 会不会更近？

**递推顺序：** `k` 必须在最外层循环，表示「允许经过前 k 个点中转」。

### 3.4 图解示例

使用与 Dijkstra 相同的图：

**初始矩阵：**

```
      A    B    C    D
A  [  0,   2,   1,   6 ]
B  [  2,   0,  ∞,   3 ]
C  [  1,  ∞,   0,   2 ]
D  [  6,   3,   2,   0 ]
```

**k=0（允许经过 A）：**

```
B→C: ∞ → B→A→C = 2+1 = 3  ✓ 更新
C→B: ∞ → C→A→B = 1+2 = 3  ✓ 更新
```

**k=1（允许经过 B）：**

```
A→D: 6 → A→B→D = 2+3 = 5  ✓ 更新
```

**k=2（允许经过 C）：**

```
A→D: 5 → A→C→D = 1+2 = 3  ✓ 更新
```

**k=3（允许经过 D）：** 无更优更新。

**最终矩阵：**

```
      A    B    C    D
A  [  0,   2,   1,   3 ]
B  [  2,   0,   3,   3 ]
C  [  1,   3,   0,   2 ]
D  [  3,   3,   2,   0 ]
```

A→D 最短 = 3，路径 A→C→D。

### 3.5 Java 实现

```java
public class Floyd {
    static final int INF = 1_000_000_000;

    /**
     * @param graph 邻接矩阵
     * @return dist[i][j] = i 到 j 的最短距离
     */
    public static int[][] floyd(int[][] graph) {
        int n = graph.length;
        int[][] dist = new int[n][n];

        // 拷贝初始矩阵
        for (int i = 0; i < n; i++) {
            dist[i] = graph[i].clone();
        }

        // k 必须在最外层！
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        int[][] graph = {
            {  0,   2,   1,   6},
            {  2,   0, INF,   3},
            {  1, INF,   0,   2},
            {  6,   3,   2,   0}
        };
        int[][] dist = floyd(graph);
        System.out.println(dist[0][3]); // A→D = 3
    }
}
```

### 3.6 复杂度分析

| 维度 | 复杂度 |
|------|-------|
| 时间 | O(V³) |
| 空间 | O(V²) |

---

## 四、TSP 状压 DP（旅行商问题）

### 4.1 问题定义

从起点出发，访问所有点恰好一次（不必返回起点），求最短总路径。

**典型题目：** 无人机巡检电力塔、快递员送货等。

### 4.2 为什么不用 Dijkstra/Floyd

| | 最短路径 | TSP |
|--|---------|-----|
| 问题 | A 到 B 多远？ | 先去哪后去哪总距离最短？ |
| 核心 | 路径长度 | **访问顺序** |

Dijkstra/Floyd 可以算出两两距离，但无法决定访问顺序。TSP 的难点在**顺序组合优化**。

### 4.3 什么是「状压」

用一个 **二进制数** 表示「哪些点访问过了」：

```
n=3 时（三位二进制）：

mask = 000 (0)  → 一个都没去
mask = 001 (1)  → 只去了 0 号
mask = 010 (2)  → 只去了 1 号
mask = 011 (3)  → 去了 0 和 1
mask = 100 (4)  → 只去了 2 号
mask = 101 (5)  → 去了 0 和 2
mask = 110 (6)  → 去了 1 和 2
mask = 111 (7)  → 全去了
```

**常用位操作：**

```java
mask | (1 << j)     // 把第 j 位变 1 = 去了点 j
mask & (1 << j)     // 检查第 j 位 = 点 j 去过没（≠0 表示去过）
```

### 4.4 DP 状态定义

```
dp[mask][i] = 已访问 mask 中的点，当前停在点 i 的最短距离
```

**示例：** `dp[011][1]` = 去过 {0,1}，停在 1 号点，最短花费

### 4.5 转移方程

```
dp[mask | (1<<j)][j] = min(dp[mask][i] + dist(i, j))
  其中：i 在 mask 中（当前停在 i）
        j 不在 mask 中（下一个去 j）
```

**人话：** 我现在停在 i，去过集合 mask，下一个去没去过的 j，新距离 = 原距离 + i 到 j 的距离。

### 4.6 完整推演示例

**问题：** 基地(0,0)，三个塔 T0=(1,2), T1=(3,1), T2=(2,3)

**预处理距离：**

```
基地→T0=3, 基地→T1=4, 基地→T2=5
T0↔T1=3,  T0↔T2=2,  T1↔T2=3
```

**初始化（从基地出发）：**

| mask | dp[mask][0] | dp[mask][1] | dp[mask][2] |
|------|-------------|-------------|-------------|
| 000 | - | - | - |
| 001 | **3** | ∞ | ∞ |
| 010 | ∞ | **4** | ∞ |
| 100 | ∞ | ∞ | **5** |

**从 mask=001（停在 T0）转移：**

```
去 T1: dp[011][1] = 3 + 3 = 6
去 T2: dp[101][2] = 3 + 2 = 5
```

**从 mask=010（停在 T1）转移：**

```
去 T0: dp[011][0] = 4 + 3 = 7
去 T2: dp[110][2] = 4 + 3 = 7
```

**从 mask=100（停在 T2）转移：**

```
去 T0: dp[101][0] = 5 + 2 = 7
去 T1: dp[110][1] = 5 + 3 = 8
```

**从 mask=011（停在 T0=7 或 T1=6）转移：**

```
T0→T2: 7+2=9
T1→T2: 6+3=9
dp[111][2] = 9
```

**从 mask=101（停在 T0=7 或 T2=5）转移：**

```
T0→T1: 7+3=10
T2→T1: 5+3=8
dp[111][1] = 8  ← 最优！
```

**从 mask=110（停在 T1=8 或 T2=7）转移：**

```
T1→T0: 8+3=11
T2→T0: 7+2=9
dp[111][0] = 9
```

**最终答案：** min(dp[111][0], dp[111][1], dp[111][2]) = min(9, 8, 9) = **8**

**最优路径：** 基地→T0→T2→T1，总距离 3+2+3=8

### 4.7 Java 实现

```java
import java.util.*;

public class TSP {
    /**
     * @param n 塔的数量
     * @param x 各塔 x 坐标
     * @param y 各塔 y 坐标
     * @return 从 (0,0) 出发访问所有塔的最短总距离
     */
    public static int tsp(int n, int[] x, int[] y) {
        int INF = 1_000_000_000;
        int full = 1 << n;              // 2^n 种 mask
        int[][] dp = new int[full][n];

        for (int[] row : dp) {
            Arrays.fill(row, INF);
        }

        // 初始化：从基地(0,0)到每个塔
        for (int i = 0; i < n; i++) {
            dp[1 << i][i] = x[i] + y[i];  // |xi-0| + |yi-0|
        }

        // 三层循环：mask → 当前点 i → 下一个点 j
        for (int mask = 0; mask < full; mask++) {
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) == 0) continue;  // i 不在 mask 中
                if (dp[mask][i] == INF) continue;       // 状态无效

                for (int j = 0; j < n; j++) {
                    if ((mask & (1 << j)) != 0) continue;  // j 已访问

                    int newMask = mask | (1 << j);
                    int cost = dp[mask][i]
                             + Math.abs(x[i] - x[j])
                             + Math.abs(y[i] - y[j]);
                    dp[newMask][j] = Math.min(dp[newMask][j], cost);
                }
            }
        }

        // 答案：全部访问完后停在任意点的最小值
        int ans = INF;
        for (int i = 0; i < n; i++) {
            ans = Math.min(ans, dp[full - 1][i]);
        }
        return ans;
    }

    public static void main(String[] args) {
        int n = 3;
        int[] x = {1, 3, 2};
        int[] y = {2, 1, 3};
        System.out.println(tsp(n, x, y));  // 输出: 8
    }
}
```

### 4.8 复杂度分析

```
mask 数量：2^n
每层循环：× n × n
总计：O(2^n × n²)

n=15 时：32768 × 225 ≈ 740 万，轻松通过
```

### 4.9 状态转移图示

```
mask=000 (未访问)
    │
    ├──→ mask=001 (去了0) ──→ mask=011 (去了0,1) ──→ mask=111 (全部)
    │                          ↗
    ├──→ mask=010 (去了1) ──→ mask=011 ──→ mask=111
    │                          ↗
    └──→ mask=100 (去了2) ──→ mask=101 ──→ mask=111
                               ↗
                         mask=110 ──→ mask=111
```

从左到右，mask 中 1 的个数递增，最终到达 mask=2^n-1。

---

## 五、Dijkstra vs Floyd 对比

| 对比项 | Dijkstra | Floyd |
|--------|----------|-------|
| 求什么 | 单源 → 所有点 | 所有点对 |
| 时间 | O(V²) 或 O(E log V) | O(V³) |
| 空间 | O(V) | O(V²) |
| 负权边 | ❌ 不支持 | ✅ 支持 |
| 核心思想 | 贪心 | 动态规划 |
| 适用 | 稀疏图、单源查询 | 稠密图、全源、节点少 |
| 实现难度 | 中等 | 简单（三重循环） |

---

## 六、最短路径 vs TSP 对比

| 对比项 | 最短路径 | TSP 状压 DP |
|--------|---------|-------------|
| 问题 | 两点间最短距离 | 访问所有点的最优顺序 |
| 输出 | 距离值 | 最小总距离 + 访问顺序 |
| 组合复杂度 | 无 | 排列组合 O(n!)，DP 优化到 O(2ⁿn²) |
| 典型应用 | 导航、网络路由 | 巡检、送货、电路板钻孔 |

**关系：** Floyd/Dijkstra 可作为 TSP 的预处理步骤，先算好两两距离，再用状压 DP 求最优顺序。

---

## 七、常见题型识别

| 题目关键词 | 对应算法 |
|-----------|---------|
| 「从A到B最短距离」「单源」 | Dijkstra |
| 「任意两点」「全源」「节点少」 | Floyd |
| 「访问所有点」「巡检/送货」「最优顺序」 | TSP 状压 DP |
| 「不能连续跳两次」「带限制的路径」 | 多状态 DP |
| 「两个栈」「后进先出」「最少操作」 | 栈模拟 + 贪心 |

---

## 八、模板代码速查

### Dijkstra 模板（朴素版）

```java
int[] dist = new int[n];
boolean[] vis = new boolean[n];
Arrays.fill(dist, INF);
dist[start] = 0;

for (int i = 0; i < n; i++) {
    int u = -1;
    for (int j = 0; j < n; j++) {
        if (!vis[j] && (u == -1 || dist[j] < dist[u])) u = j;
    }
    if (u == -1) break;
    vis[u] = true;
    for (int v = 0; v < n; v++) {
        if (!vis[v] && dist[u] + graph[u][v] < dist[v]) {
            dist[v] = dist[u] + graph[u][v];
        }
    }
}
```

### Dijkstra 模板（优先队列优化版）

```java
int[] dist = new int[n];
Arrays.fill(dist, INF);
dist[start] = 0;

PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
pq.offer(new int[]{0, start});

while (!pq.isEmpty()) {
    int[] cur = pq.poll();
    int d = cur[0], u = cur[1];
    if (d > dist[u]) continue;  // 过期数据

    for (int[] edge : graph[u]) {  // graph 为邻接表
        int v = edge[0], w = edge[1];
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.offer(new int[]{dist[v], v});
        }
    }
}
```

### Floyd 模板

```java
for (int k = 0; k < n; k++)          // k 在最外层！
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
```

### TSP 状压 DP 模板

```java
int full = 1 << n;
int[][] dp = new int[full][n];
// 初始化 dp[1<<i][i] = 起点到 i 的距离

for (int mask = 0; mask < full; mask++)
    for (int i = 0; i < n; i++) {
        if ((mask & (1 << i)) == 0 || dp[mask][i] == INF) continue;
        for (int j = 0; j < n; j++) {
            if ((mask & (1 << j)) != 0) continue;
            dp[mask | (1 << j)][j] = Math.min(
                dp[mask | (1 << j)][j],
                dp[mask][i] + dist[i][j]
            );
        }
    }

// 答案 = min(dp[full-1][i]) for all i
```

---

## 九、学习建议

1. **先手算小例子**：n=3 或 n=4，手动填 DP 表，理解状态含义
2. **画状态转移图**：mask 从少到多，看清依赖关系
3. **默写模板**：三种算法的核心循环结构要能默写
4. **做题巩固**：
   - Dijkstra：网络延迟时间（LeetCode 743）
   - Floyd：城市最短路径类题目
   - TSP：华为 OD 巡检/送货类真题
5. **理解而非死记**：Dijkstra 的「确定最小」、Floyd 的「枚举中转」、TSP 的「mask 表示集合」——记住思想比记住代码更重要

---

*整理时间：2026年 | 适用：算法竞赛 / 华为 OD 备考*
