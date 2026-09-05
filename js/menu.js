/* =========================================================
   KHOTJIPANG & RAMYEON
   MENU.JS
========================================================= */


/* =========================================================
   CUSTOMER
========================================================= */

const customerName =
    localStorage.getItem("customerName");

const customerPhone =
    localStorage.getItem("customerPhone");


/* ถ้ายังไม่ได้ Login */

if (!customerName || !customerPhone) {

    window.location.replace("index.html");

}


/* =========================================================
   CUSTOMER NAME DISPLAY
========================================================= */

const customerNameDisplay =
    document.getElementById(
        "customerNameDisplay"
    );


if (
    customerNameDisplay &&
    customerName
) {

    customerNameDisplay.textContent =
        customerName;

}


/* =========================================================
   MENU DATA
========================================================= */

const menus = [

    {
        id: 1,
        name: "ปังเนยนม",
        category: "sweet",
        price: 20,
        image: "images/menu/butter-milk.jpg",
        description: "ขนมปังปิ้งหอมเนย ราดนมหวาน ๆ"
    },

    {
        id: 2,
        name: "ปังนูเทลล่า",
        category: "sweet",
        price: 30,
        image: "images/menu/nutella.jpg",
        description: "ขนมปังปิ้งกรอบนอกนุ่มใน พร้อมนูเทลล่า"
    },

    {
        id: 3,
        name: "ปังข้าวโพดชีส",
        category: "sweet",
        price: 40,
        image: "images/menu/corn-cheese.jpg",
        description: "ข้าวโพดหวานและชีสเยิ้ม ๆ"
    },

    {
        id: 4,
        name: "ปังไส้กรอกชีส",
        category: "savory",
        price: 40,
        image: "images/menu/sausage-cheese-pizza.jpg",
        description: "ไส้กรอกพร้อมชีสยืด ๆ"
    },

    {
        id: 5,
        name: "ปังพิซซ่าฮาวายเอี้ยน",
        category: "savory",
        price: 55,
        image: "images/menu/hawaiian.jpg",
        description: "แฮม สับปะรด และชีส"
    },

    {
        id: 6,
        name: "ซัมยัง Original",
        category: "ramyeon",
        price: 59,
        image: "images/menu/samyang.jpg",
        description: "ซัมยังรสต้นตำรับ"
    },

    {
        id: 7,
        name: "ซัมยัง + ไข่ดาว",
        category: "ramyeon",
        price: 69,
        image: "images/menu/samyang-egg.jpg",
        description: "ซัมยังพร้อมไข่ดาว"
    },

    {
        id: 8,
        name: "ซัมยัง + ปูอัด",
        category: "ramyeon",
        price: 69,
        image: "images/menu/samyang-crab.jpg",
        description: "ซัมยังพร้อมปูอัด"
    },

    {
        id: 9,
        name: "ซัมยัง + ไก่",
        category: "ramyeon",
        price: 89,
        image: "images/menu/samyang-chicken.jpg",
        description: "ซัมยังพร้อมไก่"
    },

    {
        id: 10,
        name: "โค้ก",
        category: "drink",
        price: 20,
        image: "images/menu/coke.jpg",
        description: "โค้กเย็น ๆ"
    },

    {
        id: 11,
        name: "ชาพีช",
        category: "drink",
        price: 20,
        image: "images/menu/peach-tea.jpg",
        description: "ชาพีชหอมหวาน"
    }

];


/* =========================================================
   TOPPING DATA
========================================================= */

const toppings = [

    {
        id: "egg",
        name: "ไข่ดาว",
        price: 10
    },

    {
        id: "crab",
        name: "ปูอัด",
        price: 10
    },

    {
        id: "chicken",
        name: "ไก่",
        price: 30
    }

];


/* =========================================================
   CART
========================================================= */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


let selectedProduct = null;

let selectedQuantity = 1;

let currentCategory = "all";

let deleteCartIndex = null;


/*
   index ของรายการที่กำลังแก้ไข

   null = กำลังเพิ่มสินค้าใหม่
*/

let editingCartIndex = null;


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   RENDER MENU
========================================================= */

function renderMenu() {

    const menuGrid =
        document.getElementById(
            "menuGrid"
        );

    const menuCount =
        document.getElementById(
            "menuCount"
        );

    const noMenu =
        document.getElementById(
            "noMenu"
        );

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (!menuGrid) return;


    const keyword =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filteredMenus =
        menus.filter(menu => {

            const categoryMatch =
                currentCategory === "all" ||
                menu.category === currentCategory;


            const searchMatch =
                menu.name
                    .toLowerCase()
                    .includes(keyword);


            return (
                categoryMatch &&
                searchMatch
            );

        });


    if (menuCount) {

        menuCount.textContent =
            `${filteredMenus.length} เมนู`;

    }


    if (filteredMenus.length === 0) {

        menuGrid.innerHTML = "";


        if (noMenu) {

            noMenu.style.display =
                "block";

        }


        return;

    }


    if (noMenu) {

        noMenu.style.display =
            "none";

    }


    menuGrid.innerHTML =
        filteredMenus.map(menu => {

            return `

                <article class="menu-card">

                    <div
                        class="menu-image"
                        onclick="openProductModal(${menu.id})"
                    >

                        <img
                            src="${menu.image}"
                            alt="${menu.name}"
                        >

                    </div>


                    <div class="menu-info">

                        <h3>
                            ${menu.name}
                        </h3>


                        <p>
                            ${menu.description}
                        </p>


                        <div class="menu-bottom">

                            <span class="menu-price">
                                ${menu.price}฿
                            </span>


                            <button
                                type="button"
                                class="add-menu-button"
                                onclick="openProductModal(${menu.id})"
                            >
                                +
                            </button>

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


/* =========================================================
   CATEGORY
========================================================= */

function setupCategories() {

    const buttons =
        document.querySelectorAll(
            ".category-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                buttons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                currentCategory =
                    this.dataset.category ||
                    "all";


                renderMenu();

            }
        );

    });

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const clearSearch =
        document.getElementById(
            "clearSearch"
        );


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        function () {

            renderMenu();


            if (clearSearch) {

                clearSearch.style.display =
                    this.value.trim()
                        ? "block"
                        : "none";

            }

        }
    );


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                clearSearch.style.display =
                    "none";

                renderMenu();

                searchInput.focus();

            }
        );

    }

}


/* =========================================================
   OPEN PRODUCT MODAL
========================================================= */

function openProductModal(id) {

    selectedProduct =
        menus.find(
            menu => menu.id === id
        );


    if (!selectedProduct) {
        return;
    }


    /*
       ถ้าเปิดจากเมนูปกติ
       = เพิ่มสินค้าใหม่
    */

    editingCartIndex = null;

    selectedQuantity = 1;


    const modal =
        document.getElementById(
            "productModal"
        );


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    const modalName =
        document.getElementById(
            "modalName"
        );


    const modalDescription =
        document.getElementById(
            "modalDescription"
        );


    const modalQuantity =
        document.getElementById(
            "modalQuantity"
        );


    const productNote =
        document.getElementById(
            "productNote"
        );


    const addCartButtonText =
        document.getElementById(
            "addCartButtonText"
        );


    if (modalImage) {

        modalImage.src =
            selectedProduct.image;

        modalImage.alt =
            selectedProduct.name;

    }


    if (modalName) {

        modalName.textContent =
            selectedProduct.name;

    }


    if (modalDescription) {

        modalDescription.textContent =
            selectedProduct.description;

    }


    if (modalQuantity) {

        modalQuantity.textContent =
            "1";

    }


    if (productNote) {

        productNote.value = "";

    }


    if (addCartButtonText) {

        addCartButtonText.textContent =
            "เพิ่มลงตะกร้า";

    }


    renderToppings();

    updateModalTotal();


    if (modal) {

        modal.classList.add("show");

        document.body.classList.add(
            "modal-open"
        );

    }

}


/* =========================================================
   EDIT CART ITEM
========================================================= */

function editCartItem(index) {

    if (!cart[index]) {
        return;
    }


    const item =
        cart[index];


    const product =
        menus.find(
            menu => menu.id === item.id
        );


    if (!product) {
        return;
    }


    selectedProduct =
        product;


    selectedQuantity =
        Number(item.quantity) || 1;


    editingCartIndex =
        index;


    const modal =
        document.getElementById(
            "productModal"
        );


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    const modalName =
        document.getElementById(
            "modalName"
        );


    const modalDescription =
        document.getElementById(
            "modalDescription"
        );


    const modalQuantity =
        document.getElementById(
            "modalQuantity"
        );


    const productNote =
        document.getElementById(
            "productNote"
        );


    const addCartButtonText =
        document.getElementById(
            "addCartButtonText"
        );


    if (modalImage) {

        modalImage.src =
            product.image;

        modalImage.alt =
            product.name;

    }


    if (modalName) {

        modalName.textContent =
            product.name;

    }


    if (modalDescription) {

        modalDescription.textContent =
            product.description;

    }


    if (modalQuantity) {

        modalQuantity.textContent =
            selectedQuantity;

    }


    if (productNote) {

        productNote.value =
            item.note || "";

    }


    if (addCartButtonText) {

        addCartButtonText.textContent =
            "บันทึกการแก้ไข";

    }


    /*
       สร้าง topping ก่อน
       แล้วค่อยติ๊กค่าที่เคยเลือกไว้
    */

    renderToppings();


    const itemToppings =
        item.toppings || [];


    const selectedToppingIds =
        itemToppings.map(
            topping => topping.id
        );


    document
        .querySelectorAll(
            '#toppingList input[type="checkbox"]'
        )
        .forEach(input => {

            input.checked =
                selectedToppingIds.includes(
                    input.value
                );

        });


    updateModalTotal();


    /*
       ปิด Cart ก่อน
       แล้วเปิด Product Modal
    */

    closeCartModal();


    if (modal) {

        modal.classList.add("show");

        document.body.classList.add(
            "modal-open"
        );

    }

}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );


    selectedProduct = null;

    selectedQuantity = 1;

    editingCartIndex = null;

}


/* =========================================================
   RENDER TOPPINGS
========================================================= */

function renderToppings() {

    const section =
        document.getElementById(
            "toppingSection"
        );


    const list =
        document.getElementById(
            "toppingList"
        );


    if (!section || !list) {
        return;
    }


    if (
        !selectedProduct ||
        selectedProduct.category !== "ramyeon"
    ) {

        section.style.display =
            "none";

        list.innerHTML = "";

        return;

    }


    section.style.display =
        "block";


    list.innerHTML =
        toppings.map(topping => {

            return `

                <label class="topping-item">

                    <input
                        type="checkbox"
                        value="${topping.id}"
                        data-price="${topping.price}"
                    >

                    <span>
                        ${topping.name}
                    </span>

                    <span>
                        +${topping.price}฿
                    </span>

                </label>

            `;

        }).join("");


    list
        .querySelectorAll(
            'input[type="checkbox"]'
        )
        .forEach(input => {

            input.addEventListener(
                "change",
                updateModalTotal
            );

        });

}


/* =========================================================
   CHANGE PRODUCT QUANTITY
========================================================= */

function changeQuantity(change) {

    selectedQuantity += change;


    if (selectedQuantity < 1) {

        selectedQuantity = 1;

    }


    const quantity =
        document.getElementById(
            "modalQuantity"
        );


    if (quantity) {

        quantity.textContent =
            selectedQuantity;

    }


    updateModalTotal();

}


/* =========================================================
   UPDATE MODAL TOTAL
========================================================= */

function updateModalTotal() {

    if (!selectedProduct) {
        return;
    }


    const checked =
        document.querySelectorAll(
            '#toppingList input[type="checkbox"]:checked'
        );


    let toppingPrice = 0;


    checked.forEach(input => {

        toppingPrice +=
            Number(
                input.dataset.price
            ) || 0;

    });


    const unitPrice =
        selectedProduct.price +
        toppingPrice;


    const total =
        unitPrice *
        selectedQuantity;


    const modalTotal =
        document.getElementById(
            "modalTotal"
        );


    if (modalTotal) {

        modalTotal.textContent =
            `${total}฿`;

    }

}


/* =========================================================
   GET SELECTED TOPPINGS
========================================================= */

function getSelectedToppings() {

    const selectedToppings = [];


    const checked =
        document.querySelectorAll(
            '#toppingList input[type="checkbox"]:checked'
        );


    checked.forEach(input => {

        const topping =
            toppings.find(
                item =>
                    item.id === input.value
            );


        if (topping) {

            selectedToppings.push(
                topping
            );

        }

    });


    return selectedToppings;

}


/* =========================================================
   CREATE ITEM KEY
========================================================= */

function createItemKey(item) {

    return (
        (item.toppings || [])
            .map(topping => topping.id)
            .sort()
            .join(",")
        +
        "|" +
        (item.note || "")
    );

}


/* =========================================================
   ADD / EDIT TO CART
========================================================= */

function addToCart() {

    if (!selectedProduct) {
        return;
    }


    /* TOPPING */

    const selectedToppings =
        getSelectedToppings();


    /* NOTE */

    const noteElement =
        document.getElementById(
            "productNote"
        );


    const note =
        noteElement
            ? noteElement.value.trim()
            : "";


    /* PRICE */

    const toppingPrice =
        selectedToppings.reduce(
            (sum, topping) =>
                sum + topping.price,
            0
        );


    const unitPrice =
        selectedProduct.price +
        toppingPrice;


    /*
       =====================================================
       EDIT MODE
       =====================================================
    */

    if (
        editingCartIndex !== null &&
        cart[editingCartIndex]
    ) {

        cart[editingCartIndex] = {

            ...cart[editingCartIndex],

            id: selectedProduct.id,

            name: selectedProduct.name,

            price: unitPrice,

            basePrice: selectedProduct.price,

            quantity: selectedQuantity,

            image: selectedProduct.image,

            toppings: selectedToppings,

            note: note

        };


        /*
           หลังแก้ไขเสร็จ
           ถ้ามีรายการอื่นเหมือนกัน
           ให้รวมจำนวนเข้าด้วยกัน
        */

        const editedIndex =
            editingCartIndex;


        const editedItem =
            cart[editedIndex];


        const editedKey =
            createItemKey(
                editedItem
            );


        for (
            let i = cart.length - 1;
            i >= 0;
            i--
        ) {

            if (i === editedIndex) {
                continue;
            }


            if (
                cart[i].id === editedItem.id &&
                createItemKey(cart[i]) === editedKey
            ) {

                cart[i].quantity +=
                    editedItem.quantity;


                cart.splice(
                    editedIndex,
                    1
                );


                break;

            }

        }


        editingCartIndex = null;


        saveCart();

        updateCartUI();

        closeProductModal();


        return;

    }


    /*
       =====================================================
       ADD NEW ITEM
       =====================================================
    */

    const newItem = {

        id: selectedProduct.id,

        name: selectedProduct.name,

        price: unitPrice,

        basePrice: selectedProduct.price,

        quantity: selectedQuantity,

        image: selectedProduct.image,

        toppings: selectedToppings,

        note: note

    };


    const newItemKey =
        createItemKey(
            newItem
        );


    /*
       หาเมนูเดิมที่
       - id เหมือนกัน
       - topping เหมือนกัน
       - หมายเหตุเหมือนกัน
    */

    const existingIndex =
        cart.findIndex(item => {

            return (
                item.id === newItem.id &&
                createItemKey(item) === newItemKey
            );

        });


    if (existingIndex !== -1) {

        cart[existingIndex].quantity +=
            selectedQuantity;

    }

    else {

        cart.push(
            newItem
        );

    }


    saveCart();

    updateCartUI();

    closeProductModal();

}


/* =========================================================
   UPDATE CART UI
========================================================= */

function updateCartUI() {

    const cartBadge =
        document.getElementById(
            "cartBadge"
        );


    const stickyCart =
        document.querySelector(
            ".sticky-cart"
        );


    const stickyItems =
        document.getElementById(
            "stickyItems"
        );


    const stickyTotal =
        document.getElementById(
            "stickyTotal"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    const totalQuantity =
        cart.reduce(
            (sum, item) =>
                sum + Number(item.quantity),
            0
        );


    const totalPrice =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );


    if (cartBadge) {

        cartBadge.textContent =
            totalQuantity;


        cartBadge.style.display =
            totalQuantity > 0
                ? "flex"
                : "none";

    }


    if (stickyCart) {

        stickyCart.style.display =
            totalQuantity > 0
                ? "flex"
                : "none";

    }


    if (stickyItems) {

        stickyItems.textContent =
            `${totalQuantity} รายการ`;

    }


    if (stickyTotal) {

        stickyTotal.textContent =
            `${totalPrice}฿`;

    }


    if (cartTotal) {

        cartTotal.textContent =
            `${totalPrice}฿`;

    }


    renderCart();

}


/* =========================================================
   OPEN CART
========================================================= */

function openCartModal() {

    const modal =
        document.getElementById(
            "cartModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );

    }


    renderCart();

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCartModal() {

    const modal =
        document.getElementById(
            "cartModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const emptyCart =
        document.getElementById(
            "emptyCart"
        );


    const cartSummary =
        document.getElementById(
            "cartSummary"
        );


    if (!cartItems) {
        return;
    }


    /* =========================================================
       EMPTY CART
    ========================================================= */

    if (cart.length === 0) {

        cartItems.innerHTML = "";


        if (emptyCart) {

            emptyCart.style.display =
                "block";

        }


        if (cartSummary) {

            cartSummary.style.display =
                "none";

        }


        return;

    }


    /* =========================================================
       HAS ITEMS
    ========================================================= */

    if (emptyCart) {

        emptyCart.style.display =
            "none";

    }


    if (cartSummary) {

        cartSummary.style.display =
            "block";

    }


    cartItems.innerHTML =
        cart.map((item, index) => {


            /* =================================================
               TOPPING
            ================================================= */

            let toppingHTML = "";


            if (
                item.toppings &&
                item.toppings.length > 0
            ) {

                toppingHTML = `

                    <div class="checkout-item-topping">

                        <span>เพิ่ม:</span>

                        ${item.toppings
                        .map(
                            topping => `
                                    <span>
                                        ${escapeHTML(topping.name)}
                                        <span class="topping-price">
                                            +${Number(topping.price)}฿
                                        </span>
                                    </span>
                                `
                        )
                        .join(", ")
                    }

                    </div>

                `;

            }


            /* =================================================
               NOTE
            ================================================= */

            let noteHTML = "";


            if (item.note) {

                noteHTML = `

                    <div class="cart-item-note">

                        หมายเหตุ:
                        ${escapeHTML(item.note)}

                    </div>

                `;

            }


            /* =================================================
               TOTAL
            ================================================= */

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            /* =================================================
               DECREASE BUTTON

               quantity = 1
               → 🗑️

               quantity >= 2
               → −
            ================================================= */

            const decreaseButton =
                Number(item.quantity) === 1

                    ? `

                        <button
                            type="button"
                            class="cart-remove-button"
                            onclick="removeCartItem(${index})"
                            aria-label="ลบสินค้า"
                        >
                            🗑️
                        </button>

                    `

                    : `

                        <button
                            type="button"
                            onclick="changeCartQuantity(${index}, -1)"
                            aria-label="ลดจำนวน"
                        >
                            −
                        </button>

                    `;


            /* =================================================
               CART ITEM
            ================================================= */

            return `

                <div class="cart-item">


                    <img
                        src="${item.image}"
                        alt="${escapeHTML(item.name)}"
                        class="cart-item-image"
                    >


                    <div class="cart-item-info">


                        <!-- MENU NAME -->

                        <h3 class="cart-item-title">

                            <span class="cart-item-name">
                                ${escapeHTML(item.name)}
                            </span>

                            <button
                                type="button"
                                class="edit-order-button"
                                onclick="editCartItem(${index})"
                            >
                                ✏️ แก้ไข
                            </button>

                        </h3> 


                        <!-- TOPPING -->

                        ${toppingHTML}


                        <!-- NOTE -->

                        ${noteHTML}


                        <!-- BOTTOM -->

                        <div class="cart-item-bottom">


                            <div class="cart-item-bottom-row">


                                <!-- TOTAL PRICE
                                     แสดงราคาเพียงครั้งเดียว -->

                                <strong>
                                    ${itemTotal}฿
                                </strong>


                                <!-- QUANTITY -->

                                <div class="cart-quantity">


                                    ${decreaseButton}


                                    <span>
                                        ${item.quantity}
                                    </span>


                                    <button
                                        type="button"
                                        onclick="changeCartQuantity(${index}, 1)"
                                        aria-label="เพิ่มจำนวน"
                                    >
                                        +
                                    </button>


                                </div>


                            </div>


                        </div>


                    </div>


                </div>

            `;

        }).join("");

}



/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(index, change) {

    if (!cart[index]) {
        return;
    }


    /*
       ถ้าจำนวนเป็น 1
       และกดลด
       ให้ไป Popup ยืนยันการลบ
    */

    if (
        change === -1 &&
        Number(cart[index].quantity) === 1
    ) {

        removeCartItem(index);

        return;

    }


    cart[index].quantity +=
        change;


    if (cart[index].quantity < 1) {

        cart[index].quantity = 1;

    }


    saveCart();

    updateCartUI();

}


/* =========================================================
   REMOVE CART ITEM
========================================================= */

function removeCartItem(index) {

    if (!cart[index]) {
        return;
    }


    deleteCartIndex =
        index;


    const item =
        cart[index];


    const message =
        document.getElementById(
            "deleteConfirmMessage"
        );


    if (message) {

        message.textContent =
            `ต้องการลบ "${item.name}" ออกจากตะกร้าหรือไม่?`;

    }


    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


/* =========================================================
   CLOSE DELETE
========================================================= */

function closeDeleteConfirm() {

    deleteCartIndex =
        null;


    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

function confirmDeleteCartItem() {

    if (deleteCartIndex === null) {
        return;
    }


    cart.splice(
        deleteCartIndex,
        1
    );


    saveCart();


    deleteCartIndex =
        null;


    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    updateCartUI();

}


/* =========================================================
   CHECKOUT
========================================================= */

function checkout() {

    if (cart.length === 0) {

        alert(
            "กรุณาเพิ่มสินค้าลงตะกร้าก่อน"
        );

        return;

    }


    saveCart();


    window.location.href =
        "checkout.html";

}


/* =========================================================
   HOW TO ORDER
========================================================= */

function openHowToOrder() {

    const modal =
        document.getElementById(
            "howToOrderModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );

    }

}


function closeHowToOrder() {

    const modal =
        document.getElementById(
            "howToOrderModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   BANNER
========================================================= */

function setupBanner() {

    const slider =
        document.getElementById(
            "bannerSlider"
        );


    if (!slider) {
        return;
    }


    const cards =
        slider.querySelectorAll(
            ".banner-card"
        );


    const dots =
        document.querySelectorAll(
            ".banner-dots .dot"
        );


    function updateDots() {

        if (
            !cards.length ||
            !dots.length
        ) {
            return;
        }


        const cardWidth =
            cards[0].offsetWidth;


        const gap = 12;


        let index =
            Math.round(
                slider.scrollLeft /
                (cardWidth + gap)
            );


        index =
            Math.max(
                0,
                Math.min(
                    index,
                    dots.length - 1
                )
            );


        dots.forEach(dot => {

            dot.classList.remove(
                "active"
            );

        });


        if (dots[index]) {

            dots[index].classList.add(
                "active"
            );

        }

    }


    slider.addEventListener(
        "scroll",
        updateDots,
        {
            passive: true
        }
    );


    dots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                function () {

                    if (!cards[index]) {
                        return;
                    }


                    slider.scrollTo({

                        left:
                            cards[index].offsetLeft,

                        behavior:
                            "smooth"

                    });

                }
            );

        }
    );


    updateDots();

}


/* =========================================================
   DRAG SCROLL
========================================================= */

function enableDragScroll(element) {

    if (!element) {
        return;
    }


    let isDown = false;

    let startX = 0;

    let scrollLeft = 0;


    element.addEventListener(
        "mousedown",
        function (e) {

            isDown = true;

            startX =
                e.pageX -
                element.offsetLeft;

            scrollLeft =
                element.scrollLeft;

            element.style.cursor =
                "grabbing";

        }
    );


    element.addEventListener(
        "mouseup",
        function () {

            isDown = false;

            element.style.cursor =
                "grab";

        }
    );


    element.addEventListener(
        "mouseleave",
        function () {

            isDown = false;

            element.style.cursor =
                "grab";

        }
    );


    element.addEventListener(
        "mousemove",
        function (e) {

            if (!isDown) {
                return;
            }


            e.preventDefault();


            const x =
                e.pageX -
                element.offsetLeft;


            const walk =
                (x - startX) * 1.5;


            element.scrollLeft =
                scrollLeft - walk;

        }
    );


    element.style.cursor =
        "grab";

}


/* =========================================================
   ESC TO CLOSE
========================================================= */

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key !== "Escape") {
            return;
        }


        closeProductModal();

        closeCartModal();

        closeDeleteConfirm();

        closeHowToOrder();

    }
);


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

document.addEventListener(
    "click",
    function (e) {

        const productModal =
            document.getElementById(
                "productModal"
            );


        const cartModal =
            document.getElementById(
                "cartModal"
            );


        const howToOrderModal =
            document.getElementById(
                "howToOrderModal"
            );


        if (
            productModal &&
            e.target === productModal
        ) {

            closeProductModal();

        }


        if (
            cartModal &&
            e.target === cartModal
        ) {

            closeCartModal();

        }


        if (
            howToOrderModal &&
            e.target === howToOrderModal
        ) {

            closeHowToOrder();

        }

    }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderMenu();

        updateCartUI();

        setupCategories();

        setupSearch();

        setupBanner();


        enableDragScroll(
            document.getElementById(
                "bannerSlider"
            )
        );


        enableDragScroll(
            document.querySelector(
                ".category-scroll"
            )
        );

    }
);


/* =========================================================
   ORDER TRACKING
========================================================= */

function goToOrderTracking() {

    window.location.href =
        "track-order.html";

}
