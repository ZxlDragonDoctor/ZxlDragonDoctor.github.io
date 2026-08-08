---
title: "@Async"
date: 2025-09-17 17:06:41
updated: 2025-09-17 17:06:41
categories:
  - 学习总结
---

`@EnableAsync` 是 Spring 框架中的一个注解，用于开启异步方法的支持。当在配置类上添加该注解后，Spring 会自动扫描并识别带有 `@Async` 注解的方法，使其能够异步执行（即不在调用线程中同步执行，而是交给其他线程处理）。

### 基本使用步骤：

1. **在配置类上添加 `@EnableAsync`**
```java
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync // 开启异步支持
public class AsyncConfig {
    // 可以在这里配置线程池等
}
```

2. **在需要异步执行的方法上添加 `@Async`**
```java
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncService {
    
    // 该方法会异步执行
    @Async
    public void asyncMethod() {
        // 耗时操作，如网络请求、文件处理等
        System.out.println("异步方法执行中，线程名：" + Thread.currentThread().getName());
    }
}
```

3. **调用异步方法**
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @Autowired
    private AsyncService asyncService;
    
    @GetMapping("/test")
    public String test() {
        asyncService.asyncMethod(); // 调用后立即返回，不会等待方法执行完成
        return "请求已受理";
    }
}
```

### 注意事项：

- `@Async` 注解的方法必须是 **public** 的，且不能在同一个类中调用（否则异步不生效）。
- 默认情况下，Spring 使用 `SimpleAsyncTaskExecutor` 作为线程池，建议自定义线程池以更好地控制线程资源：
  ```java
  @Configuration
  @EnableAsync
  public class AsyncConfig {
      @Bean
      public Executor taskExecutor() {
          ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
          executor.setCorePoolSize(5); // 核心线程数
          executor.setMaxPoolSize(10); // 最大线程数
          executor.setQueueCapacity(25); // 队列容量
          executor.setThreadNamePrefix("Async-"); // 线程名前缀
          executor.initialize();
          return executor;
      }
  }
  ```
- 如果需要获取异步方法的返回值，可以让方法返回 `Future<T>` 或 `CompletableFuture<T>` 类型。

通过 `@EnableAsync` 和 `@Async` 的配合，可以很方便地实现方法的异步执行，适用于处理耗时操作而不阻塞主线程的场景。