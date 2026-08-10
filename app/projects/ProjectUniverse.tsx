"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowDownIcon,
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
      <span className="architecture-module-action">VIEW MODULE ↗</span>
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
  const [selectedNodeId, setSelectedNodeId] = useState(architecture.defaultNode);
  const selectedNode = architecture.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const nodes = Object.fromEntries(architecture.nodes.map((node) => [node.id, node]));

  useEffect(() => {
    if (!selectedNodeId) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedNodeId("");
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedNodeId]);

  const selectProject = (index: number) => {
    const project = projects[index];
    setActiveIndex(index);
    setSelectedNodeId(architectureBySlug[project.slug].defaultNode);
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
      <div className="project-universe-meta">
        <span>WORK / 02</span>
        <span>RESEARCH SYSTEMS · BUILDING WITH CONTEXT</span>
      </div>

      <div className="project-universe-layout">
        <div className="project-universe-index">
          <div className="project-universe-list">
            {projects.map((project, index) => (
              <article
                className={activeIndex === index ? "active" : ""}
                key={project.slug}
                onPointerEnter={() => selectProject(index)}
              >
                <button type="button" onClick={() => selectProject(index)} aria-pressed={activeIndex === index}>
                  <span>0{index + 1}</span>
                  <h2>{project.title}</h2>
                  <p>{project.tags.slice(0, 3).join(" + ")}</p>
                </button>
                <div>
                  <span>{project.year}</span>
                  <Link href={`/projects/${project.slug}`}>VIEW CASE STUDY ↗</Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="architecture-stage">
          <div className="architecture-stage-heading">
            <span>SYSTEM ARCHITECTURE / 0{activeIndex + 1}</span>
            <span>SELECT A MODULE TO INSPECT</span>
          </div>

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
                <div className="architecture-detail-grid">
                  <div>
                    <span><StudentIcon size={22} weight="light" aria-hidden="true" />ROLE</span>
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
              ) : (
                <p>Select a framed module to see its role, implementation, and evidence.</p>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
