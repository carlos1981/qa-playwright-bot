import { test, expect } from '@playwright/test';

// Usamos test.describe para agrupar funcionalidades
test.describe('Web Zubi - Funcionalidades Críticas', () => {

  test('Formulario de contacto funciona', async ({ page }) => {
    // YA NO PONEMOS LA URL ENTERA, SOLO LA RUTA RELATIVA
    // Playwright le añade 'https://zubi.group' automáticamente gracias al config
    await page.goto('/contacto/', { waitUntil: 'networkidle' });

    // ... El resto de tu código igual ...
    console.log('Rellenando formulario...');
    await page.fill('#wpforms-22539-field_1', 'Test Bot');
    await page.fill('#wpforms-22539-field_2', 'test@zubi.group');
    await page.fill('#wpforms-22539-field_3', 'Prueba automática.');
    
    await page.check('#wpforms-22539-field_4_1', { force: true }); 
    await page.click('#wpforms-submit-22539', { force: true });

    await expect(page.locator('text=Gracias')).toBeVisible({ timeout: 30000 });
  });

  // AQUÍ PODRÍAS AÑADIR OTRO TEST EN EL MISMO ARCHIVO
  test('La Home carga correctamente', async ({ page }) => {
      await page.goto('/'); // Va a la raíz (https://zubi.group/)
      await expect(page).toHaveTitle(/Zubi Group/);
  });

});