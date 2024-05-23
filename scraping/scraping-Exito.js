const puppeteer = require('puppeteer');

async function scraping_Exito(searchTerm) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();


  await page.goto(`https://www.exito.com/s?q=${encodeURIComponent(searchTerm)}&sort=score_desc`);


  // Esperar a que se carguen los resultados de la búsqueda
  await page.waitForSelector('article[data-fs-product-card="true"]');
  
  // Extraer los primeros 5 productos que coincidan con el término de búsqueda
  const products = await page.evaluate(() => {
    const productsList = [];
    const productElements = document.querySelectorAll('article[data-fs-product-card="true"]');

    productElements.forEach(product => {
      const name = product.querySelector('h3 a').innerText;
      const priceElement = product.querySelector('.ProductPrice_container__price__XmMWA');
      const price = priceElement ? priceElement.innerText.replace(/\D/g, '') : 'Precio no disponible';
      const link = product.querySelector('.link_fs-link__J1sGD').href;
      const imageUrl = product.querySelector('img[data-fs-img]').src ? product.querySelector('img[data-fs-img]').src: 'imagen no disponible';
      
      productsList.push({ name, price, link, imageUrl, store: 'Exito' });
    });

    const fiveProducts = productsList.slice(0, 5);
    const fiveProducts_asc = fiveProducts.sort((a, b) => parseFloat(a.price.replace(/\D/g, '')) - parseFloat(b.price.replace(/\D/g, '')))
    return fiveProducts_asc.slice(0,3); 
  });

  await browser.close();

  return products;
}

module.exports = scraping_Exito;




