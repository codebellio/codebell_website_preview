const url = window.location.href;
orderObj = localStorage.getItem("customerData")
  ? JSON.parse(localStorage.getItem("customerData").Result.Order)
  : {};

const UUID = JSON.parse(localStorage.getItem("orderUUID"));

async function validateCheckout() {
  const products = {
    UUID: UUID,
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

validateCheckout().then((data) => {
  orderDetails = data.Result.Order;
  orderList = data.Result.OrderProducts;

  const orderId = orderDetails.UUID;
  const orderDate = orderDetails.UpdatedAt.slice(0, 10);
  const total = orderDetails.Total;

  const orderContainer = document.querySelector(".orderContainer");
  orderContainer.innerHTML = ``;

  const priceSummary = document.querySelector(".priceSummary");
  priceSummary.innerHTML = ``;

  orderList.map((items, index) => {
    orderContainer.innerHTML += `
      <div class="item-${index + 1}"
          style="margin-top: 1em; display: flex; justify-content: space-between; align-items: center; height: max-content; background-color: rgba(255, 255, 255, 0.194); width: 85%; padding: 1em; border-radius: 1em;">

          <div class="itemDetails">
              <p><strong style="color: inherit;"> ${
                orderList[index].Title
              } </strong></p>
              <p style=" font-size: x-small; color: rgb(200, 200, 200);">${
                orderList[index].Count
              } Unit</p>
          </div>

          <div style="display: flex; width: 7em; height: 7em; overflow: hidden;">
              <img src="${orderList[index].Photo}"
                  style="object-fit: contain; max-width: 100%; max-height: 100%; margin: auto; border-radius: 0.5em;"
                  alt="item image">
          </div>
      </div>
    `;
  });

  priceSummary.innerHTML = `
      <b>
        <p class="subtotal" style="width: 80%;"> Order Id <span
                style="float: right;">${orderDetails.UUID}</span></p>

        <p class="deliveryCharges" style="width: 80%;"> Order date <span
                style="float: right;">₹${orderDetails.UpdatedAt.slice(
                  0,
                  10
                )}</span>
        </p>
        <p class="deliveryCharges" style="width: 80%;"> Ammount to be paid <span
                style="float: right;">₹${orderDetails.Total}</span>
        </p>
      </b>
  `;
});

if (url.substring(url.lastIndexOf("?") + 4) != UUID) {
  window.location.replace("https://preview.codebell.io/");
} else {
  localStorage.removeItem("customerData");
}
