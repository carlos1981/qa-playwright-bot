import { test, expect } from '@playwright/test';

test.describe('Fundación Felisa - Web', () => {

  // 1. TEST FORMULARIO CONTACTO
  test('Contacto: Formulario se envía correctamente', async ({ page }) => {
    await page.goto('/contacto/', { waitUntil: 'networkidle' });

    console.log('Rellenando formulario de contacto...');

    // Usamos los IDs específicos que me has pasado
    await page.fill('#wpforms-4965-field_1', 'Test Bot'); // Nombre
    await page.fill('#wpforms-4965-field_7', 'QA'); // Apellidos
    await page.fill('#wpforms-4965-field_2', 'test-bot@fundacionfelisa.org'); // Email
    await page.fill('#wpforms-4965-field_3', 'Prueba de formulario. Ignorar.'); // Mensaje

    // Checkbox de privacidad
    // Aunque no salía en tu snippet, el 99% de los WPForms lo tienen al final.
    // Buscamos cualquier checkbox dentro del formulario y lo marcamos.
    const checkboxPrivacidad = page.locator('.wpforms-field-container input[type="checkbox"]');
    if (await checkboxPrivacidad.count() > 0) {
        console.log('Marcando casilla de privacidad...');
        await checkboxPrivacidad.check({ force: true });
    }

    // Enviar
    console.log('Enviando...');
    await page.click('button[type="submit"]', { force: true });

    // Validación (WPForms estándar)
    const mensajeExito = page.locator('.wpforms-confirmation-container-full, .wpforms-response-output');
    await expect(mensajeExito).toBeVisible({ timeout: 15000 });

    console.log('✅ Formulario de contacto enviado.');
  });

  // 2. TEST DONACIÓN (WooCommerce)
  test('Donación: Se puede indicar importe y añadir al carrito', async ({ page }) => {
    await page.goto('/producto/donacion/', { waitUntil: 'networkidle' });

    console.log('Configurando donación...');

    // 1. Poner el importe (Name Your Price)
    // Usamos el ID fijo del plugin
    const inputImporte = page.locator('#ywcnp_suggest_price_single');
    await inputImporte.fill('10'); // Donamos 10€

    // 2. Click en "Realizar la donación"
    // Buscamos el botón por su atributo name="add-to-cart"
    console.log('Pulsando botón de donar...');
    await page.click('button[name="add-to-cart"]');

    // 3. Validación
    // En WooCommerce, al añadir al carrito suele salir un mensaje de "Se ha añadido..."
    // o el icono del carrito cambia. 
    // Buscamos la alerta de éxito estándar de WooCommerce.
    const mensajeWoo = page.locator('.woocommerce-message');
    
    // Verificamos que sea visible y contenga "Donación" o "añadido"
    await expect(mensajeWoo).toBeVisible();
    await expect(mensajeWoo).toContainText(/donación|añadido|added/i);

    console.log('✅ Donación añadida al carrito correctamente.');
  });

  // 3. TEST COMUNICACIÓN (BLOG)
  test('Comunicación: Carga y muestra entradas', async ({ page }) => {
    await page.goto('/comunicacion/', { waitUntil: 'networkidle' });

    // Buscamos artículos (etiqueta <article> o clase .post)
    // Filtramos para asegurar que tienen un enlace dentro
    const entrada = page.locator('article a, .post a').first();

    await expect(entrada).toBeVisible();
    console.log('✅ Sección de Comunicación tiene contenido.');
  });

});