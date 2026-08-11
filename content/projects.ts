export type Project = {
  slug: string;
  title: string;
  year: string;
  category: string;
  status: string;
  summary: string;
  question: string;
  role: string;
  tags: string[];
  brief: {
    problem: string;
    role: string;
    stack: string[];
    route: string[];
    outcome: string;
    evidence: string;
  };
  featured: boolean;
  order: number;
};

export const projects: Project[] = [
  {
    slug: "ai-teaching-assistant",
    title: "AI Teaching Assistant System Based on RAG & Domain Knowledge Graph",
    year: "2026",
    category: "BACHELOR THESIS / RAG + DOMAIN KG + BKT",
    status: "TEAM SYSTEM · COMPLETED",
    summary:
      "A bachelor-thesis system integrating RAG, a domain knowledge graph and Bayesian Knowledge Tracing for course-grounded question answering and learner-state support.",
    question:
      "When does structured knowledge add something that semantic retrieval alone cannot?",
    role: "PROJECT LEAD · WORKFLOW ENGINEERING · API INTEGRATION",
    tags: ["RAG", "DOMAIN KG", "BKT", "DIFY", "POSTGRESQL", "APACHE AGE"],
    brief: {
      problem:
        "Course-grounded answers must remain traceable to source material, while every practice attempt must update a persistent model of learner mastery.",
      role:
        "Project lead · Dify workflow engineering · API and data-contract integration · Apache AGE query prototyping · end-to-end debugging",
      stack: [
        "Dify",
        "GPT-4o",
        "text-embedding-3-large",
        "gte-rerank-v2",
        "Apache AGE / openCypher",
        "PostgreSQL",
        "Node.js + TypeScript",
        "BKT",
      ],
      route: ["ASK", "GROUND", "RESPOND", "ADAPT"],
      outcome:
        "Four connected learning workflows in a running bachelor-thesis system: grounded QA, personalized practice, learning reports, and prerequisite-aware study paths.",
      evidence:
        "Original system UI, Dify workflow nodes, retrieval settings, graph-query results, grounded answers, and learner-state reports.",
    },
    featured: true,
    order: 1,
  },
  {
    slug: "ccl25-hate-speech",
    title: "Fine-Grained Chinese Hate Speech Detection",
    year: "2025",
    category: "CCL25-EVAL TASK 10 / MODEL ADAPTATION",
    status: "OPEN REPRODUCTION",
    summary:
      "A GLM-4-9B LoRA system that turns Chinese social-media comments into structured hate-speech quadruples for CCL25-Eval Task 10.",
    question:
      "Can parameter-efficient adaptation make a 9B language model reliably produce a strict structured output?",
    role: "MODEL SELECTION · DATA CONVERSION · LORA TRAINING · PROMPT ITERATION",
    tags: ["GLM-4-9B", "LORA", "MS-SWIFT", "CHINESE NLP"],
    brief: {
      problem:
        "Convert open-ended Chinese social-media comments into strict hate-speech quadruples under the CCL25 evaluation and submission contract.",
      role:
        "Model selection · supervised-data conversion · LoRA training · prompt iteration · inference and submission pipeline",
      stack: [
        "GLM-4-9B-0414",
        "MS-SWIFT",
        "LoRA r64 / α128",
        "3 epochs",
        "cosine schedule",
        "5e-5 learning rate",
        "all-linear targets",
      ],
      route: ["PREPARE", "ADAPT", "GENERATE", "SUBMIT"],
      outcome:
        "A reproducible GLM-LoRA pipeline with documented training artifacts and a final competition score of 0.3566 (Hard 0.2441 · Soft 0.4692).",
      evidence:
        "Official entry, source scripts, raw training curves, submission formatter, project report, and captured competition result.",
    },
    featured: false,
    order: 2,
  },
];

export const featuredProject = projects.find((project) => project.featured) ?? projects[0];
