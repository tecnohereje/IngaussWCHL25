interface SettingsData {
  personal?: any;
  social?: any;
  job?: any;
}

export const submitSettings = (data: SettingsData): Promise<{ success: boolean; message: string }> => {
  console.log("Enviando datos a la API (mock):", data);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve({ success: true, message: "Settings saved successfully!" });
      } else {
        reject({ success: false, message: "Failed to save settings." });
      }
    }, 1500);
  });
};

// Simula la obtención de textos para el carrusel
export const fetchMarqueeTexts = (): Promise<string[]> => {
  console.log("Fetching marquee texts from API (mock)...");
  const mockTexts = [
    "Noticia de último minuto: El mercado de ICP sube un 15%!",
    "Recordatorio: La actualización del sistema será este domingo.",
    "¡Nuevas características disponibles en la Zona de Pruebas!",
  ];
  // Simula una demora de red de 2 segundos
  return new Promise(resolve => setTimeout(() => resolve(mockTexts), 2000));
};