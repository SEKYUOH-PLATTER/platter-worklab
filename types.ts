export interface BlogPost {
  id: number;
  title: string;
  category: string;
  thumbnail_url: string;
  content: string;
  view_count: number;
  created_at: string;
}

export interface CurriculumItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ContactForm {
  companyName: string;
  employees: string;
  contactName: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  needs: string;
  agreement: boolean;
}

export interface Contact {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}
