---
title: LRU缓存实现与线程安全学习笔记
date: 2026-10-15 18:30:00
comments: true
tags:
  - Java
  - LRU
  - 并发
  - 学习笔记
categories:
  - 算法学习
---

# LRU 缓存：LinkedHashMap、双向链表与线程安全

本文从 LeetCode 146「LRU 缓存」出发，整理两种常见实现方式，并说明如何为手写缓存增加线程安全，以及为什么仅把 `HashMap` 换成 `ConcurrentHashMap` 并不能解决整个缓存的并发问题。

## 对应题目

[146. LRU 缓存（LRU Cache）](https://leetcode.cn/problems/lru-cache/)

## 一、什么是 LRU？

LRU 是 Least Recently Used 的缩写，意思是**最近最少使用**。缓存容量满时，删除最近最久没有被访问的条目。

缓存一般需要支持：

- `get(key)`：存在时返回值，并刷新该条目的最近使用状态；不存在时返回 `-1`。
- `put(key, value)`：添加或更新条目；容量超限时淘汰最久未使用的条目。

题目要求 `get` 和 `put` 达到 `O(1)` 平均时间复杂度。

---

## 二、手写实现：HashMap + 双向链表

单独使用哈希表可以在平均 `O(1)` 时间内找到节点，但它不记录访问顺序。双向链表可以在 `O(1)` 时间内移动或删除已知节点，因此把两者结合：

- `HashMap<key, node>`：通过键快速定位链表节点。
- 双向链表：记录最近使用顺序。

本文约定：

```text
head.next                                  tail.prev
最近使用（MRU）  ←  ...链表节点...  →  最久未使用（LRU）
```

`head` 和 `tail` 是虚拟哨兵节点，不保存缓存数据。它们减少了处理链表首尾时的特殊分支。

### 关键操作

1. **读取命中**：从 map 找到节点，摘下节点，再插入链表头部。
2. **更新已有键**：更新节点的值，再移动到头部。
3. **添加新键**：创建节点，写入 map，并插入头部。
4. **超出容量**：移除 `tail.prev`，同时从 map 删除该节点对应的键。

### Java 实现

```java
import java.util.HashMap;
import java.util.Map;

class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();

    private static class Node {
        int key;
        int value;
        Node prev;
        Node next;

        Node() {}

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final Node head = new Node();
    private final Node tail = new Node();

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) {
            return -1;
        }

        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (capacity <= 0) {
            return;
        }

        Node node = map.get(key);
        if (node != null) {
            node.value = value;
            moveToHead(node);
            return;
        }

        Node newNode = new Node(key, value);
        map.put(key, newNode);
        addToHead(newNode);

        if (map.size() > capacity) {
            Node oldest = tail.prev;
            removeNode(oldest);
            map.remove(oldest.key);
        }
    }

    private void addToHead(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void moveToHead(Node node) {
        removeNode(node);
        addToHead(node);
    }
}
```

这里用 `map.size()` 判断容量，省去了单独维护 `size` 字段的工作，也避免 `size` 和 map 中实际条目数发生不一致。`capacity <= 0` 的判断让实现能够处理非正容量；LeetCode 146 的容量约束通常大于等于 1。

---

## 三、使用 LinkedHashMap 实现

`LinkedHashMap` 同时维护哈希表和链表，默认按照插入顺序遍历。它还提供访问顺序模式：构造方法第三个参数传 `true` 后，访问过的条目会移动到最近使用的一端，适合构造 LRU 缓存。

```java
import java.util.LinkedHashMap;
import java.util.Map;

class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75F, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(
            Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}
```

### 构造参数

```java
super(capacity, 0.75F, true);
```

- 第一个参数是初始容量，不是最大条目数。
- 第二个参数是负载因子。
- 第三个参数 `true` 开启访问顺序；`false` 表示插入顺序。

访问顺序模式下，`get`、`getOrDefault` 等命中条目的操作会刷新其位置。`removeEldestEntry` 在添加新映射后被调用；返回 `true` 时，父类会自动移除最老的条目。[Oracle LinkedHashMap API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/LinkedHashMap.html)

### 两种实现如何选择？

| 实现方式 | 优点 | 适合场景 |
|---|---|---|
| `LinkedHashMap` | 代码少，访问顺序与淘汰逻辑由类库支持 | 需要快速实现 LRU |
| `HashMap` + 双向链表 | 能清楚看到数据结构和指针操作，也方便扩展 | 学习原理或需要定制缓存行为 |

---

## 四、为什么手写缓存需要整体加锁？

手写 LRU 的一次操作可能同时改动 map 和链表。例如添加条目要完成“写 map、插入链表、检查容量、淘汰尾节点、删除 map 中的键”等步骤。如果线程在这些步骤之间交错执行，map 和链表就可能不再对应。

另外，`get` 并非纯读取：它会把命中的节点移到链表头部。因此 `get` 和 `put` 都要使用同一把锁保护完整操作。

最简单的改法是在上一节手写实现中改成：

```java
public synchronized int get(int key) {
    // 原 get 方法内容
}

public synchronized void put(int key, int value) {
    // 原 put 方法内容
}
```

两个同步方法锁住同一个缓存实例。链表辅助方法保持 `private`，只从这两个已加锁的方法调用即可。这样一次操作不会被同一缓存对象上的另一个 `get` 或 `put` 插入打断。

这种实现易于理解，但同一个缓存对象上的操作会排队执行。对于 LeetCode 面试题和简单共享缓存，通常足够。

---

## 五、为什么不能只换成 ConcurrentHashMap？

`ConcurrentHashMap` 保证 map 自身的单次操作支持并发访问，但它不会保护双向链表，也不会自动把一串 map 和链表操作合成一个原子操作。它也不提供一个能阻止所有并发访问的整表锁。[Oracle ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

例如两个线程同时执行 `put`，都可能先读到“键不存在”，然后各自创建节点并插入链表。最终 map 可能只指向其中一个节点，而另一个节点仍留在链表里，导致缓存状态不一致。

因此：

- **推荐做法**：手写 LRU 使用 `HashMap`，并让整个 `get`、`put` 使用同一把锁。
- **只把 `HashMap` 换成 `ConcurrentHashMap`**：不能保证整个缓存线程安全。
- **换成 `ConcurrentHashMap` 后仍给整个 `get`、`put` 加同一把锁**：可以保护整体，但全局锁已经串行化缓存操作，通常没有必要再使用 `ConcurrentHashMap`。

`ConcurrentHashMap` 还不允许 `null` 键或 `null` 值；本例使用整数键和节点值，不会用到 `null` 映射。[Oracle ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

---

## 六、复杂度与常见错误

手写版和 `LinkedHashMap` 版的基本操作都能达到平均 `O(1)`：

| 操作 | 平均时间复杂度 |
|---|---:|
| 查询 map、插入、删除 | `O(1)` |
| 链表插入头部、删除已知节点、移动节点 | `O(1)` |
| `get` | `O(1)` |
| `put` | `O(1)` |

常见错误：

1. **只更新 map，不更新链表**：map 和 LRU 顺序会不一致。
2. **更新已有键时不移动节点**：题意通常把 `put` 更新视为一次使用。
3. **命中 `get` 后不移动节点**：无法正确记录最近访问顺序。
4. **淘汰时只从链表删除，忘记从 map 删除**：map 会留下已淘汰节点。
5. **只同步 map 操作**：无法保护 map 与链表之间的复合操作。
6. **容量为 0 时仍删除 `tail.prev`**：此时 `tail.prev` 是虚拟头节点，可能导致空指针异常；应提前处理。

## 总结

LRU 的关键是同时维护“快速按键查找”和“最近使用顺序”。手写版本使用 `HashMap + 双向链表`；简洁版本可以使用访问顺序模式的 `LinkedHashMap`。如果手写缓存要线程安全，应对 `get` 和 `put` 的完整逻辑加同一把锁。`ConcurrentHashMap` 只保证 map 自身操作的并发安全，不能代替对链表和整个缓存状态的同步。
