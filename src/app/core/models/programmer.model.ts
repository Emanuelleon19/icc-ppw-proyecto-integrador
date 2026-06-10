export interface Programmer {
  id: number;              // ID único
  name: string;            // Nombre completo
  specialty: string;       // Especialidad laboral
  shortDescription: string;// Descripción corta
  fullDescription: string; // Descripción larga
  photo: { 
    url: string;           // URL de la foto (Strapi)
  };
  email: string;           // Correo electrónico
  github: string;          // Enlace a GitHub
  linkedin: string;        // Enlace a LinkedIn
  active: boolean;         // Estado activo/inactivo
  slug: string;            // URL amigable
}