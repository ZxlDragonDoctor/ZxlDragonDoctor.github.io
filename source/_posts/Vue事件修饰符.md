---
title: "Vue事件修饰符"
date: 2025-09-18 16:35:55
updated: 2025-09-18 16:35:55
categories:
  - 学习总结
---

## Vue事件修饰符

在 Vue 中，事件修饰符用于便捷处理事件行为，除了 `.stop` 之外，常用的还有以下这些，我将包含 `.stop` 一起整理：


### 1. `.stop`  
**作用**：阻止事件冒泡（事件不会向父元素传播）。  
**场景**：嵌套元素中，避免子元素事件触发父元素同名事件。  

```html
<div @click="parentClick">
  <!-- 点击按钮只会触发 childClick，不会触发 parentClick -->
  <button @click.stop="childClick">点击</button>
</div>
```


### 2. `.prevent`  
**作用**：阻止事件的默认行为（如表单提交刷新页面、链接跳转）。  
**场景**：需要自定义处理逻辑，替代浏览器默认行为。  

```html
<!-- 阻止表单默认提交（不刷新页面） -->
<form @submit.prevent="handleSubmit">
  <button type="submit">提交</button>
</form>

<!-- 阻止链接跳转 -->
<a href="https://example.com" @click.prevent="handleClick">点击不跳转</a>
```


### 3. `.capture`  
**作用**：启用事件捕获模式（事件从父元素向子元素传播，而非默认的冒泡模式）。  
**场景**：需要优先处理父元素事件时。  

```html
<div @click.capture="parentClick">
  <!-- 点击按钮时，先触发 parentClick，再触发 childClick -->
  <button @click="childClick">点击</button>
</div>
```


### 4. `.self`  
**作用**：事件仅在**直接触发于当前元素本身**时才执行（忽略冒泡/捕获的事件）。  
**场景**：避免父元素响应子元素传递的事件。  

```html
<div @click.self="parentClick">
  <!-- 点击按钮时，事件冒泡到 div，但 div 的事件不会触发（事件源是按钮） -->
  <button @click="childClick">点击</button>
</div>
```


### 5. `.once`  
**作用**：事件仅触发一次，触发后自动解绑。  
**场景**：限制操作次数（如提交按钮防重复点击）。  

```html
<button @click.once="submitForm">提交（仅一次）</button>
```


### 6. `.passive`  
**作用**：告知浏览器不会阻止事件默认行为，优化滚动/触摸事件性能。  
**场景**：`scroll`、`touchmove` 等高频事件，避免卡顿。  

```html
<!-- 优化移动端滚动性能 -->
<div @scroll.passive="onScroll">长列表内容</div>
```


### 7. 键盘事件修饰符  
针对 `@keyup`、`@keydown` 等键盘事件，指定特定按键触发：  
- `.enter`：回车键  
- `.tab`：Tab 键  
- `.delete`：删除键（含 Backspace）  
- `.esc`：Esc 键  
- `.up`/`.down`/`.left`/`.right`：方向键  

```html
<!-- 按下回车键触发搜索 -->
<input @keyup.enter="search">

<!-- 按下 Esc 键清空输入 -->
<input @keyup.esc="clearInput">
```


### 8. 鼠标按钮修饰符  
针对鼠标事件，指定按键触发：  
- `.left`：左键  
- `.right`：右键  
- `.middle`：中键（滚轮）  

```html
<!-- 右键点击显示菜单 -->
<div @click.right="showMenu">右键点击我</div>
```


### 修饰符组合使用  
多个修饰符可组合（顺序可能影响效果）：  
```html
<!-- 阻止冒泡 + 阻止默认行为 -->
<a @click.stop.prevent="handleClick" href="...">点击</a>

<!-- 捕获模式 + 仅自身触发 -->
<div @click.capture.self="handle">...</div>
```


这些修饰符能大幅简化事件处理代码，避免在方法中手动调用 `event.stopPropagation()` 等原生 API，让逻辑更清晰。