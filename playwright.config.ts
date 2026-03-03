// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  /* Fallar si no hay test (CI) */
  forbidOnly: !!process.env.CI,
  /* Reintentos si falla (útil para reducir falsos positivos) */
  retries: 1, 
  /* Hilos de trabajo (Workers) */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter */
  reporter: 'html',

  /* Configuración compartida para todos los proyectos */
  use: {
    trace: 'on-first-retry', // Guarda vídeo/trace si falla
    headless: true,          // Sin pantalla (modo servidor)
    screenshot: 'only-on-failure',
  },

  /* AQUÍ DEFINIMOS TUS WEBS (PROYECTOS) */
  projects: [
    // --- PROYECTO 1: ZUBI GROUP ---
    {
      name: 'zubi',
      testMatch: /.*zubi\/.*.spec.js/, // Ejecuta todo lo que esté en la carpeta zubi
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://zubi.group', // URL Base
      },
    },

    {
      name: 'zubicapital',
      testMatch: /.*zubicapital\/.*.spec.js/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://zubicapital.com', // La URL base
      },
      
    },
    {
      name: 'matteco',
      testMatch: /.*matteco\/.*.spec.js/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://matteco.com',
      },
    },

    {
      name: 'zubicities',
      testMatch: /.*zubicities\/.*.spec.js/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://zubicities.com',
      },
    },

{
      name: 'fundacionfelisa',
      testMatch: /.*fundacionfelisa\/.*\.spec\.js/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://fundacionfelisa.org',
      },
    },
     {
      name: 'woodea',
      testMatch: /.*woodea\/.*.spec.js/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://woodea.es',
      },
    },
      {
      name: 'zubilabs',
      testMatch: /.*zubilabs\/.*.spec.js/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://zubilabs.com',
      },
    },
  ],
});