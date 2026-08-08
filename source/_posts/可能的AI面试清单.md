---
title: "可能的AI面试清单"
date: 2025-07-09 00:22:13
updated: 2025-07-09 00:22:13
categories:
  - 笔记
---



# 可能的AI面试清单

以下是为你准备的**AI Agent 工程师岗位面试清单**，包含重点问题分类、具体问题及参考答案（含技术点、表达逻辑和加分内容）：

------

## 🧠 一、技术能力类问题

### ✅ 1. 什么是 RAG？你怎么优化它的效果？

**参考答案：**

> RAG（Retrieval-Augmented Generation）是一种结合检索与生成的技术流程，模型在生成回答前会先从知识库中检索相关内容。
>  我在项目中使用了 `LangChain + FAISS + OpenAI` 搭建了 RAG 流程，优化主要通过以下方式：

- 向量数据库中使用 `text-embedding-ada-002` 提升语义相关性；
- 提高 chunk 粒度控制：根据文档内容用 semantic chunk 而非固定字数；
- 在生成阶段引入 prompt 模板加强引用内容与问句的一致性；
- 加入 query expansion 和 rerank 模块进一步提高召回精度。

**加分点：**

- 是否接入企业知识库（如 Notion、Confluence）；
- 是否做过检索链路评估（如 Recall@K、BLEU）。

------

### ✅ 2. 请设计一个 AI Agent 系统，有多个 Agent 协同工作。

**参考答案：**

> 例如构建一个“智能文档处理助手”，可拆分为：

- **Reader Agent**：提取文档内容，调用 OCR/分段；
- **Summarizer Agent**：调用大模型生成摘要；
- **Reviewer Agent**：负责审查输出是否存在风险；
- **Writer Agent**：根据需求生成文档或回答；
   各 Agent 通过消息队列通信（如 Kafka），使用状态机管理生命周期。使用 Dify 搭建界面，Langflow 进行流程编排。

**加分点：**

- 使用 Memory 保持 Agent 状态；
- 具备计划（Planning）与执行（Tool-Calling）能力。

------

### ✅ 3. 你对 langflow、flowise、dify 的使用经验？

**参考答案：**

> 我分别使用过：

- **Langflow**：更适合开发调试阶段，支持模块化开发；
- **Flowise**：适合前端嵌入和快速部署，节点式配置便捷；
- **Dify**：产品化程度高，支持团队协作、权限系统和消息记录；
   项目中我用 Dify 构建了内部知识问答系统，支持 API 接入并打通用户工单系统，极大提升响应效率。

------

## 👨‍💻 二、编程 & 工具类问题

### ✅ 4. 你用 Python 写过哪些 AI 工具或自动化脚本？

**参考答案：**

> - 使用 `requests + OpenAI API` 写过 prompt 批量测试工具；

- 用 `LangChain` 构建过 agent-chaining 模型；
- 用 `BeautifulSoup` 爬取目标网页知识并自动上传向量库；
- Shell 脚本用于定时清洗日志、监控 API 调用频率等。

------

### ✅ 5. 你怎么用 Python 实现一个简单的 RAG？

**参考答案：**

```python
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# 加载知识
documents = load_my_docs()
db = FAISS.from_documents(documents, OpenAIEmbeddings())

# 构建 RAG
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    retriever=db.as_retriever()
)

print(qa.run("请总结一下该知识点"))
```

------

## 📊 三、产品分析与用户导向

### ✅ 6. 如何参与 AI 产品的需求分析与用户体验改进？

**参考答案：**

> 我常用“用户旅程图”分析用户痛点。例如在 AI 问答产品中，用户对回答可信度有疑虑，于是我提出增加来源引用机制；
>  技术选型方面，我推动使用 `RAG` 替代单一调用 GPT 模型，从而降低成本并提升可控性；
>  上线后根据用户点击率和会话长度优化了 prompt 策略。

------

## 🧩 四、学习能力 & 问题解决类

### ✅ 7. 遇到 Google 找不到答案的问题你怎么解决？

**参考答案：**

> 我遇到 langchain 中 AgentExecutor 无法处理工具超时的问题，Google 找不到直接答案。我通过阅读其源码定位到 `run_tools` 的逻辑，通过调整 `tool_caller.run()` 的异步设置并使用 retry 包实现了稳定调用。
>  我习惯查官方文档 + GitHub Issue + Discord 社群，并不断实验。

------

## 🔍 五、趋势理解类

### ✅ 8. 你如何看待 AI Agent 的发展趋势？

**参考答案：**

> AI Agent 未来一定朝两个方向演进：

1. **更强的规划与协作能力**：从 LLM + 工具调用走向多模型协同；
2. **产品化平台化**：如 Dify、Cognosys 等把 Agent 构建和部署变得更简单；
    我认为 AI Agent 会成为企业内部流程自动化的重要推动力，而非单一问答应用。

------

## 🎁 六、行为类问题

### ✅ 9. 你曾在项目中如何推进一个技术落地？

**参考答案：**

> 在公司知识库项目中，我主导了 AI Agent 的引入，从调研到落地共 3 周，过程包括：

- 与业务沟通痛点；
- 快速原型验证（RAG + prompt 优化）；
- 向上汇报 ROI，推动资源支持；
   最终上线后用户满意度达 92%，节省客服人力 40%。

------

## 📋 面试清单总结

| 模块             | 关键点                | 建议准备              |
| ---------------- | --------------------- | --------------------- |
| Prompt & RAG     | 技术理解 + 优化实践   | 实操项目、常见问题    |
| Multi-Agent 构建 | Agent 分工 + 调度机制 | Langflow/Dify/Flowise |
| 编程能力         | Python + Shell + API  | 编写小项目            |
| 平台使用         | Dify/Coze             | UI 功能 + 应用场景    |
| 产品意识         | 用户视角 + 技术选型   | 项目复盘、痛点洞察    |
| 快速学习         | 无文档解决问题能力    | GitHub/Discord 查证   |
| 趋势理解         | 关注 LLM + 工具协同   | OpenAI/Mistral/GPTs   |
| 行为能力         | 项目推动 + 沟通协调   | STAR 法则回答经验题   |

------

如需我帮你把这些问题做成一个面试模拟文档（PDF 或 Word），或针对某个问题给出更详细的 STAR 法则答案，也可以告诉我。是否需要我生成一套 Word 模拟面试文档？