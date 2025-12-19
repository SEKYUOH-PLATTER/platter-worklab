
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  keyword: string;
  summary: string;
  content: string;
  date: string;
  thumbnail: string;
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
