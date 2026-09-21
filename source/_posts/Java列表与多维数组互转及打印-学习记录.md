---
title: Java列表与多维数组互转及打印-学习记录
date: 2026-09-22 17:45:00
comments: true
tags:
  - Java
  - 数组
  - List
  - 学习笔记
categories:
  - 学习总结
---

# Java 列表与多维数组互转及打印 · 学习记录

| 项目 | 内容 |
|------|------|
| 主题 | List ↔ 二维/多维数组 转换与打印 |
| 语言 | Java（JDK 8+） |
| 记录日期 | 2026-09-22 |
| 类型 | 个人学习笔记 / 速查手册 |

---

## 一、学习目标

整理 Java 中 List 与二维/多维数组之间的常见转换写法，并总结调试时的打印技巧，形成一份可反复查阅的学习记录。学完后应能独立完成：

- 将 `List<List<T>>` / `List<T[]>` 转为 `T[][]` 或更高维数组
- 将二维、多维数组还原为 List（含可变/不可变差异）
- 将一维 List 按固定列宽 reshape 成二维数组
- 正确打印二维/多维数组与嵌套 List，避免只输出对象地址

## 二、前置概念

Java 中「列表」通常指 `java.util.List`（`ArrayList`、`LinkedList`、`Arrays.asList` 结果等）；「二维数组」是 `T[][]`（数组的数组）；「多维数组」泛指 `T[][][]` 及更高维。

二者底层模型不同：List 可动态增删，数组长度固定；数组的每一维可以长度不同（锯齿数组）。

### 常见数据形态

| 形态 | 示例类型 | 说明 |
|------|----------|------|
| 一维 List | `List<String>` | 线性序列 |
| 嵌套 List | `List<List<String>>` | 语义上的二维矩阵 |
| List 包数组 | `List<int[]>` | 行是基本类型数组 |
| 二维数组 | `String[][]` / `int[][]` | 数组的数组 |
| 多维数组 | `Integer[][][]` | 三维及以上 |

---

## 三、List → 二维 / 多维数组

### 3.1 `List<List<T>>` → `T[][]`

手动遍历：每行调用 `toArray` 转成一维数组，再赋给外层数组对应位置。

```java
import java.util.*;

List<List<String>> list = Arrays.asList(
    Arrays.asList("a", "b", "c"),
    Arrays.asList("d", "e", "f")
);

String[][] arr = new String[list.size()][];
for (int i = 0; i < list.size(); i++) {
    arr[i] = list.get(i).toArray(new String[0]);
}
```

Stream 写法：内层 `map` 成 `String[]`，外层再 `toArray` 成 `String[][]`。

```java
String[][] arr2 = list.stream()
    .map(row -> row.toArray(new String[0]))
    .toArray(String[][]::new);
```

### 3.2 `List<int[]>` → `int[][]`

当 List 元素本身已是数组时，可直接 `toArray`，无需逐行转换。

```java
List<int[]> list = Arrays.asList(
    new int[]{1, 2, 3},
    new int[]{4, 5, 6}
);

int[][] arr = list.toArray(new int[0][]);
// 或
int[][] arr2 = list.stream().toArray(int[][]::new);
```

### 3.3 一维 List → 二维数组（固定列宽 reshape）

将扁平 List 按 `cols` 列排成矩阵。行数 = `ceil(n / cols)`，不足列补默认值（`int` 为 0）。

```java
List<Integer> flat = Arrays.asList(1, 2, 3, 4, 5, 6);
int cols = 3;
int rows = (flat.size() + cols - 1) / cols;

int[][] arr = new int[rows][cols];
for (int i = 0; i < flat.size(); i++) {
    arr[i / cols][i % cols] = flat.get(i);
}
// 结果: [[1,2,3],[4,5,6,0]]
```

### 3.4 List → 三维及以上数组

多层嵌套逻辑与二维相同，逐层 `new` 出对应维的数组并 `toArray`。

```java
List<List<List<Integer>>> list3d = ...;

Integer[][][] arr = new Integer[list3d.size()][][];
for (int i = 0; i < list3d.size(); i++) {
    List<List<Integer>> plane = list3d.get(i);
    arr[i] = new Integer[plane.size()][];
    for (int j = 0; j < plane.size(); j++) {
        arr[i][j] = plane.get(j).toArray(new Integer[0]);
    }
}
```

对应的 Stream 写法：

```java
Integer[][][] arr = list3d.stream()
    .map(plane -> plane.stream()
        .map(row -> row.toArray(new Integer[0]))
        .toArray(Integer[][]::new))
    .toArray(Integer[][][]::new);
```

---

## 四、二维 / 多维数组 → List

### 4.1 `T[][]` → `List<List<T>>`

Stream 方式简洁，但 `Arrays.asList` 返回的是固定大小视图，不能 `add`/`remove`。若需要可变 List，用 `new ArrayList<>(...)` 再收集。

```java
import java.util.stream.Collectors;

String[][] arr = {
    {"a", "b", "c"},
    {"d", "e", "f"}
};

// Stream → 固定大小的 List 视图
List<List<String>> list = Arrays.stream(arr)
    .map(Arrays::asList)
    .collect(Collectors.toList());

// 可变 List
List<List<String>> list2 = new ArrayList<>();
for (String[] row : arr) {
    list2.add(new ArrayList<>(Arrays.asList(row)));
}
```

### 4.2 `int[][]` → `List<int[]>` 或 `List<List<Integer>>`

```java
int[][] arr = {{1, 2}, {3, 4}};

// 保留 int[] 元素
List<int[]> listOfArrays = Arrays.asList(arr);

// 装箱为 List<List<Integer>>
List<List<Integer>> listOfLists = Arrays.stream(arr)
    .map(row -> Arrays.stream(row).boxed().collect(Collectors.toList()))
    .collect(Collectors.toList());
```

### 4.3 三维数组 → List

```java
Integer[][][] arr3d = ...;

List<List<List<Integer>>> list3d = Arrays.stream(arr3d)
    .map(plane -> Arrays.stream(plane)
        .map(row -> Arrays.stream(row).collect(Collectors.toList()))
        .collect(Collectors.toList()))
    .collect(Collectors.toList());
```

### 4.4 拉平成一维 List（可选）

二维数组 `flatMap` 后可得到一维 List，常用于求和、排序、拼接。

```java
List<Integer> flat = Arrays.stream(arr)
    .flatMap(Arrays::stream)
    .collect(Collectors.toList());
```

---

## 五、打印方法

调试时最常踩的坑：用 `System.out.println(arr)` 直接打印数组，只会输出类型与哈希地址（如 `[[Ljava.lang.String;@1a2b3c]`）。必须使用 `Arrays` 工具类或逐行遍历。

### 5.1 打印二维数组

```java
// 1) 推荐：deepToString，嵌套结构也能完整展开
System.out.println(Arrays.deepToString(arr));

// 2) 逐行打印（表格观感更好）
for (int[] row : arr) {
    System.out.println(Arrays.toString(row));
}

// 3) fori 精确控制分隔符
for (int i = 0; i < arr.length; i++) {
    for (int j = 0; j < arr[i].length; j++) {
        System.out.print(arr[i][j] + (j < arr[i].length - 1 ? ", " : ""));
    }
    System.out.println();
}

// 4) Java 8+ Stream
Arrays.stream(arr)
    .map(Arrays::toString)
    .forEach(System.out::println);
```

### 5.2 打印多维数组

三维及以上只能用 `deepToString`；`toString` 只会打印外层引用地址。

```java
System.out.println(Arrays.deepToString(arr3d));
// 形如: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
```

### 5.3 打印 List / `List<List<T>>`

```java
List<List<String>> list = ...;

// List 已重写 toString
System.out.println(list);   // [[a, b, c], [d, e, f]]

for (List<String> row : list) {
    System.out.println(row);
}

list.forEach(System.out::println);
```

### 5.4 可复用打印工具

```java
static <T> void printMatrix(T[][] matrix) {
    for (T[] row : matrix) {
        System.out.println(Arrays.toString(row));
    }
}

static void printMatrix(int[][] matrix) {
    for (int[] row : matrix) {
        System.out.println(Arrays.toString(row));
    }
}

static <T> void printNested(List<? extends List<T>> nested) {
    nested.forEach(System.out::println);
}
```

---

## 六、常见坑速查

| 坑 | 现象 / 原因 | 正确做法 |
|----|-------------|----------|
| `Arrays.toString` 打多维 | 外层打印，内层变成 `[I@hash` 地址 | 多维一律用 `deepToString` |
| `Arrays.asList` 不可变 | 调用 `add`/`remove` 抛 `UnsupportedOperationException` | `new ArrayList<>(Arrays.asList(...))` 或 `Collectors.toList()` |
| 基本类型装箱 | `int[][]` 无法直接变成 `List<List<Integer>>` | `Arrays.stream(row).boxed().collect(...)` |
| 锯齿数组 | 每行列数可以不同 | `new String[n][]` 先不指定第二维，再逐行分配 |
| Stream 生成二维 | `toArray(String[][]::new)` 前行必须已是 `String[]` | 内层先 map 成一维数组，外层再 `toArray` |
| 直接 `println` 数组 | 输出对象地址，无法看到内容 | `Arrays.toString` / `deepToString` 或逐行遍历 |

---

## 七、转换速查表

| 源类型 | 目标类型 | 推荐写法 |
|--------|----------|----------|
| `List<List<T>>` | `T[][]` | `list.stream().map(r -> r.toArray(new T[0])).toArray(T[][]::new)` |
| `List<int[]>` | `int[][]` | `list.toArray(new int[0][])` |
| `List<Integer>`（一维） | `int[][]`（固定列） | 循环：`arr[i/cols][i%cols] = flat.get(i)` |
| `T[][]` | `List<List<T>>` | `Arrays.stream(arr).map(Arrays::asList).collect(toList())` |
| `int[][]` | `List<List<Integer>>` | `stream + boxed() + collect(toList())` |
| 任意多维数组 | （打印） | `Arrays.deepToString(arr)` |

---

## 八、学习小结

- **List → 数组**：外层确定维数 `new` 出骨架，内层用 `toArray`（或 Stream `map` + `toArray`）。
- **数组 → List**：Stream + `Arrays.asList` / `Collectors`；注意基本类型需要 `boxed`。
- **多维打印**：`toString` 只适合一维，多维必须 `deepToString`。
- **可变性**：`Arrays.asList` / stream collect 默认视图不可变，要增删请包一层 `ArrayList`。
- **锯齿数组是合法的**，转 List 时每行长度可以不同，不必强行补齐。

---

## 九、自测清单

1. 能否不查资料写出 `List<List<String>>` → `String[][]` 的两种写法？
2. 能否解释为什么 `Arrays.toString(int[][])` 看不到内层内容？
3. `Arrays.asList` 的结果调用 `add` 会发生什么？如何改成可变 List？
4. `int[][]` 转 `List<List<Integer>>` 时为什么要 `.boxed()`？
5. 如何把长度 7 的 `List<Integer>` 按 3 列转成二维数组？

> 记录原则：先抄可运行代码，再改数据类型复现；每学一个转换，务必用 `deepToString` 验证输出。

— 学习记录结束 —
