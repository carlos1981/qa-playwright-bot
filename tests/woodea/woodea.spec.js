import { test, expect } from '@playwright/test';

test.describe('Woodea - Web y Formularios', () => {

// 1. TEST HOME
  test('Home: Carga la página principal correctamente', async ({ page }) => {
    console.log('Navegando a la Home de Woodea...');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Comprobamos que el título no sea un error 404
    const titulo = await page.title();
    expect(titulo.toLowerCase()).not.toContain('page not found');
    expect(titulo).not.toContain('404');

    // 👇 SOLUCIÓN: Buscamos el texto exacto visible en lugar de depender de etiquetas HTML
    const tituloPrincipal = page.getByText('Woodea Production System').first();
    await expect(tituloPrincipal).toBeVisible();
    
    console.log('✅ Home cargada correctamente.');
  });

  // 2. TEST SOMOS WOODEA (NUEVO: Con validación de enlaces)
  test('Somos Woodea: Carga y muestra perfiles de LinkedIn y Partners (Coword)', async ({ page }) => {
    await page.goto('/somos-woodea/', { waitUntil: 'domcontentloaded' });

    // Enlace LinkedIn Octavi
    const linkOctavi = page.locator('a[href*="linkedin.com/in/octaviuya"]').first();
    await linkOctavi.scrollIntoViewIfNeeded();
    await expect(linkOctavi).toBeVisible();

    // Enlace LinkedIn Pablo
    const linkPablo = page.locator('a[href*="linkedin.com/in/pablocorderotorres"]').first();
    await linkPablo.scrollIntoViewIfNeeded();
    await expect(linkPablo).toBeVisible();

    // Enlace Coword
    const linkCoword = page.locator('a[href*="coword.org"]').first();
    await linkCoword.scrollIntoViewIfNeeded();
    await expect(linkCoword).toBeVisible();

    console.log('✅ Página Somos Woodea cargada y todos los enlaces clave encontrados.');
  });

  // 3. TEST SÚMATE (NUEVO: Candidatura espontánea)
  test('Súmate: Existe enlace a la candidatura espontánea en Zubi Group', async ({ page }) => {
    await page.goto('/sumate/', { waitUntil: 'domcontentloaded' });

    // Usamos una parte única de la URL para ser robustos
    const linkVacante = page.locator('a[href*="vacantes.zubi.group/jobs/5707309"]').first();
    await linkVacante.scrollIntoViewIfNeeded();
    await expect(linkVacante).toBeVisible();

    console.log('✅ Enlace de candidatura espontánea encontrado en Súmate.');
  });

  // 4. TEST BLOG
  test('Blog: Existen artículos publicados', async ({ page }) => {
    await page.goto('/blog/', { waitUntil: 'domcontentloaded' });

    const posts = page.locator('.blog-post');
    await expect(posts.first()).toBeVisible();

    console.log('✅ Artículos del blog detectados.');
  });

  // 5. TEST PODCAST
  test('Podcast: Existen episodios clickables', async ({ page }) => {
    await page.goto('/podcast/', { waitUntil: 'domcontentloaded' });

    const episodio = page.locator('a[href*="/podcast/"][href*="-"]');
    await expect(episodio.first()).toBeVisible();
    
    console.log('✅ Episodios del podcast encontrados.');
  });

  // 6. TEST FORMULARIO CONTACTO (Página dedicada)
  test('Contacto (Página): Formulario se envía correctamente', async ({ page }) => {
    await page.goto('/contacto/', { waitUntil: 'domcontentloaded' });
    console.log('Rellenando formulario de contacto...');

    await page.fill('input[name="text-name-surname"]', 'Test Bot Woodea');
    await page.fill('input[name="email"]', 'test-qa@woodea.es');
    await page.fill('input[name="nombre-empresa"]', 'Testing SL');
    await page.fill('input[name="actividad-empresa"]', 'Automatización');
    await page.fill('textarea[name="message"]', 'Prueba automática de contacto. Ignorar.');

    const botonEnviar = page.getByRole('button', { name: 'ENVIAR' });

    console.log('Aceptando privacidad...');
    await page.getByText('Acepto la Política de Privacidad').click();
    await expect(botonEnviar).toBeEnabled();

    console.log('Enviando...');
    await botonEnviar.click();

    const formulario = page.locator('form.wpcf7-form').filter({ has: botonEnviar });
    const respuesta = formulario.locator('.wpcf7-response-output');

    await expect(respuesta).toBeVisible({ timeout: 15000 });
    const textoRespuesta = await respuesta.textContent();
    console.log(`✅ Formulario procesado en /contacto/. Mensaje de CF7: "${textoRespuesta.trim()}"`);
  });

  // 7. TEST FORMULARIO CONTACTO (Home)
  test('Contacto (Home): Formulario funciona correctamente', async ({ page }) => {
    console.log('Cargando Woodea.es...');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    console.log('Rellenando datos...');
    await page.fill('input[name="text-name-surname"]', 'Test Automático QA');
    await page.fill('input[name="email"]', 'qa-bot@woodea.es');
    await page.fill('input[name="nombre-empresa"]', 'Empresa de Prueba S.L.');
    await page.fill('input[name="actividad-empresa"]', 'Construcción Digital');
    await page.fill('textarea[name="message"]', 'Esta es una prueba de funcionalidad del formulario. Ignorar.');

    const submitButton = page.getByRole('button', { name: 'ENVIAR' });

    console.log('Aceptando privacidad...');
    await page.getByText('Acepto la Política de Privacidad').click();
    await expect(submitButton).toBeEnabled();

    console.log('Enviando formulario...');
    await submitButton.click();

    const formulario = page.locator('form.wpcf7-form').filter({ has: submitButton });
    const mensajeRespuesta = formulario.locator('.wpcf7-response-output');

    await expect(mensajeRespuesta).toBeVisible({ timeout: 15000 });
    const textoRespuesta = await mensajeRespuesta.textContent();
    console.log(`✅ Formulario procesado en Home. Respuesta de CF7: "${textoRespuesta.trim()}"`);
  });

});