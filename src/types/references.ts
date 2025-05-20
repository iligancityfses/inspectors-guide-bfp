export interface Reference {
  id: string;
  title: string;
  description: string;
  type: 'fire-code' | 'nfpa' | 'memorandum' | 'guideline';
  category: string;
  content?: string;
  url?: string;
  tags: string[];
  datePublished?: string;
}
