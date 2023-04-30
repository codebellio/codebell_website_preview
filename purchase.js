const url = window.location.href;
orderObj = localStorage.getItem("customerData")
  ? JSON.parse(localStorage.getItem("customerData"))
  : {};

console.log(orderObj);

const UUID =
  Object.keys(orderObj).length !== 0 ? orderObj.Result.Order.UUID : null;

console.log(UUID);
console.log(url.substring(url.lastIndexOf("?") + 4));

if (url.substring(url.lastIndexOf("?") + 4) != UUID) {
  // window.location.replace("https://preview.codebell.io/");
} else {
  localStorage.clear("customerData");
}
