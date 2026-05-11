// Конфигурация API (ВАЖНО: это URL вашего бэкенда на Render)
const API_URL = 'https://meat-shop-miniapp.onrender.com/api/send-order';

// Данные товаров (в реальном приложении будут загружаться с сервера)
const products = [
    {
        id: 1,
        name: "Сервелат высший сорт",
        category: "колбасы",
        price: 450,
        weight: "1 кг",
        description: "Варено-копченая колбаса высшего сорта",
        image: "fas fa-hotdog"//"static/images/servelat.jpg"
    },
    {
        id: 2,
        name: "Докторская колбаса",
        category: "колбасы",
        price: 320,
        weight: "1 кг",
        description: "Классическая вареная колбаса",
        image: "fas fa-hotdog"
    },
    {
        id: 3,
        name: "Сосиски молочные",
        category: "сосиски",
        price: 280,
        weight: "1 кг",
        description: "Нежные сосиски для всей семьи",
        image: "fas fa-drumstick-bite"
    },
    {
        id: 4,
        name: "Охотничьи колбаски",
        category: "копчености",
        price: 520,
        weight: "500 г",
        description: "Пряные копченые колбаски",
        image: "fas fa-fire"
    },
    {
        id: 5,
        name: "Пельмени говяжьи",
        category: "полуфабрикаты",
        price: 380,
        weight: "1 кг",
        description: "Домашние пельмени с говядиной",
        image: "fa-solid fa-utensils"
    },
    {
        id: 6,
        name: "Бекон копченый",
        category: "копчености",
        price: 650,
        weight: "1 кг",
        description: "Ароматный копченый бекон",
        image: "fas fa-bacon"
    },
    {
        id: 7,
        name: "Сардельки говяжьи",
        category: "сосиски",
        price: 340,
        weight: "1 кг",
        description: "Сочные сардельки из говядины",
        image: "fas fa-hotdog"
    },
    {
        id: 8,
        name: "Котлеты домашние",
        category: "полуфабрикаты",
        price: 290,
        weight: "500 г",
        description: "Котлеты из натурального мяса",
        image: "fas fa-hamburger"
    }
];

// Состояние приложения
const state = {
    cart: JSON.parse(localStorage.getItem('meatShopCart')) || [],
    orders: JSON.parse(localStorage.getItem('meatShopOrders')) || [],
    currentCategory: 'all',
    searchQuery: ''
};

// DOM элементы
const elements = {
    pages: document.querySelectorAll('.page'),
    navButtons: document.querySelectorAll('.nav-btn'),
    categoryButtons: document.querySelectorAll('.category-btn'),
    productsContainer: document.getElementById('products-container'),
    cartCount: document.getElementById('cart-count'),
    cartContainer: document.getElementById('cart-container'),
    cartItems: document.getElementById('cart-items'),
    cartEmpty: document.getElementById('cart-empty'),
    cartSummary: document.getElementById('cart-summary'),
    cartTotal: document.getElementById('cart-total'),
    cartGrandTotal: document.getElementById('cart-grand-total'),
    checkoutBtn: document.getElementById('checkout-btn'),
    ordersContainer: document.getElementById('orders-container'),
    ordersList: document.getElementById('orders-list'),
    noOrders: document.getElementById('no-orders'),
    searchInput: document.getElementById('search-input'),
    productModal: document.getElementById('product-modal'),
    orderModal: document.getElementById('order-modal'),
    orderForm: document.getElementById('order-form'),
    notification: document.getElementById('notification')
};

// Инициализация приложения
function init() {
    loadProducts();
    updateCart();
    loadOrders();
    setupEventListeners();
}

// Загрузка товаров
function loadProducts() {
    const filteredProducts = products.filter(product => {
        const matchesCategory = state.currentCategory === 'all' || 
                               product.category === state.currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                             product.description.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    elements.productsContainer.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        elements.productsContainer.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
// Создаем содержимое карточки
    div.innerHTML = `
        <div class="product-img">
            <i class="${product.image}"></i>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-price">${product.price} ₽ / ${product.weight}</p>
            <div class="product-actions">
                <button class="btn-secondary view-product" data-id="${product.id}">
                    Подробнее
                </button>
                <button class="btn-primary add-to-cart" data-id="${product.id}">
                    В корзину
                </button>
            </div>
        </div>
    `;
    return div;
}
// Создаем содержимое карточки
/*    div.innerHTML = `
        <div class="product-img">
            <img src="${product.image}" 
                 class="product-img-real"
                 onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            <i class="${product.image}"></i>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-price">${product.price} ₽ / ${product.weight}</p>
            <div class="product-actions">
                <button class="btn-secondary view-product" data-id="${product.id}">
                    Подробнее
                </button>
                <button class="btn-primary add-to-cart" data-id="${product.id}">
                    В корзину
                </button>
            </div>
        </div>
    `;
    return div;
}*/

// Настройка обработчиков событий
function setupEventListeners() {
    // Навигация
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageId = btn.getAttribute('data-page');
            switchPage(pageId);
            elements.navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Категории
    elements.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentCategory = btn.getAttribute('data-category');
            loadProducts();
        });
    });

    // Поиск
    elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        loadProducts();
    });

    // Открытие модального окна товара
    elements.productsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-product') || 
            e.target.closest('.view-product')) {
            const btn = e.target.classList.contains('view-product') ? 
                       e.target : e.target.closest('.view-product');
            const productId = parseInt(btn.getAttribute('data-id'));
            openProductModal(productId);
        }
        
        if (e.target.classList.contains('add-to-cart') || 
            e.target.closest('.add-to-cart')) {
            const btn = e.target.classList.contains('add-to-cart') ? 
                       e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(btn.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    // Оформление заказа
    elements.checkoutBtn.addEventListener('click', openOrderModal);

    // Закрытие модальных окон
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            elements.productModal.classList.remove('active');
            elements.orderModal.classList.remove('active');
        });
    });

    // Отправка формы заказа
    elements.orderForm.addEventListener('submit', submitOrder);

    // Клик вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === elements.productModal) {
            elements.productModal.classList.remove('active');
        }
        if (e.target === elements.orderModal) {
            elements.orderModal.classList.remove('active');
        }
    });
}

// Переключение страниц
function switchPage(pageId) {
    elements.pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
}

// Работа с корзиной
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Товар добавлен в корзину!');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    // Сохраняем корзину в localStorage
    localStorage.setItem('meatShopCart', JSON.stringify(state.cart));
    
    // Обновляем счетчик
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    
    // Обновляем содержимое корзины
    if (state.cart.length === 0) {
        elements.cartEmpty.style.display = 'block';
        elements.cartItems.style.display = 'none';
        elements.cartSummary.style.display = 'none';
    } else {
        elements.cartEmpty.style.display = 'none';
        elements.cartItems.style.display = 'block';
        elements.cartSummary.style.display = 'block';
        
        // Очищаем и обновляем список товаров
        elements.cartItems.innerHTML = '';
        let total = 0;
        
        state.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-img">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price} ₽ × ${item.quantity} = ${itemTotal} ₽</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            elements.cartItems.appendChild(div);
        });
        
        // Обновляем итоги
        const deliveryCost = 300;
        elements.cartTotal.textContent = `${total} ₽`;
        elements.cartGrandTotal.textContent = `${total + deliveryCost} ₽`;
        
        // Добавляем обработчики для кнопок в корзине
        elements.cartItems.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const item = state.cart.find(item => item.id === id);
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    removeFromCart(id);
                }
                updateCart();
            });
        });
        
        elements.cartItems.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const item = state.cart.find(item => item.id === id);
                item.quantity += 1;
                updateCart();
            });
        });
        
        elements.cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }
}

// Модальное окно товара
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    const modalContent = elements.productModal.querySelector('#modal-product-details');
   
    modalContent.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-img">
                <i class="${product.image}"></i>
            </div>
            <div class="product-modal-info">
                <h2>${product.name}</h2>
                <p class="product-modal-description">${product.description}</p>
                <p class="product-modal-weight">Вес: ${product.weight}</p>
                <p class="product-modal-price">${product.price} ₽</p>
                <button class="btn-primary add-to-cart-modal" data-id="${product.id}">
                    Добавить в корзину
                </button>
            </div>
        </div>
    `;
 /*   
    modalContent.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-img">
                <img src="${product.image}" 
                     onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="product-modal-info">
                <h2>${product.name}</h2>
                <p class="product-modal-description">${product.description}</p>
                <p class="product-modal-weight">Вес: ${product.weight}</p>
                <p class="product-modal-price">${product.price} ₽</p>
                <button class="btn-primary add-to-cart-modal" data-id="${product.id}">
                    Добавить в корзину
                </button>
            </div>
        </div>
    `;*/
    
    elements.productModal.classList.add('active');
    
    // Обработчик для кнопки в модальном окне
    modalContent.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        addToCart(productId);
        elements.productModal.classList.remove('active');
    });
}

// Модальное окно заказа
function openOrderModal() {
    if (state.cart.length === 0) {
        showNotification('Корзина пуста!', 'error');
        return;
    }
    elements.orderModal.classList.add('active');
}

async function submitOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const comment = document.getElementById('comment').value;
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        time: new Date().toLocaleTimeString('ru-RU'),
        status: 'processing',
        products: [...state.cart],
        subtotal: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        delivery: 300,
        total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 300,
        customer: { name, phone, address, comment }
    };
    
    try {
        // Показываем индикатор загрузки
        elements.checkoutBtn.disabled = true;
        elements.checkoutBtn.textContent = 'Отправка...';
        
        // Отправляем заказ в Telegram
        await sendOrderToTelegram(order);
        
        // Сохраняем заказ локально
        state.orders.unshift(order);
        state.cart = [];
        
        localStorage.setItem('meatShopOrders', JSON.stringify(state.orders));
        localStorage.setItem('meatShopCart', JSON.stringify([]));
        
        updateCart();
        loadOrders();
        
        elements.orderModal.classList.remove('active');
        elements.orderForm.reset();
        
        showNotification('Заказ оформлен успешно!');
        switchPage('orders');
        
    } catch (error) {
        showNotification('Ошибка отправки заказа. Попробуйте позже.', 'error');
    } finally {
        // Возвращаем кнопку в исходное состояние
        elements.checkoutBtn.disabled = false;
        elements.checkoutBtn.textContent = 'Оформить заказ';
    }
}

// Загрузка заказов
function loadOrders() {
    if (state.orders.length === 0) {
        elements.noOrders.style.display = 'block';
        elements.ordersList.style.display = 'none';
    } else {
        elements.noOrders.style.display = 'none';
        elements.ordersList.style.display = 'block';
        
        elements.ordersList.innerHTML = '';
        
        state.orders.forEach(order => {
            const div = document.createElement('div');
            div.className = 'order-card';
            
            let productsHTML = '';
            order.products.forEach(product => {
                productsHTML += `
                    <div class="order-product">
                        <span>${product.name} × ${product.quantity}</span>
                        <span>${product.price * product.quantity} ₽</span>
                    </div>
                `;
            });
            
            div.innerHTML = `
                <div class="order-header">
                    <div>
                        <h3>Заказ #${order.id}</h3>
                        <p>${order.date}</p>
                    </div>
                    <span class="order-status status-${order.status}">
                        ${order.status === 'processing' ? 'В обработке' : 'Доставлен'}
                    </span>
                </div>
                <div class="order-products">
                    ${productsHTML}
                </div>
                <div class="order-total">
                    Итого: ${order.total} ₽
                </div>
            `;
            
            elements.ordersList.appendChild(div);
        });
    }
}

// Уведомления
function showNotification(message, type = 'success') {
    elements.notification.textContent = message;
    elements.notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}
// Обработчик для кнопки "Перейти в каталог"
document.querySelectorAll('[data-page="catalog-page"]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Находим кнопку навигации "Каталог" и кликаем по ней
        const catalogNavButton = document.querySelector('.nav-btn[data-page="catalog"]');
        if (catalogNavButton) {
            catalogNavButton.click();
        }
        ;
    });
});

// Функция отправки заказа в Telegram
async function sendOrderToTelegram(orderData) {
    try {
        // Отправляем данные на ваш сервер/бэкенд
        const response = await fetch('/api/send-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Ошибка отправки заказа');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
        throw error;
    }
}


// Добавляем CSS для модального окна товара
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .product-modal-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .product-modal-img {
        height: 200px;
        background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .product-modal-img i {
        font-size: 80px;
        color: var(--primary-color);
    }
    
    .product-modal-info h2 {
        margin-bottom: 10px;
        color: var(--secondary-color);
    }
    
    .product-modal-description {
        color: var(--gray-color);
        margin-bottom: 15px;
    }
    
    .product-modal-weight {
        margin-bottom: 10px;
    }
    
    .product-modal-price {
        font-size: 24px;
        color: var(--primary-color);
        font-weight: bold;
        margin-bottom: 20px;
    }
    
    .add-to-cart-modal {
        width: 100%;
    }
    
    .status-processing {
        background: #fff3e0;
        color: #ff9800;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
    }
    
    .status-delivered {
        background: #e8f5e9;
        color: #4caf50;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
    }
`;
document.head.appendChild(modalStyles);

// Инициализация приложения при загрузке
document.addEventListener('DOMContentLoaded', init);