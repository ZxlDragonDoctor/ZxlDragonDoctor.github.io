---
title: "C#与java不同的地方"
date: 2025-09-02 20:09:39
updated: 2025-09-02 20:09:39
categories:
  - 学习总结

cover: https://i-blog.csdnimg.cn/direct/fc1b3ed43878463f989f94d61eccfc3f.png
---

# C#与java不同的地方

#### ref参数

迫使值参数作为引用参数进行函数参数传递，变量前需要加ref关键词，函数对使用ref修饰的变量修改其值后，会影响你原始值。
注意：区函数形参传入的是值参数和引用参数的影响，如果函数形参传入的是值参数，形参会在栈上开辟空间；如果传入的是引用参数，则不会在栈上开辟空间，直接引用到实参地址；

还要区别引用类型作为值参数和引用参数：如果引用类型作为值参数传入函数，则会在方法内部开辟新对象去引用这个传入的引用类型变量；

注意：使用ref时，变量需要先初始化。


```c#
class Program
{
    static void jiaohuan(ref int a, ref int b)
    {
        int tempt;
        tempt = a;
        a = b;
        b = tempt;
    }
    static void Main(string[] args)
    {
 
        try
        {
            Console.WriteLine("输入你要试验的数字：");
            int x = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("请输入第二个数字");
            int y = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("x的数值是 "+x);
            Console.WriteLine("y的数值是 "+y);
            jiaohuan(ref x,ref y);
            Console.WriteLine("/////////////////");
            Console.WriteLine("x的数值是 "+x);
            Console.WriteLine("y的数值是 "+y);
            Console.ReadKey();
        }
        catch
        {
            Console.WriteLine("输入的内容不能够转成数字，请重新输入");
        }
    }
}
```

#### out参数

**out使用时需注意，使用out修饰的变量，需要在函数内部对其进行初始化**

```c#
    static double average(int [] x, out int maxval,out int minval)
    {
        maxval = x[0];
        minval = x[0];
        int sum = 0;
        for (int i = 0; i < x.Length; i++)
        {
            if (x[i]>maxval)
            {
                maxval = x[i];
            }
 
            if(x[i]<minval)
            {
                minval = x[i];
            }
            sum += x[i];
        }
        return sum * 1.0 / x.Length;
    }
    static void Main(string[] args)
    {
        try
        {
            int[] x = {1,1,3,4,5,6,7,8,9};
            int maxval;
            int minval;
            double y = average(x, out maxval, out minval);
            Console.WriteLine("maxval的数值是 "+maxval);
            Console.WriteLine("minval的数值是 "+minval);
            Console.WriteLine("数组的平均值是 {0:0.00}",y);
            Console.ReadKey();
        }
        catch
        {
        }
    }
}
```

#### 部分类

***关键词是partial***

```c#
partial class calculate
{
    public int maxvalue(int [] x)
    {
        int maxvale = x[0];
        for (int i = 0; i <x.Length; i++)
        {
            if (x[i]>maxvale)
            {
                maxvale = x[i];
            }
        }
        return maxvale;
    }
}
partial class calculate
{
    int sum = 0;
    public double average(int [] x)
    {
        for (int i = 0; i < x.Length; i++)
        {
            sum += x[i];
        }
        return sum * 1.0 / x.Length;
    }
}
 
class Program
{
    struct customer
    {
        public int age;
        public string name;
    }
    static void Main(string[] args)
    {
        int[] x = {1,2,3,4,5,6,7,8,9};
        calculate y = new calculate();
        int max1 = y.maxvalue(x);
        double averagev = y.average(x);
        Console.WriteLine("数组最大值是 "+max1+" 数组平均值是 "+averagev);
        Console.ReadKey();
    }
}
```

####  结构

结构是值类型，

```c#
class Program
{
    struct customer
    {
        public int age;
        public string name;
    }
    static void Main(string[] args)
    {
        customer x = new customer();
        x.age = 15;
        x.name = "jerry";
        Console.WriteLine(x.name + x.age);
        Console.ReadKey();
 
    }
}
```

####  **静态类**

**使用static对类进行修饰的，称之为静态类，其不能够被实例化。**

**静态类只包含静态属性和静态方法，不包含实例成员，且不能够进行实例化。**





### **实现继承和接口继承**

**实现继承：**该类继承于某一个类，可以调用继承的父类的所有字段、属性和方法。

**接口继承：**这种方式只是简单继承了接口函数名称，但是并没有实际继承程序代码。

```c#
        struct customer
        {
            public int age;
            public string name;
        }
        class teacher: people
        { 
            public void work()
            {
                Console.WriteLine("老师的工作是教学");
            }
        }
        class people
        {
            public int age;
            public string name;
            public void sleep()
            {
                Console.WriteLine("人需要睡觉");
            }
        }
        static void Main(string[] args)
        {
            teacher x = new teacher();
            x.sleep();
            x.age = 12;
            x.name = "jerry";
            x.work();
            Console.ReadKey();
        }
```

注意事项：

① 当基类的派生对象存在和基类相同的成员名称时，基类的派生对象内部可以使用关键词“new”对基类中具有相同名称的成员进行覆盖。目前可以实现对字段、属性、方法的覆盖。

② 在使用new方法对基类中同名字的成员进行覆盖后，如果想派生类中访问基类中同名的成员时，可以使用base关键词进行选择需要访问的成员。

③ 派生类强制转换成基类后，派生类调用成员时都是调用的基类的成员。

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication2
{
    class baseclass
    {
        public string name="这个是基类的名字";
        public string Name
        {
            set
            {
                name = value;
            }
            get
            {
                return name;
            }
        }
        public int add(int a,int b)
        {
            return a + b;
        }

    }
     
    class paishnegclass : baseclass
    {
        public new string name = "这是派生类的名字";
        public new string Name
        {
            set
            {
                name = value;
            }
            get
            {
                return name;
            }
        }
        public new int add(int a, int b)
        {
            return a + b + 10;
        }
        public void show()
        {
            Console.WriteLine(base.Name);
        }
     
    }

 


```c#
class Program
{
    static void Main(string[] args)
    {
        baseclass x = new baseclass();
        Console.WriteLine(x.Name);
        int a = x.add(4,5);
        paishnegclass y = new paishnegclass();
        int b = y.add(4,5);
        Console.WriteLine(y.Name);
        Console.ReadKey();
    }
}
}
```
#### 虚方法

**使用虚方法重写父类的函数，父类函数声明时需要加上virtual/abstract关键词，子类重写父类的函数时，需要在函数前加上override关键词。**

```c#
class animal
{
    public virtual void work()
    {
        Console.WriteLine("我是动物");
    }
}
 
class monkey : animal
{
    public override void work()
    {
        Console.WriteLine("我是猴子");
    }
}
 
class Program
{
    struct customer
    {
        public int age;
        public string name;
    }
 
    static void Main(string[] args)
    {
        animal x = new animal();
        x.work();  //输出我是动物
        monkey y = new monkey();
        y.work();  //输出我是猴子
        animal z = new monkey();
        z.work();  //输出我是猴子
        Console.ReadKey();
    }
}
```

### 注

通过虚方法和new方法对子类函数进行重写对比结论：
①new    .new声明的方法，当使用子类的类型来调用的时候，它会运行子类中的函数，当类型是基类的话 ，则使用基类的函数来执行

②override  当使用子类的类型来调用的时候，它会运行子类中的函数，当类型是基类的话 ，则使用子类的函数来执行

简单说：`override` 是 “取而代之”（多态），`new` 是 “另起炉灶”（隐藏）
````c#
// new 
public class BaseClass
{
    public void Show()
    {
        Console.WriteLine("BaseClass.Show()");
    }
}

public class SubClass : BaseClass
{
    public new void Show() // 隐藏基类的Show()
    {
        Console.WriteLine("SubClass.Show()");
    }
}

// 调用
BaseClass obj1 = new SubClass();
obj1.Show(); // 输出：BaseClass.Show()（基类引用调用基类方法）

SubClass obj2 = new SubClass();
obj2.Show(); // 输出：SubClass.Show()（子类引用调用子类新方法）
````









#### 调用基类的函数方式base.基类函数名

```c#
class zhekou
{
    public int calculate()
    {
        return 15;
    }
}
 
class zhekou1 : zhekou
{
    public double calculate1()
    {
        return base.calculate() * 0.9;
    }
 
}
 
class Program
{
    static void Main(string[] args)
    {
        zhekou1 x = new zhekou1();
        double y = x.calculate1();
        Console.WriteLine("折扣是"+y);
        Console.ReadKey();
 
    }
}
```





#### 密封类

**使用关键词sealed** 类似于java中final修饰的class

```c#
sealed class number1
{
    public  static int age;
    public  static string name;
}
 
class Program
{
    static void Main(string[] args)
    {
        number1.age = 15;
        number1.name = "jerry";
        Console.ReadKey();
    }
}
```





### 修饰符
① protected 只有派生类可以访问该项

② public      任何代码都可以访问该项

③ internal    只有包含该类的程序集中访问该项

④ private     只有在它所属的类型中进行访问该项

⑤ protected internal  只有在包含它的程序集和派生类中的任何代码中访问该项






### 接口 

和java的接口类似

接口声明和抽象类比较相似，接口只能包含方法、属性、索引器和事件的声明。

注意:接口不能够实例化操作；不能声明为虚方法或者静态类

以银行账号为例，创建接口，用于用户进行存钱、取钱和查询余额。

    public interface IDbank
    {
        void Payin(decimal amount);
        void withdraw(decimal amount);
        decimal Balance { get; }
        void check();
    }
     
    public class bankB : IDbank
    {
        private decimal balance;
        public decimal Balance
        {
            get
            {
                return balance;
            }
        }
     
        public void Payin(decimal amount)
        {
            balance += amount;
        }
     
        public void withdraw(decimal amount)
        {
            if (balance> amount)
            {
                balance -= amount;
            }
        }
        public void check()
        {
            Console.WriteLine("账户余额剩余{0:0.00}",this.balance);
        }
    }

 



```c#
class Program
{
    static void Main(string[] args)
    {
        IDbank x = new bankB();
        x.Payin(100);
        x.withdraw(50);
        x.check();
        Console.ReadKey();    
    }
}
```







### 装箱和拆箱

装箱：将值类型转成引用类型

拆箱：将引用类型转成值类型

**注意：装箱和拆箱操作容易使用，但是性能损伤比较大，遍历许多项时尤其如其。**

**例如:将object类型转成数组类型**

```c#
    static void Main(string[] args)
    {
        var x = new ArrayList();
        x.Add(4);
        x.Add("你是");
        x.Add(new int []{1,2,3});
        foreach (var item in x)
        {
            if (item is int[])
            {
                Console.WriteLine("我是数组");
                int[] y = (int[])item;
                for (int i = 0; i < y.Length; i++)
                {
                    Console.Write(y[i]+" ");
                }
            }
            else
                Console.WriteLine(item);
         
        }
        Console.ReadKey();
    }
```

### list 泛型

由于arraylist可以存储任意类型的元素，使用list可以创建存储指定类型的泛型。

```c#
        var x = new List<int>();
        x.Add(4);
        x.Add(40);
        foreach (int item in x)
        {
            Console.WriteLine(item);
        }
        Console.ReadKey();
```





## 数组

***\*数组：一种数据结构，可以存储包含同一种类型的多个元素\****

````c#
   int[] x = new int[4] { 1, 2, 3, 4 };  // 和C类似
   int[] y = {1,2,3,4,5,6};
````







#### 委托

1. `Action` 和 `Func` 

   ```c#
   class calculate
   {
       public void show()
       {
           Console.WriteLine("我是show函数");
       }
       public int add(int a,int b)
       {
           return a + b;
       }
       public int sub(int a, int b)
       {
           return a-b;
       }
    
   }
    
   class Program
   {
       static void Main(string[] args)
       {
           calculate w = new calculate();
           //利用action关键词对应到show函数
           Action x = new Action(w.show);
           x.Invoke();   //执行show函数
           x();      //执行show函数
    
           Func<int, int, int> y = new Func<int, int, int>(w.add);
           int g = y.Invoke(5,6);
           int h = y(5,6);
           Console.WriteLine(g);
           Console.WriteLine(h);
           Console.ReadKey();
       }
   }
   ```

2.  自定义委托

   ```c#
   /// <summary>
   /// 声明自定义委托
   /// </summary>
   /// 
   public delegate double cal(double x, double y);
    
   class calulator
   {
       public double add(double x, double y)
       {
           return x + y;
       }
    
       public double sub(double x, double y)
       {
           return x - y;
       }
       public double mul(double x, double y)
       {
           return x*y;
       }
       public double div(double x, double y)
       {
           return x/y;
       }
   }
    
           calulator p = new calulator();
           cal h = new cal(p.div);
    
           double c = h.Invoke(3.0,5.0);
           double d = h(3.0,5.0);
    
           Console.WriteLine(c);
           Console.WriteLine(d);
           Console.ReadKey();
   ```

​	委托的声明：委托与所封装的方法必须“类型兼容”

![img](https://i-blog.csdnimg.cn/direct/fc1b3ed43878463f989f94d61eccfc3f.png)