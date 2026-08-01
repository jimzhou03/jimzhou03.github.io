# 个人网站技术交接文档

更新日期：2026-08-01

## 1. 项目定位

这是周维杰的英文个人网站，主要用于德国留学期间申请 HiWi、学生工、实习和正式岗位。
内容比例以专业展示为主，生活照片为辅。网站当前是纯静态站，不需要服务器、数据库或登录。

- 正式网址：<https://jimzhou03.github.io/>
- GitHub 仓库：<https://github.com/jimzhou03/jimzhou03.github.io>
- 默认发布分支：`main`
- 页面语言：英文
- 视觉方向：黑白/暖米白、编辑式排版、宇宙与轨道隐喻、克制的动态效果

## 2. 实际技术栈

| 层级 | 技术 | 用途 |
| --- | --- | --- |
| 应用框架 | Next.js 16 App Router + React 19 + TypeScript | 页面、组件和静态导出 |
| 本地开发 | vinext 0.0.50 + Vite 8 | 快速本地开发服务器 |
| 样式 | 原生 CSS（`language-constellation.css` + `orbital-archive.css`） | 完整视觉系统与响应式布局 |
| 动画 | GSAP 3 + ScrollTrigger + SplitText | 标题、滚动进入和页面级编排 |
| 交互图形 | Canvas 2D + DOM fallback | 黑洞粒子、星系、项目星球和鼠标扰动 |
| 内容 | TypeScript 数据文件 | 项目与生活照片元数据 |
| 部署 | GitHub Actions + GitHub Pages | `main` 推送后自动静态构建和发布 |

当前没有使用 CMS、Supabase、Cloudflare D1、服务器端 API 或用户认证。仓库中的部分
Cloudflare/OpenAI Sites 配置来自初始模板，不是当前生产部署链路。

## 3. 页面与内容来源

| 页面 | 文件 | 主要内容 |
| --- | --- | --- |
| 首页 | `app/page.tsx` | 个人简介、学历、黑洞交互、两个项目入口 |
| Work | `app/projects/page.tsx` | 项目选择界面与项目星球 |
| AI 助教详情 | `app/projects/ai-teaching-assistant/page.tsx` | 系统目的、架构、工作流、个人职责、技术栈 |
| CCL25 详情 | `app/projects/ccl25-hate-speech/page.tsx` | LoRA 微调与结构化仇恨言论检测 |
| Life | `app/life/page.tsx` | 狗、校园风景与院子里的猫 |
| About | `app/about/page.tsx` | 简短个人陈述与联系方式 |

内容数据：

- `content/projects.ts`：项目标题、摘要、角色、标签和排序。
- `content/life.ts`：生活照片文件、名称和说明。
- `public/life/`：网站使用的 14 张生活照片。
- `app/components/SiteFooter.tsx`：格言、Email、LinkedIn 和 GitHub。

## 4. 核心组件职责

### `app/GravityField.tsx`

首页右侧黑洞场景。由三层组成：

1. CSS 黑洞、引力透镜环和吸积盘；
2. DOM 文字与陨石粒子保底层，确保 GitHub Pages 或 Canvas 初始化较慢时画面仍完整；
3. Canvas 粒子场，负责从左向右运动、靠近黑洞弯曲和鼠标排斥。

修改时必须保留 `prefers-reduced-motion`、IntersectionObserver 和 DPR 上限，避免性能退化。

### `app/ParticleField.tsx`

全站背景粒子与 GSAP 页面进入动画。新增页面区块时，如果需要滚动进入效果，将选择器加入该组件的
GSAP selector 列表，但不要同时用 GSAP 和 CSS/Motion 驱动同一个元素的 `transform`。

### `app/projects/ProjectUniverse.tsx`

Work 页项目星球与技术栈轨道。项目数据来自 `content/projects.ts`。

### `app/components/SiteFrame.tsx`

所有页面的公共框架，统一挂载 Header、全局粒子和 Footer。

## 5. 视觉与内容约束

- 保持暖米白 `#f2efe7`、近黑 `#0a0a09` 和细线网格；不要引入鲜艳主题色。
- 大标题使用 Georgia/Times 风格衬线字体，功能信息使用 Geist/等宽字体。
- 首页黑洞固定在右侧；文字与粒子可以缓慢运动，但不能遮挡主要信息。
- 动效必须支持 `prefers-reduced-motion`，移动端降低数量或关闭高成本效果。
- 首页保持简洁，不新增无意义的小标签、统计数字或模板化口号。
- AI 助教是团队项目。必须区分“系统使用的技术栈”和“周维杰实际负责的工作”，不要暗示整个系统由一人独立完成。
- 不要把测试账号、密码、密钥、Dify 管理地址或其他凭据写进仓库。
- Life 页面当前不自动播放音乐；浏览器通常会阻止未交互的自动播放。

## 6. AI 助教案例页事实边界

项目全称：**AI Teaching Assistant System Based on RAG & Domain Knowledge Graph**。

系统能力：课程问答、练习推荐、学习报告、学习路径；结合 RAG、领域知识图谱与 BKT 学习者状态。

周维杰实际负责：

- 项目组长，负责规划、任务分工和跨模块协调；
- 搭建 Dify 工作流并连接检索、图谱上下文与模型调用；
- 定义数据库字段、API contract 和服务间 payload；
- 搭建前期领域知识图谱 schema 与查询原型；
- 封装外部 API、配置 Dify HTTP 节点并参与端到端联调。

公开系统入口：<https://www.zcst-ai-assistant.online/login>（需要登录）。

## 7. 本地运行与验证

Node.js 要求：`>=22.13.0`。

```powershell
npm ci
npm run dev
```

默认本地地址：<http://127.0.0.1:3000/>。

提交前至少执行：

```powershell
npm run lint
$env:GITHUB_PAGES = "true"
npm run build:pages
Remove-Item Env:GITHUB_PAGES
```

构建应生成静态路由，并在 `out/` 输出 GitHub Pages 文件。

## 8. 发布流程

`.github/workflows/deploy-pages.yml` 监听 `main`：

1. 安装 Node.js 22；
2. `npm ci`；
3. 设置 `GITHUB_PAGES=true`；
4. `npm run build:pages`；
5. 上传 `out/` 并部署 GitHub Pages。

常规发布命令：

```powershell
git status -sb
git add <本次相关文件>
git commit -m "描述本次修改"
git push origin main
```

推送后检查 GitHub Actions，再访问正式网址并强制刷新。GitHub Pages 可能需要几分钟更新。

## 9. 接手新任务时的检查顺序

1. 阅读 `README.md` 和本文件；
2. 执行 `git status -sb`，不要覆盖未提交的用户改动；
3. 执行 `git log --oneline -8`，了解最近设计迭代；
4. 阅读目标页面、相关内容数据和 `app/orbital-archive.css`；
5. 在本地实现并进行桌面/移动端视觉检查；
6. 运行 lint 与 GitHub Pages 静态构建；
7. 未经用户明确同意，不要推送上线。

## 10. 下一个 Codex 对话推荐提示词

```text
请继续开发我的个人网站。

本地仓库路径：
C:\Users\lovane\Documents\Codex\2026-07-11\sites-plugin-sites-openai-bundled-2

正式网站：https://jimzhou03.github.io/

开始前请先：
1. 完整读取 README.md 和 TECHNICAL_HANDOFF.md；
2. 检查 git status -sb 和最近 8 条 git log；
3. 不要重建项目，不要覆盖未提交改动；
4. 保持现有黑白暖米白、编辑式排版和宇宙交互风格；
5. 修改后先给我看本地效果，运行 npm run lint 和 GitHub Pages 静态构建；
6. 只有我明确说“推送”时才提交并发布。

这次要做的任务是：
[在这里写新的修改需求，并附上截图或照片]
```
