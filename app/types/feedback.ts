export type FeedbackPayload = {
  overallSatisfaction: number;
  recommendationScore: number;
  featuresUsed: string[];
  userRole: string[];
  prioritizedImprovements: string[];
};

export type FeedbackSubmission = FeedbackPayload & {
  id: string;
  submittedAt: string;
};
