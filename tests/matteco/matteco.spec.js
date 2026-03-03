import { test, expect } from '@playwright/test';

test.describe('Matteco - Web', () => {

test('Home: Carga la página principal y muestra artículos (Loop Item)', async ({ page }) => {
    console.log('Navegando a la Home de Matteco...');
    
    // CAMBIO CLAVE: Usamos 'domcontentloaded' en lugar de 'networkidle'
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Apuntamos al data-attribute específico del HTML que nos has pasado
    const loopItem = page.locator('div[data-elementor-type="loop-item"]').first();
    
    // Hacemos scroll por si está más abajo en la página
    await loopItem.scrollIntoViewIfNeeded();
    
    // Playwright esperará automáticamente aquí hasta que el elemento aparezca en pantalla
    await expect(loopItem).toBeVisible({ timeout: 15000 }); // Le damos 15s extra de cortesía por si tarda en renderizar
    
    console.log('✅ Home cargada y componente de noticias (Loop Item) funcionando.');
  });
  
  test('Media: Carga y muestra enlaces a noticias', async ({ page }) => {
    console.log('Navegando a Matteco Media...');
    await page.goto('/media/', { waitUntil: 'networkidle' });

    await expect(page).toHaveURL(/.*media/);

    // Buscamos enlaces a entradas/noticias
    const noticia = page.locator('article a, .elementor-post a, .post a').first();

    await expect(noticia).toBeVisible();

    const tituloNoticia = await noticia.innerText();
    console.log(`✅ Noticia encontrada en Media: "${tituloNoticia}"`);
  });

  test('Technology: Existe enlace de LinkedIn de Dorient', async ({ page }) => {
    await page.goto('/technology/', { waitUntil: 'networkidle' });

    // AÑADIMOS .first() PARA EVITAR EL STRICT MODE VIOLATION
    const linkLinkedin = page.locator('a[href*="linkedin.com/in/dorient"]').first();

    await linkLinkedin.scrollIntoViewIfNeeded();
    await expect(linkLinkedin).toBeVisible();

    console.log('✅ Enlace de LinkedIn de Dorient encontrado correctamente.');
  });

  test('Impact: Existe enlace de LinkedIn de Manuel Quesada', async ({ page }) => {
    await page.goto('/impact/', { waitUntil: 'networkidle' });

    // AÑADIMOS .first() AQUÍ TAMBIÉN POR PREVENCIÓN
    const linkLinkedin = page.locator('a[href*="linkedin.com/in/manuel-quesada-vilar-6544a446"]').first();

    await linkLinkedin.scrollIntoViewIfNeeded();
    await expect(linkLinkedin).toBeVisible();

    console.log('✅ Enlace de LinkedIn de Manuel Quesada encontrado correctamente.');
  });

  // --- TESTS DE CARGA DE PÁGINAS ESTÁTICAS ---
  // Usamos un array y un bucle para mantener el código limpio y profesional
  const paginasEstaticas = [
    { nombre: 'Innovation & R&D', url: '/innovation-rd-anodes-cathodes-alkaline-aem-electrolysis/' },
    { nombre: 'About Us', url: '/about-us/' },
    { nombre: 'Careers', url: '/careers/' }
  ];

  for (const pagina of paginasEstaticas) {
    test(`Página: Carga correcta de la sección ${pagina.nombre}`, async ({ page }) => {
      await page.goto(pagina.url, { waitUntil: 'networkidle' });
      
      // Comprobación de seguridad: Nos aseguramos de que no ha saltado un error 404
      const titulo = await page.title();
      expect(titulo.toLowerCase()).not.toContain('page not found');
      expect(titulo).not.toContain('404');
      
      console.log(`✅ Página ${pagina.nombre} cargada sin errores.`);
    });
  }

});