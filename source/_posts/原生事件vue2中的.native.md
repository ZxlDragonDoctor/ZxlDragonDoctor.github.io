---
title: "原生事件vue2中的.native"
date: 2025-10-10 15:54:28
updated: 2025-10-10 15:54:28
categories:
  - 学习总结
---

## 原生事件vue2中的.native

“原生事件”就是 **DOM 本身自带、浏览器直接派发** 的那种最底层事件，  
与 **Vue 自定义事件**（`$emit('my-event')`）相对。

------------------------------------------------
一、两种事件对比（代码一眼看懂）

```html
<!-- 1. 原生事件：浏览器说了算 -->
<button onclick="console.log('浏览器直接点我')">原生 button</button>

<!-- 2. Vue 自定义事件：组件自己说了算 -->
<my-button @my-click="handleCustom">组件内部会 $emit('my-click')</my-button>
```

------------------------------------------------
二、原生事件长什么样？

| 元素       | 原生事件名          | 由谁触发         |
| ---------- | ------------------- | ---------------- |
| `button`   | `click`             | 用户点击         |
| `input`    | `input` / `change`  | 用户输入         |
| `form`     | `submit`            | 用户回车或点提交 |
| `window`   | `resize` / `scroll` | 浏览器窗口       |
| `document` | `DOMContentLoaded`  | 浏览器解析完 DOM |

这些事件 **不需要 Vue 干预**，浏览器自动派发，可直接 `addEventListener`。

------------------------------------------------
三、为什么组件需要 `.native`？

Vue 把 **自定义组件** 当成 **“黑盒”**，默认只会监听 **“它显式 $emit 出来的事件”**。  
如果你写了：

```html
<my-component @click="doTheThing"></my-component>
```

Vue 会理解为：  
“等 my-component 内部执行 `this.$emit('click')` 再回调”——**不是监听根节点原生的点击**。

而加上 `.native` 就是告诉 Vue：

> “别等它 $emit，直接把 click 事件绑到组件 **根元素** 上，像普通 DOM 一样监听浏览器原生 click。”

```html
<my-component @click.native="doTheThing"></my-component>
```

------------------------------------------------
四、一个例子

```js
// MyButton.vue
<template>
  <button class="btn">点我</button>
</template>
```

使用：

```html
<my-button @click.native="handle"></my-button>
```

- 用户点击 **button** → 浏览器派发 **原生 click** → Vue 自动触发 `handle`。  
- 如果去掉 `.native`，`handle` 永远不会执行，因为 **组件内部没有** `$emit('click')`。

------------------------------------------------
五、Vue3 的变化（重要）

`.native` 在 **Vue3 已被移除**！  
Vue3 默认会把 **所有未声明的事件** 直接绑到根节点，无需 `.native`。  
如果不想让事件透传，用 `inheritAttrs: false` 即可。

------------------------------------------------
一句话总结

> **原生事件**就是浏览器自己派发、**不需要 Vue $emit** 的底层 DOM 事件；  
> 在 Vue2 自定义组件上想直接监听这种底层事件，就得加 `.native` 修饰符；  
> Vue3 已废弃该修饰符，事件会自动透传到根节点。