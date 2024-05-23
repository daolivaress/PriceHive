window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('term');
    
    if (searchTerm) {
        fetchAndUpdate(searchTerm);
    }

    const searchForm = document.getElementById('search-btn');
    searchForm.addEventListener('click', function(event) {
        event.preventDefault();
        const newSearchTerm = document.getElementById('search-bar').value;
        updateUrlAndFetch(newSearchTerm);
    });

    // Añadir los listeners de cambio a los selectores
    document.getElementById('order-options-id').addEventListener('change', applyFilters);
};

let allProducts = [];
let currentPage = 1;

function updateUrlAndFetch(searchTerm) {
    history.pushState(null, '', `?term=${encodeURIComponent(searchTerm)}`);
    fetchAndUpdate(searchTerm);
}

function fetchAndUpdate(searchTerm) {
    if (!searchTerm.trim()) {
        alert("Por favor, ingresa un término de búsqueda.");
        return;
    }
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    fetch(`http://localhost:3000/search?term=${encodeURIComponent(searchTerm)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            allProducts = data;
            applyFilters(); // Aplicar filtros después de obtener los datos
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'none';
            document.getElementById('order-options-id').value = 'original';
            document.getElementById('main-content').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('error').innerHTML = `
                Error al cargar los datos: ${error.message}
                <button id="error-btn" onclick="fetchAndUpdate('${searchTerm}')">Reintentar</button>
            `;
            document.getElementById('error').style.display = 'flex';
            document.getElementById('loading').style.display = 'none';
            document.getElementById('main-content').style.display = 'none';
            document.getElementById('order-options-id').value = 'original';
        });
}


function applyFilters() {
    let filteredProducts = allProducts;
    filteredProducts = sortProducts(filteredProducts); // Ordenar productos

    displayProducts(1); // Mostrar siempre la primera página después de aplicar filtros
    currentPage = 1;
    setupPagination(filteredProducts.length);
}

function sortProducts(products) {
    const order = document.getElementById('order-options-id').value;
    switch (order) {
        case 'Nombre':
            return products.sort((a, b) => a.name.localeCompare(b.name));
        case 'Precio_asc':
            return products.sort((a, b) => a.price - b.price);
        case 'Precio_desc':
            return products.sort((a, b) => b.price - a.price);
        case 'original':
            return products;
        default:
            return products;
    }
}

function displayProducts(page) {
    const results = document.getElementById('resultados-productos');
    results.innerHTML = '';
    const startIndex = (page - 1) * 5;
    const selectedProducts = allProducts.slice(startIndex, startIndex + 5);
    selectedProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'item';
        const formattedPrice = formatNumberWithCommas(product.price);
        productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" width="200" onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';">
            <div class="card-item">
                <p class="nombre">${product.name}</p>
                <p class="precio"><strong>$ ${formattedPrice}</strong></p>
                <p class="tienda"><strong>Vendido por:</strong> ${product.store}</p>
                <a href="${product.link}" target="_blank"><button id="comprar-btn"><span class="icon-store_mall_directory"></span> Comprar</button></a>
            </div>
        `;
        results.appendChild(productDiv);
    });
    document.getElementById('loading').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

function setupPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / 5);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', () => {
            currentPage = i;
            displayProducts(i);
            updateActiveClass(i);
        });
        paginationContainer.appendChild(pageLink);
    }
}

function updateActiveClass(activePage) {
    const buttons = document.querySelectorAll('#pagination button');
    buttons.forEach(button => {
        if (parseInt(button.textContent) === activePage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


