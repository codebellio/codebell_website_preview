const url = window.location.href;
orderObj = localStorage.getItem("customerData")
  ? JSON.parse(localStorage.getItem("customerData"))
  : {};


const UUID = Object.keys(orderObj).length !== 0 ? orderObj.UUID : null;

if (url.substring(url.lastIndexOf("?") + 4) != UUID) {
  window.location.replace("https://preview.codebell.io/");
} else {
  localStorage.removeItem("customerData");
}
