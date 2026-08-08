---
title: "Spring在进行注入的时候会先调用构造器再进行依赖注入"
date: 2025-07-01 22:33:29
updated: 2025-07-01 22:33:29
categories:
  - 笔记
---

# Spring在进行注入的时候会先调用构造器再进行依赖注入

从代码和之前的异常信息来看，问题的根本原因在于 `fileChatBasedMemory` 在构造器中被使用时为 `null`。这是因为 Spring 在调用构造器时，尚未完成依赖注入。以下是具体的分析和解决方法：

### 问题分析
1. **构造器中直接使用依赖**：
   在 `LoveApp` 的构造器中，直接调用了 `fileChatBasedMemory.setBaseDir(baseDir)`。然而，此时 `fileChatBasedMemory` 还没有被 Spring 完全注入，因此为 `null`，导致了 `NullPointerException`。

2. **依赖注入时机**：
   !!!!!!!!!**<span style="color: red">Spring 在创建 Bean 时，会先调用构造器，然后才进行依赖注入。因此，在构造器中直接使用依赖项是不安全的。</span>**

### 解决方法
为了解决这个问题，可以将构造器中的逻辑移到一个初始化方法中，确保依赖注入完成后再执行相关逻辑。Spring 提供了 `@PostConstruct` 注解，用于定义初始化方法。

#### 修改代码
将 `fileChatBasedMemory.setBaseDir(baseDir)` 移到一个 `@PostConstruct` 方法中：

```java
@Component
@Slf4j
public class LoveApp {
    @Resource
    private SimpleVectorStore loveAppVectorStore;
    @Resource
    private Advisor loveAppRagCloudAdvisor;
    /**
     * chatClient 使用实例
     */
    private final ChatClient chatClient;
    @Resource
    private FileChatBasedMemory fileChatBasedMemory;

    private static final String SYSTEM_PROMPT = "你扮演深耕恋爱心理领域的专家。开场向用户表明身份，告知用户可倾诉恋爱难题。" +
            "围绕单身、恋爱、已婚三种状态提问：单身状态询问社交圈拓展及追求心仪对象的困扰；" +
            "恋爱状态询问沟通、习惯差异引发的矛盾；已婚状态询问家庭责任与亲属关系处理的问题。" +
            "引导用户详述事情经过、对方反应及自身想法，以便给出专属解决方案。" +
            "每一次对话你只需要在开头自我简绍，并记住自己的名字";

    public LoveApp(ChatModel dashscopeChatModel) {
        chatClient = ChatClient.builder(dashscopeChatModel)
                .defaultSystem(SYSTEM_PROMPT) //设置系统提示词
                .defaultAdvisors(
                        new MessageChatMemoryAdvisor(fileChatBasedMemory), // 基于文件保存对话
                        new MyLoggerAdviser()
                )
                .build();
    }

    @PostConstruct
    public void init() {
        String baseDir = System.getProperty("user.dir") + "/chat-memory";
        fileChatBasedMemory.setBaseDir(baseDir);
    }

    // 其他方法保持不变
}
```

### 说明
- **`@PostConstruct`**：这个注解用于定义一个初始化方法，该方法在依赖注入完成后执行。这样可以确保在调用 `fileChatBasedMemory.setBaseDir(baseDir)` 时，`fileChatBasedMemory` 已经被正确注入。
- **构造器中的依赖**：在构造器中，`fileChatBasedMemory` 还没有被注入，因此不能直接使用。将相关逻辑移到 `@PostConstruct` 方法中可以避免这个问题。

### 其他注意事项
1. **确保 `FileChatBasedMemory` 是一个 Spring Bean**：
   确保 `FileChatBasedMemory` 类上有 `@Component` 或其他相关的 Spring 注解，以便 Spring 能够管理它。

2. **检查 `ChatModel` 的注入**：
   确保 `ChatModel` 也是一个 Spring 管理的 Bean，否则构造器中的 `dashscopeChatModel` 也可能会为 `null`。

3. **日志和调试**：
   如果问题仍然存在，可以添加更多的日志信息来帮助诊断问题。例如，在构造器和 `@PostConstruct` 方法中添加日志，检查依赖项是否正确注入。

通过上述修改，应该可以解决 `NullPointerException` 的问题，并确保 `LoveApp` 类能够正确初始化和运行。





# Bean注入流程

Spring 注入一个 Bean 的流程是一个复杂的过程，涉及到多个步骤和组件。以下是 Spring 创建和注入一个 Bean 的主要流程：

### 1. **加载配置**
Spring 首先需要加载配置信息，这些配置可以是 XML 文件、注解或 Java 配置类。配置信息告诉 Spring 需要创建哪些 Bean，以及这些 Bean 的依赖关系。

- **XML 配置**：
  ```xml
  <bean id="myBean" class="com.example.MyBean"/>
  ```

- **注解配置**：
  ```java
  @Component
  public class MyBean {
  }
  ```

- **Java 配置**：
  ```java
  @Configuration
  public class AppConfig {
      @Bean
      public MyBean myBean() {
          return new MyBean();
      }
  }
  ```

### 2. **解析配置**
Spring 解析配置信息，生成 Bean 定义（`BeanDefinition`）。每个 `BeanDefinition` 包含了 Bean 的类信息、作用域、依赖关系等。

### 3. **初始化 BeanFactory**
Spring 创建一个 `BeanFactory`，这是一个工厂类，负责管理 Bean 的生命周期和依赖注入。`BeanFactory` 会根据 `BeanDefinition` 创建 Bean。

### 4. **实例化 Bean**
Spring 根据 `BeanDefinition` 中的类信息，通过反射创建 Bean 的实例。如果 Bean 的构造器需要参数，Spring 会尝试通过依赖注入来提供这些参数。

- **无参构造器**：
  ```java
  public class MyBean {
      public MyBean() {
      }
  }
  ```

- **有参构造器**：
  ```java
  public class MyBean {
      private Dependency dependency;
  
      public MyBean(Dependency dependency) {
          this.dependency = dependency;
      }
  }
  ```

### 5. **依赖注入**
Spring 通过依赖注入（DI）将依赖项注入到 Bean 中。依赖注入可以通过构造器注入、字段注入或 setter 方法注入。

- **构造器注入**：
  ```java
  @Autowired
  public MyBean(Dependency dependency) {
      this.dependency = dependency;
  }
  ```

- **字段注入**：
  ```java
  @Autowired
  private Dependency dependency;
  ```

- **Setter 方法注入**：
  ```java
  @Autowired
  public void setDependency(Dependency dependency) {
      this.dependency = dependency;
  }
  ```

### 6. **初始化后处理**
Spring 调用 Bean 的初始化方法。如果 Bean 实现了 `InitializingBean` 接口或定义了 `@PostConstruct` 注解的方法，Spring 会调用这些方法。

- **`InitializingBean` 接口**：
  ```java
  public class MyBean implements InitializingBean {
      @Override
      public void afterPropertiesSet() throws Exception {
          // 初始化逻辑
      }
  }
  ```

- **`@PostConstruct` 注解**：
  ```java
  @PostConstruct
  public void init() {
      // 初始化逻辑
  }
  ```

### 7. **Bean 后处理器**
Spring 调用 `BeanPostProcessor` 的 `postProcessBeforeInitialization` 和 `postProcessAfterInitialization` 方法。这些方法可以对 Bean 进行进一步的处理。

- **`BeanPostProcessor`**：
  ```java
  @Component
  public class MyBeanPostProcessor implements BeanPostProcessor {
      @Override
      public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
          // 在初始化之前处理
          return bean;
      }
  
      @Override
      public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
          // 在初始化之后处理
          return bean;
      }
  }
  ```

### 8. **Bean 准备就绪**
Bean 完全初始化后，Spring 将其放入 Bean 容器中，供其他 Bean 使用。

### 9. **销毁 Bean**
当 Spring 容器关闭时，Spring 会调用 Bean 的销毁方法。如果 Bean 实现了 `DisposableBean` 接口或定义了 `@PreDestroy` 注解的方法，Spring 会调用这些方法。

- **`DisposableBean` 接口**：
  ```java
  public class MyBean implements DisposableBean {
      @Override
      public void destroy() throws Exception {
          // 销毁逻辑
      }
  }
  ```

- **`@PreDestroy` 注解**：
  ```java
  @PreDestroy
  public void destroy() {
      // 销毁逻辑
  }
  ```

### 总结
Spring 创建和注入一个 Bean 的流程包括加载配置、解析配置、初始化 `BeanFactory`、实例化 Bean、依赖注入、初始化后处理、Bean 后处理器处理、Bean 准备就绪和销毁 Bean。这个过程确保了 Bean 的生命周期被正确管理，并且依赖关系被正确注入。