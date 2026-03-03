import { test, expect } from '@playwright/test';

test.describe('Zubi Capital - Smoke Tests', () => {

  // 1. Test Portfolio: Verificar enlace a One-Five
test('Portfolio: Enlace a one-five.com es clickable', async ({ page }) => {
  await page.goto('/portfolio/', { waitUntil: 'networkidle' });
  
  // 1. Buscamos el contenedor exacto de la tarjeta de One-Five
  // Usamos el 'wgl-flipbox' que contiene un enlace a one-five
  const flipCard = page.locator('.wgl-flipbox').filter({ has: page.locator('a[href*="one-five.com"]') }).first();
  
  // 2. HACEMOS HOVER: Pasamos el ratón para que la tarjeta gire
  await flipCard.hover();
  
  // 3. Esperamos a que termine la animación CSS del giro (opcional pero recomendado para flipboxes)
  await page.waitForTimeout(500); // Medio segundo para que gire completamente

  // 4. Apuntamos al enlace grande que cubre toda la tarjeta
  const linkOneFive = flipCard.locator('a.wgl-flipbox_item-link').first();
  
  // 5. Ahora sí, verificamos que sea visible
  await expect(linkOneFive).toBeVisible();
  
  // 6. Verificamos el atributo
  await expect(linkOneFive).toHaveAttribute('href', /one-five\.com/);
  
  console.log('✅ Enlace a One-Five encontrado tras el hover.');
});

  // 2. Test About Us: Verificar scroll
  test('About Us: Se puede hacer scroll en la página', async ({ page }) => {
    await page.goto('/about-us/', { waitUntil: 'networkidle' });
    
    // Obtenemos la posición inicial del scroll (debería ser 0)
    const scrollTopInicial = await page.evaluate(() => window.scrollY);
    
    // Hacemos scroll hasta el fondo
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Esperamos un poco para que el scroll ocurra
    await page.waitForTimeout(500);

    // Obtenemos la nueva posición
    const scrollTopFinal = await page.evaluate(() => window.scrollY);
    
    // Verificamos que la posición final es mayor que la inicial (significa que se movió)
    expect(scrollTopFinal).toBeGreaterThan(scrollTopInicial);
    console.log('✅ Scroll en About Us funciona correctamente.');
  });

  // 3. Test Impact: Verificar enlace al final (Recovo)
test('Impact: Existe al menos un artículo en el slider al final de la página', async ({ page }) => {
    await page.goto('/impact/', { waitUntil: 'networkidle' });
    
    // Hacemos scroll al fondo para forzar la carga (útil si hay lazy loading)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Apuntamos a la clase genérica de la tarjeta del post
    // Usamos .first() porque habrá varios elementos en el slider y Playwright necesita saber a cuál mirar
    const sliderLink = page.locator('.blog-post_media_part a.media-link.image-overlay').first();
    
    // Verificamos que sea visible
    await expect(sliderLink).toBeVisible();
    
    // Verificamos que tiene un href con contenido (la expresión regular /.+/ significa "cualquier texto que no esté vacío")
    await expect(sliderLink).toHaveAttribute('href', /.+/);
    
    console.log('✅ Slider de noticias cargado y enlace genérico válido.');
  });

  // 4. Test Communication: La página carga
  test('Communication: La página carga correctamente', async ({ page }) => {
    // Capturamos la respuesta de red para ver el status 200
    const response = await page.goto('/communication/', { waitUntil: 'domcontentloaded' });
    
    // Verificamos que el servidor responda OK (status 200-299)
    expect(response.status()).toBeLessThan(400);
    
    // Verificamos el título para asegurar que es la web correcta
    // Ajusta el texto si el título real es diferente
    await expect(page).toHaveTitle(/Communication|News/i); 
    console.log('✅ Página de Communication carga (Status 200).');
  });

  // 5. Test Contacto: Formulario
test('Contact: Formulario se envía correctamente', async ({ page }) => {
    await page.goto('/contact/', { waitUntil: 'networkidle' });

    console.log('Rellenando formulario de contacto...');
    
    // Nombre
    await page.fill('#form-field-name', 'Test Automático QA');
    
    // Email
    await page.fill('#form-field-email', 'qa-test@zubicapital.com');
    
    // Mensaje
    await page.fill('#form-field-message', 'Prueba técnica de monitoreo. Ignorar este mensaje.');
    
    // Checkbox Privacidad
    // Aquí el force sí tiene sentido porque los checkbox nativos a veces están ocultos por CSS para estilizarlos
    await page.check('#form-field-field_e849886', { force: true });

    // Botón Enviar (¡CORREGIDO!)
    // Apuntamos específicamente al botón de Elementor
    const submitBtn = page.locator('.e-form__buttons button[type="submit"]');
    await submitBtn.click();

    // Validación
    // Esperamos el mensaje de éxito de Elementor
    await expect(page.locator('.elementor-message-success').first()).toBeVisible({ timeout: 20000 });
    
    console.log('✅ Formulario de contacto enviado con éxito.');
  });

});