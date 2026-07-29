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
    title: "Knowledge-Enhanced AI Teaching Assistant",
    year: "2025",
    category: "LLM SYSTEM / RAG + KNOWLEDGE GRAPH",
    status: "TEAM SYSTEM · COMPLETED",
    summary:
      "A domain AI teaching assistant combining retrieval-augmented generation with graph context to produce grounded, traceable answers over course knowledge.",
    question:
      "When does structured knowledge add something that semantic retrieval alone cannot?",
    role: "WORKFLOW · GRAPH · BACKEND · DEPLOYMENT",
    tags: ["DIFY", "POSTGRESQL", "APACHE AGE", "RAG", "LLM"],
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
    tags: ["GLM-4-9B", "LORA", "MS-SWIFT", "PYTORCH", "CHINESE NLP"],
    featured: false,
    order: 2,
  },
];

export const featuredProject = projects.find((project) => project.featured) ?? projects[0];
