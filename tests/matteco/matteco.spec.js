import { test, expect } from '@playwright/test';

test.describe('Matteco - Web', () => {

  test('Sección Media: Carga y muestra enlaces a noticias', async ({ page }) => {
    // 1. Ir a la sección de medios
    console.log('Navegando a Matteco Media...');
    await page.goto('/media/', { waitUntil: 'networkidle' });

    // 2. Verificar que la URL es correcta
    await expect(page).toHaveURL(/.*media/);

    // 3. Buscar enlaces a entradas/noticias
    // Usamos un selector múltiple para acertar seguro:
    // - 'article a': Enlaces dentro de etiquetas de artículo (estándar HTML5)
    // - '.elementor-post a': Si usan Elementor Grid
    // - '.post a': Clase estándar de WordPress
    const noticia = page.locator('article a, .elementor-post a, .post a').first();

    // Verificamos que al menos una noticia sea visible
    await expect(noticia).toBeVisible();

    // (Opcional) Imprimimos el título de la noticia encontrada para confirmar
    const tituloNoticia = await noticia.innerText();
    console.log(`✅ Noticia encontrada: "${tituloNoticia}"`);
  });

});