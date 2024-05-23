try {
  const puppeteer = require('puppeteer');

  async function scraping_Alkosto(searchTerm) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.alkosto.com//search?text=' + encodeURIComponent(searchTerm) + '&sort=relevance', { waitUntil: 'networkidle0' });

    // Esperar a que se carguen los resultados de la búsqueda
    await page.waitForSelector('.product__item', { timeout: 30000 });

    // Extraer los primeros 5 productos que coincidan con el término de búsqueda
    const products = await page.evaluate(() => {
      const productsList = [];
      const productElements = document.querySelectorAll('.product__item');

      productElements.forEach(product => {
        const name = product.querySelector('.product__item__top__title')?.innerText;
        const priceElement = product.querySelector('.price');
        const price = priceElement ? priceElement.innerText.replace(/\D/g, '') : 'Precio no disponible';
        const dataUrl = product.querySelector('.product__item__top__title')?.getAttribute('data-url');
        const link = dataUrl ? `https://www.alkosto.com${dataUrl}` : 'Link no disponible';
        const imageUrl = product.querySelector('.product__item__information__image img')?.getAttribute('src');
        const imageLink = imageUrl ? `https://www.alkosto.com${imageUrl}` : 'Imagen no disponible';
        productsList.push({ name, price, link, imageUrl: imageLink, store: 'Alkosto' });
      });

      const fiveProducts = productsList.slice(0, 5);
      const fiveProducts_asc = fiveProducts.sort((a, b) => parseFloat(a.price.replace(/\D/g, '')) - parseFloat(b.price.replace(/\D/g, '')))
      return fiveProducts_asc.slice(0, 3);
    });

    await browser.close();

    return products;
  }

  module.exports = scraping_Alkosto;
} catch (error) {
  console.error('Error durante el scraping de Alkosto:', error);
  return []; // Retornar una lista vacía en caso de error
}









