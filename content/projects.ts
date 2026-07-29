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
    category: "NLP SYSTEM / CCL 2025",
    status: "CASE STUDY IN PROGRESS",
    summary:
      "A course question-answering system combining retrieval-augmented generation with knowledge-graph context for more grounded and traceable responses.",
    question:
      "When does structured knowledge add something that semantic retrieval alone cannot?",
    role: "PROJECT CONTRIBUTOR",
    tags: ["RAG", "KNOWLEDGE GRAPH", "LLM", "COURSE QA"],
    featured: true,
    order: 1,
  },
];

export const featuredProject = projects.find((project) => project.featured) ?? projects[0];
