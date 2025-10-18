const products = [
    {
        id: 1,
        name: "Product 1",
        price: 29.99,
        description: "Description for Product 1",
        imageUrl: "path/to/image1.jpg"
    },
    {
        id: 2,
        name: "Product 2",
        price: 39.99,
        description: "Description for Product 2",
        imageUrl: "path/to/image2.jpg"
    },
    {
        id: 3,
        name: "Product 3",
        price: 49.99,
        description: "Description for Product 3",
        imageUrl: "path/to/image3.jpg"
    }
];

function getProducts() {
    return products;
}

function renderProducts() {
    const productContainer = document.getElementById('product-list');
    const productList = getProducts();

    productList.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
        `;
        productContainer.appendChild(productElement);
    });
}

export { getProducts, renderProducts };