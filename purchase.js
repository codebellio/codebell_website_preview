const url = window.location.href;
orderObj = JSON.parse(sessionStorage.getItem("customerData"));
const UUID = orderObj.Result.Order.UUID;

console.log(url.substring(url.lastIndexOf("?") + 4));

if (url.substring(url.lastIndexOf("?") + 4) != UUID) {
  window.location.replace("https://preview.codebell.io/");
}
