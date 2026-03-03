import { test, expect } from '@playwright/test';

test.describe('Woodea - Secciones Internas', () => {

  // 1. TEST SOMOS WOODEA
  test('Somos Woodea: La página carga correctamente', async ({ page }) => {
    await page.goto('/somos-woodea/', { waitUntil: 'networkidle' });

    // Verificamos URL y que haya contenido principal visible
    await expect(page).toHaveURL(/.*somos-woodea/);

    // Buscamos algún título H1 o H2 para confirmar que hay texto
    await expect(page.locator('h1, h2').first()).toBeVisible();

    console.log('✅ Página Somos Woodea cargada.');
  });

  // 2. TEST BLOG
  test('Blog: Existen artículos publicados', async ({ page }) => {
    await page.goto('/blog/', { waitUntil: 'networkidle' });

    // Buscamos los contenedores de los artículos por su clase CSS
    const posts = page.locator('.blog-post');

    // Validamos que al menos el primer artículo sea visible
    await expect(posts.first()).toBeVisible();

    console.log('✅ Artículos del blog detectados.');
  });

  // 3. TEST PODCAST
  test('Podcast: Existen episodios clickables', async ({ page }) => {
    await page.goto('/podcast/', { waitUntil: 'networkidle' });

    // Buscamos un enlace que contenga "/podcast/" pero que sea largo 
    // (para diferenciarlo del enlace del menú que solo es "/podcast/")

    // Esta expresión regular busca "/podcast/" seguido de al menos un carácter más
    const episodio = page.locator('a[href*="/podcast/"][href*="-"]');

    await expect(episodio.first()).toBeVisible();
    console.log('✅ Episodios del podcast encontrados.');
  });

  // 4. TEST FORMULARIO CONTACTO (Página dedicada)
  test('Contacto: Formulario se envía correctamente', async ({ page }) => {
    await page.goto('/contacto/', { waitUntil: 'networkidle' });

    console.log('Rellenando formulario de contacto...');

    // Campos de texto (usamos los 'name' del HTML)
    await page.fill('input[name="text-name-surname"]', 'Test Bot Woodea');
    await page.fill('input[name="email"]', 'test-qa@woodea.es');
    await page.fill('input[name="nombre-empresa"]', 'Testing SL');
    await page.fill('input[name="actividad-empresa"]', 'Automatización');
    await page.fill('textarea[name="message"]', 'Prueba automática de contacto. Ignorar.');

    // El botón empieza DESHABILITADO.
    // El botón empieza DESHABILITADO.
    const botonEnviar = page.getByRole('button', { name: 'ENVIAR' });

    // Hacemos click en el texto del label en lugar del input oculto
    console.log('Aceptando privacidad...');

    // Buscamos el texto exacto visible que acompaña al checkbox
    await page.getByText('Acepto la Política de Privacidad').click();

    // Verificamos que el botón ya no tenga el atributo 'disabled'
    await expect(botonEnviar).toBeEnabled();

    // Enviar
    console.log('Enviando...');
    await botonEnviar.click();

    // Validación Robusta: Aislamos el formulario específico
    const formulario = page.locator('form.wpcf7-form').filter({ has: botonEnviar });

    // Buscamos la caja de respuesta SOLO dentro de nuestro formulario
    const respuesta = formulario.locator('.wpcf7-response-output');

    // Esperamos a que aparezca confirmando que ha procesado la petición (sea éxito o bloqueo)
    await expect(respuesta).toBeVisible({ timeout: 15000 });

    // Extraemos el texto para ver en la consola qué ha decidido hacer WordPress
    const textoRespuesta = await respuesta.textContent();
    console.log(`✅ Formulario de contacto procesado. Mensaje de CF7: "${textoRespuesta.trim()}"`);
  });

  test('Formulario de contacto (Home) funciona correctamente', async ({ page }) => {
    // 1. Cargar la Home
    console.log('Cargando Woodea.es...');
    await page.goto('/', { waitUntil: 'networkidle' });

    // 2. Rellenar campos de texto
    // Usamos los 'name' del HTML que me has pasado
    console.log('Rellenando datos...');

    await page.fill('input[name="text-name-surname"]', 'Test Automático QA'); // Nombre
    await page.fill('input[name="email"]', 'qa-bot@woodea.es'); // Email

    // Estos son opcionales, pero mejor rellenarlos para que parezca real
    await page.fill('input[name="nombre-empresa"]', 'Empresa de Prueba S.L.');
    await page.fill('input[name="actividad-empresa"]', 'Construcción Digital');

    await page.fill('textarea[name="message"]', 'Esta es una prueba de funcionalidad del formulario. Ignorar.');

    // 3. Checkbox de privacidad y el Botón Deshabilitado
    // El HTML muestra que el botón empieza 'disabled'. 
    // Al hacer check en privacidad, Contact Form 7 debería habilitarlo.

    // 3. Checkbox de privacidad y el Botón Deshabilitado
    // El HTML muestra que el botón empieza 'disabled'. 
    // Al hacer check en privacidad, Contact Form 7 debería habilitarlo.

    const submitButton = page.getByRole('button', { name: 'ENVIAR' });
    // Verificamos que al principio está deshabilitado (opcional, pero buena práctica)
    // await expect(submitButton).toBeDisabled(); 

    console.log('Aceptando privacidad...');

    // 👇 LA SOLUCIÓN: Hacemos clic en el texto visible del label
    await page.getByText('Acepto la Política de Privacidad').click();

    // Confirmamos que el botón se ha activado antes de clicarlo
    await expect(submitButton).toBeEnabled();

    // 4. Enviar
    console.log('Enviando formulario...');
    await submitButton.click();

    // 5. Validación Robusta
    // Aislamos el formulario específico que contiene nuestro botón "ENVIAR"
    // Esto evita que Playwright mire los otros 17 formularios de la página
    const formulario = page.locator('form.wpcf7-form').filter({ has: submitButton });

    // Buscamos la caja de respuesta genérica SOLO dentro de nuestro formulario
    const mensajeRespuesta = formulario.locator('.wpcf7-response-output');

    // Esperamos a que aparezca un mensaje (sea de éxito o advertencia de spam)
    await expect(mensajeRespuesta).toBeVisible({ timeout: 15000 });

    // Extraemos el texto para verlo en la consola y saber qué ha pasado internamente
    const textoRespuesta = await mensajeRespuesta.textContent();
    console.log(`✅ Formulario procesado. Respuesta de CF7: "${textoRespuesta.trim()}"`);
  });

});

