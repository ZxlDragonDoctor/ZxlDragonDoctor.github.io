---
title: "Thread.currentThread().interrupt()"
date: 2025-09-28 16:16:39
updated: 2025-09-28 16:16:39
categories:
  - 学习总结
---

## `Thread.currentThread().interrupt()` 

`Thread.currentThread().interrupt()` 干的事情只有一件：

> **把“当前线程”的中断标志位重新设为 true**。

---

### 1 为什么“重新”设？
- `InterruptedException` 被抛出时，JVM 会**自动清除**中断标志（置 false）。  
- 如果此时代码捕获了 `InterruptedException` 却**不重新中断**，那么**上层调用者**就永远不知道“曾经被中断过”，**任务可能无法优雅停止**。

---

### 2 使用模板
```java
try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    // 1. 立即恢复中断标志
    Thread.currentThread().interrupt();
    // 2. 自己的清理逻辑
    return;                 // 或抛出运行时异常
}
```

---

### 3 不恢复的后果
```java
catch (InterruptedException e) {
    logger.error("sleep interrupted", e);
    // 忘记 Thread.currentThread().interrupt()
}
```

- 中断标志丢失 → 调用者检查 `Thread.currentThread().isInterrupted()` 永远返回 false  
- **线程池**、**可取消任务**、**框架循环** 无法退出 → 变成“漏不掉的僵尸线程”

---

### 4 一句话总结
**捕获 `InterruptedException` 后，最正确的做法就是：**
```java
Thread.currentThread().interrupt();
```
**把“曾被打断”的事实传递出去，让上层有机会优雅地结束任务。**