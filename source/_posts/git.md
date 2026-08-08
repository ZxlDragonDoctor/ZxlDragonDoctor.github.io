---
title: "git"
date: 2025-06-17 22:51:45
updated: 2025-06-17 22:51:45
categories:
  - 笔记

cover: /img_posts/basic-rebase-3.png
---

#  git学习记录

初始化仓库的两个方法

1`git init` 需要指定push的远程仓库:`git remote add origin  URL` 

2.`git clone `需要指定push的远程仓库:`git remote add origin  URL`

从远程仓库拉取代码和推送到远程仓库代码

1.`git pull (origin) (分支名) `

2.`git push (origin) (分支名)`

3.`git fetch (origin) (分支名)`



ssh公钥方式连接远程仓库

设置用户签名

`git config --global user.name` “yorname”设置用户签名
`git config --global user.email your_email@youremail.com `    设置用户签名

生成密钥(SSH key)

```
ssh-keygen -t rsa -C "your_email@youremail.com     "-t" 代表公钥的类型，"-C"为注释 
```

生成的公钥文件在你C盘用户目录下.ssh文件下，可以看到id_rsa.pub的文件，赋值上面的内容到代码托管平台上添加ssh密钥的位置即可







## 一.修改提交信息

### 1. 修改提交信息

如果你刚刚提交了更改，但想要修改提交信息，可以使用：

bash

```bash
git commit --amend -m "新的提交信息"
```

这将打开一个编辑器，让你修改提交信息。

### 2. 添加更多更改到上次提交

如果你在提交后进行了更多的更改，并且想要将这些更改添加到上次提交中，而不是创建一个新的提交，可以这样做：

bash

```bash
git add <更改的文件>
git commit --amend --no-edit
```

这里 `--no-edit` 选项表示不更改提交信息，直接使用上次的提交信息

###3.**要修改已推送到远程仓库的提交**

1. **修改本地提交**：使用 `git commit --amend` 命令来修改最近一次提交。这会打开一个编辑器，允许你修改提交信息。

2. **强制推送到远程仓库**：由于你已经修改了最近一次提交，需要使用 `git push --force` 命令将修改后的提交推送到远程仓库。注意，这里使用了 `--force` 选项来覆盖远程仓库中的提交记录。

3. **注意事项**：使用 `--force` 选项会强制更新远程分支，使其与你的本地分支状态完全一致。这意味着如果你或他人在此期间有其他提交到远程，它们将被你的这次推送覆盖。因此，除非你确信没有其他人在此期间推送到该分支，否则应谨慎使用 `--force`。

4. **推荐使用 `--force-with-lease`**：为了更安全地强制推送，可以使用 `git push --force-with-lease`。它会在推送前检查远程分支的状态是否与你预期的一致。如果远程分支在你上次拉取后有其他人的新提交，推送会失败，从而避免意外覆盖他人的工作。
### 4.提交删除的文件
1.`git rm 'path/file' `
2.`git commit -m '提交信息' `
3.`git push`

  





## 二、修改指定文件的提交信息（已推送）

这里的方法是通过**手动拆分**和**重新提交**，与指定文件夹相关的提交信息重新组织历史。以下是详细步骤：

------
### 具体场景说明

假设有一个文件夹 `src`，你希望修改它的相关提交信息，其他文件夹的提交信息保持不变。

------

### 详细步骤

#### 1. **备份当前仓库**

在进行历史修改之前，创建一个安全备份分支：

```bash
git branch backup
```

这样可以随时恢复到原始状态。

------

#### 2. **查找与指定文件夹相关的提交**

运行以下命令以筛选出与目标文件夹相关的提交：

```bash
git log --oneline -- <folder_path>
```

例如：

```bash
git log --oneline -- src
```

这将输出类似以下内容：

```
abc1234 Fix: Bug in src module
def5678 Refactor: Updated src structure
ghi9012 Initial commit for src
```

记下相关提交的哈希值。

------

#### 3. **交互式 rebase 定位提交**

使用 `git rebase` 将历史分解为可编辑状态：

运行：

```bash
git rebase -i <starting_commit_hash>^
```

如果你只需要修改最近 3 次提交：

```bash
git rebase -i HEAD~3
```

进入编辑器后，你会看到提交历史，例如：

```
pick abc1234 Fix: Bug in src module
pick def5678 Refactor: Updated src structure
pick ghi9012 Initial commit for src
```

将涉及 `src` 文件夹的提交标记为 `edit`：

```
pick abc1234 Fix: Bug in src module
edit def5678 Refactor: Updated src structure
pick ghi9012 Initial commit for src
```

保存并退出。

------

#### 4. **拆分与目标文件夹无关的修改**

Git 会暂停在标记为 `edit` 的提交上，你可以拆分内容。

1. **检查提交内容：** 查看该提交改动：

   ```bash
   git show
   ```

2. **重置提交到暂存区：** 将当前提交的内容重置为未提交状态：

   ```bash
   git reset HEAD~
   ```

3. **暂存指定文件夹的更改：** 只将 `src` 文件夹相关的改动添加到暂存区：

   ```bash
   git add src
   ```

4. **创建新的提交：** 提交新的信息：

   ```bash
   git commit -m "New message for src folder"
   ```

5. **提交其他更改：** 将剩余未暂存的文件提交回去：

   ```bash
   git add .
   git commit -m "Other unrelated changes"
   ```

6. **继续 rebase：** 完成拆分后，继续 rebase：

   ```bash
   git rebase --continue
   ```

------

#### 5. **重复操作**

对于所有标记为 `edit` 的提交，重复上述步骤，直到完成。

------

#### 6. **强制推送更改**

完成所有修改后，需要强制推送到远程仓库：

```bash
git push --force
```

------

### 示例操作流程

假设 `src` 文件夹的某个提交信息需要修改：

1. 当前提交内容：
   - 修改了 `src/main.c`。
   - 修改了 `README.md`。
2. 通过 `git reset` 和 `git add` 拆分：
   - `git add src` -> 提交 `src` 文件的改动，修改提交信息。
   - `git add README.md` -> 提交其他文件的改动。

------

### 注意事项

1. **操作环境**：确保团队成员没有并行修改提交历史，避免冲突。
2. **备份**：始终在操作前备份分支，避免数据丢失。
3. **强制推送**：所有历史变更都需要 `git push --force`（这是不安全的），务必与团队沟通。











## 三、要连接到其他 Git 仓库，您可以使用以下步骤：

1. **查找或创建新的远程仓库**：
  
   - 如果您想要连接到一个已经存在的仓库，您需要知道该仓库的 URL。
   - 如果您想要创建一个新的远程仓库，您可以在 GitHub、GitLab、Bitbucket 或其他 Git 托管服务上创建一个新的仓库，并获取该仓库的 URL。
   
2. **使用 `git remote add` 命令添加远程仓库**：
   - 打开终端或命令行界面。
   - 切换到您的本地 Git 仓库目录。
   - 执行以下命令来添加一个新的远程仓库：

     ```bash
     git remote add <remote-name> <repository-url>
     ```

   - 其中 `<remote-name>` 是您为远程仓库起的别名（通常是 `origin`，但也可以是任何其他名称），而 `<repository-url>` 是远程仓库的 URL。

   例如，如果您想要将远程仓库别名设置为 `upstream` 并连接到一个名为 `https://github.com/other-user/other-repo.git` 的仓库，您可以执行：

     ```bash
     git remote add upstream https://github.com/other-user/other-repo.git
     ```

3. **验证远程仓库**：
  
   - 使用 `git remote -v` 命令来查看所有远程仓库的 URL，确保新的远程仓库已经被正确添加。
   
   ```bash
   git remote -v
   ```
   
4. **从远程仓库拉取代码**：
   - 如果您想要从新添加的远程仓库拉取代码，可以使用 `git fetch` 命令：

   ```bash
   git fetch <remote-name>
   ```

   - 这会将远程仓库的代码拉取到您的本地仓库，但不会自动合并到您的当前分支。

5. **合并代码**：
   - 如果您想要将远程仓库的代码合并到您的本地分支，可以使用 `git merge` 命令：

   ```bash
   git merge <remote-name>/branch-name
   ```

   - 替换 `branch-name` 为远程仓库中您想要合并的分支名称。

6. **git删除远程仓库连接**：

- 使用`git remote rm <仓库名>`命令，例如`git remote rm origin`可以删除名为origin的远程仓库。
- 使用`git remote remove <仓库名>`命令，例如`git remote remove origin`也可以删除名为origin的远程仓库。

- 使用`git remote prune <仓库名>`命令，例如`git remote prune origin`可以删除名为origin的远程仓库。

- 使用`git remote rm --all`命令可以删除所有远程仓库。
6. **git修改连接的远程仓库的别名**：
  使用`git remote rename <old_name> <new_name>`命令将指定的旧别名修改为新别名

7. **提交到远程不同仓库**

   `git push 自定义仓库名 分支名`

8. **git查看关联的远程库**

   要查看当前 Git 仓库关联的远程仓库，可以使用以下命令：

   ```bash
   git remote -v
   ```

   这将列出所有远程仓库及其URL。

   如果你只想查看远程仓库的简要信息，可以使用：

   ```bash
   git remote
   ```

   这将列出所有远程仓库的名称。





## 四、git撤销记录

###git 如何撤销commit记录

要撤销最后一次commit但保留更改，可以使用：

```bash
git reset --soft HEAD^
```

如果要撤销commit并且也撤销更改（慎用，这会丢失代码更改），可以使用：

```bash
git reset --hard HEAD^
```

如果需要撤销特定的一个commit（不是最后一个），你需要先找到那个commit的哈希值，然后使用：

```bash
git reset --soft <commit_hash>^
# 或者
git reset --hard <commit_hash>^
```

替换`<commit_hash>`为你想要撤销的commit的哈希值。

注意：使用`--hard`选项会丢失所有未提交的更改，请谨慎操作。如果需要保留更改而不是撤销commit，请使用`--soft`选项。

-----

###git 如何撤销add记录

要撤销`git add`添加到暂存区的文件，可以使用`git reset`命令。具体的命令取决于你要撤销添加的文件是单个文件还是多个文件。

撤销单个文件：

```bash
git reset <file>
```

撤销多个文件：

```bash
git reset <file1> <file2> ...
```

撤销所有文件：

```bash
git reset
```







##五、git本地master分支推送到远程main分支
如果你在本地使用的是 master 分支，而远程仓库使用的是 main 分支，那么需要进行一些设置才能将本地的 master 分支推送到远程的 main 分支。

一种简单的方法是，在本地使用 git branch -m 命令将本地的 master 分支重命名为 main 分支，然后再将其推送到远程仓库。具体步骤如下：

1. **检查本地分支：**
`git branch`
你应该能看到 master 分支。

2. **将本地的 master 分支重命名为 main 分支：**
`git branch -m master main`
3. **推送本地 main 分支到远程仓库：**
`git push -u origin main`
上述命令会将本地的 main 分支推送到远程的 main 分支，并且在远程仓库中创建一个新的 main 分支（如果该分支不存在）。

4. **如果你想删除在远程仓库中的 master 分支，可以运行以下命令：**

`git push origin :master`
上述命令会将一个空分支推送到远程仓库的 master 分支，从而删除该分支。

注意：在重命名本地分支和推送到远程仓库之前，请确保没有其他人正在共享该仓库，并且你的代码没有在其他地方被引用或依赖。





## 六、常见报错

1.   **报错：fatal: refusing to merge unrelated histories**

在执行 `git pull` 时出现 `fatal: refusing to merge unrelated histories` 错误，这是因为本地仓库和远程仓库的提交历史（history）不相关，Git 默认拒绝合并不相关的历史。

**解决方法**

可以通过添加 `--allow-unrelated-histories` 参数强制合并不同历史：

```
git pull movie_app main --allow-unrelated-histories 
```

2. **报错：fatal: The current branch master has no upstream branch.**
````git
     fatal: The current branch master has no upstream branch.
     To push the current branch and set the remote as upstream, use

       git push --set-upstream origin master

   To have this happen automatically for branches without a tracking
   upstream, see 'push.autoSetupRemote' in 'git help config'.
`````

这段提示是 Git 在执行某些操作时发出的，意思是当前分支 `master` 没有设置上游分支（即远程分支）。以下是它的含义和解决方法：

2.1  **问题解释**

1. **上游分支（Upstream Branch）**：  
   在 Git 中，本地分支可以与远程分支关联，这种关联关系称为“上游分支”。当你从远程仓库克隆代码时，Git 会自动设置本地分支与远程分支的关联关系。例如，`master` 分支通常会与远程仓库的 `origin/master` 关联。

2. **没有上游分支的原因**：  
   - 可能是本地分支是新创建的，还没有推送到远程仓库。
   - 或者本地分支是从其他分支创建的，但没有设置与远程分支的关联。

3. **提示内容的含义**：  
   - Git 建议你使用命令 `git push --set-upstream origin master`，将本地的 `master` 分支推送到远程仓库，并设置远程分支 `origin/master` 作为上游分支。
   - 它还提到可以通过配置 `push.autoSetupRemote` 来自动设置这种关联关系。

2.2  **解决方法**

**方法 1：手动设置上游分支**
运行以下命令，将本地分支推送到远程仓库，并设置上游分支：

```bash
git push --set-upstream origin master
```
这个命令会：
1. 将本地的 `master` 分支推送到远程仓库的 `origin/master`。
2. 设置本地分支与远程分支的关联关系。

 **方法 2：自动设置上游分支**
如果你希望 Git 在推送时自动设置上游分支，可以配置 `push.autoSetupRemote`：

```bash
git config --global push.autoSetupRemote origin
```
这样，当你下次推送分支时，Git 会自动设置上游分支。

**方法 3：检查当前分支状态**
如果你不确定当前分支的状态，可以运行以下命令查看：

```bash
git branch -vv
```
这会显示本地分支及其关联的远程分支信息。如果某个分支没有关联远程分支，你会看到类似 `[]` 的空值。

**注意事项**

1. 如果你使用的是 `main` 分支（而不是 `master`），请将命令中的 `master` 替换为 `main`。
2. 如果你不确定远程仓库的名称（默认是 `origin`），可以用 `git remote -v` 查看远程仓库的名称和地址。










## 七、常用命令
1.  查看当前文件状态
	`git status`
	`git status -s| --short`  简介的展示文件状态,例如
	
	````git
	$ git status -s
	 M README
	MM Rakefile
	A  lib/git.rb
	M  lib/simplegit.rb
	?? LICENSE.txt
	`````
	

​	输出结果：左栏有两列，第一列指明了**暂存区的状态**，第二列指明了**工作区的状态**（新添加的未跟踪文件前面有 `??` 标记，新添加到暂存区中的文件前面有 `A` 标记，修改过的文件前面有 `M` 标记)，右栏指相应文件。

**常见输出**

`Untracked files` : 未跟踪的文件

`Changes to be committed`： 已暂存状态

`Changes not staged for commit`(未暂存清单) : 说明已跟踪文件的内容发生了变化，但还没有放到暂存区。 要暂存这次更新,需要运行 `git add` 命令.

---

2. 查看已暂存和未暂存的修改

​		`git diff`  此命令比较的是工作目录中当前文件和暂存区域快照之间的差异。 也就是修改之后还没有暂存起来的变化内容

​        `git diff -staged` 查看已暂存的将要添加到下次提交里的内容

​		`git diff --cached` 查看已经暂存起来的变化

-----

3. 提交记录

   `git commit`

   `git commit -a` :给 `git commit` 加上 `-a` 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 `git add` 步骤

-----

4. 移除文件（从暂存区域移除）

   `git rm`   一定要提交此次删除才能从暂存区域移除文件(同时删除工作目录的文件)

   `git rm --cached`  把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录中（不会删除工作目录上的文件）

   ----

5. 查看提交日志

    **`git log`**

    作用:查看提交记录

    命令形式：`git log [option]`

    `options:`

    - --all 显示所有分支

    - --pretty=oneline 将提交信息显示为一行

    - --abbrev-commit 使得输出的commitId更简短

    - --graph 以图的形式显示

    - --pretty=format 定制记录的显示格式

    常用命令

    `git log --online` 

    `git log --graph`
    
    `git log -p | -patch  -N` 查看最近N次提交，附带显示每次提交的差异
    
    `git log -stat` 在每次提交的下面列出所有被修改过的文件、有多少文件被修改了以及被修改过的文件的哪些行被移除或是添加了。 在每次提交的最后还有一个总结.

----

2. ​	撤销操作

   `git commit -amend` 修改最近一次提交的提交信息,本质上是**新的提交** 替换旧的提交

   `git reset HEAD <file>`  指定取消暂存区的某个文件

   ` git checkout — <file>`  ：**撤消对文件的修改** -》 对那个文件在本地的任何修改都会消失——Git 会用最近提交的版本覆盖掉它

   ----

2.  远程仓库

   `git remote ` 只列举远程仓库名

   `git remote -v` 列举远程仓库名,同时显示与其对应的URL

   `git remote add <shortname> <url>`  添加远程仓库

   **从远程仓库中抓取与拉取**  

      - `git  fetch <remote> ` 只会将数据下载到你的本地仓库——它并不会自动合并或修改你当前的工作
      - `git pull` 自动抓取后合并该远程分支到当前分支,前提是你的当前分支设置了跟踪远程分支

   `git push <remote> <branch>`  推送到远程仓库

​		`git remote show <remote>`  查看某一个远程仓库的更多信息

> **它同样会列出远程仓库的 URL 与跟踪分支的信息。 这些信息非常有用，它告诉你正处于 `master` 分支，并且如果运行 `git pull`， 就会抓取所有的远程引用，然后将远程 `master` 分支合并到本地 `master` 分支。 它也会列出拉取到的所有远程引用。**

​		`git remote rename <oldName> <newName>`   远程仓库的重命名

​		`git remote remove | rm <remoteName>` 远程仓库的移除

-----

4. 打标签（人们会使用这个功能来标记发布结点）

   `git tag [-l | --list ]`   列出已有的标签

   **创建标签** 

   - 轻量标签  `git tag <tagName>` 
   - 附属标签 `git tag -a <tagName>-m "<message>"` 

    后期打标签  `git tag -a <tagName> <散列值>`  对过去的提交打标签，散列值可以使用`git log`查看

   > 共享标签 :`git push` 命令并不会传送标签到远程仓库服务器上。 在创建完标签后你必须显式地推送标签到共享服务器上。 这个过程就像共享远程分支一样——你可以运行 `git push origin <tagname>`如果想要一次性推送很多标签，也可以使用带有 `--tags` 选项的 `git push` 命令。 这将会把所有不在远程仓库服务器上的标签全部传送到那里

   **删除标签**

   `git tag -d <tagname>`  删除掉本地仓库上的标签
   
    删除远程仓库标签:  
   
    - `git push <remote> :refs/tags/<tagname>`
   
    - `git push origin --delete <tagName>`

>  ​	**检出标签**
>
> 如果你想查看某个标签所指向的文件版本，可以使用 `git checkout` 命令， 虽然这会使你的仓库处于“分离头指针（detached HEAD）”的状态——这个状态有些不好的副作用：
>
> ```console
> $ git checkout 2.0.0
> Note: checking out '2.0.0'.
> 
> You are in 'detached HEAD' state. You can look around, make experimental
> changes and commit them, and you can discard any commits you make in this
> state without impacting any branches by performing another checkout.
> 
> If you want to create a new branch to retain commits you create, you may
> do so (now or later) by using -b with the checkout command again. Example:
> 
>   git checkout -b <new-branch>
> 
> HEAD is now at 99ada87... Merge pull request #89 from schacon/appendix-final
> 
> $ git checkout 2.0-beta-0.1
> Previous HEAD position was 99ada87... Merge pull request #89 from schacon/appendix-final
> HEAD is now at df3f601... add atlas.json and cover image
> ```
>
> 在“分离头指针”状态下，如果你做了某些更改然后提交它们，标签不会发生变化， 但你的新提交将不属于任何分支，并且将无法访问，除非通过确切的提交哈希才能访问。 因此，如果你需要进行更改，比如你要修复旧版本中的错误，那么通常需要创建一个新分支：
>
> ```console
> $ git checkout -b version2 v2.0.0
> Switched to a new branch 'version2'
> ```
>
> 如果在这之后又进行了一次提交，`version2` 分支就会因为这个改动向前移动， 此时它就会和 `v2.0.0` 标签稍微有些不同，这时就要当心了。

----

5.  Git 别名

   `git config --global alias.<别名> '<git子命令'>`  
   
   `git config --global alias.<别名> '!命令'`

-----

6. **版本回退(版本穿梭)**

(1) `git reset`

- 命令形式：git reset --hard commitID

  commitID 可以使用 git-log 或 git log 指令查看

- 如何查看已经删除的记录？

​       `git reflog`**这个指令可以看到已经删除的提交记录**

(2) `git reset --hard(--soft或--mixed)`
 - --hard : 本地仓库、暂存区、工作区都回退版本
 - -- soft: 只有本地仓库回退，暂存区和工作区不会回退
 - --mixed:这是默认操作，本地仓库和暂存区回退，工作区不会改变

---

7. **<span style="color: red">分支</span>**

​		`git branch  <brachName>` 新建分支

​		`git checkout <brachName>`   切换分支

​		`git checkout -b <branchName>` 新建分支并切换到该分支

​		`git branch -d <branchName>` 删除分支

​		`git merge <branchName>` 合并其他分支到当前分支

​		`git branch` 得到当前所有分支的一个列表

​		`git branch -v` 查看每一个分支的最后一次提交

​		`git branch --merged` 查看哪些分支已经合并到当前分支

​		`git branch --no-merged`   查看所有包含未合并工作的分支

****

>       **遇到冲突时的分支合并**
>
>       在合并冲突后的任意时刻使用 `git status` 命令来查看那些因包含合并冲突而处于未合并（unmerged）状态的文件：
>
>       ```console
>       $ git status
>       On branch master
>       You have unmerged paths.
>         (fix conflicts and run "git commit")
>       
>       Unmerged paths:
>         (use "git add <file>..." to mark resolution)
>       
>           both modified:      index.html
>       
>       no changes added to commit (use "git add" and/or "git commit -a")
>       ```
>
>       任何因包含合并冲突而有待解决的文件，都会以未合并状态标识出来。 Git 会在有冲突的文件中加入标准的冲突解决标记，这样你可以打开这些包含冲突的文件然后手动解决冲突。 出现冲突的文件会包含一些特殊区段，看起来像下面这个样子：
>
>       ```html
>       <<<<<<< HEAD:index.html
>       <div id="footer">contact : email.support@github.com</div>
>       =======
>       <div id="footer">
>       please contact us at support@github.com
>       </div>
>       >>>>>>> iss53:index.html
>       ```
>
>       这表示 `HEAD` 所指示的版本（也就是你的 `master` 分支所在的位置，因为你在运行 merge 命令的时候已经检出到了这个分支）在这个区段的上半部分（`=======` 的上半部分），而 `iss53` 分支所指示的版本在 `=======` 的下半部分。 为了解决冲突，你必须选择使用由 `=======` 分割的两部分中的一个，或者你也可以自行合并这些内容。 例如，你可以通过把这段内容换成下面的样子来解决冲突：
>
>       ```html
>       <div id="footer">
>       please contact us at email.support@github.com
>       </div>
>       ```
>
>       上述的冲突解决方案仅保留了其中一个分支的修改，并且 `<<<<<<<` , `=======` , 和 `>>>>>>>` 这些行被完全删除了。 在你解决了所有文件里的冲突之后，对每个文件使用 `git add` 命令来将其标记为冲突已解决。 一旦暂存这些原本有冲突的文件，Git 就会将它们标记为冲突已解决。

-------

8. 变基

   `git resbase <branceName>` 

   **原理：**

   在这个例子中，你可以检出 `experiment` 分支，然后将它变基到 `master` 分支上：

   ```console
   $ git checkout experiment
   $ git rebase master
   First, rewinding head to replay your work on top of it...
   Applying: added staged command
   ```

   它的原理是首先找到这两个分支（即当前分支 `experiment`、变基操作的目标基底分支 `master`） 的最近共同祖先 `C2`，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件， 然后将当前分支指向目标基底 `C3`, 最后以此将之前另存为临时文件的修改依序应用。 （译注：写明了 commit id，以便理解，下同）

   ![将 `C4` 中的修改变基到 `C3` 上。](/img_posts/basic-rebase-3.png)





-----

9. 存储

git stash命令的语法如下表所示。

| 命令 | 说明 |
| ---- | ---- |
|   git stath   |   将当前工作空间的状态保存   |
|git stash list|	查看当前Git中存储的所有状态 |
|git stash apply {stashName}	|根据存储名称读取Git存储|
|git stash drop {stashName}|	根据存储名称删除Git存储|
|git stash save “日志信息”	|将当前工作空间的状态保存并指定一个日志信息|
|git stash pop	| 读取stash堆栈中的第一个存储，并将该存储从stash堆栈中移除|
|git stash show [-p] {stashName} |	查看指定存储与未建立存储时的差异 -p：显示详细差异|
|git stash branch {branchName} [stashName]|创建并切换到一个新分支来读取指定的存储  stashName：存储的名称，默认情况下读取stash堆栈中栈顶的存储|



## 八、不常用命令

`git rev-parse --abbrev-ref @{u}`  查看当前分支的上游分支



## 九、多人协同开发

1. 托管平台的仓库上的成员管理添加成员
2. `git clone ` 仓库
3. 新建分支
4. 推送到远程仓库新的分支` git push <仓库名> 分支名：远程仓库分支名（远程没有会新建）`





## 推送本地分支到远程指定分支

git checkout -b <bracname>

git push origin <bracname>/<>
