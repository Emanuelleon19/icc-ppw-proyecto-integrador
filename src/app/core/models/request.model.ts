export interface ContactRequest {
  id?: string;
  uid: string;
  userEmail: string;
  applicantName: string;
  projectIdea: string;
  programmerSlug: string;
  createdAt: Date;
  status: 'Pendiente' | 'Respondida';
  response?: string;
}