export interface ParsedResumeFields {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience_years: number | null;
  education: string[];
}

export interface Candidate {
  resume_id: number;
  filename: string;
  score: number;
  rank: number;
  parsed_json: ParsedResumeFields;
}

export interface JobDescription {
  id: number;
  title: string;
  created_at: string;
}

export interface UploadResponse {
  uploaded: {
    id: number;
    filename: string;
    parsed_fields: ParsedResumeFields;
  }[];
}

export interface ScreenResponse {
  results: Candidate[];
}

export interface ChatResponse {
  reply: string;
  cited_candidates: number[];
}
