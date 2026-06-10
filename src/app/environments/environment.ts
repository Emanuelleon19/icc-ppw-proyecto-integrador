/** Configuración de variables de entorno para el entorno de desarrollo local */
export const environment = {
  production: true,
  strapiUrl: 'http://localhost:1337/api',
  programmerEmails: [
    'eleonj2@est.ups.edu.ec',
    'tzuritaa@est.ups.edu.ec',
  ],
  programmerSlugs: [
    'emanuel-leon',  
    'sebastian-zurita', 
  ],
  firebaseConfig: {
    apiKey: "AIzaSyAGnpuiZScXNk95cevP7NdmqxUxNwGLKtE",
    authDomain: "ppw-proyecto-integrador.firebaseapp.com",
    projectId: "ppw-proyecto-integrador",
    storageBucket: "ppw-proyecto-integrador.firebasestorage.app",
    messagingSenderId: "453101858073",
    appId: "1:453101858073:web:58e1e600a8f7aa0c5fe988"
  },
};