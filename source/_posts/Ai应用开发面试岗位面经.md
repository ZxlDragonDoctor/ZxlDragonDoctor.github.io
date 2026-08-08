---
title: "Ai应用开发面试岗位面经"
date: 2025-07-09 00:21:53
updated: 2025-07-09 00:21:53
categories:
  - 笔记

cover: /img_posts/image-20250708185518219.png
---

# Ai应用开发面试岗位面经

同步or异步方式传输数据、用户是怎么保持认证状态的用的token还是JWT

Mybatis的一级缓存和二级缓存。

Mybatis是怎么封装sql查询的结果集





多态
static关键字
集合相关实现类，arraylist底层
java8新增哪些特性
定义线程的方法
为什么不用executor定义的方法？
synchronized关键字
如何避免死锁
spring常用注解
spring中Bean有哪些特点
Mybatis如何讲一个sql结果集封装成一个java对象返回
mybatis一级缓存和二级缓存
什么是事务
mysql默认隔离级别
优化sql的方案
sql的递归查询
redis数据类型
如果使用git拉取代码下来发现冲突了怎么解决
前端js定义一个对象
为什么使用分布式，有什么优点
如何实现分布式id

作者：如果清醒是种罪
链接：https://www.nowcoder.com/feed/main/detail/32a66eafe43c47d981131ad2b7157e41?sourceSSR=users
来源：牛客网

x这是一份后端开发常见的面试问题清单，涵盖了 Java 核心、并发、集合、Spring、MyBatis、数据库、分布式、Redis、Git 及前端基础等方面。以下是每个问题的简洁答案（适合面试回答或复习准备）：

------

## ✅ **Java 基础 & 面向对象**

### 1. 多态

- **定义**：父类引用指向子类对象，调用方法时根据实际对象类型决定执行哪个方法（运行时多态）。
- **前提**：继承 + 方法重写 + 父类引用指向子类对象。
- **好处**：提高代码扩展性，解耦。

------

### 2. static 关键字

- **作用**：表示静态成员，属于类而非对象。
- **常见用法**：
  - 静态变量：所有对象共享。
  - 静态方法：不能访问非静态成员。
  - 静态代码块：类加载时执行一次。
  - 静态内部类：不依赖外部类对象。

------

## ✅ **集合 & Java 底层**

### 3. ArrayList 底层原理

- 底层是 **动态数组**，默认初始容量为 10。
- 增长策略：容量不够时扩容为原来的 **1.5 倍**。
- **线程不安全**，可用 `Collections.synchronizedList` 或 `CopyOnWriteArrayList` 实现线程安全。

------

## ✅ **Java 8 新特性**

### 4. Java8 新增特性

- Lambda 表达式
- 函数式接口（@FunctionalInterface）
- Stream 流式处理
- Optional 避免 NullPointerException
- 新的时间日期 API（java.time.*）
- 接口默认方法（default）、静态方法
- CompletableFuture（异步编程）

------

## ✅ **并发编程**

### 5. 定义线程的方法

- 实现 `Runnable` 接口
- 继承 `Thread` 类
- 实现 `Callable` 接口（配合 Future）

------

### 6. 为什么不用 executor 定义的方法？

- 实际开发推荐使用 Executor 框架（线程池），**避免频繁创建销毁线程，提升性能和资源利用率**。
- 不推荐手动 `new Thread()`，难以管理和扩展。

------

### 7. synchronized 关键字

- 实现线程同步的关键字，修饰：
  - 实例方法（锁当前对象）
  - 静态方法（锁类对象）
  - 代码块（自定义锁对象）
- 实现原理：JVM 指令加锁，依赖对象监视器（Monitor）

------

### 8. 如何避免死锁

- 避免嵌套锁/嵌套 synchronized
- **统一加锁顺序**
- 设置加锁超时时间（如 `tryLock`）
- 尽量使用并发工具类如 `Lock`, `Semaphore`, `BlockingQueue`

------

## ✅ **Spring 框架**

### 9. Spring 常用注解

- `@Component` / `@Service` / `@Repository` / `@Controller`
- `@Autowired` / `@Resource` / `@Qualifier`
- `@Configuration` / `@Bean`
- `@Value` / `@PropertySource`
- `@Transactional`
- `@RequestMapping`, `@GetMapping` 等

------

### 10. Spring 中 Bean 有哪些特点

- 单例（默认）
- 延迟加载（默认）
- 生命周期受容器管理
- 可通过注解或 XML 进行配置

------

## ✅ **MyBatis**

### 11. MyBatis 如何将 SQL 结果集封装成 Java 对象

- 通过 `<resultMap>` 或使用 `resultType`
- 字段名和 Java 属性不一致时使用 `column` 映射
- 支持嵌套映射（多对一、一对多）

------

### 12. MyBatis 一级缓存和二级缓存

- **一级缓存**：SqlSession 级别，默认开启，同一个 session 有缓存。
- **二级缓存**：mapper 级别，需要配置开启；跨 session 有效，通常使用第三方缓存实现。

------

## ✅ **数据库 & SQL**

### 13. 什么是事务

- 数据库操作的最小单位，具备 ACID：
  - 原子性、一致性、隔离性、持久性

------

### 14. MySQL 默认隔离级别

- **Repeatable Read**（可重复读）

------

### 15. 优化 SQL 的方案

- 建索引（尤其是 where、join、order by）
- 避免 select *
- 使用分页查询
- 避免函数操作字段
- 分表分库、读写分离
- 使用执行计划 `EXPLAIN`

------

### 16. SQL 的递归查询

- 使用 `WITH RECURSIVE` 实现层级关系查询（如组织树）
- 示例：

```sql
WITH RECURSIVE temp AS (
  SELECT id, name, parent_id FROM category WHERE id = 1
  UNION ALL
  SELECT c.id, c.name, c.parent_id FROM category c
  JOIN temp t ON c.parent_id = t.id
)
SELECT * FROM temp;
```

------

## ✅ **Redis**

### 17. Redis 数据类型

- String（字符串）
- List（列表）
- Set（集合）
- Hash（哈希）
- ZSet（有序集合）
- Bitmap、HyperLogLog、Geo 等

------

## ✅ **Git**

### 18. 使用 Git 拉取代码发现冲突怎么解决

1. 拉取代码时报冲突：
   - `git pull` 时提示冲突，需手动解决。
2. 步骤：
   - 修改冲突文件，清除冲突标记。
   - `git add 文件名`
   - `git commit -m "fix conflict"`
   - 可选择继续 rebase 或合并。

------

## ✅ **前端基础**

### 19. 前端 JS 定义一个对象

```js
const person = {
  name: "Tom",
  age: 20,
  sayHi: function() {
    console.log("Hi");
  }
};
```

------

## ✅ **分布式系统**

### 20. 为什么使用分布式，有什么优点

- 提升系统的 **高可用性**
- 提高 **并发能力** 和 **性能**
- 实现 **服务拆分，灵活扩展**
- 解决 **单点故障**
- 支持 **异地多活**

------

### 21. 如何实现分布式 ID

- 常见方式：
  - UUID（唯一但不有序）
  - 数据库自增（单点瓶颈）
  - Redis 自增
  - 雪花算法（Snowflake，Twitter 出品，64位长整型）
  - 百度 UidGenerator、Leaf 等

------

如需我根据岗位（如“AI Agent 工程师”或“后端开发”）定制结构化面经文档、模拟面试题本、视频讲解、或配合项目经验整理，欢迎继续提问。











![image-20250708185518219](/img_posts/image-20250708185518219.png)



































如何让AI输出的更准确更可信真实（RAG，WorkFlow。

如何提高RAG召回率、工具调用和MCP区别等问题。

![img](/img_posts/VGaQ3NDpvpf8ASAM.webp)









 

SSE 重连机制？如何实现重连续传？

SSE（Server-Sent Events）是一种允许服务器主动向客户端推送数据的技术，其重连机制是其重要特性之一。以下是关于SSE重连机制及其实现的详细说明：

### SSE重连机制
1. **自动重连特性**：SSE的重连机制是由浏览器自动实现的。当连接因网络问题或其他原因中断时，浏览器会自动尝试重新连接。
2. **重连时间间隔**：重连的时间间隔可以通过服务端发送的`retry`字段来指定。例如，服务端可以发送`retry: 5000`，表示在连接中断后5秒尝试重新连接。如果服务端未指定`retry`字段，浏览器会使用默认值，通常是3秒。
3. **Last-Event-ID**：客户端在每次接收到消息时，会将消息的`id`字段作为内部属性`Last-Event-ID`存储起来。在重连成功后，客户端会将`Last-Event-ID`作为请求头发送给服务器，以便服务器可以根据这个ID继续发送后续消息。

### 实现重连的两种方式
1. **浏览器自动重连**：
   - **监听error事件**：当连接中断时，`EventSource`的`error`事件会被触发。浏览器会自动尝试重新连接，无需手动干预。
   - **示例代码**：
     ```javascript
     let eventSource = new EventSource('your_event_source_url');
     eventSource.addEventListener('error', function() {
         console.log('Connection lost. Browser will try to reconnect.');
     });
     ```

2. **手动重连**：
   - **手动控制重连**：如果需要手动控制重连，可以在`error`事件处理函数中关闭当前连接，然后重新创建一个新的`EventSource`实例。
   - **限制重连次数**：可以通过设置重连次数来避免无限重连。
   - **示例代码**：
     ```javascript
     let eventSource = new EventSource('your_event_source_url');
     let reconnectAttempts = 0;
     const maxReconnectAttempts = 3;
     
     eventSource.addEventListener('error', function() {
         reconnectAttempts++;
         if (reconnectAttempts <= maxReconnectAttempts) {
             console.log(`Reconnect attempt ${reconnectAttempts}`);
             eventSource.close();
             eventSource = new EventSource('your_event_source_url');
         } else {
             console.log('Max reconnect attempts reached. Aborting.');
         }
     });
     ```

### 重连续传的实现
1. **服务端发送`id`字段**：为了保证数据的完整性，服务端在发送消息时需要带上`id`字段。这样客户端在重连后可以通过`Last-Event-ID`请求后续数据。
2. **客户端处理`Last-Event-ID`**：客户端在重连成功后，会将`Last-Event-ID`作为请求头发送给服务器。服务器可以根据这个ID继续发送后续消息。
3. **示例代码**：
   - **服务端**：
     ```javascript
     res.write('id: 12345\n');
     res.write('data: Hello, client!\n\n');
     ```
   - **客户端**：
     ```javascript
     let eventSource = new EventSource('your_event_source_url');
     eventSource.addEventListener('message', function(event) {
         console.log('Received message:', event.data);
     });
     ```

通过以上机制和实现方式，SSE可以有效地实现自动重连和数据的连续传输，确保在连接中断后能够恢复数据传输。