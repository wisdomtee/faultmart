export interface ListingAssistantInput {
  title?: string;
  description?: string;
  category?: string;
  condition?: string;
  faultSeverity?: string;
  faultDescription?: string;
}

export interface ListingAssistantResult {
  suggestedTitle: string;
  improvedDescription: string;
  suggestedFaultSeverity:
    | "MINOR"
    | "MODERATE"
    | "MAJOR"
    | "CRITICAL"
    | null;
  suggestions: string[];
}
