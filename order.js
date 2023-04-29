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

const checkoutBtn = orderSummaryForm.querySelector(".checkout.button");

let orderObj = JSON.parse(sessionStorage.getItem("customerData"))
  ? JSON.parse(sessionStorage.getItem("customerData"))
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

// sessionStorage.clear("orderList");

// console.log(JSON.parse(sessionStorage.getItem("customerData")));

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

console.log(customerAddress);

if (customerAddress) {
  console.log(customerAddress);

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
  orderObj = JSON.parse(sessionStorage.getItem("customerData"));

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
  // console.log(localStorage.getItem("customerAddress"));
}

function formValidation() {
  const errorMessage = shippingDetailsElem.querySelectorAll(".errorMessage");

  shippingDetailInput.forEach((input, index) => {
    if (input.type == "text") {
      formComplete = true;
      const inputValue = input.value.trim();

      if (!inputValue) {
        errorMessage[index].innerHTML = "Field cannot remain empty!";
        input.addEventListener(
          "keypress",
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

  if ((formComplete || orderObj.Address !== "") & (orderList != "")) {
    headingTopElem.innerHTML = `Almost <span class="text-transparent">there...</span>`;
    shippingDetailsElem.style.display = "none";
    orderSummaryForm.style.display = "flex";
    progressBarElem.style.background =
      "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 50%, #ffffff 50%, #ffffff 100%)";

    progressElem[1].classList.add("activeProgress");
  }

  (orderList != "") & (orderObj.OtpCreatedOn > 0)
    ? (checkoutBtn.style.display = "block")
    : (checkoutBtn.style.display = "none");
}

function setShippingDetails() {
  const inputs = shippingDetailInput;
  const data = new FormData(shippingDetailsElem);

  for (const entry of data) {
    console.log(entry);
    addressType = `${entry[1]}`;
  }

  orderObj.Name = inputs[0].value + " " + inputs[1].value;
  orderObj.Address = inputs[2].value;
  orderObj.Apt = inputs[3].value;
  orderObj.City = inputs[4].value;
  orderObj.Pin = inputs[5].value;
  orderObj.AddressType = addressType;
  orderObj.Country = shippingDetailsSelect.value;

  sessionStorage.setItem("customerData", JSON.stringify(orderObj));
  console.log(orderObj);

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

function Checkout() {
  fetchData().then((data) => {
    console.log(data);
    if (
      (data.Result.Order.MobileVerified === true) &
      (data.Result.Order.TotalVerified === true)
    ) {
      orderSummaryForm.style.display = "none";
      paymentMethods.style.display = "block";

      progressBarElem.style.background =
        "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 100%)";
      progressElem[2].classList.add("activeProgress");
    }
  });
}

function paymentMehtod(type) {
  orderObj["PaymentMethod"] = type;
  console.log(orderObj);

  fetchData().then((data) => {
    console.log(data);
    if (
      (data.Result.Order.MobileVerified === true) &
      (data.Result.Order.TotalVerified === true)
    ) {
      orderObj = data.Result.Order;
      sessionStorage.setItem("customerData", JSON.stringify(orderObj));

      if (data.Result.Order.PaymentMethod === "onlinePayment") {
        Snackbar.show({
          pos: "top-right",
          showAction: false,
          text: "Online payment is temprarily disabled!",
        });
      }
      if (data.Result.Order.PaymentMethod === "COD") {
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
console.log(orderList);

let resendOtp = false;

async function fetchData(bool) {
  const record = {
    record: orderObj,
    items: orderList,
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

function getCustomerOtp() {
  if (customerPhone.value.length === 10) {
    phoneNumberForm.style.display = "none";
    otpForm.style.display = "block";

    // verifyOtpBtn.disabled = false;
    customerOtp.disabled = false;
    customerPhone.disabled = true;
    getOtpBtn.disabled = true;

    verifyOtpBtn.style.backgroundColor = "#059862";
    getOtpBtn.style.backgroundColor = "#4a4a4a";

    orderObj.Mobile = customerPhone.value;
    otpLabel.innerHTML = `Phone number - ${orderObj.Mobile}`;

    // JSON.stringify(orderObj.Items);
    sessionStorage.setItem("customerData", JSON.stringify(orderObj));

    fetchData().then((data) => {
      console.log(data);

      orderObj["UUID"] = `${data.Result.Order.UUID}`;
      sessionStorage.setItem("customerData", JSON.stringify(orderObj));

      const UUID = orderObj.UUID;
      history.pushState(
        {},
        "Codebell",
        `https://preview.codebell.io/purchase?id=${UUID}`
      );

      Snackbar.show({
        pos: "top-left",
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
            // customerPhone.disabled = false;
            // getOtpBtn.disabled = false;
          }
        }
        tick();
      }
      countdown(5);
    });
  }

  if (customerPhone.value.length < 10) {
    Snackbar.show({
      actionTextColor: "#ef4444",
      pos: "top-left",
      // showAction: false,
      text: "Please check your phone number!",
    });
  }
}

function verifyCustomerOtp() {
  // otp verification code goes here.
  verifyOtpBtn.disabled = true;
  customerOtp.disabled = true;

  orderObj["OTP"] = `${customerOtp.value}`;
  console.log(orderObj);

  fetchData().then((data) => {
    console.log(data);

    if (data.Result.Order.MobileVerified === true) {
      // Snackbar.show({
      //   backgroundColor: "#047857",
      //   pos: "top-right",
      //   showAction: false,
      //   text: data.Message,
      // });

      customerOtp.remove();
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

console.log(orderObj);

// sessionStorage.clear("orderObj")

const subtotal = orderList.reduce((accumulator, productDetail) => {
  return accumulator + parseInt(productDetail.Price * productDetail.Count);
}, 0);

orderObj.Subtotal = subtotal;

const subtotalElem = orderSummaryForm.querySelector(".subtotal span");
subtotalElem.innerHTML = `₹${subtotal}`;

const finalAmount = subtotal + 50;

orderObj.Total = finalAmount;

const finalAmountElem = orderSummaryForm.querySelector(".finalAmount span");
finalAmountElem.innerHTML = `₹${finalAmount}`;

const orderContainerElem = orderSummaryForm.querySelector(".orderContainer");

orderList.map((productDetail) => {
  orderContainerElem.innerHTML += `
  <div style="display: flex; align-items: center; gap: 1.5em; margin: 2em 0;">
      <div style="min-width: 138px; width: 138px; height: 138px;">
        <img src="${productDetail.Photo}" alt="${productDetail.Photo} image" style="width: 100%; height: 100%; object-fit: contain;">
      </div>
  
      <div>
          <h6>${productDetail.Title}</h6>
          <p>${productDetail.Count} unit</p>
      </div>
  </div>
`;
});
