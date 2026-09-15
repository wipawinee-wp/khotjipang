/* =========================================
   TRACK ORDER
   KHOTJIPANG & RAMYEON
========================================= */


/* =========================================
   GLOBAL
========================================= */

let allOrders = [];

let customerOrders = [];

let selectedOrder = null;


/* =========================================
   NORMALIZE PHONE
   ทำให้เบอร์รูปแบบต่างกันสามารถจับคู่ได้
   เช่น 081-234-5678
   0812345678
========================================= */

function normalizePhone(phone) {

    return String(phone || "")
        .replace(/\D/g, "");

}


/* =========================================
   GET CUSTOMER PHONE
========================================= */

function getCustomerPhone() {

    let phone =
        localStorage.getItem(
            "customerPhone"
        ) || "";

    phone =
        normalizePhone(phone);


    /*
     * ถ้า customerPhone ไม่มี
     * ลองดึงจาก latestOrder
     *
     * ช่วยรองรับกรณีข้อมูลเก่า
     */

    if (!phone) {

        const latestOrder =
            getLatestOrder();

        if (
            latestOrder &&
            latestOrder.customer
        ) {

            phone =
                normalizePhone(
                    latestOrder.customer.phone
                );

        }

    }


    return phone;

}


/* =========================================
   GET ALL ORDERS
========================================= */

function getAllOrders() {

    const savedOrders =
        localStorage.getItem(
            "orders"
        );


    if (!savedOrders) {

        return [];

    }


    try {

        const orders =
            JSON.parse(
                savedOrders
            );


        if (
            Array.isArray(orders)
        ) {

            return orders;

        }


        return [];

    } catch (error) {

        console.error(
            "ไม่สามารถอ่านข้อมูล orders ได้",
            error
        );

        return [];

    }

}


/* =========================================
   GET LATEST ORDER
   สำรองสำหรับข้อมูลระบบเก่า
========================================= */

function getLatestOrder() {

    const savedOrder =
        localStorage.getItem(
            "latestOrder"
        );


    if (!savedOrder) {

        return null;

    }


    try {

        return JSON.parse(
            savedOrder
        );

    } catch (error) {

        console.error(
            "ไม่สามารถอ่านข้อมูล latestOrder ได้",
            error
        );

        return null;

    }

}


/* =========================================
   GET CUSTOMER ORDERS
========================================= */

function getCustomerOrders() {

    const phone =
        getCustomerPhone();


    allOrders =
        getAllOrders();


    /*
     * =====================================
     * FILTER ORDERS
     * =====================================
     */

    const matchedOrders =
        allOrders.filter(
            function (order) {

                if (
                    !order ||
                    !order.customer
                ) {

                    return false;

                }


                const orderPhone =
                    normalizePhone(
                        order.customer.phone
                    );


                /*
                 * ต้องมีเบอร์ทั้งสองฝั่ง
                 */

                if (
                    !phone ||
                    !orderPhone
                ) {

                    return false;

                }


                return (
                    orderPhone ===
                    phone
                );

            }
        );


    /*
     * =====================================
     * ถ้าเจอออเดอร์ใน orders
     * ใช้ข้อมูลตรงนี้ทั้งหมด
     * =====================================
     */

    if (
        matchedOrders.length > 0
    ) {

        return matchedOrders;

    }


    /*
     * =====================================
     * FALLBACK latestOrder
     * สำหรับข้อมูลระบบเก่า
     * =====================================
     */

    const latestOrder =
        getLatestOrder();


    if (
        latestOrder &&
        latestOrder.customer
    ) {

        const latestPhone =
            normalizePhone(
                latestOrder.customer.phone
            );


        if (
            latestPhone &&
            latestPhone === phone
        ) {

            return [
                latestOrder
            ];

        }

    }


    return [];

}


/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(number) {

    return Number(number || 0)
        .toLocaleString("th-TH") +
        " ฿";

}


/* =========================================
   RECEIVE METHOD
========================================= */

function getReceiveMethodText(method) {

    if (
        method === "delivery"
    ) {

        return "จัดส่ง";

    }


    return "รับที่ร้าน";

}


/* =========================================
   PAYMENT METHOD
========================================= */

function getPaymentMethodText(method) {

    if (
        method === "transfer"
    ) {

        return "โอนเงิน";

    }


    return "เงินสด";

}


/* =========================================
   STATUS INFO
========================================= */

function getStatusInfo(status) {

    const statuses = {

        received: {

            text:
                "ร้านได้รับออเดอร์แล้ว",

            badge:
                "รับออเดอร์แล้ว"

        },


        preparing: {

            text:
                "ร้านกำลังเตรียมอาหาร",

            badge:
                "กำลังเตรียม"

        },


        shipping: {

            text:
                "อาหารกำลังเดินทาง",

            badge:
                "กำลังจัดส่ง"

        },


        completed: {

            text:
                "ออเดอร์เสร็จสมบูรณ์",

            badge:
                "เสร็จสิ้น"

        }

    };


    return (
        statuses[status] ||
        statuses.received
    );

}


/* =========================================
   GET STATUS CLASS
========================================= */

function getStatusClass(status) {

    switch (status) {

        case "preparing":

            return "status-preparing";


        case "shipping":

            return "status-shipping";


        case "completed":

            return "status-completed";


        default:

            return "status-received";

    }

}


/* =========================================
   RENDER ORDER LIST
========================================= */

function renderOrderList() {

    const container =
        document.getElementById(
            "myOrdersList"
        );


    const selectedSection =
        document.getElementById(
            "selectedOrderSection"
        );


    if (!container) {

        return;

    }


    /* =====================================
       ไม่มีออเดอร์🛒
    ===================================== */

    if (
        !customerOrders ||
        customerOrders.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-orders">

                <div class="empty-orders-icon">
                    <i class="fi fi-rr-shopping-cart"></i>
                </div>

                <strong>
                    ยังไม่มีออเดอร์
                </strong>

                <p>
                    เมื่อคุณสั่งอาหาร ออเดอร์จะแสดงที่นี่
                </p>

            </div>

        `;


        if (selectedSection) {

            selectedSection.style.display =
                "none";

        }


        return;

    }


    /* =====================================
       มีออเดอร์
    ===================================== */

    if (selectedSection) {

        selectedSection.style.display =
            "";

    }


    /*
     * เรียงออเดอร์ใหม่สุดก่อน
     */

    const sortedOrders =
        [...customerOrders].sort(
            function (a, b) {

                return (
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
                );

            }
        );


    container.innerHTML = "";


    sortedOrders.forEach(
        function (order) {

            const status =
                order.status ||
                "received";


            const statusInfo =
                getStatusInfo(
                    status
                );


            const itemCount =
                Array.isArray(
                    order.items
                )
                    ? order.items.reduce(
                        function (
                            sum,
                            item
                        ) {

                            return (
                                sum +
                                Number(
                                    item.quantity || 1
                                )
                            );

                        },
                        0
                    )
                    : 0;


            const total =
                Number(
                    order.total || 0
                );


            /* =================================
               DATE / TIME
            ================================= */

            let orderDate = "-";

            let orderTime = "-";


            if (
                order.createdAt
            ) {

                const date =
                    new Date(
                        order.createdAt
                    );


                if (
                    !isNaN(
                        date.getTime()
                    )
                ) {

                    orderDate =
                        date.toLocaleDateString(
                            "th-TH",
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            }
                        );


                    orderTime =
                        date.toLocaleTimeString(
                            "th-TH",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        ) +
                        " น.";

                }

            }


            /* =================================
               ORDER CARD
            ================================= */

            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className =
                "my-order-card";


            /*
             * ใช้ orderId
             * ไม่ใช่ id
             */

            if (
                selectedOrder &&
                String(
                    selectedOrder.orderId || ""
                ) ===
                String(
                    order.orderId || ""
                )
            ) {

                card.classList.add(
                    "selected"
                );

            }


            card.innerHTML = `

                <div class="my-order-card-top">

                    <span class="my-order-id">

                        ${escapeHTML(
                String(
                    order.orderId || "-"
                )
            )}

                    </span>


                    <span class="
                        order-status-small
                        ${getStatusClass(status)}
                    ">

                        ${escapeHTML(
                statusInfo.badge
            )}

                    </span>

                </div>

                

                <div class="my-order-card-info">

                    <span>
                        <i class="fi fi-rr-calendar-day" id="calendar-day"></i> ${orderDate}
                    </span>

                    <span>
                        <i class="fi fi-rr-clock" id="rr-clock"></i> ${orderTime}
                    </span>

                    <span>
                        <i class="fi fi-rr-grocery-basket" id="grocery-basket"></i> ${itemCount} รายการ
                    </span>

                </div>


                <div class="my-order-card-bottom">

                    <strong>
                        ${formatMoney(total)}
                    </strong>


                    <span class="view-order">
                        ดูรายละเอียด <i class="fi fi-rr-arrow-small-right" id="arrow-small-right"></i>
                    </span>

                </div>

            `;


            /*
             * สำคัญมาก📅
             * ส่ง orderId🕐
             * ไม่ใช่ order.id🍽️
             */

            card.addEventListener(
                "click",
                function () {

                    selectOrder(
                        order.orderId
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   SELECT ORDER
========================================= */

function selectOrder(orderId) {

    const foundOrder =
        customerOrders.find(
            function (order) {

                return (
                    String(
                        order.orderId || ""
                    ) ===
                    String(
                        orderId || ""
                    )
                );

            }
        );


    if (!foundOrder) {

        console.warn(
            "ไม่พบออเดอร์:",
            orderId
        );

        return;

    }


    selectedOrder =
        foundOrder;


    /*
     * UPDATE LIST
     */

    renderOrderList();


    /*
     * UPDATE DETAILS
     */

    renderSelectedOrder(
        selectedOrder
    );


    /*
     * SCROLL MOBILE
     */

    const detailSection =
        document.getElementById(
            "selectedOrderSection"
        );


    if (
        detailSection &&
        window.innerWidth <= 768
    ) {

        detailSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================
   RENDER SELECTED ORDER
========================================= */

function renderSelectedOrder(order) {

    if (!order) {

        return;

    }


    renderOrderNumber(
        order
    );


    renderCustomer(
        order
    );


    renderItems(
        order
    );


    renderTotal(
        order
    );


    renderPayment(
        order
    );


    renderStatus(
        order
    );

}


/* =========================================
   RENDER ORDER NUMBER
========================================= */

function renderOrderNumber(order) {

    const element =
        document.getElementById(
            "orderId"
        );

    if (!element) {
        return;
    }

    const orderId =
        String(
            order.orderId || "-"
        ).replace(/^#/, "");

    element.textContent =
        orderId;
}


/* =========================================
   RENDER CUSTOMER
========================================= */

function renderCustomer(order) {

    const customer =
        order.customer || {};


    const name =
        document.getElementById(
            "customerName"
        );


    const phone =
        document.getElementById(
            "customerPhone"
        );


    const receive =
        document.getElementById(
            "receiveMethod"
        );


    if (name) {

        name.textContent =
            customer.name || "-";

    }


    if (phone) {

        phone.textContent =
            customer.phone || "-";

    }


    if (receive) {

        receive.textContent =
            getReceiveMethodText(
                order.receiveMethod
            );

    }


    /* =====================================
       ADDRESS
    ===================================== */

    const addressRow =
        document.getElementById(
            "addressRow"
        );


    const address =
        document.getElementById(
            "customerAddress"
        );


    if (
        order.receiveMethod ===
        "delivery" &&
        customer.address
    ) {

        if (addressRow) {

            addressRow.style.display =
                "flex";

        }


        if (address) {

            address.textContent =
                customer.address;

        }

    } else {

        if (addressRow) {

            addressRow.style.display =
                "none";

        }

    }


    /* =====================================
       DATE / TIME
    ===================================== */

    const dateElement =
        document.getElementById(
            "orderDate"
        );


    const timeElement =
        document.getElementById(
            "orderTime"
        );


    if (
        order.createdAt
    ) {

        const date =
            new Date(
                order.createdAt
            );


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            if (dateElement) {

                dateElement.textContent =
                    date.toLocaleDateString(
                        "th-TH",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    );

            }


            if (timeElement) {

                timeElement.textContent =
                    date.toLocaleTimeString(
                        "th-TH",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ) +
                    " น.";

            }

        }

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


/* =========================================
   RENDER ITEMS
========================================= */

function renderItems(order) {

    const container =
        document.getElementById("orderItems");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !order.items ||
        order.items.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-order">
                ไม่มีรายการอาหาร
            </div>
        `;

        return;

    }


    order.items.forEach(item => {

        const quantity =
            Number(item.quantity || 1);


        const itemPrice =
            Number(
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

            toppingList =
                item.toppings
                    .map(topping => {

                        let toppingName = "";
                        let toppingPrice = 0;


                        /* Topping เป็น Object */

                        if (
                            typeof topping === "object" &&
                            topping !== null
                        ) {

                            toppingName =
                                topping.name ||
                                topping.title ||
                                "ท็อปปิ้ง";


                            toppingPrice =
                                Number(
                                    topping.price || 0
                                );

                        }


                        /* Topping เป็นข้อความ */

                        else {

                            toppingName =
                                String(topping);

                        }


                        toppingTotal +=
                            toppingPrice;


                        return `
                        <span class="topping-item">

                            ${escapeHTML(toppingName)}

                            ${toppingPrice > 0
                                                    ? `
                                        <span class="topping-price">
                                            +${formatMoney(toppingPrice)}
                                        </span>
                                    `
                                                    : ""
                                                }

                        </span>
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
            item.remark ||
            item.customerNote ||
            "";


        /* =====================================
           ราคา
        ===================================== */

        const singleItemTotal =
            itemPrice +
            toppingTotal;


        const totalPrice =
            singleItemTotal *
            quantity;


        /* =====================================
           รูปสินค้า
        ===================================== */

        const imageSrc =
            item.image ||
            item.imageUrl ||
            item.img ||
            item.photo ||
            "";


        let imageHTML = "";


        if (imageSrc) {

            imageHTML = `
                <img
                    class="order-item-image"
                    src="${escapeHTML(imageSrc)}"
                    alt="${escapeHTML(
                item.name || "สินค้า"
            )}"
                    onerror="
                        this.style.display='none';
                    "
                >
            `;

        }


        /* =====================================
           TOPPING HTML
        ===================================== */

        let toppingHTML = "";


        if (toppingList) {

            toppingHTML = `
                <div class="order-item-detail">

                    <span class="topping-label">
                        Topping:
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
                        ${escapeHTML(note)}
                    </span>

                </div>
            `;

        }


        /* =====================================
           ITEM HTML
        ===================================== */

        const itemHTML = `

            <div class="order-item">


                <!-- รูปเมนู -->

                ${imageHTML}


                <!-- ข้อมูลสินค้า -->

                <div class="order-item-info">


                    <!-- ชื่อ + จำนวน -->

                    <div class="order-item-name">

                        ${escapeHTML(
            item.name || "สินค้า"
        )}

                        <span class="order-item-quantity">
                            × ${quantity}
                        </span>

                    </div>


                    <!-- TOPPING -->

                    ${toppingHTML}


                    <!-- หมายเหตุ -->

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

    const foodTotal =
        document.getElementById(
            "foodTotal"
        );


    const deliveryFee =
        document.getElementById(
            "deliveryFee"
        );


    const total =
        document.getElementById(
            "total"
        );


    if (foodTotal) {

        foodTotal.textContent =
            formatMoney(
                order.foodTotal
            );

    }


    if (deliveryFee) {

        deliveryFee.textContent =
            formatMoney(
                order.deliveryFee
            );

    }


    if (total) {

        total.textContent =
            formatMoney(
                order.total
            );

    }


    const deliveryFeeRow =
        document.getElementById(
            "deliveryFeeRow"
        );


    if (
        deliveryFeeRow
    ) {

        if (
            order.receiveMethod ===
            "delivery"
        ) {

            deliveryFeeRow.style.display =
                "flex";

        } else {

            deliveryFeeRow.style.display =
                "none";

        }

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


    if (method) {

        method.textContent =
            getPaymentMethodText(
                order.paymentMethod
            );

    }


    /* =====================================
       TRANSFER + SLIP
    ===================================== */

    if (
        order.paymentMethod ===
        "transfer" &&
        order.paymentSlip
    ) {

        if (slipSection) {

            slipSection.style.display =
                "block";

        }


        if (slipImage) {

            slipImage.src =
                order.paymentSlip;

        }


        if (slipFileName) {

            slipFileName.textContent =
                order.slipFileName
                    ? "ไฟล์: " +
                    order.slipFileName
                    : "";

        }


        if (paymentStatus) {

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

        }

    } else {

        if (slipSection) {

            slipSection.style.display =
                "none";

        }


        if (slipImage) {

            slipImage.src = "";

        }


        if (slipFileName) {

            slipFileName.textContent = "";

        }


        if (paymentStatus) {

            paymentStatus.textContent = "";

        }

    }

}


/* =========================================
   RENDER STATUS
========================================= */

function renderStatus(order) {

    const status =
        order.status ||
        "received";


    const statusInfo =
        getStatusInfo(
            status
        );


    /* =====================================
       STATUS TEXT
    ===================================== */

    const statusText =
        document.getElementById(
            "statusText"
        );


    const statusBadge =
        document.getElementById(
            "statusBadge"
        );


    if (statusText) {

        statusText.textContent =
            statusInfo.text;

    }


    if (statusBadge) {

        statusBadge.textContent =
            statusInfo.badge;

    }


    /* =====================================
       TIMELINE
    ===================================== */

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
        statusOrder[status] ?? 0;


    steps.forEach(
        function (step, index) {

            if (!step) {

                return;

            }


            step.classList.remove(
                "active",
                "completed"
            );


            if (
                index < current
            ) {

                step.classList.add(
                    "completed"
                );

            }


            if (
                index === current
            ) {

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
        order.receiveMethod ===
        "pickup"
    ) {

        if (shippingTitle) {

            shippingTitle.textContent =
                "พร้อมรับที่ร้าน";

        }


        if (shippingDescription) {

            shippingDescription.textContent =
                "สามารถมารับอาหารที่ร้านได้แล้ว";

        }

    } else {

        if (shippingTitle) {

            shippingTitle.textContent =
                "กำลังจัดส่ง";

        }


        if (shippingDescription) {

            shippingDescription.textContent =
                "อาหารกำลังเดินทางไปหาคุณ";

        }

    }

}


/* =========================================
   LOAD TRACK ORDER
========================================= */

function loadTrackOrder() {

    /*
     * โหลดออเดอร์ทั้งหมด
     */

    allOrders =
        getAllOrders();


    /*
     * โหลดเฉพาะออเดอร์ของลูกค้าปัจจุบัน
     */

    customerOrders =
        getCustomerOrders();


    console.log(
        "TRACK ORDER - CUSTOMER PHONE:",
        getCustomerPhone()
    );


    console.log(
        "TRACK ORDER - ALL ORDERS:",
        allOrders
    );


    console.log(
        "TRACK ORDER - CUSTOMER ORDERS:",
        customerOrders
    );


    /* =====================================
       ไม่มีออเดอร์
    ===================================== */

    if (
        !customerOrders ||
        customerOrders.length === 0
    ) {

        selectedOrder =
            null;


        renderOrderList();


        return;

    }


    /* =====================================
       เรียงใหม่สุดก่อน
    ===================================== */

    customerOrders.sort(
        function (a, b) {

            return (
                new Date(
                    b.createdAt || 0
                ) -
                new Date(
                    a.createdAt || 0
                )
            );

        }
    );


    /* =====================================
       เลือกออเดอร์ล่าสุด
    ===================================== */

    selectedOrder =
        customerOrders[0];


    /* =====================================
       RENDER LIST
    ===================================== */

    renderOrderList();


    /* =====================================
       RENDER DETAIL
       สำคัญมาก ต้องส่ง selectedOrder
    ===================================== */

    renderSelectedOrder(
        selectedOrder
    );

}


/* =========================================
   REFRESH STATUS
========================================= */

function refreshOrderStatus() {

    allOrders =
        getAllOrders();


    customerOrders =
        getCustomerOrders();


    if (
        customerOrders.length === 0
    ) {

        selectedOrder =
            null;


        renderOrderList();


        showToast(
            "ยังไม่มีออเดอร์"
        );


        return;

    }


    /* =====================================
       พยายามเลือกออเดอร์เดิม
    ===================================== */

    if (selectedOrder) {

        const updatedOrder =
            customerOrders.find(
                function (order) {

                    return (
                        String(
                            order.orderId || ""
                        ) ===
                        String(
                            selectedOrder.orderId || ""
                        )
                    );

                }
            );


        if (updatedOrder) {

            selectedOrder =
                updatedOrder;

        } else {

            selectedOrder =
                customerOrders[0];

        }

    } else {

        selectedOrder =
            customerOrders[0];

    }


    /* =====================================
       RENDER
    ===================================== */

    renderOrderList();


    renderSelectedOrder(
        selectedOrder
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

        setupPaymentSlipDropdown();

        loadTrackOrder();

    }
);


/* =========================================
   PAYMENT SLIP DROPDOWN
========================================= */

function setupPaymentSlipDropdown() {

    const toggle =
        document.getElementById(
            "paymentSlipToggle"
        );


    const section =
        document.getElementById(
            "paymentSlipSection"
        );


    if (!toggle || !section) {

        return;

    }


    toggle.addEventListener(
        "click",
        function () {

            section.classList.toggle(
                "open"
            );

        }
    );

}
