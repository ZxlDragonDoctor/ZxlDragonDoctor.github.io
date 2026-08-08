---
title: "java中的四种函数式接口"
date: 2025-09-28 20:00:21
updated: 2025-09-28 20:00:21
categories:
  - 学习总结
---

## java中的四种函数式接口

在 Java 中，函数式接口（Functional Interface）是指**只包含一个抽象方法**的接口，通常用于 Lambda 表达式或方法引用。Java 8 引入了 `java.util.function` 包，其中定义了四种最常用的函数式接口，分别是：

| 接口名             | 抽象方法            | 输入类型 | 输出类型 | 用途说明                           |
| ------------------ | ------------------- | -------- | -------- | ---------------------------------- |
| **Consumer<T>**    | `void accept(T t)`  | T        | void     | 接收一个参数，执行操作，无返回     |
| **Supplier<T>**    | `T get()`           | 无       | T        | 不接收参数，返回一个值             |
| **Function<T, R>** | `R apply(T t)`      | T        | R        | 接收一个参数，返回一个结果         |
| **Predicate<T>**   | `boolean test(T t)` | T        | boolean  | 接收一个参数，返回布尔值，用于判断 |

---

### ✅ 示例代码

```java
import java.util.function.*;

public class FunctionalDemo {
    public static void main(String[] args) {
        // Consumer 示例
        Consumer<String> printer = s -> System.out.println("打印: " + s);
        printer.accept("Hello");

        // Supplier 示例
        Supplier<Double> randomSupplier = () -> Math.random();
        System.out.println("随机数: " + randomSupplier.get());

        // Function 示例
        Function<Integer, String> intToString = i -> "数字是: " + i;
        System.out.println(intToString.apply(42));

        // Predicate 示例
        Predicate<Integer> isEven = n -> n % 2 == 0;
        System.out.println("是偶数吗？ " + isEven.test(10));
    }
}
```

---

### 🔍 小结口诀（记忆用）：
- **Consumer** 消费不产出（有进无出）  
- **Supplier** 供应不摄入（无进有出）  
- **Function** 转化有进出（有进有出）  
- **Predicate** 判断真假（有进有布尔）
