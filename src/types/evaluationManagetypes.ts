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