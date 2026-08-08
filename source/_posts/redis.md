---
title: "redis"
date: 2025-03-07 00:38:04
updated: 2025-03-07 00:38:04
categories:
  - 笔记

cover: /img_posts/image-20241225222506160.png
---

# redis

![image-20241225222506160](/img_posts/image-20241225222506160.png)

### redis通用命令

![image-20241225222204337](/img_posts/image-20241225222204337.png)

**TTL = -1 代表该key永久有效**

**TTL = -2 代表key已失效**





### String类型

![image-20241225222706026](/img_posts/image-20241225222706026.png)

![image-20241225223043112](/img_posts/image-20241225223043112.png)

**INCREBYFLOAT必须指定步长***



**通用删除命令：del key**



###key的层级结构

![image-20241225223646180](/img_posts/image-20241225223646180.png)

###Hash类型

![image-20241225224044341](/img_posts/image-20241225224044341.png)



![image-20241225224751566](/img_posts/image-20241225224751566.png)

![image-20241225224743174](/img_posts/image-20241225224743174.png)

**HSETNX成功返回1，失败返回0**





### List类型

![image-20241225225020541](/img_posts/image-20241225225020541.png)

![image-20241225225608849](/img_posts/image-20241225225608849.png)

**BLOP可以阻塞队列，设置等待时间，在规定时间等待其他用户插入，并返回拿到值所花的时间**





### Setl类型

![image-20241225230310612](/img_posts/image-20241225230310612.png)

![image-20241225230505586](/img_posts/image-20241225230505586.png)



### SortedSet

![image-20241225231227556](/img_posts/image-20241225231227556.png)

![image-20241225231238289](/img_posts/image-20241225231238289.png)

**排名按照score属性排，下标从零开始**

![image-20241225232036111](/img_posts/image-20241225232036111.png)

###redis客户端

![image-20241225234550341](/img_posts/image-20241225234550341.png)

**Jedis连接池配置**

![image-20241225235725110](/img_posts/image-20241225235725110.png)

![image-20241226000315029](/img_posts/image-20241226000315029.png)

![image-20241226000444813](/img_posts/image-20241226000444813.png)







##重点

![image-20241226000527236](/img_posts/image-20241226000527236.png)

![image-20241226000742215](/img_posts/image-20241226000742215.png)

![image-20241226000818226](/img_posts/image-20241226000818226.png)



###**难点（序列化的方式）**

![image-20241226001236996](/img_posts/image-20241226001236996.png)

**redis是将k-v的字符根据不同编码格式转成字节存在库中**

**springDataRedis默认的序列化类是jdk的序列化，所以redis解析不出来正确的结果**

**指定正确的序列化方式：1.key指定String....序列化方式

​											  2.value指定GenericJacon2Json...方式（object装json）

***RedisTemplate其他源码序列化方式为null***

![image-20241226002617466](/img_posts/image-20241226002617466.png)

![](/img_posts/image-20241226001654649.png)









**节约内存，不使用对象序列化的做法**

![image-20241226003322825](/img_posts/image-20241226003322825.png)

![image-20241226003335934](/img_posts/image-20241226003335934.png)

![image-20241226003440593](/img_posts/image-20241226003440593.png)

![image-20241226003532154](/img_posts/image-20241226003532154.png)

![image-20241226003732632](/img_posts/image-20241226003732632.png)





**方法与redis命令不一致(自己摸索)**

![image-20241226003744493](/img_posts/image-20241226003744493.png)





问题：缓存雪崩，缓存击穿，缓存穿透
