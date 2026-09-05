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

    const container =
        document.getElementById("orderItems");


    container.innerHTML = "";


    if (
        !order.items ||
        order.items.length === 0
    ) {

        container.innerHTML = `
            <p style="
                color:#999;
                font-size:13px;
            ">
                ไม่พบรายการอาหาร
            </p>
        `;

        return;

    }


    order.items.forEach(function (item) {

        const quantity =
            Number(item.quantity || 1);


        const itemPrice =
            Number(item.price || 0);


        const totalPrice =
            itemPrice * quantity;


        /* =================================
           TOPPINGS
        ================================= */

        let toppingText = "";


        if (
            Array.isArray(item.toppings) &&
            item.toppings.length > 0
        ) {

            toppingText =
                item.toppings
                    .map(function (topping) {

                        if (
                            typeof topping === "string"
                        ) {

                            return topping;

                        }

                        return topping.name || "";

                    })
                    .filter(Boolean)
                    .join(", ");

        }


        const div =
            document.createElement("div");


        div.className =
            "order-item";


        div.innerHTML = `

            <div>

                <div class="order-item-name">

                    ${item.name || "สินค้า"}

                    × ${quantity}

                </div>

                ${
                    toppingText
                        ? `
                            <div class="order-item-detail">
                                Topping: ${toppingText}
                            </div>
                        `
                        : ""
                }

            </div>


            <div class="order-item-price">

                ${formatMoney(totalPrice)}

            </div>

        `;


        container.appendChild(div);

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

        return;

    }


    renderOrderStatus(order);


    alert(
        "อัปเดตสถานะเรียบร้อยแล้ว"
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


