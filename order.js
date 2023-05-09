const shippingDetailsElem = document.getElementById("shippingDetails");
const paymentMethods = document.getElementById("paymentMethods");

const headingTopElem = document.querySelector(".heading-top");
const shippingDetailInput = shippingDetailsElem.querySelectorAll("input");
const shippingDetailsSelect = shippingDetailsElem.querySelector("select");
const orderSummaryForm = document.getElementById("orderSummary");

const customerDetails = orderSummaryForm.querySelector("#customerDetails");
const otpForm = document.querySelector("#otpForm");
const cutomerPhoneLabel = otpForm.querySelector(
  "#cutomerPhoneLabel strong span"
);

const progressElem = document.getElementsByClassName("progress");
const progressBarElem = document.getElementById("progressBar");
const customerPhone = shippingDetailsElem.querySelector("#customerPhone");

const customerOtp = otpForm.querySelector("#customerOtp");
const verifyOtpBtn = otpForm.querySelector("#verifyOtpBtn");
const verifyOtpBtnVal = otpForm.querySelector("#verifyOtpBtn div");

const resendBtn = otpForm.querySelector("#resendBtn");

const couponCodeForm = orderSummaryForm.querySelector("#couponForm");
const addCouponForm = couponCodeForm.querySelector("#addCouponForm");
const couponCodeInput = addCouponForm.querySelector("#couponCodeInput");
const couponCodeError = addCouponForm.querySelector(".errorMessage");
const couponSummaryForm = couponCodeForm.querySelector("#couponSummary");
const couponOfferMsgElem = couponSummaryForm.querySelector(
  "#couponOfferMsg span"
);

const appliedCouponElem = orderSummaryForm.querySelector("#appliedCoupon");
const appliedCouponDetails = orderSummaryForm.querySelector(
  "#appliedCouponDetails"
);

const checkoutBtn = orderSummaryForm.querySelector(".checkout.button");
const cartDetailsElem = orderSummaryForm.querySelector("#cartDetails");

var url = window.location.href;

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
  customerDetails.innerHTML = `
    <p id="customerName">${customerAddress.Name} (${customerAddress.AddressType})</p>
    <p id="customerPhone">+91${orderObj.Mobile}</p>
    <p id="customerAddress">${customerAddress.Apt}, ${customerAddress.Address},
      ${customerAddress.City},
      ${customerAddress.Pin}</p>
  `;
}

function setOrders(orderList) {
  orderContainerElem.innerHTML = ``;
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
              <img src="./assets/img/minus.png" alt="" style="width: 28px; height: 28px;">
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
}

async function getCouponDetails(couponCode) {
  couponObj = { coupon_code: couponCode };

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

async function validateCheckout(couponCode, bool) {
  const products = {
    UUID: orderObj.UUID,
    ...(bool && {
      products: orderList,
      coupon_code: couponCode ? couponCode : "",
    }),
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

function Checkout(couponCode) {
  validateCheckout(couponCode, true).then((data) => {
    if (data.Status == 2) {
      orderSummaryForm.style.display = "none";
      paymentMethods.style.display = "block";

      progressBarElem.style.background =
        "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 100%)";
      progressElem[2].classList.add("activeProgress");

      localStorage.removeItem("orderList");

      document.getElementById("productCount").innerHTML = 0;
    } else {
      Snackbar.show({
        pos: "top-right",
        showAction: true,
        text: data.Message,
      });
    }
  });
}

function paymentMehtod(paymentType) {
  orderObj["PaymentMethod"] = paymentType;

  fetchData().then((data) => {
    if (
      (data.Result.Order.MobileVerified === true) &
      (data.Result.Order.TotalVerified === true)
    ) {
      orderObj = data.Result.Order;
      localStorage.setItem("customerData", JSON.stringify(orderObj));

      if (paymentType === "Online Payment") {
        Snackbar.show({
          pos: "top-right",
          showAction: false,
          text: data.Message,
        });
      }
      if (paymentType === "Cash On Delivery") {
        const UUID = data.Result.Order.UUID;
        location.replace(`https://preview.codebell.io/purchase?id=${UUID}`);
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
  inputs[2].value = customerAddress.Address;
  inputs[3].value = customerAddress.Apt;
  inputs[4].value = customerAddress.City;
  inputs[5].value = customerAddress.Pin;
  inputs[6].value = orderObj.Mobile;

  customerAddress.AddressType == "Home"
    ? ((inputs[7].checked = true), (inputs[8].checked = false))
    : ((inputs[8].checked = true), (inputs[7].checked = false));

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
function getCustomerOtp(bool) {
  formValidation();

  if (customerPhone.value.length === 10) {
    orderObj.Mobile = customerPhone.value;
    localStorage.setItem("customerData", JSON.stringify(orderObj));

    document.querySelector("body").style.overflowY = "hidden";
    otpForm.style.display = "flex";
    customerOtp.disabled = "false";
    verifyOtpBtn.disabled = "false";

    if (formComplete) {
      setShippingDetails();

      verifyOtpBtn.disabled = false;
      customerOtp.disabled = false;

      cutomerPhoneLabel.innerHTML = orderObj.Mobile;
    }
  } else {
    if (bool == true) {
      const phoneErrorMsgElem =
        shippingDetailsElem.querySelector(".phoneErrorMessage");

      phoneErrorMsgElem.style.display = "block";
      phoneErrorMsgElem.innerHTML = "Please enter a valid phone number.";

      customerPhone.addEventListener("input", () => {
        phoneErrorMsgElem.innerHTML = "";
        phoneErrorMsgElem.style.display = "none";
      });
    }
  }

  url = window.location.href;

  if (url.substring(url.lastIndexOf("?") + 4) != orderObj.UUID) {
    fetchData().then((data) => {
      if (data.Result.Order.UUID != "") {
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

        data.Result.Order.TotalVerified === true
          ? ((checkoutBtn.style.display = "block"),
            (checkoutBtn.disabled = false))
          : (checkoutBtn.style.display = "none");
      } else {
        changeAddress();
      }

      customerAddress.Address !== "" &&
        changeAddress() &&
        orderList != "" &&
        setOrderSummaryForm();
      setOrders(orderList);
    });
  } else {
    verifyCustomerOtp(false);

    validateCheckout({}, false).then((data) => {
      orderList = data.Result.OrderProducts;

      let totalCount = 0;
      orderList.map((orders) => {
        totalCount += orders.Count;
      });

      localStorage.setItem(
        "orderList",
        JSON.stringify({ orderList, totalCount })
      );

      changeAddress(),
        setOrderSummaryForm(),
        shippingDetails(),
        setOrders(orderList);
    });
  }
}

function changePhoneNum() {
  phoneNumberForm.style.display = "block";

  otpForm.style.display = "none";

  customerOtp.disabled = true;
  customerPhone.disabled = false;
  getOtpBtn.disabled = false;

  checkoutBtn.style.display = "none";
  checkoutBtn.disabled = true;

  verifyOtpBtn.innerHTML = "Verify Otp";

  delete orderObj.UUID;
  localStorage.setItem("customerData", JSON.stringify(orderObj));
}

function verifyCustomerOtp(bool) {
  customerOtp.style.display = "block";
  verifyOtpBtn.disabled = true;
  customerOtp.disabled = true;

  orderObj["OTP"] = `${customerOtp.value}`;

  fetchData().then((data) => {
    if (data.Result.Order.MobileVerified === true) {
      orderObj["OTP"] = "";

      customerOtp.style.display = "none";
      resendBtn.style.display = "none";
      verifyOtpBtnVal.innerHTML = "Verified ✅";
      verifyOtpBtn.disabled = true;

      setTimeout(() => {
        closeOtpForm();
      }, 1000);

      setTimeout(() => {
        shippingDetails();
      }, 1500);
    } else {
      if (bool) {
        Snackbar.show({
          backgroundColor: "#dc2626",
          pos: "top-right",
          showAction: false,
          text: data.Message,
        });
      }
      verifyOtpBtn.disabled = false;
      customerOtp.disabled = false;
    }
  });
}

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

  finalAmount === 50
    ? (cartDetailsElem.innerHTML = `
  <h5 style="padding: 1em;">No items in cart..</h5>
  `)
    : (finalAmountElem.innerHTML = `₹${finalAmount}`);
}

const orderContainerElem = orderSummaryForm.querySelector(".orderContainer");

function incItemCount(productIndex) {
  if (localStorage.getItem("orderList")) {
    orderList[productIndex].Count += 1;

    verifyCouponCode(false);
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
      orderList.splice(productIndex, 1),
      setOrders(orderList));

    verifyCouponCode(false);
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

// if (
//   url.substring(url.lastIndexOf("?") + 4) == orderObj.UUID &&
//   orderList == ""
// ) {
// } else {

// }

let couponCode = "";
function verifyCouponCode(bool) {
  const couponCodeVal = couponCodeInput.value;

  if (bool == true && couponCodeVal == "") {
    couponCodeError.style.display = "block";
    couponCodeError.innerHTML = "Please enter a coupon code!";

    couponCodeInput.addEventListener("input", () => {
      couponCodeError.innerHTML = "";
      couponCodeError.style.display = "none";
    });
  } else {
    getCouponDetails(couponCodeVal).then((data) => {
      if (data.Status === 2) {
        findTotal();
        addCouponForm.style.display = "none";
        couponSummaryForm.style.display = "flex";

        couponName = data.Result.Coupon.Name;

        const discountType = data.Result.Coupon.Type;

        couponOfferMsgElem.innerHTML =
          discountType == "Percentage"
            ? `${data.Result.Coupon.Value}% off`
            : `₹${data.Result.Coupon.Value} off`;

        const subTotal = orderObj.Subtotal;

        discountAmm =
          discountType == "Percentage"
            ? subTotal * (data.Result.Coupon.Value / 100)
            : data.Result.Coupon.Value;

        findTotal(discountAmm);

        appliedCouponElem.style.display = "flex";
        appliedCouponDetails.innerHTML = `
          Coupon discount <span style="float: right;">-₹${discountAmm}</span>
      `;
      } else {
        findTotal();

        if (bool) {
          couponCodeError.style.display = "block";
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
verifyCouponCode(false);

function removeCoupon() {
  couponSummaryForm.style.display = "none";
  addCouponForm.style.display = "block";

  appliedCouponElem.style.display = "none";
  appliedCouponDetails.innerHTML = "";

  discountAmm = 0;
  findTotal(discountAmm);
}

function closeOtpForm() {
  otpForm.style.display = "none";
  customerOtp.disabled = "true";
  verifyOtpBtn.disabled = "true";

  document.querySelector("body").style.overflowY = "scroll";

  customerPhone.disabled = false;
}
