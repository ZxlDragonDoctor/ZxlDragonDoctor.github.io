---
title: "java内省机制"
date: 2025-09-25 11:32:46
updated: 2025-09-25 11:32:46
categories:
  - 学习总结
---

## java内省机制

Java 内省机制（Introspection）速览  
=====================================

一、一句话定位  
“只认 getter/setter”的官方属性扫描器——把 JavaBean 变成**属性名⇄读写方法**的映射，无需手写反射。

---

二、基础使用（3 个类 4 行代码）

```java
// 1. 拿到 BeanInfo（缓存全局复用）
BeanInfo info = Introspector.getBeanInfo(User.class, Object.class); // 忽略 Object 的属性

// 2. 遍历属性
for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
    String     name   = pd.getName();          // 属性名
    Method     getter = pd.getReadMethod();    // getXxx()
    Method     setter = pd.getWriteMethod();   // setXxx()
    Class<?>   type   = pd.getPropertyType();  // 属性类型

    if (getter != null) {
        Object value = getter.invoke(user);    // 读
        System.out.println(name + " = " + value);
    }
}
```

依赖包：仅 `java.beans.*`，零第三方。

---

三、核心 API 脑图

```
Introspector.getBeanInfo(Class<?> beanClass, Class<?> stopClass)
    ↓
BeanInfo
    ├─ PropertyDescriptor[]   读写方法对
    ├─ MethodDescriptor[]     普通方法（很少用）
    └─ EventSetDescriptor[]   事件（已过时）
PropertyDescriptor
    ├─ getName()
    ├─ getReadMethod()
    ├─ getWriteMethod()
    └─ getPropertyType()
```

---

四、工作原理（源码级顺口溜）

1. **缓存优先**  
   `Introspector` 内部有全局 `SoftReference` 缓存——同一个 Class 只解析一次，性能高于原生反射。

2. **命名规约硬编码**  
   把 `getXxx/setXxx/isXxx` 按 JavaBean 规范拆出属性名；**不认 public 字段**。

3. **低层还是反射**  
   解析完成后返回的 `Method` 对象就是 `java.lang.reflect.Method`——内省只是“反射的封装 + 缓存 + 规约”。

4. **可插拔：BeanInfo 定制**  
   若类提供 `XXXBeanInfo`（同名包内），`Introspector` 会优先加载它，可隐藏/重命名属性，实现**细粒度控制**。

---

五、常见场景

| 场景                       | 原因                                |
| -------------------------- | ----------------------------------- |
| 早期 JSP EL `${user.name}` | 容器用内省找 `getName()`            |
| GUI 表单绑定（Swing）      | 自动把 JTextField 绑定到 bean 属性  |
| 轻量级 Map↔Bean 转换       | 代码量低，不引入 Spring/Apache 依赖 |
| 写脚手架代码生成器         | 快速拿到所有可写属性                |

---

六、与反射快速对比

| 维度   | 反射              | 内省                       |
| ------ | ----------------- | -------------------------- |
| 入口   | `Class.getMethod` | `Introspector.getBeanInfo` |
| 范围   | 所有成员          | 仅 JavaBean 属性           |
| 缓存   | 无                | 全局软引用缓存             |
| 性能   | 慢                | 快（首次后）               |
| 代码量 | 多                | 少                         |

---

七、小结（背下来）

> 内省 = **官方出品的 JavaBean 扫描器**；  
> 给类→`Introspector`→`PropertyDescriptor`→`getReadMethod / getWriteMethod`；  
> 缓存 + 规约，写工具类时比反射更轻更快。