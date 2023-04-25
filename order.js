const shippingDetailsElem = document.getElementById("shippingDetails");
const shippingDetailInput = shippingDetailsElem.querySelectorAll("input");
const shippingDetailsSelect = shippingDetailsElem.querySelector("select");
const orderSummaryForm = document.getElementById("orderSummary");
const customerNameElem = orderSummaryForm.querySelector("#customerName");
const customerAddressElem = orderSummaryForm.querySelector("#customerAddress");

const progressElem = document.getElementsByClassName("progress");
const progressBarElem = document.getElementById("progressBar");

const customerPhone = orderSummaryForm.querySelector("#phoneNumber");
const customerOtp = orderSummaryForm.querySelector("#customerOtp");
const verifyOtpBtn = orderSummaryForm.querySelector("#verifyOtpBtn");
const getOtpBtn = orderSummaryForm.querySelector("#getOtpBtn");

let orderObj = JSON.parse(sessionStorage.getItem("customerData"))
  ? JSON.parse(sessionStorage.getItem("customerData"))
  : {
      UUID: "",
      UserID: "",
      Name: "",
      Mobile: "",
      MobileVerified: false,
      OTP: "",
      OtpCreatedOn: "",
      UpdatedBy: "",
      Address: "",
      Apt: "",
      City: "",
      Country: "",
      Pin: "",
      AddressType: "",
      Subtotal: "",
      Delivery: "",
      Total: "",
      Step: "",
      Status: "",
      Items: "",
    };

orderObj.Address !== "" && (shippingDetails(), setOrderSummary());

function setCustomerDeatils() {
  orderObj = JSON.parse(sessionStorage.getItem("customerData"));
}

const errorMessage = shippingDetailsElem.querySelectorAll(".errorMessage");

function shippingDetails() {
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

  if (formComplete) {
    shippingDetailsElem.style.display = "none";
    orderSummaryForm.style.display = "flex";
    progressBarElem.style.background =
      "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 50%, #ffffff 50%, #ffffff 100%)";

    progressElem[1].classList.add("activeProgress");
  }
}

function setShippingDetails() {
  const inputs = shippingDetailInput;
  const data = new FormData(shippingDetailsElem);

  for (const entry of data) {
    addressType = `${entry[0]}`;
  }

  orderObj.Name = inputs[0].value + " " + inputs[1].value;
  orderObj.Address = inputs[2].value;
  orderObj.Apt = inputs[3].value;
  orderObj.City = inputs[4].value;
  orderObj.Pin = inputs[5].value;
  orderObj.AddressType = addressType;
  orderObj.Country = shippingDetailsSelect.value;

  sessionStorage.setItem("customerData", JSON.stringify(orderObj));

  setCustomerDeatils();
  setOrderSummary();
}

function setOrderSummary() {
  customerNameElem.innerHTML = orderObj.Name;
  customerAddressElem.innerHTML = `${orderObj.Apt}, ${orderObj.Address},
      ${orderObj.City},
      ${orderObj.Pin}
  `;
}

function Checkout() {
  orderSummaryForm.style.display = "none";

  progressBarElem.style.background =
    "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 100%)";
  progressElem[2].classList.add("activeProgress");
}

function changeAddress() {
  shippingDetailsElem.style.display = "flex";
  orderSummaryForm.style.display = "none";

  progressBarElem.style.background =
    "linear-gradient(to right, #ffffff 0%, #ffffff 100%)";
  progressElem[1].classList.remove("activeProgress");

  const inputs = shippingDetailInput;
  const name = orderObj["Name"].split(" ");

  inputs[0].value = name[0];
  inputs[1].value = name[1];
  inputs[2].value = orderObj["Address"];
  inputs[3].value = orderObj["Apt"];
  inputs[4].value = orderObj["City"];
  inputs[5].value = orderObj["Pin"];
}

function getCustomerOtp() {
  // otp code goes here.
  if (customerPhone.value.length === 10) {
    verifyOtpBtn.disabled = false;
    customerOtp.disabled = false;
    customerPhone.disabled = true;
    getOtpBtn.disabled = true;

    verifyOtpBtn.style.backgroundColor = "#059862";
    getOtpBtn.style.backgroundColor = "#4a4a4a";

    orderObj.Mobile = customerPhone.value;
    sessionStorage.setItem("customerData", JSON.stringify(orderObj));

    // console.log(sessionStorageData);

    setTimeout(() => {
      customerPhone.disabled = false;
      getOtpBtn.disabled = false;
    }, 10000);

    let timer = 10;
    const changePhoneNumber = setInterval(() => {
      getOtpBtn.innerHTML = timer;
      timer -= 1;
      timer < 0 &&
        ((getOtpBtn.innerHTML = "Get otp"),
        (getOtpBtn.style.backgroundColor = "#059862"),
        clearInterval(changePhoneNumber));
    }, 1000);
  }

  if (customerPhone.value.length < 10) {
    alert("Please check your phone number again.");
  }
}

function verifyCustomerOtp() {
  // otp verification code goes here.
  verifyOtpBtn.disabled = true;
  customerOtp.disabled = true;
  verifyOtpBtn.style.backgroundColor = "#4a4a4a";
}

orderList = JSON.parse(sessionStorage.getItem("orderList")) ?? [];
orderObj.Items = sessionStorage.getItem("orderList");
console.log(orderList);
console.log(orderObj);

// sessionStorage.clear("orderList")
// sessionStorage.clear("customerData");

const subtotal = orderList.reduce((accumulator, productDetail) => {
  return accumulator + parseInt(productDetail.price * productDetail.count);
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
      <img src="${productDetail.image}" alt="Doormount image" style="width: 40%; height: 40%;">
  
      <div>
          <h6>${productDetail.name}</h6>
          <p>${productDetail.count} unit</p>
      </div>
  </div>
`;
});

const checkoutBtn = orderSummaryForm.querySelector(".checkout.button");

if (orderList == "") {
  checkoutBtn.style.display = "none";
} else {
  checkoutBtn.style.display = "block";
}
