---
title: "var，let,  const的区别"
date: 2025-09-17 20:53:18
updated: 2025-09-17 20:53:18
categories:
  - 学习总结
---

## var，let,  const的区别





在 JavaScript 中，`var`、`let`、`const` 都是用于声明变量的关键字，但它们在**作用域、变量提升、可修改性**等方面有显著区别，以下是详细对比：


### 1. 作用域（Scope）
- **`var`**：  
  仅支持**函数作用域**（function scope），在函数外声明的 `var` 变量是全局变量，在代码块（如 `if`、`for` 循环的 `{}`）中声明的 `var` 变量会“穿透”代码块，在外部仍可访问。  
  ```javascript
  if (true) {
    var a = 10;
  }
  console.log(a); // 10（变量穿透了 if 代码块）
  ```

- **`let` 和 `const`**：  
  支持**块级作用域**（block scope），变量仅在声明它的代码块（`{}`）内有效，外部无法访问。  
  ```javascript
  if (true) {
    let b = 20;
    const c = 30;
  }
  console.log(b); // 报错：b is not defined
  console.log(c); // 报错：c is not defined
  ```


### 2. 变量提升（Hoisting）
- **`var`**：  
  会发生**变量提升**，即变量声明会被提升到当前作用域的顶部，但赋值不会提升。  
  ```javascript
  console.log(x); // undefined（声明被提升，赋值未提升）
  var x = 5;
  ```

- **`let` 和 `const`**：  
  存在**暂时性死区（Temporal Dead Zone, TDZ）**，变量声明不会被提升，在声明前访问会直接报错。  
  ```javascript
  console.log(y); // 报错：Cannot access 'y' before initialization
  let y = 10;
  
  console.log(z); // 报错：Cannot access 'z' before initialization
  const z = 15;
  ```


### 3. 可修改性（Mutability）
- **`var` 和 `let`**：  
  声明的是**可重新赋值的变量**，可以多次修改其值。  
  ```javascript
  var a = 1;
  a = 2; // 允许
  
  let b = 3;
  b = 4; // 允许
  ```

- **`const`**：  
  声明的是**常量**，**必须在声明时赋值**，且赋值后**不能重新赋值**（但如果是对象/数组，其内部属性可以修改）。  
  ```javascript
  const c = 5;
  c = 6; // 报错：Assignment to constant variable
  
  // 特殊情况：对象/数组的内部修改允许
  const obj = { name: '张三' };
  obj.name = '李四'; // 允许（仅禁止重新赋值整个对象）
  ```


### 4. 重复声明（Duplicate Declaration）
- **`var`**：  
  允许在同一作用域内**重复声明同一变量**，后声明的会覆盖前面的。  
  ```javascript
  var a = 10;
  var a = 20; // 允许，a 最终为 20
  ```

- **`let` 和 `const`**：  
  不允许在同一作用域内**重复声明同一变量**（包括与 `var` 声明的变量重名）。  
  ```javascript
  let b = 30;
  let b = 40; // 报错：Identifier 'b' has already been declared
  
  var c = 50;
  let c = 60; // 报错：Identifier 'c' has already been declared
  ```


### 总结对比表
| 特性       | `var`                | `let`              | `const`                  |
| ---------- | -------------------- | ------------------ | ------------------------ |
| 作用域     | 函数作用域           | 块级作用域         | 块级作用域               |
| 变量提升   | 有（声明提升）       | 无（有暂时性死区） | 无（有暂时性死区）       |
| 可重新赋值 | 允许                 | 允许               | 不允许（声明时必须赋值） |
| 重复声明   | 允许                 | 不允许             | 不允许                   |
| 适用场景   | （不推荐）旧代码兼容 | 需修改值的变量     | 不修改值的常量、对象等   |


### 最佳实践
- 优先使用 `const`，除非确定变量需要被重新赋值（此时用 `let`）。  
- 避免使用 `var`，因其作用域和提升特性容易导致意外的 bugs（如变量泄露、重复声明覆盖）。  
- 对于对象/数组，即使使用 `const` 声明，也应通过 `Object.freeze()` 冻结内部属性（如需完全不可变）。