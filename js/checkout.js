/* =========================================
   CHECKOUT JS
   KHOTJIPANG & RAMYEON
========================================= */


/* =========================================
   SETTINGS
========================================= */

let receiveMethod = "pickup";

let paymentMethod = "cash";

/* =========================================
   ตั้งค่าจัดส่ง
========================================= */

const FREE_DELIVERY_MINIMUM = 50;
const DELIVERY_FEE = 10;

/* =========================================
   CHECKOUT FORM DATA
   เก็บข้อมูล Checkout ไว้ชั่วคราว
========================================= */

const CHECKOUT_STORAGE_KEY = "checkoutData";


/* =========================================
   SAVE CHECKOUT DATA
========================================= */

function saveCheckoutData() {

    const checkoutData = {

        receiveMethod:
            receiveMethod,

        paymentMethod:
            paymentMethod,

        customerName:
            document.getElementById("customerName")?.value || "",

        customerPhone:
            document.getElementById("customerPhone")?.value || "",

        deliveryAddress:
            document.getElementById("deliveryAddress")?.value || "",

        deliveryNote:
            document.getElementById("deliveryNote")?.value || ""

    };


    localStorage.setItem(
        CHECKOUT_STORAGE_KEY,
        JSON.stringify(checkoutData)
    );


    console.log(
        "CHECKOUT DATA SAVED:",
        checkoutData
    );
}


/* =========================================
   LOAD CHECKOUT DATA
========================================= */

function loadCheckoutData() {

    const savedData =
        localStorage.getItem(
            CHECKOUT_STORAGE_KEY
        );


    if (!savedData) {

        return false;

    }


    let checkoutData;


    try {

        checkoutData =
            JSON.parse(savedData);

    } catch (error) {

        console.error(
            "ไม่สามารถโหลดข้อมูล Checkout ได้",
            error
        );

        return false;

    }


    /* =====================================
       RECEIVE METHOD
    ===================================== */

    if (checkoutData.receiveMethod) {

        receiveMethod =
            checkoutData.receiveMethod;

    }


    /* =====================================
       PAYMENT METHOD
    ===================================== */

    if (checkoutData.paymentMethod) {

        paymentMethod =
            checkoutData.paymentMethod;

    }


    /* =====================================
       CUSTOMER NAME
    ===================================== */

    const customerName =
        document.getElementById(
            "customerName"
        );


    if (customerName) {

        customerName.value =
            checkoutData.customerName || "";

    }


    /* =====================================
       CUSTOMER PHONE
    ===================================== */

    const customerPhone =
        document.getElementById(
            "customerPhone"
        );


    if (customerPhone) {

        customerPhone.value =
            checkoutData.customerPhone || "";

    }


    /* =====================================
       DELIVERY ADDRESS
    ===================================== */

    const deliveryAddress =
        document.getElementById(
            "deliveryAddress"
        );


    if (deliveryAddress) {

        deliveryAddress.value =
            checkoutData.deliveryAddress || "";

    }


    /* =====================================
       DELIVERY NOTE
    ===================================== */

    const deliveryNote =
        document.getElementById(
            "deliveryNote"
        );


    if (deliveryNote) {

        deliveryNote.value =
            checkoutData.deliveryNote || "";

    }


    /* =====================================
       UPDATE RECEIVE UI
    ===================================== */

    selectReceiveMethod(
        receiveMethod,
        false
    );


    /* =====================================
       UPDATE PAYMENT UI
    ===================================== */

    selectPaymentMethod(
        paymentMethod,
        false
    );


    console.log(
        "CHECKOUT DATA LOADED:",
        checkoutData
    );


    return true;

}


/* =========================================
   AUTO SAVE FORM
========================================= */

function setupCheckoutAutoSave() {

    const customerName =
        document.getElementById(
            "customerName"
        );


    const customerPhone =
        document.getElementById(
            "customerPhone"
        );


    const deliveryAddress =
        document.getElementById(
            "deliveryAddress"
        );


    const deliveryNote =
        document.getElementById(
            "deliveryNote"
        );


    /* =====================================
       INPUT EVENTS
    ===================================== */

    [
        customerName,
        customerPhone,
        deliveryAddress,
        deliveryNote

    ].forEach(function (element) {

        if (!element) {
            return;
        }


        element.addEventListener(
            "input",
            saveCheckoutData
        );

    });

}

/* =========================================
   INIT CHECKOUT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCheckoutData();

        setupCheckoutAutoSave();

        loadCustomerData();

    }
);


/* =========================================
   CART
========================================= 

let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];*/

document.addEventListener("DOMContentLoaded", function () {

    cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    renderCart();

});


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================
           LOAD CART
        ===================================== */

        cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        /* =====================================
           LOAD SAVED CHECKOUT DATA
        ===================================== */

        const hasSavedData =
            loadCheckoutData();


        /* =====================================
           ถ้ายังไม่มีข้อมูลเก่า
           ใช้ค่าเริ่มต้น
        ===================================== */

        if (!hasSavedData) {

            receiveMethod =
                "pickup";

            paymentMethod =
                "cash";


            selectReceiveMethod(
                "pickup",
                false
            );


            selectPaymentMethod(
                "cash",
                false
            );

        }


        /* =====================================
           RENDER
        ===================================== */

        renderCheckoutItems();

        updateCheckoutTotal();

        setupSlipUpload();

        setupPhoneInput();

        setupCheckoutAutoSave();

    }
);

/* =========================================
   BACK TO Menu
========================================= */

function backToMenu() {

    // บันทึกข้อมูล Checkout ก่อนออก
    saveCheckoutData();

    window.location.href = "menu.html";

}


/* =========================================
   RECEIVE METHOD
========================================= */

function selectReceiveMethod(
    method,
    clearAddress = true
) {

    receiveMethod = method;


    /* =====================================
       ELEMENTS
    ===================================== */

    const pickupOption =
        document.getElementById(
            "pickupOption"
        );


    const deliveryOption =
        document.getElementById(
            "deliveryOption"
        );


    const addressGroup =
        document.getElementById(
            "deliveryAddressGroup"
        );


    const deliveryAddress =
        document.getElementById(
            "deliveryAddress"
        );


    const deliveryFeeRow =
        document.getElementById(
            "deliveryFeeRow"
        );


    const deliveryNotice =
        document.getElementById(
            "deliveryNotice"
        );


    /* =====================================
       RESET OPTION
    ===================================== */

    pickupOption.classList.remove(
        "active"
    );


    deliveryOption.classList.remove(
        "active"
    );


    /* =====================================
       PICKUP
    ===================================== */

    if (method === "pickup") {

        pickupOption.classList.add(
            "active"
        );


        addressGroup.classList.remove(
            "show"
        );


        deliveryFeeRow.style.display =
            "none";


        if (deliveryNotice) {

            deliveryNotice.classList.remove(
                "show"
            );

        }


        /*
           ล้างที่อยู่เฉพาะตอนที่
           ผู้ใช้กดเปลี่ยนเป็นรับเองจริง ๆ

           ไม่ล้างตอนโหลดข้อมูลเก่า
        */

        if (
            clearAddress &&
            deliveryAddress
        ) {

            deliveryAddress.value = "";

        }

    }


    /* =====================================
       DELIVERY
    ===================================== */

    if (method === "delivery") {

        deliveryOption.classList.add(
            "active"
        );


        addressGroup.classList.add(
            "show"
        );


        deliveryFeeRow.style.display =
            "flex";


        if (deliveryNotice) {

            deliveryNotice.classList.add(
                "show"
            );

        }

    }


    /* =====================================
       SAVE METHOD
    ===================================== */

    saveCheckoutData();


    /* =====================================
       UPDATE TOTAL
    ===================================== */

    updateCheckoutTotal();

}


/* =========================================
   PAYMENT METHOD
========================================= */

function selectPaymentMethod(
    method,
    saveData = true
) {

    paymentMethod = method;


    const cashPayment =
        document.getElementById(
            "cashPayment"
        );


    const transferPayment =
        document.getElementById(
            "transferPayment"
        );


    const transferBox =
        document.getElementById(
            "transferBox"
        );


    /* =====================================
       RESET
    ===================================== */

    cashPayment.classList.remove(
        "active"
    );


    transferPayment.classList.remove(
        "active"
    );


    transferBox.classList.remove(
        "show"
    );


    /* =====================================
       CASH
    ===================================== */

    if (method === "cash") {

        cashPayment.classList.add(
            "active"
        );

    }


    /* =====================================
       TRANSFER
    ===================================== */

    else if (method === "transfer") {

        transferPayment.classList.add(
            "active"
        );


        transferBox.classList.add(
            "show"
        );

    }


    /* =====================================
       SAVE
    ===================================== */

    if (saveData) {

        saveCheckoutData();

    }

}


/* =========================================
   CALCULATE FOOD TOTAL
========================================= */

function calculateFoodTotal() {

    if (!Array.isArray(cart)) {

        return 0;

    }


    return cart.reduce(
        function (total, item) {

            const price =
                Number(item.price) || 0;


            const quantity =
                Number(item.quantity) || 1;


            return total +
                (price * quantity);

        },
        0
    );

}


/* =========================================
   RENDER CHECKOUT ITEMS
========================================= */

function renderCheckoutItems() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (!container) {
        return;
    }


    /* =====================================
       EMPTY CART
    ===================================== */

    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-checkout">

                ไม่มีสินค้าในตะกร้า

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    /* =====================================
       RENDER ITEMS
    ===================================== */

    cart.forEach(function (item) {

        const price =
            Number(item.price) || 0;


        const quantity =
            Number(item.quantity) || 1;


        const subtotal =
            price * quantity;


        const image =
            item.image ||
            "images/no-image.png";


        const itemName =
            item.name ||
            "สินค้า";


        const itemNote =
            item.note ||
            "";


        /* =====================================
           TOPPINGS
        ===================================== */

        const itemToppings =
            Array.isArray(item.toppings)
                ? item.toppings
                : [];


        const toppingHTML =
            itemToppings.length > 0

                ? `
                    <div class="checkout-item-toppings">

                        ${itemToppings.map(function (topping) {

                    const toppingName =
                        topping.name || "ท็อปปิ้ง";

                    const toppingPrice =
                        Number(topping.price) || 0;

                    return `
                                <div class="checkout-item-topping">

                                    <span>
                                        + ${escapeHTML(toppingName)}
                                    </span>

                                    <span>
                                        ฿${toppingPrice.toLocaleString()}
                                    </span>

                                </div>
                            `;

                }).join("")}

                    </div>
                `

                : "";


        /* =====================================
           ITEM HTML
        ===================================== */

        const itemHTML = `

            <div class="checkout-item">


                <img
                    class="checkout-item-image"
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(itemName)}"
                    onerror="
                        this.src='images/no-image.png';
                    ">


                <div class="checkout-item-info">


                    <div class="checkout-item-name">

                        ${escapeHTML(itemName)}

                    </div>


                    <div class="checkout-item-qty">

                        จำนวน ${quantity} ชิ้น

                    </div>


                    ${toppingHTML}


                    ${itemNote ? `

                        <div class="checkout-item-note">

                            📝 ${escapeHTML(itemNote)}

                        </div>

                    ` : ""}


                </div>


                <div class="checkout-item-price">
                    <div class="checkout-item-main-price">
                        ฿${(price * quantity).toLocaleString()}
                    </div>

                    ${itemToppings.length > 0
                ? `
                                <div class="checkout-item-topping-price">
                                    +฿${(
                    itemToppings.reduce(function (total, topping) {
                        return total + (Number(topping.price) || 0);
                    }, 0) * quantity
                ).toLocaleString()}
                                </div>
                            `
                : ""
            }
                </div>



            </div>

        `;


        container.insertAdjacentHTML(
            "beforeend",
            itemHTML
        );

    });

}


/* =========================================
   UPDATE TOTAL
========================================= */

function updateCheckoutTotal() {

    const foodTotal =
        calculateFoodTotal();


    // ค่าส่ง
    // รับเอง = ฟรี
    // จัดส่ง + ยอดต่ำกว่า 50 = 10 บาท
    // จัดส่ง + ยอดตั้งแต่ 50 บาทขึ้นไป = ฟรี
    const deliveryFee =
        receiveMethod === "delivery" &&
            foodTotal < FREE_DELIVERY_MINIMUM
            ? DELIVERY_FEE
            : 0;


    const total =
        foodTotal + deliveryFee;


    /* =====================================
       FOOD TOTAL
    ===================================== */

    const foodTotalElement =
        document.getElementById(
            "foodTotal"
        );


    if (foodTotalElement) {

        foodTotalElement.textContent =
            `฿${foodTotal.toLocaleString()}`;

    }


    /* =====================================
       DELIVERY FEE
    ===================================== */

    const deliveryFeeElement =
        document.getElementById(
            "deliveryFee"
        );


    if (deliveryFeeElement) {

        deliveryFeeElement.textContent =
            `฿${deliveryFee.toLocaleString()}`;

    }


    /* =====================================
       CHECKOUT TOTAL
    ===================================== */

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );


    if (checkoutTotal) {

        checkoutTotal.textContent =
            `฿${total.toLocaleString()}`;

    }


    /* =====================================
       FOOTER TOTAL
    ===================================== */

    const confirmTotal =
        document.getElementById(
            "confirmTotal"
        );


    if (confirmTotal) {

        confirmTotal.textContent =
            `฿${total.toLocaleString()}`;

    }

}


/* =========================================
   SLIP UPLOAD
========================================= */

function setupSlipUpload() {

    const input =
        document.getElementById(
            "slipImage"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "change",
        function (event) {

            previewSlip(event);

        }
    );

}


/* =========================================
   PREVIEW SLIP
========================================= */

function previewSlip(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    /* =====================================
       FILE TYPE
    ===================================== */

    if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png"
    ) {

        alert(
            "กรุณาเลือกไฟล์ JPG หรือ PNG"
        );

        event.target.value = "";

        return;

    }


    /* =====================================
       FILE SIZE
    ===================================== */

    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "ไฟล์สลิปต้องมีขนาดไม่เกิน 5 MB"
        );

        event.target.value = "";

        return;

    }


    /* =====================================
       READER
    ===================================== */

    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            const preview =
                document.getElementById(
                    "slipPreview"
                );


            const placeholder =
                document.getElementById(
                    "uploadPlaceholder"
                );


            preview.src =
                e.target.result;


            preview.style.display =
                "block";


            placeholder.style.display =
                "none";

        };


    reader.readAsDataURL(file);

}


/* =========================================
   PHONE INPUT
========================================= */

function setupPhoneInput() {

    const phoneInput = document.getElementById("customerPhone");

    if (!phoneInput) return;

    phoneInput.readOnly = true;

    phoneInput.addEventListener("keydown", function (e) {
        e.preventDefault();
    });

    phoneInput.addEventListener("paste", function (e) {
        e.preventDefault();
    });

    phoneInput.addEventListener("input", function (e) {
        e.preventDefault();
        phoneInput.value = localStorage.getItem("customerPhone") || "";
    });
}


/* =========================================
   VALIDATE CHECKOUT
========================================= */

function validateCheckout() {


    /* =====================================
       CART
    ===================================== */

    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        alert(
            "ไม่มีสินค้าในตะกร้า"
        );

        return false;

    }


    /* =====================================
       NAME
    ===================================== */

    const name =
        document
            .getElementById(
                "customerName"
            )
            .value
            .trim();


    if (!name) {

        alert(
            "กรุณากรอกชื่อผู้สั่ง"
        );


        document
            .getElementById(
                "customerName"
            )
            .focus();


        return false;

    }


    /* =====================================
       PHONE
    ===================================== */

    const phone =
        document
            .getElementById(
                "customerPhone"
            )
            .value
            .trim();


    if (!phone) {

        alert(
            "กรุณากรอกเบอร์โทรศัพท์"
        );


        document
            .getElementById(
                "customerPhone"
            )
            .focus();


        return false;

    }


    /* =====================================
       THAI PHONE
    ===================================== */

    if (!/^0[0-9]{9}$/.test(phone)) {

        alert(
            "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"
        );


        document
            .getElementById(
                "customerPhone"
            )
            .focus();


        return false;

    }


    /* =====================================
       DELIVERY ADDRESS
    ===================================== */

    if (
        receiveMethod === "delivery"
    ) {

        const address =
            document
                .getElementById(
                    "deliveryAddress"
                )
                .value
                .trim();


        if (!address) {

            alert(
                "กรุณากรอกที่อยู่จัดส่ง"
            );


            document
                .getElementById(
                    "deliveryAddress"
                )
                .focus();


            return false;

        }

    }


    /* =====================================
       TRANSFER SLIP
    ===================================== */

    if (
        paymentMethod === "transfer"
    ) {

        const slip =
            document.getElementById(
                "slipImage"
            );


        if (
            !slip.files ||
            slip.files.length === 0
        ) {

            alert(
                "กรุณาอัปโหลดสลิปการโอนเงิน"
            );

            return false;

        }

    }


    return true;

}


/* =========================================
   CONFIRM ORDER
========================================= */

function confirmOrder() {

    /* =====================================
       VALIDATE
    ===================================== */

    if (!validateCheckout()) {
        return;
    }


    /* =====================================
       CUSTOMER
    ===================================== */

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    const phone =
        document
            .getElementById("customerPhone")
            .value
            .trim();


    /* =====================================
       ADDRESS
    ===================================== */

    let address = "";


    if (receiveMethod === "delivery") {

        address =
            document
                .getElementById("deliveryAddress")
                .value
                .trim();

    }


    /* =====================================
       TOTAL
    ===================================== */

    const foodTotal =
        calculateFoodTotal();


    const deliveryFee =
        receiveMethod === "delivery" &&
            foodTotal < FREE_DELIVERY_MINIMUM
            ? DELIVERY_FEE
            : 0;


    const total =
        foodTotal + deliveryFee;


    /* =====================================
       ORDER ID
    =====================================

    const orderId =
        "KP" + Date.now(); */

    const orderId = generateOrderId();

    /* =========================================
   GENERATE DAILY ORDER ID
    ========================================= */

    function generateOrderId() {

        const now =
            new Date();


        const today =
            now.getFullYear() +
            "-" +
            String(
                now.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                now.getDate()
            ).padStart(2, "0");


        const savedDate =
            localStorage.getItem(
                "orderDate"
            );


        let orderNumber = 1;


        if (savedDate === today) {

            orderNumber =
                parseInt(
                    localStorage.getItem(
                        "orderNumber"
                    ) || "0"
                ) + 1;

        }


        localStorage.setItem(
            "orderDate",
            today
        );


        localStorage.setItem(
            "orderNumber",
            orderNumber.toString()
        );


        return (
            "KJP#" +
            String(orderNumber)
                .padStart(3, "0")
        );

    }


    /* =====================================
       SLIP
    ===================================== */

    const slipInput =
        document.getElementById("slipImage");


    /* =====================================
       ORDER DATA
    ===================================== */

    const orderData = {

        orderId: orderId,

        status: "received",


        customer: {

            name: name,

            phone: phone,

            address: address

        },


        receiveMethod:
            receiveMethod,


        paymentMethod:
            paymentMethod,


        paymentStatus:
            paymentMethod === "transfer"
                ? "pending"
                : "unpaid",


        foodTotal:
            foodTotal,


        deliveryFee:
            deliveryFee,


        total:
            total,


        /* สำคัญ:
           เก็บ toppings ไปด้วย
        */

        items:
            cart.map(function (item) {

                return {

                    ...item,

                    toppings:
                        Array.isArray(item.toppings)
                            ? item.toppings
                            : []

                };

            }),


        createdAt:
            new Date().toISOString()

    };


    /* =====================================
       SLIP FILE NAME
    ===================================== 

    if (
        paymentMethod === "transfer" &&
        slipInput &&
        slipInput.files &&
        slipInput.files.length > 0
    ) {

        orderData.slipFileName =
            slipInput.files[0].name;

    }*/

    /* =====================================
   SAVE SLIP
    ===================================== */

    if (
        paymentMethod === "transfer" &&
        slipInput &&
        slipInput.files &&
        slipInput.files.length > 0
    ) {

        const slipFile =
            slipInput.files[0];

        const reader =
            new FileReader();


        reader.onload = function (event) {

            orderData.paymentSlip =
                event.target.result;

            orderData.slipFileName =
                slipFile.name;


            saveOrderAndFinish(orderData);

        };


        reader.onerror = function () {

            alert(
                "ไม่สามารถอ่านรูปสลิปได้ กรุณาลองใหม่อีกครั้ง"
            );

        };


        reader.readAsDataURL(slipFile);

    } else {

        saveOrderAndFinish(orderData);

    }

    /* =========================================
    SAVE ORDER AND FINISH
        ========================================= */

    function saveOrderAndFinish(orderData) {

        /* =====================================
           SAVE ORDER
        ===================================== */

        localStorage.setItem(
            "latestOrder",
            JSON.stringify(orderData)
        );


        console.log(
            "ORDER DATA:",
            orderData
        );


        /* =====================================
           SUCCESS
        ===================================== */

        alert(
            "สั่งซื้อเรียบร้อยแล้ว!\n\n" +
            "เลขออเดอร์: " +
            orderData.orderId
        );


        /* =====================================
           CLEAR CHECKOUT DATA
        ===================================== */

        localStorage.removeItem(
            "checkoutData"
        );


        /* =====================================
           CLEAR CART
        ===================================== */

        localStorage.removeItem(
            "cart"
        );


        /* =====================================
           GO SUCCESS
        ===================================== */

        window.location.href =
            "order-success.html";

    }
    if (paymentMethod === "transfer" && slipInput?.files?.length > 0) {

        const slipFile = slipInput.files[0];

        const reader = new FileReader();

        reader.onload = function (event) {

            orderData.paymentSlip =
                event.target.result;

            orderData.slipFileName =
                slipFile.name;

            saveOrderAndFinish(orderData);

        };

        reader.readAsDataURL(slipFile);

    } else {

        saveOrderAndFinish(orderData);

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

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


// =====================================
// CUSTOMER DATA FROM INDEX
// =====================================

const loggedCustomerName =
    localStorage.getItem("customerName") || "";

const loggedCustomerPhone =
    localStorage.getItem("customerPhone") || "";


/* =========================================
   CUSTOMER DATA FROM INDEX
========================================= */

function loadCustomerData() {

    const name = localStorage.getItem("customerName") || "";
    const phone = localStorage.getItem("customerPhone") || "";

    const nameInput = document.getElementById("customerName");
    const phoneInput = document.getElementById("customerPhone");

    if (nameInput) {
        nameInput.value = name;
        nameInput.readOnly = true;
    }

    if (phoneInput) {
        phoneInput.value = phone;
        phoneInput.readOnly = true;
    }
}