"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { projects } from "../../content/projects";

type ArchitectureNode = {
  id: string;
  label: string;
  role: string;
  implementation: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type ArchitectureDefinition = {
  image: string;
  alt: string;
  nodes: ArchitectureNode[];
};

const architectureBySlug: Record<string, ArchitectureDefinition> = {
  "ai-teaching-assistant": {
    image: "/project-diagrams/ai-teaching-assistant-architecture.png",
    alt: "Architecture of the RAG teaching assistant, from course materials through retrieval, knowledge graph, learner modeling, and answer generation.",
    nodes: [
      {
        id: "materials",
        label: "Course materials",
        role: "Provides the grounded source material used by the assistant.",
        implementation: "Parse syllabus, slides, notes, and other course files; retain source metadata so every retrieved passage can be traced back to evidence.",
        x: 6.1,
        y: 14.2,
        width: 8.3,
        height: 17.8,
      },
      {
        id: "ingestion",
        label: "Ingestion pipeline",
        role: "Transforms source files into retrieval-ready knowledge units.",
        implementation: "Extract text, normalize structure, split it into semantic chunks, and create embeddings before indexing the chunks in the retrieval store.",
        x: 21.8,
        y: 14.1,
        width: 40.6,
        height: 18,
      },
      {
        id: "knowledge-graph",
        label: "Domain knowledge graph",
        role: "Adds explicit concepts and relationships that vector similarity alone can miss.",
        implementation: "Represent course entities and prerequisites as graph nodes and edges, then expand retrieved evidence with related concepts through graph queries.",
        x: 71.5,
        y: 11.6,
        width: 18.8,
        height: 21,
      },
      {
        id: "retrieval",
        label: "Hybrid retrieval",
        role: "Selects the most useful evidence for the current learner question.",
        implementation: "Combine embedding similarity, graph-neighborhood expansion, metadata filters, and Top-K reranking before sending evidence to the generator.",
        x: 76,
        y: 36.3,
        width: 9.3,
        height: 18,
      },
      {
        id: "generator",
        label: "Answer generator",
        role: "Produces a course-grounded response with an explanation.",
        implementation: "Build a constrained prompt from retrieved passages, graph context, and learner state; require the LLM to cite evidence and avoid unsupported claims.",
        x: 70.7,
        y: 58.8,
        width: 13.6,
        height: 9.5,
      },
      {
        id: "learner-state",
        label: "Bayesian Knowledge Tracing",
        role: "Estimates which concepts the learner has likely mastered.",
        implementation: "Update concept mastery probabilities from learner interactions and feed the state back into retrieval depth, explanation style, and practice recommendations.",
        x: 23.2,
        y: 54,
        width: 36.5,
        height: 16.7,
      },
      {
        id: "answer",
        label: "Learner-state-aware answer",
        role: "Delivers the final response at an appropriate level of detail.",
        implementation: "Return the answer, evidence references, and an explanation adapted to the learner state; log the interaction for later evaluation and BKT updates.",
        x: 69.3,
        y: 73.1,
        width: 16.3,
        height: 7.2,
      },
    ],
  },
  "ccl25-hate-speech": {
    image: "/project-diagrams/hate-speech-architecture.png",
    alt: "Architecture of the Chinese hate-speech system, from comment preprocessing through LoRA fine-tuning, structured decoding, and evaluation.",
    nodes: [
      {
        id: "input",
        label: "Chinese social-media comment",
        role: "Supplies the raw text that the system must analyze at fine-grained level.",
        implementation: "Preserve the original comment for traceability while creating a normalized copy for inference and dataset preprocessing.",
        x: 3.5,
        y: 16.5,
        width: 9.2,
        height: 20.2,
      },
      {
        id: "preprocessing",
        label: "Preprocessing and prompt",
        role: "Turns noisy social-media text into a consistent model request.",
        implementation: "Normalize Unicode and slang, remove noise conservatively, then place the comment into a prompt that defines the required quadruple schema.",
        x: 17.1,
        y: 16.2,
        width: 26,
        height: 24,
      },
      {
        id: "model",
        label: "GLM-4-9B + LoRA",
        role: "Learns the task while keeping training cost manageable.",
        implementation: "Fine-tune low-rank adapters with MS-SWIFT, mixed precision, and gradient checkpointing while keeping the base model weights frozen.",
        x: 46.6,
        y: 12.8,
        width: 16.7,
        height: 27.3,
      },
      {
        id: "decoder",
        label: "Structured decoder",
        role: "Converts model output into a reliable machine-readable prediction.",
        implementation: "Constrain generation to the JSON schema, validate required fields, normalize labels, and retry or repair malformed outputs before scoring.",
        x: 66.5,
        y: 16.2,
        width: 15.2,
        height: 24,
      },
      {
        id: "output",
        label: "Hate-speech quadruples",
        role: "Expresses target, group, attack type, and severity explicitly.",
        implementation: "Return structured quadruples that can be audited, compared with annotations, and used in downstream moderation or evaluation tools.",
        x: 85.7,
        y: 16.2,
        width: 10.4,
        height: 24,
      },
      {
        id: "training-data",
        label: "CCL25-Eval training data",
        role: "Provides annotated examples for supervised adaptation.",
        implementation: "Deduplicate examples, validate labels, create train/dev splits, and serialize each sample into the same structured format used at inference time.",
        x: 6.2,
        y: 52.7,
        width: 11.3,
        height: 22.3,
      },
      {
        id: "fine-tuning",
        label: "MS-SWIFT fine-tuning",
        role: "Optimizes the LoRA adapter for the shared evaluation task.",
        implementation: "Train with reproducible seeds and checkpointing, monitor validation loss, and select the best adapter rather than the final training step.",
        x: 39.5,
        y: 55,
        width: 12,
        height: 17.4,
      },
      {
        id: "evaluation",
        label: "Structured-output evaluation",
        role: "Measures both format reliability and prediction quality.",
        implementation: "Track schema validity, exact match, field-wise F1, and severity error; inspect failure clusters to refine prompts, labels, and training data.",
        x: 73.8,
        y: 55,
        width: 12.3,
        height: 18.5,
      },
    ],
  },
};

export default function ProjectUniverse() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const activeProject = projects[activeIndex];
  const architecture = architectureBySlug[activeProject.slug];
  const selectedNode = architecture.nodes.find((node) => node.id === selectedNodeId) ?? null;

  useEffect(() => {
    if (!selectedNodeId) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedNodeId(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedNodeId]);

  const selectProject = (index: number) => {
    setActiveIndex(index);
    setSelectedNodeId(null);
  };

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

          <div className="architecture-board">
            <Image
              src={architecture.image}
              alt={architecture.alt}
              width={1536}
              height={1024}
              priority
            />
            <div className="architecture-hotspots" aria-label={`${activeProject.title} architecture modules`}>
              {architecture.nodes.map((node) => (
                <button
                  type="button"
                  className={selectedNodeId === node.id ? "active" : ""}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    width: `${node.width}%`,
                    height: `${node.height}%`,
                  }}
                  key={node.id}
                  aria-label={`Inspect ${node.label} module`}
                  aria-expanded={selectedNodeId === node.id}
                  aria-controls="architecture-module-detail"
                  onClick={() => setSelectedNodeId((current) => current === node.id ? null : node.id)}
                />
              ))}
            </div>

            <aside
              id="architecture-module-detail"
              className={`architecture-detail ${selectedNode ? "open" : ""}`}
              aria-live="polite"
            >
              {selectedNode ? (
                <>
                  <div className="architecture-detail-head">
                    <span>MODULE / {selectedNode.label}</span>
                    <button type="button" onClick={() => setSelectedNodeId(null)} aria-label="Close module details">
                      CLOSE
                    </button>
                  </div>
                  <div className="architecture-detail-grid">
                    <div>
                      <span>ROLE</span>
                      <p>{selectedNode.role}</p>
                    </div>
                    <div>
                      <span>IMPLEMENTATION</span>
                      <p>{selectedNode.implementation}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p>Select a framed module to see its role and implementation approach.</p>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
