/* =========================================
   TRACK ORDER
========================================= */


/* =========================================
   GET LATEST ORDER
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
   PAYMENT METHOD
========================================= */

function getPaymentMethodText(method) {

    if (method === "transfer") {

        return "โอนเงิน";

    }


    return "เงินสด";

}



/* =========================================
   STATUS TEXT
========================================= */

function getStatusInfo(status) {

    const statuses = {

        received: {

            text: "ร้านได้รับออเดอร์แล้ว",

            badge: "รับออเดอร์แล้ว"

        },

        preparing: {

            text: "ร้านกำลังเตรียมอาหาร",

            badge: "กำลังเตรียม"

        },

        shipping: {

            text: "อาหารกำลังเดินทาง",

            badge: "กำลังจัดส่ง"

        },

        completed: {

            text: "ออเดอร์เสร็จสมบูรณ์",

            badge: "เสร็จสิ้น"

        }

    };


    return statuses[status]
        || statuses.received;

}



/* =========================================
   RENDER ORDER NUMBER
========================================= */

function renderOrderNumber(order) {

    document.getElementById("orderId")
        .textContent =
        order.orderId || "-";

}



/* =========================================
   RENDER CUSTOMER
========================================= */

function renderCustomer(order) {

    const customer =
        order.customer || {};


    document.getElementById("customerName")
        .textContent =
        customer.name || "-";


    document.getElementById("customerPhone")
        .textContent =
        customer.phone || "-";


    document.getElementById("receiveMethod")
        .textContent =
        getReceiveMethodText(
            order.receiveMethod
        );


    const addressRow =
        document.getElementById(
            "addressRow"
        );


    const address =
        document.getElementById(
            "customerAddress"
        );


    if (
        order.receiveMethod === "delivery" &&
        customer.address
    ) {

        addressRow.style.display =
            "flex";

        address.textContent =
            customer.address;

    } else {

        addressRow.style.display =
            "none";

    }


    /* DATE */

    if (order.createdAt) {

        const date =
            new Date(order.createdAt);


        document.getElementById("orderDate")
            .textContent =
            date.toLocaleDateString(
                "th-TH",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );


        document.getElementById("orderTime")
            .textContent =
            date.toLocaleTimeString(
                "th-TH",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }

}



/* =========================================
   RENDER ITEMS
========================================= */

function renderItems(order) {

    const container =
        document.getElementById(
            "orderItems"
        );


    container.innerHTML = "";


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    if (items.length === 0) {

        container.innerHTML = `
            <p style="
                text-align:center;
                color:#999;
                font-size:12px;
            ">
                ไม่พบรายการอาหาร
            </p>
        `;

        return;

    }


    items.forEach(function (item) {

        const quantity =
            Number(item.quantity || 1);


        const itemTotal =
            Number(item.price || 0)
            * quantity;


        let toppingHTML = "";


        if (
            Array.isArray(item.toppings) &&
            item.toppings.length > 0
        ) {

            toppingHTML = `

                <div class="order-item-toppings">

                    ${item.toppings
                        .map(function (topping) {

                            return topping.name
                                || topping.title
                                || topping;

                        })
                        .join(", ")}

                </div>

            `;

        }


        const html = `

            <div class="order-item">

                <div class="order-item-left">

                    <div class="order-item-name">

                        ${item.name || "เมนู"}

                    </div>

                    <div class="order-item-quantity">

                        x${quantity}

                    </div>

                    ${toppingHTML}

                </div>


                <div class="order-item-price">

                    ${formatMoney(itemTotal)}

                </div>

            </div>

        `;


        container.insertAdjacentHTML(
            "beforeend",
            html
        );

    });

}



/* =========================================
   RENDER TOTAL
========================================= */

function renderTotal(order) {

    document.getElementById("foodTotal")
        .textContent =
        formatMoney(order.foodTotal);


    document.getElementById("deliveryFee")
        .textContent =
        formatMoney(order.deliveryFee);


    document.getElementById("total")
        .textContent =
        formatMoney(order.total);


    const deliveryFeeRow =
        document.getElementById(
            "deliveryFeeRow"
        );


    if (
        order.receiveMethod === "delivery"
    ) {

        deliveryFeeRow.style.display =
            "flex";

    } else {

        deliveryFeeRow.style.display =
            "none";

    }

}



/* =========================================
   RENDER PAYMENT
========================================= */

function renderPayment(order) {

    const method =
        document.getElementById(
            "paymentMethod"
        );


    const slipSection =
        document.getElementById(
            "paymentSlipSection"
        );


    const slipImage =
        document.getElementById(
            "paymentSlip"
        );


    const slipFileName =
        document.getElementById(
            "slipFileName"
        );


    const paymentStatus =
        document.getElementById(
            "paymentStatus"
        );


    method.textContent =
        getPaymentMethodText(
            order.paymentMethod
        );


    if (
        order.paymentMethod === "transfer" &&
        order.paymentSlip
    ) {

        slipSection.style.display =
            "block";


        slipImage.src =
            order.paymentSlip;


        slipFileName.textContent =
            order.slipFileName
                ? "ไฟล์: " +
                  order.slipFileName
                : "";


        if (
            order.paymentStatus ===
            "verified"
        ) {

            paymentStatus.textContent =
                "ตรวจสอบแล้ว";

        } else {

            paymentStatus.textContent =
                "รอตรวจสอบจากทางร้าน";

        }

    } else {

        slipSection.style.display =
            "none";


        slipImage.src = "";

        slipFileName.textContent = "";

    }

}



/* =========================================
   RENDER STATUS
========================================= */

function renderStatus(order) {

    const status =
        order.status || "received";


    const statusInfo =
        getStatusInfo(status);


    document.getElementById(
        "statusText"
    ).textContent =
        statusInfo.text;


    document.getElementById(
        "statusBadge"
    ).textContent =
        statusInfo.badge;



    const received =
        document.getElementById(
            "statusReceived"
        );


    const preparing =
        document.getElementById(
            "statusPreparing"
        );


    const shipping =
        document.getElementById(
            "statusShipping"
        );


    const completed =
        document.getElementById(
            "statusCompleted"
        );


    const steps = [

        received,

        preparing,

        shipping,

        completed

    ];


    const statusOrder = {

        received: 0,

        preparing: 1,

        shipping: 2,

        completed: 3

    };


    const current =
        statusOrder[status]
        ?? 0;


    steps.forEach(
        function (step, index) {

            step.classList.remove(
                "active",
                "completed"
            );


            if (index < current) {

                step.classList.add(
                    "completed"
                );

            }


            if (index === current) {

                step.classList.add(
                    "active"
                );

            }

        }
    );


    /* =====================================
       RECEIVE METHOD
    ===================================== */

    const shippingTitle =
        document.getElementById(
            "shippingTitle"
        );


    const shippingDescription =
        document.getElementById(
            "shippingDescription"
        );


    if (
        order.receiveMethod === "pickup"
    ) {

        shippingTitle.textContent =
            "พร้อมรับที่ร้าน";


        shippingDescription.textContent =
            "สามารถมารับอาหารที่ร้านได้แล้ว";

    } else {

        shippingTitle.textContent =
            "กำลังจัดส่ง";


        shippingDescription.textContent =
            "อาหารกำลังเดินทางไปหาคุณ";

    }

}



/* =========================================
   LOAD PAGE
========================================= */

function loadTrackOrder() {

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


    renderOrderNumber(order);

    renderCustomer(order);

    renderItems(order);

    renderTotal(order);

    renderPayment(order);

    renderStatus(order);

}



/* =========================================
   REFRESH STATUS
========================================= */

function refreshOrderStatus() {

    const order =
        getLatestOrder();


    if (!order) {

        alert(
            "ไม่พบข้อมูลออเดอร์"
        );

        return;

    }


    renderOrderNumber(order);

    renderCustomer(order);

    renderItems(order);

    renderTotal(order);

    renderPayment(order);

    renderStatus(order);


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
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTrackOrder();

    }
);