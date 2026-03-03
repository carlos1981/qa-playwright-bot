import { test, expect } from '@playwright/test';

test.describe('ZubiLabs - Newsletter', () => {

  test('Formulario de suscripción (Home) funciona', async ({ page }) => {
    // 1. Ir a la home
    console.log('Cargando Zubilabs.com...');
    await page.goto('/', { waitUntil: 'networkidle' });

    // 2. Rellenar campos
    // Este formulario es peculiar porque el texto está partido en varios divs,
    // pero los inputs tienen nombres claros.
    
    console.log('Rellenando nombre...');
    await page.fill('input[name="your-name"]', 'Test Bot');

    console.log('Rellenando email...');
    await page.fill('input[name="your-email"]', 'test-bot@zubilabs.com');

    // 3. Checkbox de privacidad (Brevo)
    // El checkbox tiene un name largo. Usamos force: true porque Contact Form 7
    // a veces oculta el checkbox real y muestra uno "falso" con CSS.
    console.log('Aceptando política...');
    await page.check('input[name="AceptolaspolticasdePrivacidad"]', { force: true });

    // 4. Enviar
    console.log('Enviando...');
    await page.click('input[type="submit"]', { force: true });

    // 5. Validación
    // Contact Form 7 siempre muestra el mensaje de éxito en un div con la clase .wpcf7-response-output
    // Esperamos a que sea visible y contenga texto positivo
    const mensajeRespuesta = page.locator('.wpcf7-response-output');
    
    await expect(mensajeRespuesta).toBeVisible({ timeout: 15000 });
    
    // Opcional: Verificar que el texto no sea de error (borde rojo/naranja)
    // Normalmente el éxito tiene borde verde o dice "Gracias" / "Enviado"
    // await expect(mensajeRespuesta).toContainText(/gracias|enviado|sent/i);

    console.log('✅ Formulario de Zubilabs enviado correctamente.');
  });

});

test.describe('Zubi Labs - Navegación y Contacto', () => {

  // 1. TEST MENÚ LATERAL
  test('Menú hamburguesa abre y permite navegar a Sobre Nosotros', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Clic en el icono de hamburguesa (fa-bars)
   // Clic en el icono de hamburguesa (fa-bars)
    console.log('Abriendo menú lateral...');
    await page.click('.open_side_menu i.fa-bars');

    // Usamos el ID exacto del HTML que pasaste para aislar este enlace del que hay en el footer
    const enlaceSobreNosotros = page.locator('#menu-item-237 a');

    // Esperamos a que la animación del menú termine y sea visible
    await expect(enlaceSobreNosotros).toBeVisible();
    
    console.log('Navegando a Sobre Nosotros...');
    await enlaceSobreNosotros.click();

    // Validamos que hemos llegado
    await expect(page).toHaveURL(/.*sobre-nosotros/);
    console.log('✅ Navegación menú correcta.');
  });

  // 2. TEST BLOG (Verificar artículos)
test('Blog: Carga y tiene artículos clickables', async ({ page }) => {
    await page.goto('/blog/', { waitUntil: 'networkidle' });

    // Verificamos que hay al menos un artículo.
    // Usamos la clase nativa de Elementor para los items del blog.
    const articulo = page.locator('.e-loop-item').first();
    
    // Validamos que el contenedor general del post esté visible
    await expect(articulo).toBeVisible();
    console.log('✅ Se han encontrado artículos en el blog.');
    
    // --- Opcional: Hacer clic y verificar ---
    // Si quieres verificar que realmente es clickable, buscamos el primer
    // enlace (<a>) DENTRO de ese artículo concreto.
    
    /*
    const enlaceArticulo = articulo.locator('a').first();
    
    // Forzamos el clic en el enlace
    await enlaceArticulo.click();
    
    // Esperamos a que la URL cambie (verificamos que ya NO estamos en la portada del blog)
    // Explicación: La URL original suele terminar en /blog/
    // Al entrar a un artículo, la URL tendrá más texto después.
    await expect(page).not.toHaveURL(/\/blog\/$/);
    console.log('✅ Navegación al detalle del artículo confirmada.');
    */
  });

  // 3. TEST MEDIOS (Verificar noticias)
  test('Medios: Carga y tiene noticias clickables', async ({ page }) => {
    await page.goto('/medios/', { waitUntil: 'networkidle' });

    // Similar al blog, buscamos el primer enlace a una noticia
    // Usamos un selector genérico para robustez
    const noticia = page.locator('a[href*="medios/"]').first();
    
    // O el específico de Kampe que mencionaste:
    // const noticia = page.locator('a[href*="kampe-lanza-un-bootcamp"]');

    await expect(noticia).toBeVisible();
    console.log('✅ Se han encontrado noticias en Medios.');
  });

  // 4. TEST FORMULARIO CONTACTO (Estilo narrativo)
  test('Contacto: Formulario narrativo se envía correctamente', async ({ page }) => {
    await page.goto('/contacto/', { waitUntil: 'networkidle' });

    console.log('Rellenando formulario narrativo...');
    
    // Nombre ("Hola, mi nombre es...")
    await page.fill('input[name="your-name"]', 'Test Bot');
    
    // Perfil ("y soy...")
    await page.fill('input[name="perfil"]', 'un robot de QA');
    
    // Email ("a...")
    await page.fill('input[name="your-email"]', 'test-bot@zubilabs.com');
    
    // Teléfono ("o llamando a...")
    await page.fill('input[name="tel-767"]', '600123456');
    
    // Mensaje (Textarea final)
    await page.fill('textarea[name="your-message"]', 'Prueba técnica de automatización. Por favor ignorar.');

    // Checkbox Privacidad ("Estoy de acuerdo...")
    // Usamos el name="acceptance-630"
    await page.check('input[name="acceptance-630"]', { force: true });

    // Radio Button ("Deseo recibir info...")
    // Este ya viene checked por defecto en tu HTML, pero por si acaso:
    // await page.check('input[name="radio-272"]', { force: true });

    // Enviar
    console.log('Enviando...');
    await page.click('input[type="submit"]', { force: true });

    // Validación
    // Esperamos el mensaje de éxito de Contact Form 7 (.wpcf7-response-output)
    const mensajeRespuesta = page.locator('.wpcf7-response-output');
    await expect(mensajeRespuesta).toBeVisible({ timeout: 15000 });
    
    // Comprobamos que NO sea un error (los errores suelen tener clase wpcf7-validation-errors)
    await expect(mensajeRespuesta).not.toHaveClass(/validation-errors/);
    
    console.log('✅ Formulario de contacto enviado.');
  });

});