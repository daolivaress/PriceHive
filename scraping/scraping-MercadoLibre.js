const puppeteer = require('puppeteer');

async function scraping_MercadoLibre(searchTerm) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

 
  await page.goto(`https://listado.mercadolibre.com.co/${encodeURIComponent(searchTerm)}`);

  // Esperar a que se carguen los resultados de la búsqueda
  await page.waitForSelector('.ui-search-result__wrapper', {timeout : 10000});
  
  // Extraer los primeros 5 productos que coincidan con el término de búsqueda
  const products = await page.evaluate(() => {
    const productsList = [];
    const productElements = document.querySelectorAll('.ui-search-result__wrapper');

    productElements.forEach(item => {
      const name = item.querySelector('.ui-search-item__title').innerText;
      const priceElement = item.querySelector('.ui-search-price__second-line .andes-money-amount__fraction');
      const price = priceElement ? priceElement.innerText.replace(/\D/g, '') : 'Precio no disponible';
      const link = item.querySelector('.ui-search-link').href;
      const imageUrl = item.querySelector('.andes-carousel-snapped__slide img').src;
      
      productsList.push({ name, price, link, imageUrl, store: 'Mercado Libre' });
    });

    const fiveProducts = productsList.slice(0, 5);
    const fiveProducts_asc = fiveProducts.sort((a, b) => parseFloat(a.price.replace(/\D/g, '')) - parseFloat(b.price.replace(/\D/g, '')))
    return fiveProducts_asc.slice(0,3); 
  });

  await browser.close();

  return products;
}

module.exports = scraping_MercadoLibre;












