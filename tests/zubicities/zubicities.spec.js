import { test, expect } from '@playwright/test';

test.describe('Zubi Cities - Promociones y Blog', () => {

  // FUNCIÓN AUXILIAR PARA NO REPETIR CÓDIGO
  // Rellena el formulario en la página que le digamos
  async function rellenarFormulario(page, url) {
    console.log(`Navegando a ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle' });

    console.log('Rellenando formulario de información...');

    // Selectores basados en 'name' o 'id' del HTML que pasaste
    await page.fill('#nombre-1', 'Test Bot');
    await page.fill('#apellido-1', 'Zubi Cities');
    await page.fill('#telefono-1', '600123456'); // Cumple el pattern [0-9]{9,13}
    await page.fill('#email-1', 'test-bot@zubicities.com');
    await page.fill('#mensaje-1', 'Prueba técnica de formulario. Ignorar.');

// Checkbox obligatorio (Términos)
    // Usamos .evaluate() para ejecutar un click nativo desde el propio navegador, 
    // ignorando cualquier CSS que lo tape o el enlace del modal.
    await page.locator('#form-checkbox-politica-1').evaluate(node => node.click());

    // Checkbox opcional (Publicidad) - Lo marcamos por si acaso
    await page.locator('#form-checkbox-publicidad-1').evaluate(node => node.click());

    // Enviar
    console.log('Enviando...');
    
    // PREPARAMOS LA INTERCEPCIÓN DE RED
    // Como el form va a 'php/validation.php', esperamos a ver esa petición
    const requestPromise = page.waitForRequest(request => 
      request.url().includes('php/validation.php') && request.method() === 'POST'
    );

    await page.click('.submit-btn.envioclase');

    // Esperamos a que salga la petición
    const request = await requestPromise;
    console.log(`✅ Formulario enviado. Petición detectada a: ${request.url()}`);
    
    // Validación visual (Opcional): Si sale un mensaje de éxito, descomenta esto
    // await expect(page.locator('text=Gracias')).toBeVisible();
  }

  // 1. TEST MADRESELVA
  test('Madreselva: Formulario funciona', async ({ page }) => {
    await rellenarFormulario(page, '/promociones-sostenibles/madreselva/');
  });

  // 2. TEST PINEA
  test('Pinea: Formulario funciona', async ({ page }) => {
    await rellenarFormulario(page, '/promociones-sostenibles/pinea/');
  });

  // 3. TEST BLOG
  test('Blog: Existen entradas publicadas', async ({ page }) => {
    await page.goto('/blog/', { waitUntil: 'networkidle' });

    // Buscamos artículos. 
    // Usamos selectores genéricos de WordPress o de tu tema custom
    const entrada = page.locator('article, .post, .blog-post').first();
    
    await expect(entrada).toBeVisible();
    console.log('✅ Entradas del blog detectadas.');
  });

});