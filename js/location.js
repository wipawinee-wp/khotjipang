// =====================================
// พิกัดร้าน
// =====================================

// ตัวอย่างเท่านั้น 
// const SHOP_LAT = 13.8765; 
// const SHOP_LNG = 100.4123;


// const SHOP_LAT = 13.8989879;
// const SHOP_LNG = 100.3652583;

// const SHOP_LAT = 13.914975117290831;
// const SHOP_LNG = 100.55193129564663; มอศิลปากร เมืองทอง


const SHOP_LAT = 13.901026593463579;
const SHOP_LNG = 100.36511682395017;



// ระยะสูงสุดที่ให้บริการ
const MAX_DISTANCE = 5000;


// =====================================
// ELEMENT
// =====================================

const orderButton =
    document.getElementById("orderButton");

const statusMessage =
    document.getElementById("statusMessage");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");


// =====================================
// ป้องกันกรอกเบอร์เป็นตัวอักษร
// =====================================

customerPhone.addEventListener(
    "input",
    function () {

        this.value =
            this.value.replace(/\D/g, "");

    }
);


// =====================================
// LOGIN / ORDER
// =====================================

orderButton.addEventListener(
    "click",
    function () {

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();


        // =================================
        // ตรวจชื่อ
        // =================================

        if (!name) {
            statusMessage.textContent = "กรุณากรอกชื่อ";
            return;
        }


        // =================================
        // ตรวจเบอร์
        // =================================

        if (!/^0\d{9}$/.test(phone)) {
            statusMessage.textContent = "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก";
            return;
        }


        // =================================
        // ตรวจ GPS
        // =================================

        if (!navigator.geolocation) {

            statusMessage.innerHTML =
                "❌ อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง";

            return;

        }


        orderButton.disabled = true;

        orderButton.innerHTML =
            "📍 กำลังตรวจสอบพื้นที่...";

        statusMessage.innerHTML =
            "กำลังตรวจสอบพื้นที่ให้บริการ";


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const userLat =
                    position.coords.latitude;

                const userLng =
                    position.coords.longitude;


                const distance =
                    calculateDistance(
                        SHOP_LAT,
                        SHOP_LNG,
                        userLat,
                        userLng
                    );


                console.log(
                    "ระยะทาง:",
                    distance
                );


                // =================================
                // อยู่ในพื้นที่
                // =================================

                if (distance <= MAX_DISTANCE) {

                    statusMessage.textContent =
                        `อยู่ในระยะจัดส่ง (${distance.toFixed(2)} กม.)`;

                    /* =====================================
                       บันทึกข้อมูลลูกค้าปัจจุบัน
                    ===================================== */

                    localStorage.setItem(
                        "customerName",
                        name
                    );

                    localStorage.setItem(
                        "customerPhone",
                        phone
                    );

                    localStorage.setItem(
                        "customerDistance",
                        distance.toFixed(2)
                    );


                    /* =====================================
                       สร้างตะกร้าตามเบอร์โทร
                    ===================================== */

                    const customerCartKey =
                        `cart_${phone}`;


                    /* ถ้ายังไม่เคยมีตะกร้าของลูกค้าคนนี้
                       ให้สร้างตะกร้าว่าง */

                    if (
                        !localStorage.getItem(
                            customerCartKey
                        )
                    ) {

                        localStorage.setItem(
                            customerCartKey,
                            JSON.stringify([])
                        );

                    }


                    /* บอกระบบว่าตอนนี้ใช้ตะกร้าไหน */

                    localStorage.setItem(
                        "activeCartKey",
                        customerCartKey
                    );


                    /* =====================================
                       ไปหน้าเมนู
                    ===================================== */

                    setTimeout(() => {

                        window.location.href =
                            "menu.html";

                    }, 700);
                }


                // =================================
                // นอกพื้นที่
                // =================================

                else {

                    statusMessage.innerHTML =
                        `❌ ขออภัย ร้านให้บริการเฉพาะพื้นที่ภายใน 5 กม.<br>
                         ขณะนี้คุณอยู่ห่างจากร้าน ${distance.toFixed(2)} กม.`;

                    orderButton.disabled = false;

                    orderButton.innerHTML =
                        "🍜 เข้าสู่ระบบ / สั่งอาหาร";

                }

            },


            // =================================
            // GPS ERROR
            // =================================

            function (error) {

                orderButton.disabled = false;

                orderButton.innerHTML =
                    "🍜 เข้าสู่ระบบ / สั่งอาหาร";


                switch (error.code) {

                    case error.PERMISSION_DENIED:

                        statusMessage.innerHTML =
                            "❌ กรุณาอนุญาตการเข้าถึงตำแหน่ง";

                        break;


                    case error.POSITION_UNAVAILABLE:

                        statusMessage.innerHTML =
                            "❌ ไม่สามารถตรวจสอบตำแหน่งของคุณได้";

                        break;


                    case error.TIMEOUT:

                        statusMessage.innerHTML =
                            "❌ การตรวจสอบตำแหน่งใช้เวลานานเกินไป";

                        break;


                    default:

                        statusMessage.innerHTML =
                            "❌ เกิดข้อผิดพลาด กรุณาลองใหม่";

                }

            },


            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0
            }

        );

    }
);


// =====================================
// คำนวณระยะทาง
// Haversine Formula
// =====================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;


    const dLat =
        degreesToRadians(
            lat2 - lat1
        );


    const dLon =
        degreesToRadians(
            lon2 - lon1
        );


    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(
            degreesToRadians(lat1)
        ) *

        Math.cos(
            degreesToRadians(lat2)
        ) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;

}


// =====================================
// Degrees → Radians
// =====================================

function degreesToRadians(degrees) {

    return degrees *
        (Math.PI / 180);

}
