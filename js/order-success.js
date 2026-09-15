/* =========================================
   ORDER SUCCESS
========================================= */


/* =========================================
   LOAD ORDER
========================================= */

function getLatestOrder() {

    const savedOrder =
        localStorage.getItem("latestOrder");

    if (!savedOrder) {

        return null;

    }

    try {

        return JSON.parse(savedOrder);

    } catch (error) {

        console.error(
            "ไม่สามารถอ่านข้อมูลออเดอร์ได้",
            error
        );

        return null;

    }

}



/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(number) {

    return Number(number || 0)
        .toLocaleString("th-TH") + " ฿";

}



/* =========================================
   RECEIVE METHOD
========================================= */

function getReceiveMethodText(method) {

    if (method === "delivery") {

        return "จัดส่ง";

    }

    return "รับที่ร้าน";

}



/* =========================================
   RENDER CUSTOMER
========================================= */

function renderCustomer(order) {

    document
        .getElementById("customerName")
        .textContent =
        order.customer?.name || "-";


    document
        .getElementById("customerPhone")
        .textContent =
        order.customer?.phone || "-";


    document
        .getElementById("receiveMethod")
        .textContent =
        getReceiveMethodText(
            order.receiveMethod
        );

    /* =====================================
       ORDER DATE & TIME
    ===================================== */

    if (order.createdAt) {

        const orderDate =
            new Date(order.createdAt);


        document
            .getElementById("orderDate")
            .textContent =
            orderDate.toLocaleDateString(
                "th-TH",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );


        document
            .getElementById("orderTime")
            .textContent =
            orderDate.toLocaleTimeString(
                "th-TH",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ) + " น.";

    }


    /* =====================================
       ADDRESS
    ===================================== */

    const addressRow =
        document.getElementById("addressRow");


    if (
        order.receiveMethod === "delivery" &&
        order.customer?.address
    ) {

        addressRow.style.display =
            "flex";

        document
            .getElementById("customerAddress")
            .textContent =
            order.customer.address;

    } else {

        addressRow.style.display =
            "none";

    }

}

/* =========================================
   PAYMENT INFORMATION
========================================= */

function renderPayment(order) {

    const paymentMethod =
        document.getElementById("paymentMethod");

    const paymentSlipRow =
        document.getElementById("paymentSlipRow");

    const paymentSlip =
        document.getElementById("paymentSlip");

    const paymentStatus =
        document.getElementById("paymentStatus");


    /* =====================================
       PAYMENT METHOD
    ===================================== */

    if (order.paymentMethod === "transfer") {

        paymentMethod.textContent =
            "โอนเงิน";

    } else {

        paymentMethod.textContent =
            "เงินสด";

    }


    /* =====================================
       PAYMENT SLIP
    ===================================== */

    if (
        order.paymentMethod === "transfer" &&
        order.paymentSlip
    ) {

        paymentSlipRow.style.display =
            "block";

        paymentSlip.src =
            order.paymentSlip;

        paymentStatus.textContent =
            "✓ ส่งหลักฐานแล้ว";

    } else {

        paymentSlipRow.style.display =
            "none";

        paymentSlip.src = "";

    }

}



/* =========================================
   RENDER ITEMS
========================================= */

function renderItems(order) {

    const container = document.getElementById("orderItems");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (!order.items || order.items.length === 0) {

        container.innerHTML = `
            <div class="empty-order">
                ไม่มีรายการอาหาร
            </div>
        `;

        return;
    }


    order.items.forEach(item => {

        const quantity = Number(item.quantity || 1);

        const itemPrice = Number(
            item.price ||
            item.basePrice ||
            0
        );


        /* =====================================
           TOPPING
        ===================================== */

        let toppingTotal = 0;

        let toppingList = "";

        if (
            Array.isArray(item.toppings) &&
            item.toppings.length > 0
        ) {

            toppingList = item.toppings
                .map(topping => {

                    let toppingName = "";
                    let toppingPrice = 0;


                    /* กรณี topping เป็น object */
                    if (
                        typeof topping === "object" &&
                        topping !== null
                    ) {

                        toppingName =
                            topping.name ||
                            "";

                        toppingPrice =
                            Number(
                                topping.price || 0
                            );

                    }

                    /* กรณี topping เป็นข้อความ */
                    else {

                        toppingName =
                            String(topping);

                    }


                    toppingTotal += toppingPrice;


                    return `
                        ${toppingName}
                        ${
                            toppingPrice > 0
                                ? `
                                    <span class="topping-price">
                                        +${formatMoney(toppingPrice)}
                                    </span>
                                `
                                : ""
                        }
                    `;

                })
                .join(", ");

        }


        /* =====================================
           หมายเหตุ
        ===================================== */

        const note =
            item.note ||
            item.notes ||
            "";


        /* =====================================
           ราคา
        ===================================== */

        const singleItemTotal =
            itemPrice + toppingTotal;


        const totalPrice =
            singleItemTotal * quantity;


        /* =====================================
           รูปสินค้า
        ===================================== */

        const imageSrc =
            item.image ||
            item.imageUrl ||
            item.img ||
            "";


        const imageHTML = imageSrc
            ? `
                <img
                    class="order-item-image"
                    src="${imageSrc}"
                    alt="${item.name || "สินค้า"}"
                    onerror="this.style.display='none';"
                >
            `
            : "";


        /* =====================================
           TOPPING HTML
        ===================================== */

        let toppingHTML = "";

        if (toppingList) {

            toppingHTML = `
                <div class="order-item-detail">

                    <span class="topping-label">
                        ท็อปปิ้ง:
                    </span>

                    <span class="topping-text">
                        ${toppingList}
                    </span>

                </div>
            `;

        }


        /* =====================================
           NOTE HTML
        ===================================== */

        let noteHTML = "";

        if (note) {

            noteHTML = `
                <div class="order-item-note">

                    <span class="note-label">
                        หมายเหตุ:
                    </span>

                    <span class="note-text">
                        ${note}
                    </span>

                </div>
            `;

        }


        /* =====================================
           แสดงสินค้า
        ===================================== */

        const itemHTML = `

            <div class="order-item">


                <!-- รูปเมนู -->

                ${imageHTML}


                <!-- ข้อมูลสินค้า -->

                <div class="order-item-info">

                    <div class="order-item-name">

                        ${item.name || "สินค้า"}

                        <span class="order-item-quantity">
                            × ${quantity}
                        </span>

                    </div>


                    ${toppingHTML}


                    ${noteHTML}

                </div>


                <!-- ราคา -->

                <div class="order-item-price">

                    ${formatMoney(totalPrice)}

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
   RENDER TOTAL
========================================= */

function renderTotal(order) {

    document
        .getElementById("foodTotal")
        .textContent =
        formatMoney(order.foodTotal);


    document
        .getElementById("deliveryFee")
        .textContent =
        formatMoney(order.deliveryFee);


    document
        .getElementById("total")
        .textContent =
        formatMoney(order.total);


    const deliveryRow =
        document.getElementById(
            "deliveryFeeRow"
        );


    if (
        order.receiveMethod === "delivery"
    ) {

        deliveryRow.style.display =
            "flex";

    } else {

        deliveryRow.style.display =
            "none";

    }

}



/* =========================================
   ORDER STATUS
========================================= */

function renderOrderStatus(order) {

    /*
       สถานะที่รองรับ:

       received
       preparing
       shipping
       completed
    */


    const status =
        order.status || "received";


    const steps = {

        received:
            document.getElementById(
                "statusReceived"
            ),

        preparing:
            document.getElementById(
                "statusPreparing"
            ),

        shipping:
            document.getElementById(
                "statusShipping"
            ),

        completed:
            document.getElementById(
                "statusCompleted"
            )

    };


    const statusText = {

        received:
            "รับออเดอร์แล้ว",

        preparing:
            "กำลังเตรียมอาหาร",

        shipping:
            "กำลังจัดส่ง",

        completed:
            "สำเร็จ"

    };


    const orderStatusText =
        document.getElementById(
            "statusText"
        );


    orderStatusText.textContent =
        statusText[status] ||
        "รับออเดอร์แล้ว";


    /* =====================================
       ACTIVE STEPS
    ===================================== */

    const statusOrder = [
        "received",
        "preparing",
        "shipping",
        "completed"
    ];


    const currentIndex =
        statusOrder.indexOf(status);


    statusOrder.forEach(
        function (statusName, index) {

            if (
                index <= currentIndex
            ) {

                steps[statusName]
                    .classList
                    .add("active");

            } else {

                steps[statusName]
                    .classList
                    .remove("active");

            }

        }
    );


    /* =====================================
       RECEIVE AT STORE
    ===================================== */

    if (
        order.receiveMethod ===
        "pickup"
    ) {

        document
            .getElementById(
                "shippingTitle"
            )
            .textContent =
            "พร้อมรับที่ร้าน";


        document
            .getElementById(
                "shippingDescription"
            )
            .textContent =
            "สามารถมารับอาหารที่ร้านได้แล้ว";

    }

}



/* =========================================
   LOAD EVERYTHING
========================================= */

function loadOrderPage() {

    const order =
        getLatestOrder();


    if (!order) {

        alert(
            "ไม่พบข้อมูลออเดอร์"
        );

        window.location.href =
            "index.html";

        return;

    }


    /* =====================================
       ORDER ID
    ===================================== */

    document
        .getElementById("orderId")
        .textContent =
        order.orderId;


    renderCustomer(order);

    renderPayment(order);

    renderItems(order);

    renderTotal(order);

    renderOrderStatus(order);


}


/* =========================================
   REFRESH STATUS
========================================= */

function refreshOrderStatus() {

    const order =
        getLatestOrder();


    if (!order) {

        showToast(
            "ไม่พบข้อมูลออเดอร์"
        );

        return;

    }


    /* =====================================
       RENDER STATUS ใหม่
    ===================================== */

    renderOrderStatus(
        order
    );


    /* =====================================
       TOAST
    ===================================== */

    showToast(
        "อัปเดตสถานะเรียบร้อยแล้ว"
    );

}


/* =========================================
   TOAST NOTIFICATION
========================================= */

function showToast(message) {

    const oldToast =
        document.getElementById(
            "statusToast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.id =
        "statusToast";


    toast.innerHTML = `

        <div class="status-toast-icon">
            <i class="fi fi-rr-check"></i>
        </div>

        <div class="status-toast-content">

            <strong>
                อัปเดตสำเร็จ
            </strong>

            <span>
                ${escapeHTML(message)}
            </span>

        </div>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.classList.add(
                "show"
            );

        },
        10
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                function () {

                    if (toast) {

                        toast.remove();

                    }

                },
                300
            );

        },
        2500
    );

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




/* =========================================
   GO HOME
========================================= */

function goHome() {

    window.location.href =
        "menu.html";

}



/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadOrderPage();

    }
);


