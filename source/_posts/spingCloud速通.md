---
title: "spingCloud速通"
date: 2025-03-17 21:35:30
updated: 2025-03-17 21:35:30
categories:
  - 笔记

cover: /img_posts/image-20250313002602436.png
---

# spingCloud速通

## Nacos

### 服务注册

面试问题：

![image-20250313002602436](/img_posts/image-20250313002602436.png)



答案：

![image-20250313002721421](/img_posts/image-20250313002721421.png)





## 注册中心

![image-20250313003427571](/img_posts/image-20250313003427571.png)



注意：

-  记得在使用nacos配置的类上加上**@RefreshScope** 实时刷新配置，而不用重新打包项目
- 如果某个服务导入了nacos-config依赖，但没指定配置数据集，请在配置文件中配置**spring.cloud.nacos.config.import-check.enabled=false**

![image-20250313005038514](/img_posts/image-20250313005038514.png)



注意：

- ```
  @Component
  @ConfigurationProperties(prefix = "order")  //配置批量绑定在nacos下,可以无需配置@RefrehScope就能自动刷新
  ```





## 监听配置

```
/**
 * 项目运行时，自启动，监督配置变化
 * @param nacosConfigManager
 * @return
 */
@Bean
ApplicationRunner applicationRunner(NacosConfigManager nacosConfigManager){
    return args -> {
        ConfigService configService = nacosConfigManager.getConfigService();
        configService.addListener("server-order.properties", "DEFAULT_GROUP", new Listener() {
            /**
             * 配置线程池
             * @return
             */
            @Override
            public Executor getExecutor() {
               return Executors.newFixedThreadPool(4);
            }

            /**
             * 获取变化后的配置信息
             * @param configInfo
             */
            @Override
            public void receiveConfigInfo(String configInfo) {
                System.out.println("变化配置信息是："+configInfo);
                System.out.println("邮件发送=====");
            }
        });
    };
}
```



面试问题

![image-20250317200832450](/img_posts/image-20250317200832450.png)

![image-20250317200850963](/img_posts/image-20250317200850963.png)

- 即nacos外部配置优先





## 数据隔离

![image-20250317201301533](/img_posts/image-20250317201301533.png)

​	![image-20250317201425205](/img_posts/image-20250317201425205.png)

**实际例子（springboot配置applcation.yml）**

```yml
server:
  port: 8000
spring:
  profiles:
    active: prod
  application:
    name: server-order
  cloud:
    nacos:
      server-addr: 127.0.0.1:8848
      config:
        namespace: ${spring.profiles.active:public}
        import-check:
          enabled: false  #禁用默认导入

---
spring:
  config:
    import:
      - nacos:common.properties?group=order
      - nacos:databases.properties?group=order
    activate:
      on-profile: dev
---
spring:
  config:
    import:
      - nacos:common.properties?group=order
      - nacos:databases.properties?group=order
    activate:
      on-profile: test
---
spring:
  config:
    import:
      - nacos:common.properties?group=order
      - nacos:databases.properties?group=order
      - nacos:druid.properties?group=order
    activate:
      on-profile: prod
```

**Nacos总结**

![image-20250317213503748](/img_posts/image-20250317213503748.png)
