---
title: "Arrays.sort()"
date: 2025-04-03 01:46:52
updated: 2025-04-03 01:46:52
categories:
  - Java面试
---

#**各种lambda表达式的应用场景**

# Arrays.sort()

你提到的这行代码：

```java
Arrays.sort(intervals, (a, b) -> a[0] - b[0]); //记住
```

是正确的，它用于对二维数组 `intervals` 按照每个区间的起始位置（`a[0]` 和 `b[0]`）进行升序排序。这种写法是基于 Java 的 `Arrays.sort` 方法，结合 Lambda 表达式实现自定义排序逻辑。

### 关于这行代码的说明
1. **`Arrays.sort` 方法**：
   - `Arrays.sort` 是 Java 中用于对数组进行排序的方法。
   - 它可以接受一个自定义的比较器（Comparator），用于定义排序规则。

2. **Lambda 表达式 `(a, b) -> a[0] - b[0]`**：
   - 这是一个比较器，用于比较两个区间 `a` 和 `b` 的起始位置。
   - `a[0] - b[0]` 的结果决定了排序顺序：
     - 如果结果为负数，`a` 排在 `b` 前面。
     - 如果结果为正数，`b` 排在 `a` 前面。
     - 如果结果为零，表示 `a` 和 `b` 的起始位置相同。

3. **排序规则**：
   - 这行代码将 `intervals` 按照每个区间的起始位置进行升序排序。
   - 例如，对于输入 `[[1, 3], [2, 6], [8, 10], [15, 18]]`，排序后仍然是 `[[1, 3], [2, 6], [8, 10], [15, 18]]`，因为它们已经按起始位置排序。

### 注意事项
1. **整数溢出问题**：
   - 如果 `a[0]` 和 `b[0]` 的值非常大，`a[0] - b[0]` 可能会导致整数溢出。
   - 为了避免这个问题，可以使用 `Integer.compare(a[0], b[0])`，这是一个更安全的比较方式：
     ```java
     Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
     ```

2. **排序的必要性**：
   - 在区间合并问题中，排序是必要的，因为合并操作依赖于区间的顺序。
   - 排序后，可以方便地判断两个相邻区间是否重叠，并进行合并。

### 完整的区间合并代码
结合排序逻辑，以下是完整的区间合并代码：

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length <= 1) {
            return intervals;
        }

        // 按照区间的起始位置排序（安全的比较方式）
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int[] currentInterval = intervals[0]; // 当前处理的区间
        merged.add(currentInterval);

        for (int[] interval : intervals) {
            int currentEnd = currentInterval[1];
            int nextStart = interval[0];
            int nextEnd = interval[1];

            if (currentEnd >= nextStart) { // 有重叠
                currentInterval[1] = Math.max(currentEnd, nextEnd); // 合并区间
            } else { // 没有重叠
                currentInterval = interval; // 更新当前区间
                merged.add(currentInterval);
            }
        }

        return merged.toArray(new int[merged.size()][]);
    }
}
```





## Arrays.sort()对Double类型的数组排序

三种排序方式

```java
// 使用 Double.compare 进行倒序排序
Arrays.sort(arr, new Comparator<Double>() {
        @Override
        public int compare(Double o1, Double o2) {
                // 使用 Double.compare 方法避免浮点数精度问题
                return Double.compare(o2, o1); //倒叙
        }
});
Arrays.sort(arr, (o1, o2) -> Double.compare(o2, o1)); //倒叙
Arrays.sort(arr, Double::compare);  //正序，使用的Lambda表达式
```









#Collections.sort(l.stream().distinct().toList());

```java
Collections.sort(l.stream().distinct().toList());
```

这里，`l.stream().distinct().toList()` 创建了一个**不可变列表**，而你试图对它调用 `Collections.sort()`，这导致了 `java.lang.UnsupportedOperationException`。

### 问题分析

1. **`toList()` 的特性**：
   - 在 Java 16 及更高版本中，`Stream.toList()` 会返回一个不可变列表（`List.of()` 的类似实现）。对不可变列表进行修改操作（如排序）会抛出异常。
   - 如果你使用的是 Java 16 或更高版本，这就是问题的根源。
2. **`Collections.sort()` 的要求**：
   - `Collections.sort()` 需要一个可变的 `List`，因为它会直接修改列表的内容

### 正确用法

````
List<Integer> l = new ArrayList<>();
List<Integer> sortedList = new ArrayList<>(l.stream().distinct().toList());//对list数组去重加排序
Collections.sort(sortedList);
````









#**注意**`List.of()` 创建的集合是不可修改的

报错

````
java.lang.UnsupportedOperationException
  at line 142, java.base/java.util.ImmutableCollections.uoe
  at line 263, java.base/java.util.ImmutableCollections$AbstractImmutableList.sort
  at line 145, java.base/java.util.Collections.sort
  at line 9, Solution.merge
  at line 56, __DriverSolution__.__helper__
  at line 86, __Driver__.main
````

从你提供的堆栈跟踪信息来看，问题出在尝试对一个不可变集合（Immutable Collection）进行排序操作，这导致了 `java.lang.UnsupportedOperationException` 异常。

以下是问题的详细分析和可能的解决方案：

### 问题分析
1. **异常类型**：`java.lang.UnsupportedOperationException` 是一个运行时异常，通常表示某个操作不被支持。
2. **关键信息**：
   - 异常发生在 `java.util.ImmutableCollections$AbstractImmutableList.sort`，表明你尝试对一个不可变列表调用了 `sort()` 方法。
   - 不可变集合（如 `List.of()` 创建的集合）是不可修改的，因此任何试图修改集合的操作（如排序、添加、删除等）都会抛出此异常。

3. **代码路径**：
   - `Collections.sort` 调用了 `ImmutableCollections$AbstractImmutableList.sort`。
   - 最终问题发生在 `Solution.merge` 方法中。

### 可能的原因
1. **使用了不可变集合**：你可能使用了 `List.of()` 或其他方式创建了一个不可变集合，然后尝试对其进行排序。
2. **错误的集合类型**：你可能误以为这个集合是可以修改的，或者在代码中不小心传递了不可变集合。

### 解决方案
#### 方法 1：转换为可变集合
在对集合进行排序之前，将其转换为可变集合（如 `ArrayList`）。例如：
```java
List<Integer> immutableList = List.of(3, 1, 2); // 不可变集合
List<Integer> mutableList = new ArrayList<>(immutableList); // 转换为可变集合
Collections.sort(mutableList); // 现在可以排序了
```

#### 方法 2：使用其他方式创建可变集合
如果你需要一个可变集合，可以直接使用 `ArrayList` 或其他可变集合类型：
```java
List<Integer> mutableList = new ArrayList<>(Arrays.asList(3, 1, 2));
Collections.sort(mutableList);
```

#### 方法 3：检查代码逻辑
检查 `Solution.merge` 方法中是否有错误地传递了不可变集合。如果确实需要传递可变集合，确保在创建集合时使用可变集合类型。

##**方法 4：使用 Stream API**(记住)
如果你使用的是 Java 8 或更高版本，可以使用 Stream API 对集合进行排序，而无需直接修改集合：
```java
List<Integer> sortedList = List.of(3, 1, 2).stream()
                                .sorted()
                                .collect(Collectors.toList());
```





# List`<int[]>` 转为二维数组

````
 List<int[]> merged = new ArrayList<>();

merged.toArray(new int[merged.size()][]);  // 指定行数
````









# 小知识点（java二维数组类比“按行优先”）

在 Java 中，二维数组（例如 `int[][]`）本质上是一个**数组的数组**，而不是一个连续的二维矩阵。因此，Java 的二维数组存储方式既不是典型的“按行优先”，也不是“按列优先”，而是基于**数组的数组**的结构。不过，从逻辑上和访问习惯上，我们可以类比为“按行优先”。

### Java 二维数组的结构
1. **数组的数组**：
   - 二维数组 `int[][]` 是一个一维数组，其中的每个元素又是一个一维数组（即“行”）。
   - 例如：
     ```java
     int[][] matrix = {
         {1, 2, 3},  // 第一行
         {4, 5, 6},  // 第二行
         {7, 8, 9}   // 第三行
     };
     ```
   - 在这个例子中，`matrix` 是一个一维数组，包含三个元素，每个元素是一个一维数组（行）。

2. **访问方式**：
   - 通过 `matrix[i][j]` 访问元素时，`i` 表示行索引，`j` 表示列索引。
   - 这种访问方式类似于“按行优先”，因为首先定位到第 `i` 行，然后在该行中访问第 `j` 列的元素。

### Java 二维数组的存储方式
- Java 的二维数组并不是一个连续的内存块，而是由多个独立的一维数组组成。
- 每个“行”数组是独立分配的，它们的内存地址是不连续的。
- 例如：
  ```java
  int[][] matrix = new int[3][3];
  ```
  这会创建一个包含 3 个元素的一维数组，每个元素是一个长度为 3 的一维数组。这些一维数组在内存中是独立分配的。

### 类比“按行优先”
虽然 Java 的二维数组并不是严格意义上的“按行优先”存储（因为内存中是分散的），但从逻辑上和访问习惯上，它更像是“按行优先”：
- **访问顺序**：`matrix[i][j]` 的访问方式更符合“按行优先”的逻辑。
- **遍历习惯**：通常我们会按行遍历二维数组：
  ```java
  for (int i = 0; i < matrix.length; i++) {  // 遍历行
      for (int j = 0; j < matrix[i].length; j++) {  // 遍历列
          System.out.print(matrix[i][j] + " ");
      }
      System.out.println();
  }
  ```

### 总结
- Java 的二维数组本质上是一个**数组的数组**，而不是一个连续的二维矩阵。
- 它的访问方式和遍历习惯类似于“按行优先”，但并不是严格意义上的“按行优先”存储，因为每行是独立分配的。
- 如果需要一个真正的二维矩阵（连续存储），可以使用一维数组来模拟，并通过计算偏移量访问元素（类似于 C/C++ 的二维数组）。







# new Random(System.nanoTime()).nextInt(int bound)

**问题**`new Random().nextInt()` 使用的是没有设置种子的默认构造方法，这会根据当前时间戳等因素初始化 `Random` 实例。对于多次连续调用 `nextInt()`，因为 `Random` 是随机数生成器，默认情况下它的种子不会改变，导致 `nextInt()` 的输出可能会在短时间内返回相同的结果

**方案**`System.nanoTime()` 是一个高精度的时间戳，它基于当前系统的纳秒级时间，通常足够用来保证随机数生成器每次调用时都会使用不同的种子



# 二维数转链表

````java
class Solution {
    //打印杨辉三角
    public List<List<Integer>> generate(int numRows) {
        Integer[][] ans = new Integer[numRows][numRows];
        for(int i=0;i<numRows;i++){
            ans[i][0] = 1;
            ans[i][i] = 1;
            for(int j=1;j<i;j++){
                ans[i][j] = ans[i-1][j-1]+ans[i-1][j];
            }
        }
     return  Arrays.stream(ans)
                        .map(a-> Arrays.asList(a).stream().filter(b->b!=null).toList())
                        .collect(Collectors.toList());
    }
}
````

- 这里filter过滤出不为null的值





#扁平化.flatMap（）

```
Map<String, Long> tagsCountMap = tagsList.stream()
        .flatMap(tags -> JSONUtil.toList(tags, String.class).stream()) //扁平化
        .collect(Collectors.groupingBy(tags -> tags, Collectors.counting()));//分组统计
```

- **`flatMap`**：将每个元素的流合并为一个单一的流，实现扁平化。这样，所有标签都被展平到一个单一的流中。





