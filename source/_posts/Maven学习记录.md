---
title: "Maven学习记录"
date: 2025-03-10 20:14:00
updated: 2025-03-10 20:14:00
categories:
  - 笔记

cover: /img_posts/image-20241018213900272.png
---

# Maven 学习记录

## maven的作用

**1.依赖管理**

**2.构建项目**

![image-20241018213900272](/img_posts/image-20241018213900272.png)

## maven的安装与配置

**1. 设置本地仓库**

**2.设置jdk版本**

**3.设置国内镜像**    

## maven的GAVP属性

<img src="/img_posts/image-20241018221824814.png" alt="image-20241018221824814" style="zoom:50%;" />

*这里version有默认的值*

### maven创建工程

**手动创建方式**

![image-20241018223117792](/img_posts/image-20241018223117792.png)

**插件创建方式**

使用JBLtojavaweb插件

![image-20241018223356763](/img_posts/image-20241018223356763.png)

## maven项目结构

<img src="/img_posts/image-20241018223926867.png" alt="image-20241018223926867" style="zoom:50%;" />

## pom 依赖管理

![image-20241018230103853](/img_posts/image-20241018230103853.png)

使用方法：*${Jack.version}*



**scope标签**

![image-20241018230253592](/img_posts/image-20241018230253592.png)

## 依赖传递

![image-20241018230709245](/img_posts/image-20241018230709245.png)

## 依赖冲突

<img src="/img_posts/image-20241018231636271.png" alt="image-20241018231636271" style="zoom:50%;" />

**<span style="color:red;"> ！！！只要发生了依赖冲突，后续的依赖传递全部静止</span>**



## 导入依赖的错误场景和解决办法

![image-20241018232613779](/img_posts/image-20241018232613779.png)

![image-20241018232228872](/img_posts/image-20241018232228872.png)



## 构建管理

**命令行方式构建**

![image-20241018233510346](/img_posts/image-20241018233510346.png)



**可视化工具方式构建**

![image-20241019000149605](/img_posts/image-20241019000149605.png)



**要求掌握的三种主动构建场景**

![image-20241019000255764](/img_posts/image-20241019000255764.png)



**周期，命令，插件关系**

<img src="/img_posts/image-20241019001153032.png" alt="image-20241019001153032" style="zoom: 33%;" />

、<img src="/img_posts/image-20241019001302376.png" alt="image-20241019001302376" style="zoom: 50%;" />





**导入插件**

![image-20241019001350068](/img_posts/image-20241019001350068.png)



## 继承关系

![image-20241019003148800](/img_posts/image-20241019003148800.png)

**父工程pom**

<img src="/img_posts/image-20241019003313756.png" alt="image-20241019003313756" style="zoom:50%;" />

**子工程pom**

<img src="/img_posts/image-20241019003041024.png" alt="image-20241019003041024" style="zoom:50%;" />





## 聚合关系

![image-20241019004032148](/img_posts/image-20241019004032148.png)





## maven项目实战

**项目结构**

![image-20241019234533328](/img_posts/image-20241019234533328.png)

**需要导入的依赖**



![image-20241019234635845](/img_posts/image-20241019234635845.png)

**<span style="color:red;">！！注意点：通用模块应install部署到本地仓库再被其他模块引用,后续可以写到父工程的dependenceyManagement中统一管理</span>**

## Maven核心掌握知识总结

![image-20241019235512697](/img_posts/image-20241019235512697.png)
