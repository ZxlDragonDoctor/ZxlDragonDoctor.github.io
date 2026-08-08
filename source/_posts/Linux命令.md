---
title: "Linux命令"
date: 2025-01-01 16:32:57
updated: 2025-01-01 16:32:57
categories:
  - 笔记
---

# Linux命令

删除文件

- `rm 文件名`

删除文件夹

1. 文件夹为空
- `rmdir 文件夹`
- `rm -d 文件夹`

2. 文件夹非空

- `rm  -r 文件夹`
- `rm  -rf 文件夹`
- `del 文件夹/* `  + `rmdir 文件夹`





#####在Linux中，可以使用sed命令来显示指定文件内容的第几行。以下是一个基本的命令示例：

`sed -n 'Np' filename`

其中N是你想查看的行号，filename是你的文件名。

例如，如果你想查看文件example.txt的第10行，你可以使用：

`sed -n '10p' example.txt`

这将输出example.txt文件的第10行内容。

、



####chmod 和 chown

rwx 读|写|执行

ugo 用户|组|其他

````bash
chmod 权限 文件路径
chmod 777 test.txt
chmod u+x test.txt
chmod o+w test.txt
chmod g-w test.txt
````

`chown 用户:组的名字 文件路径`

````bash
rw- r-- r--
拥有者的权限u 同组用户g 其他用户(不同组)o
````

r: read

w:write

x:执行