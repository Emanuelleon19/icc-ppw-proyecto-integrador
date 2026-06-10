export interface Programmer {
  id: number;
  name: string;
  specialty: string;
  shortDescription: string;
  fullDescription: string;
  photo: { url: string };
  email: string;
  github: string;
  linkedin: string;
  active: boolean;
  slug: string;
}