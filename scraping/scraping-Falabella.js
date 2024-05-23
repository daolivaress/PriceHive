const puppeteer = require('puppeteer');

async function scraping_Falabella(searchTerm) {
  const browser = await puppeteer.launch(); // SlowMo para visualizar la navegación
  const page = await browser.newPage();

  await page.goto('https://www.falabella.com.co/falabella-co');

  // Esperamos a que la página principal esté completamente cargada
  await page.waitForSelector('input[placeholder="Buscar en falabella.com"]');

  // Ingresamos el término de búsqueda en el campo de búsqueda
  await page.type('input[placeholder="Buscar en falabella.com"]', searchTerm);

  // Presionamos la tecla "Enter" para realizar la búsqueda
  await page.keyboard.press('Enter');

  // Esperar a que se carguen los resultados de la búsqueda
  await page.waitForSelector('.pod', {timeout : 30000});
  
  // Extraer los primeros 5 productos que coincidan con el término de búsqueda
  const products = await page.evaluate(() => {
    const productsList = [];
    const productElements = document.querySelectorAll('.pod');

    productElements.forEach(product => {
      const name = product.querySelector('b[id^="testId-pod-displaySubTitle"]')?.innerText;
      const priceElement = product.querySelector('.copy10');
      const price = priceElement ? priceElement.innerText.replace(/\D/g, '') : 'Precio no disponible';
      const link = product.href ? product.href : 'No link available';
      const imageUrl = product.querySelector('picture img')?.getAttribute('src') ? product.querySelector('picture img')?.getAttribute('src'): 'imagen no disponible';
      
      productsList.push({ name, price, link, imageUrl, store: 'Falabella' });
    });

    const fiveProducts = productsList.slice(0, 5);
    const fiveProducts_asc = fiveProducts.sort((a, b) => parseFloat(a.price.replace(/\D/g, '')) - parseFloat(b.price.replace(/\D/g, '')))
    return fiveProducts_asc.slice(0,3); 
  });

  await browser.close();

  return products;
}

module.exports = scraping_Falabella;



