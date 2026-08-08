---
title: "C#中的ToQueryParam"
date: 2025-09-16 15:57:23
updated: 2025-09-16 15:57:23
categories:
  - 学习总结
---

## C#中的ToQueryParam

```c#
public static Dictionary<string, object> ToQueryParam(this Element self, string qpselector = "[qp]")
{
    Dictionary<string, object> qps = new Dictionary<string, object>();
    self.ForEach(delegate(Element x)
        {
            
            var key = x.Attr("qp");
            if (String.IsNullOrEmpty(key))
                return false;
            if (x.AttrExists("local"))
                return false;

            //默认值不打包
            string defVal = x.Attr("defval");
            if (defVal == null)
            {  
                switch (x.CtrlType())
                {
                    case CtlType.CTL_DATE:
                        defVal = "0000-00-00";
                        break;
                    case CtlType.CTL_TIME:
                        defVal = "00:00:00";
                        break;
                    default:
                        defVal = "";
                        break;
                }
            }

            object val = x.Value;
            string strVal;
            if (val == null)
                strVal = "";
            else if (val is string)
                strVal = (string)val;
            else if (val is bool)
                strVal = (bool)val ? "1" : "0";
            else if (val is int[])
                strVal = string.Join(",", (int[])val);
            else if (val is object[])
                strVal = string.Join(",", (object[])val);
            else
                strVal = Convert.ToString(val);

            if (strVal == defVal && !x.AttrExists("send_qp"))
                return false;

            qps[key] = strVal; 

            return false;
        }, qpselector);

    return qps;
}
```


### 一、方法整体作用与使用场景
先明确几个关键背景，帮助理解代码设计意图：
- **扩展方法**：通过 `this Element self` 定义，意味着任何 `Element` 类型的对象（如搜索表单容器、整个页面）都可以直接调用 `ToQueryParam()`（例：`Q("#search_form").ToQueryParam()`）。
- **`qpselector = "[qp]"`**：默认筛选“带有 `qp` 属性的UI组件”——`qp` 是“Query Parameter”的缩写，在HTML中用于标记“该组件的值需要作为查询参数”（如搜索框 `<edit qp="count_apply_no">`，表示其值对应“申请单号”查询参数）。
- **返回值 `Dictionary<string, object>`**：键是 `qp` 属性的值（如 `count_apply_no`），值是组件的实际输入值（如用户输入的“AP202405001”），可直接传递给数据库查询接口。


### 二、逐段解析代码逻辑
代码按“遍历组件→提取参数名→处理默认值→获取实际值→过滤无效值→添加到字典”的流程执行，每一步都有明确的业务规则：


#### 1. 初始化与遍历组件
```csharp
Dictionary<string, object> qps = new Dictionary<string, object>();
self.ForEach(delegate(Element x)
{
    // 核心逻辑：对每个符合 qpselector 的组件（x）执行操作
}, qpselector);
return qps;
```
- **`self.ForEach(...)`**：遍历当前元素（`self`，如搜索表单容器）下所有符合 `qpselector`（默认 `[qp]`）的子组件（`x`，如带有 `qp` 属性的输入框、下拉框）。
- **委托返回 `false`**：`ForEach` 是框架遍历方法，返回 `false` 表示“继续遍历下一个组件”（若返回 `true` 则终止遍历），这里确保提取所有符合条件的参数。


#### 2. 步骤1：提取参数名（`qp` 属性）并过滤无效组件
```csharp
var key = x.Attr("qp"); // 获取组件的 qp 属性值（如 "count_apply_no"）
if (String.IsNullOrEmpty(key))
    return false; // 无 qp 属性，跳过该组件
if (x.AttrExists("local"))
    return false; // 带有 local 属性的组件，标记为“本地参数”，不参与查询，跳过
```
- **`x.Attr("qp")`**：读取UI组件的 `qp` 属性，作为最终查询参数的“键”（如HTML中 `<edit qp="goods_no">`，`key` 就是 `goods_no`）。
- **`local` 属性过滤**：业务中可能存在“仅前端使用、不传给后端”的参数（如前端分页临时变量），通过 `local` 属性标记，避免误提交。


#### 3. 步骤2：处理“默认值”——决定是否跳过该参数
```csharp
// 1. 先从组件属性中获取自定义默认值（如 <widget qp="status" defval="-1">）
string defVal = x.Attr("defval");

// 2. 若未设置自定义默认值，按组件类型设置框架默认值
if (defVal == null)
{  
    switch (x.CtrlType()) // 获取组件类型（日期、时间、普通输入框等）
    {
        case CtlType.CTL_DATE: // 日期选择器
            defVal = "0000-00-00";
            break;
        case CtlType.CTL_TIME: // 时间选择器
            defVal = "00:00:00";
            break;
        default: // 其他组件（输入框、下拉框等）
            defVal = "";
            break;
    }
}
```
- **核心目的**：判断“用户是否输入了有效值”——若组件值等于默认值，说明用户未修改该参数（如“申请单状态”默认选“全部”，值为 `-1`），后续会跳过该参数，避免传递无效的默认值给后端。
- **示例**：你之前的搜索表单中，状态下拉框 `<widget qp="status" defval="-1">`，若用户未选择状态，`defVal` 就是 `-1`，后续会跳过该参数，后端查询时不筛选状态。


#### 4. 步骤3：获取组件的“实际输入值”并统一格式
```csharp
object val = x.Value; // 获取组件当前值（如用户输入的文本、选择的下拉框值）
string strVal;

// 按值的类型，统一转换为字符串格式（后端查询通常需要字符串参数）
if (val == null)
    strVal = "";
else if (val is string)
    strVal = (string)val; // 字符串直接使用
else if (val is bool)
    strVal = (bool)val ? "1" : "0"; // 布尔值转“1/0”（如复选框选中为1，未选为0）
else if (val is int[])
    strVal = string.Join(",", (int[])val); // 整数数组转“逗号分隔符”（如多选下拉框选中多个ID：1,2,3）
else if (val is object[])
    strVal = string.Join(",", (object[])val); // 其他数组类型同理
else
    strVal = Convert.ToString(val); // 其他类型（如数字）直接转字符串
```
- **关键作用**：统一参数格式——无论组件是日期、多选框还是普通输入框，最终都转为字符串，避免后端处理不同类型参数的麻烦。
- **示例**：多选仓库的下拉框，用户选中ID为 `1` 和 `3` 的仓库，`val` 是 `int[] {1,3}`，转换后 `strVal` 为 `"1,3"`，后端可通过 `IN (1,3)` 筛选仓库。


#### 5. 步骤4：过滤“默认值参数”并添加到字典
```csharp
// 若组件值等于默认值，且无 send_qp 属性，跳过该参数（不添加到字典）
if (strVal == defVal && !x.AttrExists("send_qp"))
    return false;

// 若通过过滤，将参数添加到字典（key是qp属性值，value是处理后的实际值）
qps[key] = strVal; 

return false; // 继续遍历下一个组件
```
- **核心过滤规则**：仅传递“用户修改过的参数”——若用户未修改（值等于默认值），且组件无 `send_qp` 属性，就不添加到字典，减少后端查询的无效参数。
- **`send_qp` 属性例外**：若组件需要“即使是默认值也要传递”（如特殊业务场景），可添加 `send_qp` 属性（如 `<edit qp="keyword" defval="" send_qp>`），强制保留该参数。


### 三、实际使用示例（结合你之前的搜索功能）
以你之前计数申请单的搜索表单为例，HTML结构如下：
```html
<div .flat_bar>
    <!-- 状态下拉框：qp="status"，defval="-1"（默认“全部”） -->
    <widget qp="status" defval="-1">...</widget>
    <!-- 申请单号输入框：qp="count_apply_no"，defval="" -->
    <edit qp="count_apply_no" defval=""></edit>
    <!-- 建单日期：qp="create_begin"，日期类型，默认“0000-00-00” -->
    <widget qp="create_begin" type="date"></widget>
</div>
```

当用户：
1. 未修改“状态”（值为 `-1`，等于 `defval="-1"`）；
2. 输入申请单号“AP202405001”（值不等于 `defval=""`）；
3. 未选择“建单日期”（值为 `0000-00-00`，等于默认值）。

调用 `Q(".flat_bar").ToQueryParam()` 后，返回的字典为：
```csharp
{
    "count_apply_no": "AP202405001" // 仅用户输入的参数被保留
}
```

该字典可直接传递给后端查询接口（如 `count.CountApply.query`），后端仅按“申请单号”筛选数据，符合用户实际搜索意图。


### 四、核心设计亮点
1. **自动化提取**：无需手动逐个获取组件值，通过 `qp` 属性标记即可自动遍历，减少重复代码；
2. **默认值过滤**：仅传递有效参数，减轻后端查询压力，避免“全量默认值”导致的性能问题；
3. **格式统一**：自动处理布尔值、数组等特殊类型，确保后端接收的参数格式一致；
4. **灵活性**：通过 `local`（本地参数不传递）、`send_qp`（强制传递默认值）属性，适配不同业务场景。

