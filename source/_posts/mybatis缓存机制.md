---
title: "mybatis缓存机制"
date: 2025-03-08 11:41:14
updated: 2025-03-08 11:41:14
categories:
  - Java面试
---

# mybatis缓存机制

MyBatis 提供了两级缓存机制：一级缓存和二级缓存，用于提升数据库查询性能。

### 一级缓存
一级缓存是基于 `SqlSession` 的本地缓存，每个 `SqlSession` 实例都有自己的缓存区域。它的特点如下：
- **默认开启**：无需额外配置。
- **作用范围**：仅限于同一个 `SqlSession`。
- **失效条件**：
  - 执行 `insert`、`update` 或 `delete` 操作。
  - 调用 `SqlSession.clearCache()`。
  - `SqlSession` 关闭。
- **工作原理**：当使用同一个 `SqlSession` 执行相同的查询时，MyBatis 会先检查一级缓存是否存在结果。如果存在，则直接返回缓存结果，否则查询数据库并将结果存入缓存。

### 二级缓存
二级缓存是跨多个 `SqlSession` 的全局缓存，作用范围是同一个 Mapper。它的特点如下：
- **需要手动开启**：默认情况下，二级缓存是关闭的。
- **作用范围**：同一个 Mapper 的所有 `SqlSession`。
- **缓存实现**：可以使用 MyBatis 自带的缓存，也可以集成第三方缓存（如 Ehcache、Redis）。
- **失效条件**：当执行数据修改操作（`insert`、`update`、`delete`）时，二级缓存会被清空。
- **配置步骤**：
  1. 在 `mybatis-config.xml` 中启用二级缓存：
     ```xml
     <settings>
         <setting name="cacheEnabled" value="true"/>
     </settings>
     ```
  2. 在 Mapper 文件中配置 `<cache>` 标签：
     ```xml
     <cache eviction="FIFO" flushInterval="60000" size="512" readOnly="true"/>
     ```
  3. 如果使用第三方缓存，需指定缓存类型，例如：
     ```xml
     <cache type="org.mybatis.caches.ehcache.EhcacheCache"/>
     ```

### 缓存策略配置
- **`eviction`**：指定缓存的清理策略，如 LRU（最近最少使用）、FIFO（先进先出）。
- **`flushInterval`**：缓存刷新时间间隔（单位：毫秒）。
- **`size`**：缓存的最大存储对象数量。
- **`readOnly`**：指定缓存是否为只读。

### 注意事项
1. **数据一致性**：二级缓存需要确保与数据库数据的一致性，尤其是在分布式环境下。
2. **对象序列化**：二级缓存中的对象需要实现 `Serializable` 接口。
3. **缓存穿透**：避免缓存穿透问题，对高频查询适当配置缓存。

通过合理配置和使用一级缓存与二级缓存，可以显著提升 MyBatis 的查询性能。



## 解决问题

（1） **数据一致性问题**  

在使用 MyBatis 二级缓存时，确保数据一致性是一个关键问题，尤其是在高并发和分布式环境下。以下是确保二级缓存数据一致性的方法和策略：

### 1. **自动清空缓存**
MyBatis 在执行 `INSERT`、`UPDATE` 或 `DELETE` 操作时，会自动清空相关 Mapper 的二级缓存。这是 MyBatis 为保证数据一致性而采取的默认机制。

### 2. **配置缓存刷新策略**
通过合理配置 `<cache>` 标签的属性，可以进一步优化缓存的刷新策略：
- **`flushInterval`**：设置缓存的自动刷新时间间隔（单位：毫秒）。例如，`flushInterval="60000"` 表示每 60 秒刷新一次缓存，以确保缓存中的数据不会过期。
- **`eviction`**：指定缓存的淘汰策略，如 LRU（最近最少使用）或 FIFO（先进先出）。这可以避免缓存中的数据过多导致内存问题。

### 3. **使用只读缓存**
将二级缓存配置为只读（`readOnly="true"`），可以提高缓存的性能，同时减少因缓存数据被修改而导致的一致性问题。

### 4. **分布式缓存解决方案**
在分布式环境中，MyBatis 默认的二级缓存实现可能无法满足需求，因为它们无法跨多个应用实例同步数据。此时，可以集成第三方分布式缓存，如 Redis 或 Ehcache：
- **Redis**：通过 Redis 的发布/订阅机制或使用 Redis 的过期时间（TTL）功能，可以确保缓存数据的实时性和一致性。
- **Ehcache**：支持集群模式，可以在多个应用实例之间同步缓存数据。

### 5. **手动清空缓存**
在某些场景下，可能需要手动清空二级缓存，以确保数据的最新性。可以通过调用 `clearCache()` 方法或在 Mapper 文件中配置 `<cache>` 标签的 `clearCacheInterval` 属性。

### 6. **避免缓存穿透**
对于高频查询的数据，应确保缓存中始终有数据可用，避免因缓存穿透导致数据库压力过大。可以通过设置合理的缓存过期时间和使用互斥锁（如分布式锁）来解决。

### 7. **合理设计缓存策略**
- **适用场景**：二级缓存适用于查询频繁且数据更新较少的业务场景（如配置表）。
- **多表关联查询**：在涉及多表关联查询时，需要通过 `<cache-ref>` 配置来避免脏数据。

通过以上方法和策略，可以有效确保 MyBatis 二级缓存的数据一致性，同时提升系统的性能和稳定性。





（2）**对象序列化**

在 MyBatis 的二级缓存中，对象序列化是一个重要的概念。由于二级缓存的作用范围是跨多个 `SqlSession` 的，甚至可能跨多个应用实例（在分布式环境中），因此需要将缓存的对象序列化后存储，以便在需要时可以反序列化还原对象。这就要求存储在二级缓存中的对象必须实现 `java.io.Serializable` 接口。

### 为什么需要序列化？
1. **跨会话共享**：二级缓存中的数据需要在不同的 `SqlSession` 之间共享，甚至可能在不同的 JVM 实例之间共享（例如在集群环境中）。序列化可以将对象转换为字节流，方便在不同环境之间传输和存储。
2. **持久化存储**：某些缓存实现（如 Ehcache）可能将数据持久化到磁盘，或者使用分布式缓存（如 Redis）时，需要将对象序列化后存储到外部存储中。
3. **缓存一致性**：序列化确保对象在存储和恢复时保持一致的状态，避免因对象状态不一致导致的错误。

### 如何实现序列化？
要使对象可以被序列化，需要满足以下条件：
1. **实现 `Serializable` 接口**：`Serializable` 是一个标记接口，没有方法和字段。实现该接口的类表示可以被序列化。
   ```java
   import java.io.Serializable;
   
   public class User implements Serializable {
       private static final long serialVersionUID = 1L; // 序列化版本号
       private int id;
       private String name;
       private String email;
   
       // 构造函数、getter 和 setter 省略
   }
   ```

2. **添加 `serialVersionUID`**：这是可选的，但建议添加。`serialVersionUID` 是一个序列化版本号，用于在反序列化时验证类版本是否一致。如果类结构发生变化（如添加或删除字段），需要更新这个版本号。
   - 如果没有显式声明 `serialVersionUID`，JVM 会根据类的结构自动生成一个。但如果类结构发生变化，自动生成的版本号也会改变，从而导致反序列化失败。

3. **处理非序列化字段**：如果对象中有一些字段不需要序列化，可以使用 `transient` 关键字修饰这些字段。例如：
   ```java
   public class User implements Serializable {
       private static final long serialVersionUID = 1L;
       private int id;
       private String name;
       private transient String password; // 不需要序列化的字段
   }
   ```







（3） **缓存击穿问题**

在使用 MyBatis 二级缓存时，缓存穿透是一个常见的问题，尤其是在高频查询场景下。缓存穿透指的是查询不存在的数据时，由于缓存中没有该数据，每次请求都会直接查询数据库，从而失去缓存的意义，甚至可能导致数据库压力过大。

### 解决缓存穿透问题的方法
以下是几种常见的解决方案：

#### 1. **使用布隆过滤器（Bloom Filter）**
布隆过滤器是一种高效的数据结构，用于快速判断某个数据是否存在。在查询之前，先通过布隆过滤器判断数据是否可能存在于缓存或数据库中。如果布隆过滤器返回不存在，则直接返回，避免查询数据库。

#### 2. **缓存空对象**
对于查询结果为空的数据，可以将空对象或特殊标记缓存起来，并设置较短的过期时间（如 5 分钟）。这样，后续相同的查询可以直接从缓存中获取空结果，减少对数据库的访问。

#### 3. **接口层校验**
在查询缓存之前，对请求参数进行合法性校验，如过滤非法字符、判断参数范围等。对于明显错误的参数，直接拦截并返回，避免无效查询。

#### 4. **限流与熔断**
通过限流算法（如令牌桶、漏桶算法）控制访问频率，或在检测到数据库访问异常时启动熔断机制，暂时屏蔽请求。这可以有效缓解数据库压力。

### 示例代码
以下是一个结合布隆过滤器和缓存空对象的示例代码：

```java
public User getUserById(Integer userId) {
    // 检查缓存是否存在
    User user = cache.get(userId);
    if (user != null) {
        return user;
    }

    // 使用布隆过滤器判断数据是否存在
    if (!bloomFilter.mightContain(userId)) {
        return null; // 直接返回，防止缓存穿透
    }

    // 查询数据库
    user = userMapper.getUserById(userId);

    if (user != null) {
        cache.put(userId, user); // 缓存数据
    } else {
        cache.put(userId, null, 300); // 缓存空对象，过期时间为 300 秒
    }

    return user;
}
```

