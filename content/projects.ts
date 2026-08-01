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
  featured: boolean;
  order: number;
};

export const projects: Project[] = [
  {
    slug: "ai-teaching-assistant",
    title: "AI Teaching Assistant System Based on RAG & Domain Knowledge Graph",
    year: "2025",
    category: "BACHELOR THESIS / RAG + DOMAIN KG + BKT",
    status: "TEAM SYSTEM · COMPLETED",
    summary:
      "A bachelor-thesis system integrating RAG, a domain knowledge graph and Bayesian Knowledge Tracing for course-grounded question answering and learner-state support.",
    question:
      "When does structured knowledge add something that semantic retrieval alone cannot?",
    role: "PROJECT LEAD · WORKFLOW ENGINEERING · API INTEGRATION",
    tags: ["RAG", "DOMAIN KG", "BKT", "DIFY", "POSTGRESQL", "APACHE AGE"],
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
    role: "MODEL SELECTION · TRAINING · PROMPT ITERATION",
    tags: ["GLM-4-9B", "LORA", "MS-SWIFT", "CHINESE NLP"],
    featured: false,
    order: 2,
  },
];

export const featuredProject = projects.find((project) => project.featured) ?? projects[0];
