
export interface Profile {
  id: string;
  name: string;
  role: string; // Changed from union type to string to match Supabase
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DiagnosisRecord {
  id: string;
  patient_id: string;
  image_urls: string[];
  symptoms?: string;
  ai_diagnosis?: string;
  ai_confidence?: number;
  risk_level?: string; // Changed from union type to string to match Supabase
  status: string; // Changed from union type to string to match Supabase
  doctor_id?: string;
  doctor_diagnosis?: string;
  doctor_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
}
