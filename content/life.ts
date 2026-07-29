export type LifeEntry = {
  id: string;
  title: string;
  category: "DOG" | "CATS" | "CAMPUS";
  caption: string;
  image: string | null;
  alt: string;
};

export const lifeEntries: LifeEntry[] = [
  {
    id: "01",
    title: "Everyday company",
    category: "DOG",
    caption: "A familiar presence at home.",
    image: null,
    alt: "A future photograph of Jim's dog",
  },
  {
    id: "02",
    title: "Visitors in the courtyard",
    category: "CATS",
    caption: "The cats that made the garden their own.",
    image: null,
    alt: "A future photograph of cats in the courtyard",
  },
  {
    id: "03",
    title: "Where this chapter began",
    category: "CAMPUS",
    caption: "Small views from my undergraduate campus.",
    image: null,
    alt: "A future photograph of Jim's undergraduate campus",
  },
];
