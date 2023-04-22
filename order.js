const shippingDetailsElem = document.getElementById("shippingDetails");
const shippingDetailInput = shippingDetailsElem.querySelectorAll("input");
const shippingDetailsSelect = shippingDetailsElem.querySelector("select");
const orderSummaryForm = document.getElementById("orderSummary");
const customerNameElem = orderSummaryForm.querySelector("#customerName");
const customerAddressElem = orderSummaryForm.querySelector("#customerAddress");

const orderSummaryElem = document.getElementById("orderSummary");
const progressElem = document.getElementsByClassName("progress");
const progressBarElem = document.getElementById("progressBar");

const customerPhone = orderSummaryForm.querySelector("#phoneNumber");
const customerOtp = orderSummaryForm.querySelector("#customerOtp");
const verifyOtpBtn = orderSummaryForm.querySelector("#verifyOtpBtn");
const getOtpBtn = orderSummaryForm.querySelector("#getOtpBtn");

let customerObj = {};

let sessionStorageData = JSON.parse(sessionStorage.getItem("customerData"));
sessionStorageData && (shippingDetails(), setOrderSummary());

function setCustomerDeatils() {
  sessionStorageData = JSON.parse(sessionStorage.getItem("customerData"));
}

function shippingDetails() {
  shippingDetailsElem.style.display = "none";
  orderSummaryElem.style.display = "flex";
  progressBarElem.style.background =
    "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 50%, #ffffff 50%, #ffffff 100%)";

  progressElem[1].classList.add("activeProgress");
}

function setShippingDetails() {
  const inputs = shippingDetailInput;
  const data = new FormData(shippingDetailsElem);

  for (const entry of data) {
    addressType = `${entry[0]}`;
  }

  customerObj["Name"] = inputs[0].value + " " + inputs[1].value;
  customerObj["Address"] = inputs[2].value;
  customerObj["Apt"] = inputs[3].value;
  customerObj["City"] = inputs[4].value;
  customerObj["Pin"] = inputs[5].value;
  customerObj["AddressType"] = addressType;
  customerObj["Country"] = shippingDetailsSelect.value;

  sessionStorage.clear("customerData");
  sessionStorage.setItem("customerData", JSON.stringify(customerObj));
  setCustomerDeatils();

  setOrderSummary();
}

function setOrderSummary() {
  customerNameElem.innerHTML = sessionStorageData.Name;
  customerAddressElem.innerHTML = `${sessionStorageData.Apt}, ${sessionStorageData.Address},
      ${sessionStorageData.City},
      ${sessionStorageData.Pin}
  `;
}

function Checkout() {
  orderSummaryElem.style.display = "none";

  progressBarElem.style.background =
    "linear-gradient(to right, #2F8AB2 0%, #2F8AB2 100%)";
  progressElem[2].classList.add("activeProgress");

  // sessionStorage.clear("userData");
}

function changeAddress() {
  shippingDetailsElem.style.display = "flex";
  orderSummaryElem.style.display = "none";

  progressBarElem.style.background =
    "linear-gradient(to right, #ffffff 0%, #ffffff 100%)";
  progressElem[1].classList.remove("activeProgress");
}

function getCustomerOtp() {
  // otp code goes here.
  if (customerPhone.value.length > 3 && customerPhone.value.startsWith("+")) {
    verifyOtpBtn.disabled = false;
    customerOtp.disabled = false;
    customerPhone.disabled = true;
    getOtpBtn.disabled = true;

    verifyOtpBtn.style.backgroundColor = "#059862";
    getOtpBtn.style.backgroundColor = "#4a4a4a";

    sessionStorageData["Phone"] = customerPhone.value;

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

  if (customerPhone.value.length <= 3) {
    alert("Please check your phone number again.");
  }

  if (!customerPhone.value.startsWith("+")) {
    alert("Please add you country code (example: +91) before your number.");
  }
}

function verifyCustomerOtp() {
  // otp verification code goes here.
  verifyOtpBtn.disabled = true;
  customerOtp.disabled = true;
  verifyOtpBtn.style.backgroundColor = "#4a4a4a";
}

// sessionStorage.clear("customerData");
