const puppeteer = require('puppeteer');

async function scraping_Olimpica(searchTerm) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

 
  await page.goto(`https://www.olimpica.com/${encodeURIComponent(searchTerm)}`)

  // Esperar a que se carguen los resultados de la búsqueda
  await page.waitForSelector('.vtex-product-summary-2-x-container', {timeout : 30000});
  
  // Extraer los primeros 5 productos que coincidan con el término de búsqueda
  const products = await page.evaluate(() => {
    const productsList = [];
    const productElements = document.querySelectorAll('.vtex-product-summary-2-x-container');

    productElements.forEach(item => {
      const name = item.querySelector('.vtex-product-summary-2-x-brandName').innerText;
      const priceElement = item.querySelector('.vtex-product-price-1-x-sellingPrice--hasListPrice--dynamicF');
      const price = priceElement ? priceElement.innerText.replace(/\D/g, '') : 'Precio no disponible';
      const dataUrl = item.querySelector('a')?.getAttribute('href');
      const link = `https://www.olimpica.com${dataUrl}`; 
      const imageUrl = item.querySelector('.vtex-product-summary-2-x-imageNormal').src;
      
      productsList.push({ name, price, link, imageUrl, store: 'Olimpica' });
    });

    const fiveProducts = productsList.slice(0, 5);
    const fiveProducts_asc = fiveProducts.sort((a, b) => parseFloat(a.price.replace(/\D/g, '')) - parseFloat(b.price.replace(/\D/g, '')))
    return fiveProducts_asc.slice(0,3); 
  });

  await browser.close();

  return products;
}

module.exports = scraping_Olimpica;

