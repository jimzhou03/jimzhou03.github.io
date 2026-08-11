"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  BookOpenTextIcon,
  BracketsCurlyIcon,
  ChartLineIcon,
  ChatCircleTextIcon,
  DatabaseIcon,
  FileTextIcon,
  FlowArrowIcon,
  GearSixIcon,
  GraphIcon,
  PauseIcon,
  PlayIcon,
  ShieldCheckIcon,
  StudentIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import { projects } from "../../content/projects";

type ArchitectureNode = {
  id: string;
  label: string;
  role: string;
  implementation: string;
  proof: string;
  icon: Icon;
};

type ArchitectureDefinition = {
  defaultNode: string;
  nodes: ArchitectureNode[];
};

type DemoFrame = {
  eyebrow: string;
  title: string;
  description: string;
  proof: string;
  source: string;
  brief?: (typeof projects)[number]["brief"];
  image?: string;
  imageAlt?: string;
  code?: {
    filename: string;
    language: string;
    lines: string[];
  };
};

const projectBySlug = Object.fromEntries(projects.map((project) => [project.slug, project]));

const briefFrame = (slug: string): DemoFrame => {
  const project = projectBySlug[slug];

  return {
    eyebrow: "00 / PROJECT BRIEF",
    title: project.summary,
    description: project.question,
    proof: project.brief.evidence,
    source: "PROJECT BRIEF · VERIFIED FROM ORIGINAL MATERIAL",
    brief: project.brief,
  };
};

const demoBySlug: Record<string, DemoFrame[]> = {
  "ai-teaching-assistant": [
    briefFrame("ai-teaching-assistant"),
    {
      eyebrow: "01 / RUNNING SYSTEM",
      title: "The learner experience starts from a real working interface",
      description: "I built the student-facing learning center around persistent conversations, question history, practice records, and next-step support.",
      proof: "Original system screenshot showing the implemented student home page and its production information architecture.",
      source: "ORIGINAL SCREENSHOT · SYSTEM RUNNING INTERFACE",
      image: "/project-demos/ai-teaching-assistant/process-01-system-interface.png",
      imageAlt: "Original screenshot of the running AI teaching assistant student interface",
    },
    {
      eyebrow: "02 / WORKFLOW BUILD",
      title: "I orchestrated the answer path in Dify",
      description: "Intent detection routes questions into practice, prerequisite lookup, course retrieval, or direct answering before the branches merge into one response.",
      proof: "Original Dify canvas with the actual API, routing, RAG retrieval, graph lookup, and answer-generation nodes.",
      source: "ORIGINAL SCREENSHOT · DIFY AI ASSISTANT WORKFLOW",
      image: "/project-demos/ai-teaching-assistant/process-02-dify-workflow.png",
      imageAlt: "Original Dify workflow screenshot for the AI assistant",
    },
    {
      eyebrow: "03 / RETRIEVAL CONFIG",
      title: "The evidence path is configured, not implied",
      description: "The knowledge base uses text-embedding-3-large, hybrid retrieval, Top-K control, and weighted semantic and keyword matching.",
      proof: "Original retrieval-settings screenshot records the embedding model, retrieval strategy, weighting, and Top-K value used in the system.",
      source: "ORIGINAL SCREENSHOT · RAG KNOWLEDGE-BASE SETTINGS",
      image: "/project-demos/ai-teaching-assistant/process-03-rag-config.png",
      imageAlt: "Original RAG retrieval configuration screenshot",
    },
    {
      eyebrow: "04 / GRAPH QUERY",
      title: "Course structure is queried from real graph data",
      description: "A Cypher query walks from a course to topics and deeper knowledge points, returning the hierarchy used for prerequisite-aware explanations and paths.",
      proof: "Original query-and-result screenshot shows the executed course hierarchy query and returned nodes for the machine-learning course.",
      source: "ORIGINAL SCREENSHOT · COURSE GRAPH QUERY RESULT",
      image: "/project-demos/ai-teaching-assistant/process-04-kg-query.png",
      imageAlt: "Original course knowledge graph query and result screenshot",
    },
    {
      eyebrow: "05 / ANSWER RESULT",
      title: "Retrieved evidence reaches the student answer",
      description: "The student asks about KNN and receives a structured explanation with a visible retrieval citation instead of an unsupported model-only reply.",
      proof: "Original application screenshot contains the real conversation history, question, grounded answer, and retrieval-source marker.",
      source: "ORIGINAL SCREENSHOT · STUDENT QUESTION-ANSWER RESULT",
      image: "/project-demos/ai-teaching-assistant/process-05-qa-result.png",
      imageAlt: "Original AI teaching assistant question and grounded answer screenshot",
    },
    {
      eyebrow: "06 / LEARNING REPORT",
      title: "Stored attempts become an evidence-based report",
      description: "The report reads answer history and mastery values, identifies weak knowledge points, lists recent mistakes, and proposes concrete review actions.",
      proof: "Original report screenshot shows real attempt counts, mastery percentages, question IDs, timestamps, and generated next-step advice.",
      source: "ORIGINAL SCREENSHOT · LEARNING REPORT RESULT",
      image: "/project-demos/ai-teaching-assistant/process-06-learning-report.png",
      imageAlt: "Original AI teaching assistant learning report screenshot",
    },
    {
      eyebrow: "07 / LEARNING PATH",
      title: "The same learner state drives the next study path",
      description: "Weak topics are prioritized, prerequisite order is respected, and the response turns the mastery state into a sequenced study plan.",
      proof: "Original path-planning screenshot exposes the mastery values, selected priority target, prerequisite order, and action plan used for the learner.",
      source: "ORIGINAL SCREENSHOT · PERSONALIZED LEARNING PATH",
      image: "/project-demos/ai-teaching-assistant/process-07-learning-path.png",
      imageAlt: "Original personalized learning path result screenshot",
    },
  ],
  "ccl25-hate-speech": [
    briefFrame("ccl25-hate-speech"),
    {
      eyebrow: "01 / OFFICIAL ENTRY",
      title: "The project began as a real CCL25 competition entry",
      description: "I registered for the official fine-grained Chinese hate-speech evaluation and built the project against its task and submission contract.",
      proof: "Original Tianchi competition-page screenshot shows the registered CCL2025 fine-grained Chinese hate-speech task.",
      source: "ORIGINAL SCREENSHOT · TIANCHI COMPETITION REGISTRATION",
      image: "/project-demos/ccl25-hate-speech/process-01-competition-registration.png",
      imageAlt: "Original screenshot of the registered CCL2025 competition page",
    },
    {
      eyebrow: "02 / DATA CONVERSION",
      title: "I converted the task data into supervised messages",
      description: "The conversion script keeps each source comment, injects the complete quadruple instruction, and writes the gold output as the assistant response in JSONL.",
      proof: "This is an excerpt from the actual utils/change.py that produced sft_data.jsonl and test_data.jsonl.",
      source: "ORIGINAL SOURCE ARTIFACT · utils/change.py",
      code: {
        filename: "utils/change.py",
        language: "PYTHON · DATA PREPARATION",
        lines: [
          "train_data = json.load(open('./train.json', 'r', encoding='utf-8'))",
          "",
          "for item in train_data:",
          "    text = item['content']",
          "    label = item['output']",
          "    temp = {}",
          "    temp['messages'] = [",
          "        {'role': 'system', 'content': sys},",
          "        {'role': 'user', 'content': text},",
          "        {'role': 'assistant', 'content': label}",
          "    ]",
          "    train_file.write(json.dumps(temp, ensure_ascii=False) + '\\n')",
        ],
      },
    },
    {
      eyebrow: "03 / LORA TRAINING",
      title: "The final GLM run is reproducible from one script",
      description: "The selected run uses GLM-4-9B, three epochs, cosine scheduling, 5e-5 learning rate, all-linear targets, rank 64, and alpha 128.",
      proof: "This excerpt is taken from the actual scripts/sft.sh used for the rank-64 training run.",
      source: "ORIGINAL SOURCE ARTIFACT · scripts/sft.sh",
      code: {
        filename: "scripts/sft.sh",
        language: "SHELL · MS-SWIFT LORA TRAINING",
        lines: [
          "CUDA_VISIBLE_DEVICES=0 swift sft \\",
          "  --model '../pretrain/GLM-4-9B-0414' \\",
          "  --train_type lora \\",
          "  --dataset ./sft_data.jsonl \\",
          "  --num_train_epochs 3 \\",
          "  --gradient_accumulation_steps 8 \\",
          "  --lr_scheduler_type cosine \\",
          "  --learning_rate 5e-5 \\",
          "  --target_modules all-linear \\",
          "  --lora_rank 64 \\",
          "  --lora_alpha 128 \\",
          "  --logging_steps 5",
        ],
      },
    },
    {
      eyebrow: "04 / TRAINING LOSS",
      title: "The rank-64 run converged across 1,488 steps",
      description: "The training loss drops sharply in the first phase, then continues downward with a stable late-stage profile.",
      proof: "Raw trainer export from glm-4-9b-0414 v1; its adapter_config records LoRA rank 64 and alpha 128.",
      source: "ORIGINAL TRAINING ARTIFACT · GLM-4-9B V1 TRAIN LOSS",
      image: "/project-demos/ccl25-hate-speech/process-04-train-loss.png",
      imageAlt: "Original GLM-4-9B LoRA rank-64 training loss curve",
    },
    {
      eyebrow: "05 / SUBMISSION BUILD",
      title: "Predictions are converted into the required result file",
      description: "The submission utility reads every inference response and writes one structured prediction per line without changing the generated quadruple format.",
      proof: "This is an excerpt from the actual utils/submit.py used to create predict_result.txt.",
      source: "ORIGINAL SOURCE ARTIFACT · utils/submit.py",
      code: {
        filename: "utils/submit.py",
        language: "PYTHON · SUBMISSION FORMATTER",
        lines: [
          "with open('./predict_result.jsonl', 'r', encoding='utf-8') as f:",
          "    preds = f.readlines()",
          "",
          "all_preds = []",
          "for line in preds:",
          "    line = json.loads(line)",
          "    response = line['response']",
          "    all_preds.append(response)",
          "",
          "with open('predict_result.txt', 'w', encoding='utf-8') as file:",
          "    for item in all_preds:",
          "        file.write(item + '\\n')",
        ],
      },
    },
    {
      eyebrow: "06 / REPORTED OUTCOME",
      title: "The work ends with a documented competition result",
      description: "The final report records the working GLM-LoRA system, controlled comparisons, training evidence, and the submitted competition score.",
      proof: "Project-report evidence combines the method summary with the captured competition result table.",
      source: "PROJECT REPORT · FINAL OUTCOME AND COMPETITION RESULT",
      image: "/project-demos/ccl25-hate-speech/05-project-outcome.png",
      imageAlt: "Fine-grained hate speech project outcome and competition result",
    },
  ],
};

const architectureBySlug: Record<string, ArchitectureDefinition> = {
  "ai-teaching-assistant": {
    defaultNode: "bkt-mastery",
    nodes: [
      {
        id: "dify-orchestration",
        label: "Dify Workflow Orchestration",
        role: "Routes each learner request into the correct question-answering or practice branch.",
        implementation: "Parses intent, resolves the course and target topic, then coordinates course retrieval, graph queries, answer generation, and the backend API contract.",
        proof: "Implemented as the orchestration layer behind the AI assistant, recommendation, learning-report, and learning-path workflows.",
        icon: FlowArrowIcon,
      },
      {
        id: "course-evidence",
        label: "Course Evidence · RAG",
        role: "Supplies text evidence from the actual course materials instead of relying on model memory.",
        implementation: "Retrieves course-scoped passages with Top-K search and applies gte-rerank-v2 before the evidence enters the answer context.",
        proof: "The thesis documents course knowledge-base retrieval and reranking as the textual evidence path of reliable question answering.",
        icon: DatabaseIcon,
      },
      {
        id: "course-structure",
        label: "Course Structure · Apache AGE",
        role: "Adds explicit chapter, topic, related-concept, and prerequisite constraints to the retrieved evidence.",
        implementation: "Queries the course graph in Apache AGE for topic hierarchy, related nodes, and DEPENDS_ON prerequisite relationships.",
        proof: "The implemented graph queries return chapter membership, related topics, question links, and prerequisite dependencies.",
        icon: GraphIcon,
      },
      {
        id: "grounded-answer",
        label: "Evidence-grounded Answer",
        role: "Returns a course-bounded explanation that remains traceable to text evidence and graph context.",
        implementation: "Combines retrieved passages and structured course relations, streams the response through SSE, and returns a limited explanation when evidence is insufficient.",
        proof: "The final architecture separates model wording from deterministic course queries and backend response constraints.",
        icon: ChatCircleTextIcon,
      },
      {
        id: "answer-writeback",
        label: "Answer Write-back & Topic Mapping",
        role: "Turns a completed exercise into reusable learning-state evidence.",
        implementation: "Stores the attempt, correctness, and difficulty, then maps the question to its graphTopicId / Topic so the correct mastery record can be updated.",
        proof: "The thesis defines answer write-back and topic mapping as the bridge between practice and learner-state persistence.",
        icon: BookOpenTextIcon,
      },
      {
        id: "bkt-mastery",
        label: "BKT Mastery Update",
        role: "Updates learner mastery for each topic from attempt outcomes and behavior signals.",
        implementation: "Uses historical attempts, correctness, question difficulty, and guess/slip estimates to update mastery probability via Bayesian Knowledge Tracing.",
        proof: "Implemented in the bachelor-thesis final architecture as the learning-state update module, with the update chain and equations documented.",
        icon: ChartLineIcon,
      },
      {
        id: "continued-learning",
        label: "Continued Learning Support",
        role: "Reuses one persistent mastery state across the learner's next decisions.",
        implementation: "Feeds updated topic mastery into the learning report, rule-based personalized question recommendation, and prerequisite-aware study-path planning.",
        proof: "All three downstream modules read the same stored mastery state rather than generating independent learner profiles.",
        icon: TargetIcon,
      },
      {
        id: "engineering-foundation",
        label: "Engineering Foundation",
        role: "Keeps workflow, business data, course structure, and learner state consistent across the system.",
        implementation: "Uses PostgreSQL for business and learning-state records, Apache AGE for graph relations, backend APIs for deterministic operations, and Dify for workflow composition.",
        proof: "The final system architecture validates the complete chain across the workflow, API, knowledge-and-algorithm, and data layers.",
        icon: GearSixIcon,
      },
    ],
  },
  "ccl25-hate-speech": {
    defaultNode: "evaluation",
    nodes: [
      {
        id: "social-comment",
        label: "Social-media Comment",
        role: "Provides the original Chinese text to be analyzed at span and relation level.",
        implementation: "Keeps the source content intact and passes it directly into the task instruction without inventing an unsupported text-cleaning stage.",
        proof: "The released conversion script reads each sample's content field and places it in the user message.",
        icon: ChatCircleTextIcon,
      },
      {
        id: "task-schema",
        label: "Task Instruction & Schema",
        role: "Defines the extraction target and the exact output contract before generation.",
        implementation: "The system prompt explains Target, Argument, five Targeted Group classes, Hateful, and the required [SEP] / [END] delimiters.",
        proof: "The same instruction is used when converting both training and test examples to the messages format.",
        icon: BracketsCurlyIcon,
      },
      {
        id: "glm-lora",
        label: "GLM-4-9B + LoRA Adapter",
        role: "Models long Chinese context while adapting only a small fraction of parameters to quadruple extraction.",
        implementation: "Keeps the GLM-4-9B base model and attaches a low-rank adapter across all linear modules for task-specific generation.",
        proof: "The system report records a 0.76% adapted-parameter ratio for the selected rank-64 GLM configuration.",
        icon: ArrowsClockwiseIcon,
      },
      {
        id: "quadruple-generation",
        label: "Quadruple Generation",
        role: "Expresses the fine-grained relation rather than returning only a hate / non-hate class.",
        implementation: "Generates Target | Argument | Targeted Group | Hateful, separates multiple quadruples with [SEP], and terminates each group with [END].",
        proof: "This exact four-field format is the submission contract used by CCL25-Eval Task 10.",
        icon: BracketsCurlyIcon,
      },
      {
        id: "submission",
        label: "Submission Formatter",
        role: "Converts generated responses into the competition's line-oriented result file.",
        implementation: "Extracts the response field from each inference record and writes one formatted prediction per line without changing the generated quadruple schema.",
        proof: "The released submit.py utility implements this final response-to-file conversion.",
        icon: FileTextIcon,
      },
      {
        id: "state-toxicn",
        label: "STATE-ToxiCN Dataset",
        role: "Provides human-annotated Chinese comments and fine-grained quadruple labels for supervised adaptation.",
        implementation: "Each record retains its id, content, and output fields, including multiple quadruples when a comment contains more than one target relation.",
        proof: "The project report uses STATE-ToxiCN for CCL25-Eval Task 10 training and controlled model comparison.",
        icon: DatabaseIcon,
      },
      {
        id: "messages-conversion",
        label: "Messages Conversion",
        role: "Turns the competition records into the conversational format expected by MS-SWIFT.",
        implementation: "Serializes system, user, and assistant messages to JSONL; the assistant message contains the gold quadruple output during training.",
        proof: "The released change.py utility creates both sft_data.jsonl and test_data.jsonl with this structure.",
        icon: BracketsCurlyIcon,
      },
      {
        id: "ms-swift",
        label: "MS-SWIFT LoRA Fine-tuning",
        role: "Adapts the model efficiently under limited GPU memory while preserving the base model.",
        implementation: "Uses rank 64, alpha 128, all-linear targets, 3 epochs, 5e-5 learning rate, batch size 1, and gradient accumulation 8.",
        proof: "These parameters are recorded in the released training script and the reported rank-ablation study.",
        icon: GearSixIcon,
      },
      {
        id: "evaluation",
        label: "Evaluation & Ablation",
        role: "Scores structured predictions and compares model families and adapter configurations.",
        implementation: "Computes Hard-match F1 for exact quadruples and Soft-match F1 for partial string alignment, then reports their arithmetic mean.",
        proof: "GLM-4-9B reached 0.2441 Hard-match F1, 0.4692 Soft-match F1, and a 0.3566 average; the study also compares Qwen, LLaMA, and LoRA ranks.",
        icon: ShieldCheckIcon,
      },
    ],
  },
};

type ModuleButtonProps = {
  node: ArchitectureNode;
  selected: boolean;
  className?: string;
  children?: React.ReactNode;
  onSelect: (id: string) => void;
};

function ModuleButton({ node, selected, className = "", children, onSelect }: ModuleButtonProps) {
  const ModuleIcon = node.icon;

  return (
    <button
      type="button"
      className={`architecture-module ${className} ${selected ? "active" : ""}`}
      aria-label={`Inspect ${node.label} module`}
      aria-expanded={selected}
      aria-controls="architecture-module-detail"
      onClick={() => onSelect(node.id)}
    >
      <ModuleIcon className="architecture-module-icon" size={32} weight="light" aria-hidden="true" />
      <span className="architecture-module-copy">
        <strong>{node.label}</strong>
        {children}
      </span>
      <span className="architecture-module-inline-detail">
        <span>
          <b>MODULE ROLE</b>
          <em>{node.role}</em>
        </span>
        <span>
          <b>HOW IT WORKS</b>
          <em>{node.implementation}</em>
        </span>
        <span>
          <b>PROOF</b>
          <em>{node.proof}</em>
        </span>
      </span>
    </button>
  );
}

function FlowArrow({ update = false }: { update?: boolean }) {
  return (
    <span className={`architecture-flow-arrow ${update ? "update" : ""}`} aria-hidden="true">
      <ArrowRightIcon size={23} weight="regular" />
      <ArrowDownIcon size={21} weight="regular" />
    </span>
  );
}

export default function ProjectUniverse() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];
  const architecture = architectureBySlug[activeProject.slug];
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoFrameIndex, setDemoFrameIndex] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [caseStudyOpenerIndex, setCaseStudyOpenerIndex] = useState(0);
  const caseStudyTriggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const caseStudyBoardRef = useRef<HTMLElement | null>(null);
  const selectedNode = architecture.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const nodes = Object.fromEntries(architecture.nodes.map((node) => [node.id, node]));
  const demoFrames = demoBySlug[activeProject.slug];
  const demoFrame = demoFrames[demoFrameIndex];

  const closeCaseStudy = useCallback((restoreFocus = true) => {
    setDemoOpen(false);
    setDemoPlaying(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => caseStudyTriggerRefs.current[caseStudyOpenerIndex]?.focus());
    }
  }, [caseStudyOpenerIndex]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (demoOpen) {
        closeCaseStudy();
        return;
      }
      setSelectedNodeId("");
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeCaseStudy, demoOpen]);

  useEffect(() => {
    if (!demoOpen) return;
    window.requestAnimationFrame(() => caseStudyBoardRef.current?.focus());
  }, [demoOpen]);

  useEffect(() => {
    if (!demoOpen || !demoPlaying) return;

    const advance = window.setTimeout(() => {
      if (demoFrameIndex === demoFrames.length - 1) {
        setDemoPlaying(false);
        return;
      }
      setDemoFrameIndex((current) => current + 1);
    }, 4800);

    return () => window.clearTimeout(advance);
  }, [demoFrameIndex, demoFrames.length, demoOpen, demoPlaying]);

  const selectProject = (index: number) => {
    setActiveIndex(index);
    setSelectedNodeId("");
    setDemoOpen(false);
    setDemoPlaying(false);
    setDemoFrameIndex(0);
  };

  const openCaseStudy = (index: number) => {
    setActiveIndex(index);
    setSelectedNodeId("");
    setDemoFrameIndex(0);
    setCaseStudyOpenerIndex(index);
    setDemoOpen(true);
    setDemoPlaying(false);
  };

  const showDemoFrame = (index: number) => {
    setDemoFrameIndex(index);
    setDemoPlaying(false);
  };

  const moveDemo = (direction: -1 | 1) => {
    setDemoFrameIndex((current) => Math.min(Math.max(current + direction, 0), demoFrames.length - 1));
    setDemoPlaying(false);
  };

  const toggleDemoPlayback = () => {
    if (!demoPlaying && demoFrameIndex === demoFrames.length - 1) setDemoFrameIndex(0);
    setDemoPlaying((current) => !current);
  };

  const selectModule = (id: string) => {
    setSelectedNodeId((current) => current === id ? "" : id);
  };

  const moduleButton = (id: string, content: React.ReactNode, className = "") => (
    <ModuleButton
      node={nodes[id]}
      selected={selectedNodeId === id}
      className={className}
      onSelect={selectModule}
    >
      {content}
    </ModuleButton>
  );

  return (
    <section className="project-universe" aria-label="Selected work">
      <h1 className="project-route-title" data-route-focus tabIndex={-1}>Selected Work — NLP and Language Systems</h1>
      <div className="project-universe-meta">
        <span>RESEARCH SYSTEMS · BUILDING WITH CONTEXT</span>
      </div>

      <div className="project-universe-layout">
        <div className="project-universe-index">
          <div className="project-universe-list">
            {projects.map((project, index) => (
              <article className={activeIndex === index ? "active" : ""} key={project.slug}>
                <button type="button" onClick={() => selectProject(index)} aria-pressed={activeIndex === index}>
                  <span>0{index + 1}</span>
                  <h2>{project.title}</h2>
                  <p>{project.tags.slice(0, 3).join(" + ")}</p>
                </button>
                <div>
                  <span>{project.year}</span>
                  <span className="project-universe-actions">
                    <button
                      ref={(element) => { caseStudyTriggerRefs.current[index] = element; }}
                      type="button"
                      onClick={() => openCaseStudy(index)}
                      aria-expanded={demoOpen && activeIndex === index}
                      aria-controls="project-case-study"
                    >
                      EXPLORE CASE STUDY →
                    </button>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="architecture-stage">
          <div className="architecture-stage-heading">
            <span>{demoOpen ? "CASE STUDY" : "SYSTEM ARCHITECTURE"} / 0{activeIndex + 1}</span>
            <span>{demoOpen ? "REAL PROJECT EVIDENCE · STEP-BY-STEP" : "SELECT A MODULE TO INSPECT"}</span>
          </div>

          {demoOpen ? (
            <section
              ref={caseStudyBoardRef}
              id="project-case-study"
              className={`project-demo-board ${demoPlaying ? "is-playing" : "is-paused"}`}
              aria-label={`${activeProject.title} case study`}
              tabIndex={-1}
            >
              <header className="project-demo-toolbar">
                <div>
                  <span>CASE STUDY / {String(demoFrameIndex).padStart(2, "0")} OF {String(demoFrames.length - 1).padStart(2, "0")}</span>
                  <strong>{activeProject.title}</strong>
                </div>
                <div className="project-demo-toolbar-actions">
                  <button type="button" onClick={toggleDemoPlayback} aria-label={demoPlaying ? "Pause project demo" : "Play project demo"}>
                    {demoPlaying ? <PauseIcon size={14} weight="fill" aria-hidden="true" /> : <PlayIcon size={14} weight="fill" aria-hidden="true" />}
                    {demoPlaying ? "PAUSE" : demoFrameIndex === demoFrames.length - 1 ? "REPLAY" : "PLAY"}
                  </button>
                  <button type="button" onClick={() => closeCaseStudy()}>
                    CLOSE ×
                  </button>
                </div>
              </header>

              <div className={`project-demo-media ${demoFrame.brief ? "is-brief" : ""}`} key={`${activeProject.slug}-${demoFrameIndex}`}>
                {demoFrame.brief ? (
                  <div className="project-demo-brief">
                    <div className="project-demo-brief-lead">
                      <span>00 / PROJECT BRIEF</span>
                      <h3>{activeProject.title}</h3>
                      <p>{activeProject.summary}</p>
                    </div>
                    <div className="project-demo-brief-grid">
                      <article>
                        <span>PROBLEM</span>
                        <p>{demoFrame.brief.problem}</p>
                      </article>
                      <article>
                        <span>MY ROLE</span>
                        <p>{demoFrame.brief.role}</p>
                      </article>
                      <article className="project-demo-brief-stack">
                        <span>CORE STACK</span>
                        <ul>{demoFrame.brief.stack.map((item) => <li key={item}>{item}</li>)}</ul>
                      </article>
                      <article className="project-demo-brief-route">
                        <span>IMPLEMENTATION ROUTE</span>
                        <ol>{demoFrame.brief.route.map((item, index) => <li key={item}><b>0{index + 1}</b>{item}</li>)}</ol>
                      </article>
                      <article className="project-demo-brief-outcome">
                        <span>OUTCOME / PROOF</span>
                        <p>{demoFrame.brief.outcome}</p>
                        <small>{demoFrame.brief.evidence}</small>
                      </article>
                    </div>
                  </div>
                ) : demoFrame.code ? (
                  <div className="project-demo-code" aria-label={`${demoFrame.code.filename} source excerpt`}>
                    <header>
                      <span>{demoFrame.code.filename}</span>
                      <span>{demoFrame.code.language}</span>
                    </header>
                    <pre><code>{demoFrame.code.lines.join("\n")}</code></pre>
                  </div>
                ) : demoFrame.image ? (
                  <Image
                    className="project-demo-image"
                    src={demoFrame.image}
                    alt={demoFrame.imageAlt ?? "Project process evidence"}
                    fill
                    sizes="(max-width: 820px) 100vw, 68vw"
                    loading="eager"
                  />
                ) : null}
                <span className="project-demo-scan" aria-hidden="true" />
                <span className="project-demo-source">{demoFrame.source}</span>
              </div>

              {!demoFrame.brief ? (
                <div className="project-demo-story" key={`${activeProject.slug}-${demoFrameIndex}-story`}>
                  <div>
                    <span>{demoFrame.eyebrow}</span>
                    <h3>{demoFrame.title}</h3>
                  </div>
                  <div className="project-demo-explanation">
                    <p>{demoFrame.description}</p>
                    <small><b>PROOF</b>{demoFrame.proof}</small>
                  </div>
                </div>
              ) : null}

              <footer className="project-demo-controls">
                <button type="button" onClick={() => moveDemo(-1)} disabled={demoFrameIndex === 0} aria-label="Previous demo frame">
                  <ArrowLeftIcon size={16} weight="regular" aria-hidden="true" /> PREV
                </button>
                <div className="project-demo-steps" aria-label="Demo chapters">
                  {demoFrames.map((frame, index) => (
                    <button
                      type="button"
                      key={frame.eyebrow}
                      className={index === demoFrameIndex ? "active" : ""}
                      onClick={() => showDemoFrame(index)}
                      aria-label={`Show ${frame.eyebrow}`}
                      aria-current={index === demoFrameIndex ? "step" : undefined}
                    >
                      <span>{String(index).padStart(2, "0")}</span>
                      <i aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => moveDemo(1)} disabled={demoFrameIndex === demoFrames.length - 1} aria-label="Next demo frame">
                  NEXT <ArrowRightIcon size={16} weight="regular" aria-hidden="true" />
                </button>
              </footer>
            </section>
          ) : (
          <div className={`architecture-board architecture-board-${activeProject.slug}`}>
            <div className="architecture-canvas">
              {activeProject.slug === "ai-teaching-assistant" ? (
                <>
                  <section className="architecture-diagram-section architecture-ai-question" aria-label="Question answer chain">
                    <h3>1. QUESTION-ANSWER CHAIN</h3>
                    <div className="architecture-ai-question-grid">
                      {moduleButton("dify-orchestration", <small>intent routing · topic lookup<br />QA / practice branch</small>)}
                      <FlowArrow />
                      {moduleButton("course-evidence", <small>Top-K retrieval<br />gte-rerank-v2</small>)}
                      <FlowArrow />
                      {moduleButton("course-structure", <small>chapter · related topics<br />prerequisites</small>)}
                      <FlowArrow />
                      {moduleButton("grounded-answer", <small>text evidence + graph context<br />SSE streaming · limited response</small>)}
                    </div>
                  </section>

                  <section className="architecture-diagram-section architecture-ai-loop" aria-label="Learning loop">
                    <h3>2. LEARNING LOOP</h3>
                    <div className="architecture-ai-loop-grid">
                      {moduleButton("answer-writeback", <small>store attempt · map<br />question to topic</small>)}
                      <FlowArrow update />
                      {moduleButton("bkt-mastery", <small>history · difficulty · guess/slip<br />mastery probability</small>)}
                      <FlowArrow update />
                      {moduleButton("continued-learning", <small>learning report · recommendation<br />study path planning</small>)}
                    </div>
                    <div className="architecture-loop-return" aria-hidden="true">
                      <ArrowsClockwiseIcon size={18} weight="regular" />
                      ANSWER → STATE → NEXT SUPPORT
                    </div>
                  </section>

                  <section className="architecture-diagram-section architecture-foundation" aria-label="Engineering foundation">
                    <h3>3. ENGINEERING FOUNDATION</h3>
                    {moduleButton("engineering-foundation", <small>PostgreSQL · Apache AGE · Backend API · Dify</small>)}
                  </section>
                </>
              ) : (
                <>
                  <section className="architecture-diagram-section architecture-ccl-inference" aria-label="Inference flow">
                    <h3>INFERENCE FLOW</h3>
                    <div className="architecture-ccl-inference-grid">
                      {moduleButton("social-comment", <span className="architecture-comment-sample">某些人就是心胸狭窄，<br />看不得别人比自己好。</span>)}
                      <FlowArrow />
                      {moduleButton("task-schema", <small>system prompt<br />5 target groups<br />output format</small>)}
                      <FlowArrow />
                      {moduleButton("glm-lora", <small>GLM-4-9B base model<br />LoRA adapter</small>)}
                      <FlowArrow />
                      {moduleButton("quadruple-generation", <><span className="architecture-schema-row">Target <i /> Argument <i /> Targeted Group <i /> Hateful</span><small>multiple quadruples: [SEP]<br />end token: [END]</small></>)}
                      <FlowArrow />
                      {moduleButton("submission", <small>extract response<br />convert line-by-line<br />to submission file</small>)}
                    </div>
                  </section>

                  <section className="architecture-diagram-section architecture-ccl-training" aria-label="Training flow">
                    <h3>TRAINING FLOW</h3>
                    <div className="architecture-ccl-training-grid">
                      {moduleButton("state-toxicn", <small>content · output<br />quadruple labels</small>)}
                      <FlowArrow update />
                      {moduleButton("messages-conversion", <small>system / user / assistant<br />JSONL</small>)}
                      <FlowArrow update />
                      {moduleButton("ms-swift", <small>rank 64 · alpha 128 · all-linear<br />3 epochs · lr 5e-5 · grad accum 8</small>)}
                      <FlowArrow update />
                      {moduleButton("evaluation", <><span className="architecture-metric"><b>Hard-match F1</b><strong>0.2441</strong></span><span className="architecture-metric"><b>Soft-match F1</b><strong>0.4692</strong></span><span className="architecture-metric"><b>Average</b><strong>0.3566</strong></span><small>Qwen / LLaMA comparison<br />LoRA rank ablation</small></>)}
                    </div>
                  </section>

                  <div className="architecture-legend" aria-label="Diagram legend">
                    <span><ArrowRightIcon size={17} weight="regular" />Inference Flow</span>
                    <span><ArrowsClockwiseIcon size={17} weight="regular" />Training / Update</span>
                  </div>
                </>
              )}
            </div>

            <aside
              id="architecture-module-detail"
              className={`architecture-detail ${selectedNode ? "open" : ""}`}
              aria-live="polite"
            >
              {selectedNode ? (
                <>
                  <header className="architecture-detail-heading">
                    <span>MODULE / {selectedNode.label}</span>
                    <button type="button" onClick={() => setSelectedNodeId("")} aria-label="Close module details">
                      CLOSE ×
                    </button>
                  </header>
                  <div className="architecture-detail-grid">
                    <div>
                      <span><StudentIcon size={22} weight="light" aria-hidden="true" />MODULE ROLE</span>
                      <p>{selectedNode.role}</p>
                    </div>
                    <div>
                      <span><GearSixIcon size={22} weight="light" aria-hidden="true" />HOW IT WORKS</span>
                      <p>{selectedNode.implementation}</p>
                    </div>
                    <div>
                      <span><ShieldCheckIcon size={22} weight="light" aria-hidden="true" />PROOF</span>
                      <p>{selectedNode.proof}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p>Select a framed module to see its role, implementation, and evidence.</p>
              )}
            </aside>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
