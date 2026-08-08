---
title: "布隆过滤器（Bloom Filter）"
date: 2025-07-09 00:21:39
updated: 2025-07-09 00:21:39
categories:
  - 笔记
---

# 布隆过滤器（**Bloom Filter**）

布隆过滤器（**Bloom Filter**）是一个**空间效率非常高的概率型数据结构**，用于判断一个元素是否在一个集合中。它的特点是：

- **可能误判为存在（false positive）**，但**绝不会漏判（false negative）**
- 空间占用远小于哈希表
- 查询效率极高（适合大数据、高并发场景）

------

## ✅ 一、原理简述

布隆过滤器的核心原理是：

1. 使用一个**位数组（bit array）**，初始时所有位为 0；
2. 需要 k 个不同的**哈希函数**；
3. **添加元素时**：
   - 将元素通过 k 个哈希函数计算出 k 个位置；
   - 把这些位置上的位都置为 1；
4. **查询元素是否存在**：
   - 同样通过 k 个哈希函数计算位置；
   - 若所有这些位置上的位都是 1，**可能存在**；
   - 若其中有一个为 0，**一定不存在**。

------

## ✅ 二、图示示意

假设位数组长度为 10，哈希函数数量为 3：

添加元素 `x`：

```text
哈希1(x) = 2
哈希2(x) = 4
哈希3(x) = 7
```

则设置 bit[2]、bit[4]、bit[7] 为 1。

------

## ✅ 三、优缺点

| 特点   | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| ✅ 优点 | 高效、节省内存、查询速度快、适合大规模数据去重               |
| ❌ 缺点 | 可能存在误判，不能删除元素（除非使用计数型布隆过滤器），不支持获取原始数据 |

------

## ✅ 四、典型应用场景

- 缓存穿透（Redis + 布隆过滤器防止大量非法 key 查询数据库）
- 黑名单、敏感词过滤
- 垃圾邮件识别
- 搜索引擎 URL 去重
- 区块链地址验证
- 广告系统曝光记录去重

------

## ✅ 五、Java 实现示例

使用 Google Guava 提供的布隆过滤器：

```java
import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;

public class BloomFilterDemo {
    public static void main(String[] args) {
        BloomFilter<Integer> bloomFilter = BloomFilter.create(
                Funnels.integerFunnel(),
                10000, // 预期插入数量
                0.01   // 可接受的误判率（1%）
        );

        // 添加元素
        bloomFilter.put(123);
        bloomFilter.put(456);

        // 查询元素
        System.out.println(bloomFilter.mightContain(123)); // true
        System.out.println(bloomFilter.mightContain(999)); // false（大概率）
    }
}
```

------

## ✅ 六、扩展类型

| 类型                                      | 描述                                         |
| ----------------------------------------- | -------------------------------------------- |
| 标准布隆过滤器                            | 普通的，不能删除元素                         |
| 计数型布隆过滤器（Counting Bloom Filter） | 可以实现删除操作（每个位置是计数器而非 0/1） |
| 分布式布隆过滤器                          | Redis、Kafka 中均支持                        |
| RoaringBitmap                             | 更适合稀疏数据集合（性能优于布隆过滤器）     |

------

## ✅ 七、Redis 中的布隆过滤器

Redis 官方模块 **RedisBloom** 支持布隆过滤器：

```bash
BF.ADD user:filter "user123"
BF.EXISTS user:filter "user123"  # 1（可能存在）
BF.EXISTS user:filter "user456"  # 0（一定不存在）
```

------

如你正在做高并发系统、分布式缓存或推荐系统项目，布隆过滤器是一个非常值得加入的组件。如果你需要结合 Spring Boot 或 Redis 实现布隆过滤器的完整样例代码，我也可以帮你生成。需要吗？