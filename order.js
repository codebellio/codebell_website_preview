const shippingDetailsElem = document.getElementById("shippingDetails");
const paymentMethods = document.getElementById("paymentMethods");

const headingTopElem = document.querySelector(".heading-top");
const shippingDetailInput = shippingDetailsElem.querySelectorAll("input");
const shippingDetailsSelect = shippingDetailsElem.querySelector("select");
const orderSummaryForm = document.getElementById("orderSummary");
const customerNameElem = orderSummaryForm.querySelector("#customerName");
const customerAddressElem = orderSummaryForm.querySelector("#customerAddress");

const phoneNumberForm = orderSummaryForm.querySelector("#phoneNumberForm");
const otpForm = orderSummaryForm.querySelector("#otpForm");
const otpLabel = orderSummaryForm.querySelector("#otpLabel");
const coolDownElem = orderSummaryForm.querySelector("#coolDown");
const coolDownTimerElem = coolDownElem.querySelector("#coolDown span");
const resendOtpElem = coolDownElem.querySelector("#coolDown a");

const progressElem = document.getElementsByClassName("progress");
const progressBarElem = document.getElementById("progressBar");

const customerPhone = orderSummaryForm.querySelector("#phoneNumber");
const customerOtp = orderSummaryForm.querySelector("#customerOtp");
const verifyOtpBtn = orderSummaryForm.querySelector("#verifyOtpBtn");
const getOtpBtn = orderSummaryForm.querySelector("#getOtpBtn");

const couponCodeElem = orderSummaryForm.querySelector("#couponCode");
const couponCodeInput = couponCodeElem.querySelector("#couponCodeInput");
const couponCodeBtn = couponCodeElem.querySelector("#couponCodeBtn");
const couponCodeError = couponCodeElem.querySelector(".errorMessage");

const appliedCouponElem = orderSummaryForm.querySelector("#appliedCoupon");
const appliedCouponDetails = orderSummaryForm.querySelector(
  "#appliedCouponDetails"
);

const checkoutBtn = orderSummaryForm.querySelector(".checkout.button");

let orderObj = JSON.parse(localStorage.getItem("customerData"))
  ? JSON.parse(localStorage.getItem("customerData"))
  : {
      Name: "",
      Mobile: "",
      MobileVerified: false,
      OtpCreatedOn: 0,
      Address: "",
      Apt: "",
      City: "",
      Country: "",
      Pin: "",
      AddressType: "",
      Subtotal: "",
      Total: "",
    };

orderList = localStorage.getItem("orderList")
  ? JSON.parse(localStorage.getItem("orderList")).orderList
  : [];

let customerAddress = localStorage.getItem("customerAddress")
  ? JSON.parse(localStorage.getItem("customerAddress"))
  : {
      Name: "",
      Address: "",
      Apt: "",
      City: "",
      Country: "",
      Pin: "",
      AddressType: "",
    };

if (customerAddress) {
  orderObj.Name = customerAddress.Name;
  orderObj.Address = customerAddress.Address;
  orderObj.Apt = customerAddress.Apt;
  orderObj.Pin = customerAddress.Pin;
  orderObj.City = customerAddress.City;
  orderObj.AddressType = customerAddress.AddressType;
  orderObj.Country = customerAddress.Country;
}

customerAddress.Address !== "" &&
  (changeAddress(), orderList != "") &&
  (setOrderSummaryForm(), shippingDetails());

function setCustomerDeatils() {
  orderObj = JSON.parse(localStorage.getItem("customerData"));

  customerAddress = {
    Name: orderObj.Name,
    Address: orderObj.Address,
    Apt: orderObj.Apt,
    City: orderObj.City,
    Country: orderObj.Country,
    Pin: orderObj.Pin,
    AddressType: orderObj.AddressType,
  };

  localStorage.setItem("customerAddress", JSON.stringify(customerAddress));
}

function formValidation() {
  const errorMessage = shippingDetailsElem.querySelectorAll(".errorMessage");

  formComplete = true;
  shippingDetailInput.forEach((input, index) => {
    if (input.type == "text") {
      const inputValue = input.value.trim();

      if (!inputValue) {
        errorMessage[index].innerHTML = "Field cannot remain empty!";
        input.addEventListener(
          "input",
          () => (errorMessage[index].innerHTML = "")
        );
        formComplete = false;
      } else {
        errorMessage[index].innerHTML = "";
      }
    }
  });
}

function shippingDetails() {
  formValidation();

  if (formComplete & (orderObj.Address !== "") & (orderList != "")) {
    headingTopElem.innerHTML = `Almost <span class="text-transparent">there...</span>`;
    shippingDetailsElem.style.display = "none";
    orderSummaryForm.style.display = "flex";
    progressBarElem.style.background =
      "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 50%, #ffffff 50%, #ffffff 100%)";

    progressElem[1].classList.add("activeProgress");
  }

  orderList == "" &&
    Snackbar.show({
      pos: "top-right",
      showAction: false,
      text: "Please Add Items to cart",
    });

  // (orderList != "") & (orderObj.OtpCreatedOn > 0)
  //   ? (checkoutBtn.style.display = "block")
  //   : (checkoutBtn.style.display = "none");
}

function setShippingDetails() {
  const inputs = shippingDetailInput;
  const data = new FormData(shippingDetailsElem);

  for (const entry of data) {
    addressType = `${entry[1]}`;
  }

  orderObj.Name = inputs[0].value + " " + inputs[1].value;
  orderObj.Address = inputs[2].value;
  orderObj.Apt = inputs[3].value;
  orderObj.City = inputs[4].value;
  orderObj.Pin = inputs[5].value;
  orderObj.AddressType = addressType;
  orderObj.Country = shippingDetailsSelect.value;

  localStorage.setItem("customerData", JSON.stringify(orderObj));

  setCustomerDeatils();
  setOrderSummaryForm();
}

function setOrderSummaryForm() {
  customerNameElem.innerHTML = customerAddress.Name;
  customerAddressElem.innerHTML = `${customerAddress.Apt}, ${customerAddress.Address},
      ${customerAddress.City},
      ${customerAddress.Pin}
  `;
}

async function getCouponDetails(couponCode) {
  couponObj = { coupon_code: couponCode ? couponCode : "" };

  var api = "https://api.codebell.io/api/coupon";
  return await fetch(api, {
    method: "post",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(couponObj),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function validateCheckout() {
  const products = {
    UUID: orderObj.UUID,
    products: orderList,
    coupon_code: couponObj.coupon_code,
  };

  var api = "https://api.codebell.io/api/checkout";
  return await fetch(api, {
    method: "post",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(products),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

function Checkout() {
  validateCheckout().then((data) => {
    if (data.Status == 2) {
      orderSummaryForm.style.display = "none";
      paymentMethods.style.display = "block";

      progressBarElem.style.background =
        "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 100%)";
      progressElem[2].classList.add("activeProgress");

      localStorage.removeItem("orderList");
    }
  });
}

function paymentMehtod(type) {
  orderObj["PaymentMethod"] = type;

  fetchData().then((data) => {
    if (
      (data.Result.Order.MobileVerified === true) &
      (data.Result.Order.TotalVerified === true)
    ) {
      orderObj = data.Result.Order;
      localStorage.setItem("customerData", JSON.stringify(orderObj));

      if (type === "onlinePayment") {
        Snackbar.show({
          pos: "top-right",
          showAction: false,
          text: data.Message,
        });
      }
      if (type === "COD") {
        localStorage.removeItem("orderList");

        const UUID = data.Result.Order.UUID;
        window.location.replace(
          `https://preview.codebell.io/purchase?id=${UUID}`
        );
      }
    }
  });
}

function changeAddress() {
  headingTopElem.innerHTML = `Purchase <span class="text-transparent">page</span>`;
  shippingDetailsElem.style.display = "flex";
  orderSummaryForm.style.display = "none";

  progressBarElem.style.background =
    "linear-gradient(to right, #ffffff 0%, #ffffff 100%)";
  progressElem[1].classList.remove("activeProgress");

  const inputs = shippingDetailInput;
  const name = customerAddress["Name"].split(" ");

  inputs[0].value = name[0];
  inputs[1].value = name[1];
  inputs[2].value = customerAddress["Address"];
  inputs[3].value = customerAddress["Apt"];
  inputs[4].value = customerAddress["City"];
  inputs[5].value = customerAddress["Pin"];

  formValidation();
}

let resendOtp = false;

async function fetchData(bool) {
  const record = {
    record: orderObj,
  };

  bool && (record["ResendOTP"] = true);

  var api = "https://api.codebell.io/api/update_order";
  return await fetch(api, {
    method: "post",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(record),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

orderObj.Mobile !== "" && getCustomerOtp();
function getCustomerOtp() {
  if (customerPhone.value.length === 10) {
    orderObj.Mobile = customerPhone.value;
    localStorage.setItem("customerData", JSON.stringify(orderObj));
  }

  if (orderObj.Mobile !== "") {
    phoneNumberForm.style.display = "none";
    otpForm.style.display = "block";

    // verifyOtpBtn.disabled = false;
    customerOtp.disabled = false;
    customerPhone.disabled = true;
    getOtpBtn.disabled = true;

    otpLabel.innerHTML = `
    Phone number - ${orderObj.Mobile} <button type="button" onclick="changePhoneNum()" style="background-color: transparent; width: max-content; border-radius: 1em; color: #2F8AB2;">Change</button>`;

    // JSON.stringify(orderObj.Items);
    const url = window.location.href;

    if (url.substring(url.lastIndexOf("?") + 4) != orderObj.UUID) {
      fetchData().then((data) => {
        orderObj["UUID"] = `${data.Result.Order.UUID}`;
        localStorage.setItem("customerData", JSON.stringify(orderObj));

        const UUID = orderObj.UUID;
        history.pushState(
          {},
          "Codebell",
          `https://preview.codebell.io/order?id=${UUID}`
        );

        Snackbar.show({
          pos: "top-right",
          showAction: false,
          text: data.Message,
        });

        function countdown(minutes) {
          var seconds = 60;
          var mins = minutes;
          function tick() {
            //This script expects an element with an ID = "counter". You can change that to what ever you want.
            var current_minutes = mins - 1;
            seconds--;
            coolDownTimerElem.innerHTML =
              current_minutes.toString() +
              ":" +
              (seconds < 10 ? "0" : "") +
              String(seconds);
            if (seconds > 0) {
              setTimeout(tick, 1000);
            } else {
              if (mins > 1) {
                countdown(mins - 1);
              }
            }
            if ((mins - 1 == 0) & (seconds == 0)) {
              resendOtpElem.style.color = "#2F8AB2";
              resendOtpElem.style.pointerEvents = "all";
            }
          }
          tick();
        }
        countdown(5);
      });

      if (customerPhone.value.length < 10) {
        const phoneErrorMsgElem =
          phoneNumberForm.querySelector(".errorMessage");

        phoneErrorMsgElem.style.display = "block";
        phoneErrorMsgElem.innerHTML = "Please enter a valid phone number.";

        customerPhone.addEventListener("input", () => {
          phoneErrorMsgElem.innerHTML = "";
          phoneErrorMsgElem.style.display = "none";
        });
      }
    }
  }
}

function changePhoneNum() {
  phoneNumberForm.style.display = "block";
  otpForm.style.display = "none";

  customerOtp.disabled = true;
  customerPhone.disabled = false;
  getOtpBtn.disabled = false;

  orderObj.UUID = "";
  localStorage.setItem("customerData", JSON.stringify(orderObj));
  // clearTimeout(tick);
}

function verifyCustomerOtp() {
  // otp verification code goes here.
  verifyOtpBtn.disabled = true;
  customerOtp.disabled = true;

  orderObj["OTP"] = `${customerOtp.value}`;

  fetchData().then((data) => {
    if (data.Result.Order.MobileVerified === true) {
      orderObj["OTP"] = "";

      customerOtp.remove();
      // clearTimeout(tick);
      coolDownElem.remove();
      verifyOtpBtn.innerHTML = "Verified ✅";

      data.Result.Order.TotalVerified === true
        ? (checkoutBtn.style.display = "block")
        : (checkoutBtn.style.display = "none");
    } else {
      Snackbar.show({
        backgroundColor: "#dc2626",
        pos: "top-right",
        showAction: false,
        text: data.Message,
      });

      verifyOtpBtn.disabled = false;
      customerOtp.disabled = false;
    }
  });
}

// sessionStorage.clear("orderObj")

function findTotal(discountAmm) {
  const subtotal = orderList.reduce((accumulator, productDetail) => {
    return accumulator + parseInt(productDetail.Price * productDetail.Count);
  }, 0);

  orderObj.Subtotal = subtotal;

  const subtotalElem = orderSummaryForm.querySelector(".subtotal span");
  subtotalElem.innerHTML = `₹${subtotal}`;

  const finalAmount = subtotal - (discountAmm ? discountAmm : 0) + 50;

  orderObj.Total = finalAmount;

  const finalAmountElem = orderSummaryForm.querySelector(".finalAmount span");
  finalAmountElem.innerHTML = `₹${finalAmount}`;
}

const orderContainerElem = orderSummaryForm.querySelector(".orderContainer");

function incItemCount(productIndex) {
  if (localStorage.getItem("orderList")) {
    orderList[productIndex].Count += 1;

    verifyCouponCode();
    findTotal(discountAmm);

    const itemCount = orderSummaryForm.querySelector(
      `#itemCount-${productIndex}`
    );

    itemCount.innerHTML = orderList[productIndex].Count + " " + "unit";

    let totalCount = 0;
    orderList.map((orders) => {
      totalCount += orders.Count;
    });

    localStorage.setItem(
      "orderList",
      JSON.stringify({ orderList, totalCount })
    );

    const productCount = JSON.parse(
      localStorage.getItem("orderList")
    ).totalCount;

    document.querySelector("#productCount").innerHTML = productCount;
  }
}

function decItemCount(productIndex) {
  if (localStorage.getItem("orderList")) {
    orderList[productIndex].Count -= 1;

    const itemCount = orderSummaryForm.querySelector(
      `#itemCount-${productIndex}`
    );

    itemCount.innerHTML = orderList[productIndex].Count + " " + "unit";

    orderList[productIndex].Count == 0 &&
      (orderSummaryForm.querySelector(`#itemDetail-${productIndex}`).remove(),
      orderList.splice(productIndex, 1));

    verifyCouponCode();
    findTotal(discountAmm);

    let totalCount = 0;
    orderList.map((orders) => {
      totalCount += orders.Count;
    });

    localStorage.setItem(
      "orderList",
      JSON.stringify({ orderList, totalCount })
    );

    const productCount = JSON.parse(
      localStorage.getItem("orderList")
    ).totalCount;

    document.querySelector("#productCount").innerHTML = productCount;
  }
}

orderList.map((productDetail, index) => {
  orderContainerElem.innerHTML += `
  <div style="display: flex; align-items: center; gap: 1.5em; margin: 2em 0;" id="itemDetail-${index}">
      <div style="min-width: 138px; width: 138px; height: 138px;">
        <img src="${productDetail.Photo}" alt="${productDetail.Photo} image" style="width: 100%; height: 100%; object-fit: contain;">
      </div>
  
      <div>
          <h6>${productDetail.Title}</h6>

          <div style="display: flex; margin-top: 1em; align-items: center; gap: 0.5em">

            <button type="button" onclick="decItemCount(${index})" style="background: transparent">
              <img src="./assets/img/remove.png" alt="" style="width: 28px; height: 28px;">
            </button>

            <p id="itemCount-${index}">${productDetail.Count} unit</p>

            <button type="button" onclick="incItemCount(${index})" style="background: transparent">
              <img src="./assets/img/add.png" alt="" style="width: 24px; height: 24px;">
            </button>

        </div>
      </div>
  </div>
`;
});

function verifyCouponCode(elem) {
  const couponCodeVal = elem && couponCodeInput.value;
  console.log(couponCodeVal);

  if (couponCodeVal == "") {
    couponCodeError.style.display = "block";
    couponCodeError.style.color = "#ff5c5c";
    couponCodeError.innerHTML = "Please enter a coupon code!";

    couponCodeInput.addEventListener("input", () => {
      couponCodeError.innerHTML = "";
      couponCodeError.style.display = "none";
    });
  } else {
    getCouponDetails(couponCodeVal).then((data) => {
      if (data.Status === 2) {
        data.Result.Coupon.PreApply &&
          (couponCodeInput.value = data.Result.Coupon.Code);

        couponCodeBtn.innerHTML = "Applied!";

        // get discount from response.
        const discountType = data.Result.Coupon.Type;

        couponCodeError.style.display = "block";
        couponCodeError.innerHTML =
          discountType == "Percentage"
            ? `Hurray!! You got flat ${data.Result.Coupon.Value}% off`
            : `Hurray!! You got flat ₹${data.Result.Coupon.Value} off`;

        couponCodeError.style.display = "block";
        couponCodeError.style.color = "#15803d";

        const subTotal = orderObj.Subtotal;

        console.log(subTotal);

        discountAmm =
          discountType == "Percentage"
            ? subTotal * (data.Result.Coupon.Value / 100)
            : data.Result.Coupon.Value;

        console.log(discountType);

        findTotal(discountAmm);

        appliedCouponElem.style.display = "flex";
        appliedCouponDetails.innerHTML = `
      ${data.Result.Coupon.Code} <span style="float: right;">-₹${discountAmm}</span>
      `;

        // set new values for subtotal
      } else {
        findTotal();

        if (elem) {
          findTotal();

          couponCodeError.style.display = "block";
          couponCodeError.style.color = "#ff5c5c";
          couponCodeError.innerHTML = "Invalid Coupon Code!";

          appliedCouponElem.style.display = "none";
          appliedCouponDetails.innerHTML = "";

          couponCodeInput.addEventListener("input", () => {
            couponCodeError.innerHTML = "";
            couponCodeError.style.display = "none";
          });
        }
      }
    });
  }
}
verifyCouponCode();

// localStorage.removeItem("orderList");

// localStorage.clear("customerData")
