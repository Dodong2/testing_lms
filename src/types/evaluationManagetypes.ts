export type RatingData = {
  content: number[];
  materials: number[];
  resourcePerson: number[];
  overall: number[];
};

export type CreateEvaluationInput = {
  programId: string;
  titleOfSeminar: string;
  date: string;
  venue: string;
  suggestions?: string;
  name?: string;
  ratings: RatingData;
};

// types for EDA 

export type RatingCount = {
  value: number;     // rating number (1–5)
  count: number;     // how many answered this rating
};

export type QuestionDistribution = {
  question: string;            // e.g., "Q1", "Q2"
  totalAnswers: number;        // total respondents for this question
  ratings: RatingCount[];      // distribution per rating
};

export type SummaryDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type EDAResponse = {
  totalRespondents: number;               // daily/weekly/monthly count
  questionDistributions: QuestionDistribution[];
  summary: SummaryDistribution
};

export type EvaluationEntry = {
  id: string;
  name: string | null;
  titleOfSeminar: string;
  venue: string;
  suggestions?: string;
  ratings: RatingData;
  createdAt: string;

  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};
