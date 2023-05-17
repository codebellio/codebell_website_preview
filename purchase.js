// Get the current URL of the window
const url = window.location.href;

// Retrieve the "customerData" from localStorage and parse it as JSON, or assign an empty object if it doesn't exist
orderObj = localStorage.getItem("customerData")
  ? JSON.parse(localStorage.getItem("customerData"))
  : {};

// Retrieve the "orderUUID" from localStorage and parse it as JSON, assigning the value to the UUID variable
const UUID = JSON.parse(localStorage.getItem("orderUUID"));

async function validateCheckout() {
  // Prepare the data to be sent in the request body
  const products = {
    UUID: UUID,
  };

  // API endpoint URL
  var api = "https://api.codebell.io/api/checkout";

  // Send a POST request to the API endpoint
  return await fetch(api, {
    method: "post",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(products),
  })
    .then((response) => response.json()) // Parse the response data as JSON
    .then((data) => {
      return data; // Return the parsed data
    })
    .catch((error) => {
      console.error(error); // Log any errors that occur
    });
}

// Call the validateCheckout function and handle the returned data
validateCheckout().then((data) => {
  // Extract order details and order products from the returned data
  orderDetails = data.Result.Order;
  orderList = data.Result.OrderProducts;

  // Clear the existing content of the orderContainer element
  const orderContainer = document.querySelector(".orderContainer");
  orderContainer.innerHTML = ``;

  // Clear the existing content of the priceSummary element
  const priceSummary = document.querySelector(".priceSummary");
  priceSummary.innerHTML = ``;

  // Loop through the orderList and generate HTML markup for each item
  orderList.map((item, index) => {
    orderContainer.innerHTML += `
      <div class="item-${index + 1}"
          style="margin-top: 1em; display: flex; justify-content: space-between; align-items: center; height: max-content; background-color: rgba(255, 255, 255, 0.194); width: 85%; padding: 1em; border-radius: 1em;">

          <div class="itemDetails">
              <p><strong style="color: inherit;"> ${item.Title} </strong></p>
              <p style=" font-size: x-small; color: rgb(200, 200, 200);">${
                item.Count
              } Unit</p>
          </div>

          <div style="display: flex; width: 7em; height: 7em; overflow: hidden;">
              <img src="${item.Photo}"
                  style="object-fit: contain; max-width: 100%; max-height: 100%; margin: auto; border-radius: 0.5em;"
                  alt="item image">
          </div>
      </div>
    `;
  });

  // Generate HTML markup for the price summary
  priceSummary.innerHTML = `
        <div style="display: flex; width: 100%;">
            <p class="subtotal" style="width:50%; "> Order Id: </p>
            <div style="width: 50%; word-break: break-all;">${
              orderDetails.UUID
            }</div>
        </div>
        <div style="display: flex; width: 100%;">
            <p class="subtotal" style="width:50%; "> Order date: </p>
            <div style="width: 50%">${orderDetails.UpdatedAt.slice(0, 10)}</div>

        </div>
        <div style="display: flex; width: 100%;">
            <p class="subtotal" style="width:50%; "> Ammount to be paid: </p>
            <div style="width: 50%">₹${orderDetails.Total}</div>
        </div>


  `;
});

// Check if the substring after the last occurrence of "?" in the URL is not equal to the UUID
if (url.substring(url.lastIndexOf("?") + 4) != UUID) {
  // If the condition is true, redirect the user to "https://preview.codebell.io/"
  window.location.replace("https://preview.codebell.io/");
} else {
  // If the condition is false, remove the "customerData" item from localStorage
  localStorage.removeItem("customerData");
}
