---
title: "CountDownLatch 和CompletableFuture"
date: 2025-08-29 17:23:07
updated: 2025-08-29 17:23:07
categories:
  - 学习总结
---

## CountDownLatch 和CompletableFuture



在Java并发编程中，`CountDownLatch`和`CompletableFuture`都是处理多线程协作的重要工具，但它们的设计目标和应用场景有所不同。下面是两者的详细说明及代码示例：


### 一、CountDownLatch
`CountDownLatch`是基于AQS（抽象队列同步器）的同步工具，用于**等待一组线程完成后再执行主线程**。它通过一个计数器实现：
- 初始化时设置计数器值（线程数量）
- 每个线程完成任务后调用`countDown()`递减计数器
- 主线程调用`await()`阻塞等待，直到计数器变为0

````java
import java.util.concurrent.CountDownLatch;

public class CountDownLatchDemo {
    public static void main(String[] args) throws InterruptedException {
        // 初始化计数器为3（需要等待3个线程完成）
        CountDownLatch latch = new CountDownLatch(3);
        
        // 启动3个工作线程
        for (int i = 1; i <= 3; i++) {
            final int taskId = i;
            new Thread(() -> {
                try {
                    System.out.println("任务" + taskId + "开始执行");
                    Thread.sleep(1000 * taskId); // 模拟不同耗时的任务
                    System.out.println("任务" + taskId + "执行完成");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    latch.countDown(); // 任务完成，计数器减1
                }
            }).start();
        }
        
        System.out.println("主线程等待所有任务完成...");
        latch.await(); // 阻塞等待计数器变为0
        System.out.println("所有任务已完成，主线程继续执行");
    }
}

````





**应用场景**：
- 主线程等待多个子线程初始化完成后再启动
- 批量任务执行完毕后汇总结果
- 模拟并发测试（让所有线程准备就绪后同时执行）

**特点**：
- 计数器只能使用一次，不能重置
- 是非阻塞的线程间通信方式
- 适合"一对多"的等待场景


### 二、CompletableFuture
`CompletableFuture`是Java 8引入的异步编程工具，基于Future模式扩展，支持**异步任务的链式执行、结果处理和异常处理**。它可以：
- 异步执行任务并获取结果
- 多个异步任务串行或并行组合
- 自动处理任务完成后的回调逻辑



**常用API**：
- `runAsync()`：异步执行Runnable任务（无返回值）
- `supplyAsync()`：异步执行Supplier任务（有返回值）
- `thenApply()`：任务完成后处理结果（有返回值）
- `thenAccept()`：任务完成后消费结果（无返回值）
- `thenCompose()`：串联两个异步任务
- `allOf()`：等待所有任务完成
- `anyOf()`：等待任一任务完成

​	

````java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class CompletableFutureDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 1. 异步执行任务（无返回值）
        CompletableFuture<Void> future1 = CompletableFuture.runAsync(() -> {
            System.out.println("异步任务1执行: " + Thread.currentThread().getName());
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        // 2. 异步执行任务（有返回值）
        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> {
            System.out.println("异步任务2执行: " + Thread.currentThread().getName());
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "任务2结果";
        });
        
        // 3. 任务2完成后执行回调（链式操作）
        CompletableFuture<String> future3 = future2.thenApply(result -> {
            System.out.println("接收任务2结果: " + result);
            return result + " -> 处理后";
        });
        
        // 4. 等待所有任务完成
        CompletableFuture.allOf(future1, future3).join();
        
        // 获取最终结果
        System.out.println("最终结果: " + future3.get());
    }
}

````



**应用场景**：

- 异步IO操作（如网络请求、文件读写）
- 复杂的异步任务编排（串行、并行、分支）
- 非阻塞的结果处理（避免主线程阻塞）
- 函数式编程风格的并发代码

**特点**：
- 支持任务间的依赖关系和流水线操作
- 内置异常处理机制（`exceptionally()`）
- 可与线程池结合使用，控制并发资源


### 三、两者对比与选择
| 特性     | CountDownLatch             | CompletableFuture            |
| -------- | -------------------------- | ---------------------------- |
| 核心功能 | 等待多个线程完成           | 异步任务执行与结果处理       |
| 灵活性   | 功能单一（仅等待）         | 支持复杂的任务组合和链式操作 |
| 结果处理 | 不直接支持结果传递         | 原生支持结果处理和转换       |
| 重用性   | 计数器不可重置，一次性使用 | 可多次组合使用               |
| 适用场景 | 简单的等待多线程完成场景   | 复杂的异步任务编排和结果处理 |

**选择建议**：
- 若只需等待一组线程完成后继续执行，用`CountDownLatch`
- 若需要处理异步任务的结果、组合多个任务，用`CompletableFuture`
- 并发编程中，`CompletableFuture`更符合现代异步编程模式，应用更广泛

在实际开发中，两者也可结合使用，例如用`CompletableFuture`处理异步任务，用`CountDownLatch`控制整体等待逻辑。