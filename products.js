const productsObj = {
  1: {
    ProductID: 1,
    Title: "Codebell for Home",
    Photo:
      "https://s3.ap-south-1.amazonaws.com/device.codebell.io/products/cproduct1.png",
    Summary:
      "Upon scanning Codebell, a screenshot of visitor is stored in your app. Keep track of all visitors for extra safety.",
    Price: 365,
    Plan: 365,
    Count: 1,
    Locked: true,
    Keyword: "home",
  },
  2: {
    ProductID: 2,
    Title: "Codebell for your Vehicle",
    Photo:
      "https://s3.ap-south-1.amazonaws.com/device.codebell.io/products/cccproduct2.png",
    Summary:
      "Get LIVE preview when anyone scans the CodeBell. Talk to them or let them know if you are away.",
    Price: 365,
    Plan: 365,
    Count: 1,
    Locked: true,
    Keyword: "vehicle",
  },
  3: {
    Title: "Codebell Office",
    ProductID: 3,
    Keyword: "office",
    Photo:
      "https://s3.ap-south-1.amazonaws.com/device.codebell.io/products/product3.png",
    Summary:
      "Codebell Shop Connect is a QR code-based scanner that allows customers to connect with shop owners even when the shop is closed or the owner is unavailable. This innovative tool ensures that businesses can remain connected with their customers 24/7 without the need for physical presence.",
    Price: 400,
    Plan: 365,
    Count: 1,
    Locked: true,
  },
};

const productWrapperElem = document.querySelector("#productWrapper");
if (productWrapperElem) {
  Object.values(productsObj).map((products, index) => {
    // productWrapperElem.innerHTML += `
    // `;
  });
}

let orderList = localStorage.getItem("orderList")
  ? JSON.parse(localStorage.getItem("orderList"))
  : [];

function order(productIndex, triggerer) {
  if (triggerer == "addToCart") {
    orderPopUp = document.querySelector("#orderPopUp");
    orderPopUp.style.display = "flex";
    document.querySelector("body").style.overflowY = "hidden";
  }

  if (localStorage.getItem("orderList")) {
    orderList = JSON.parse(localStorage.getItem("orderList")).orderList;

    let productListIndex = orderList.findIndex(
      (product) => product.Title === productsObj[productIndex].Title
    );

    productListIndex < 0
      ? orderList.push(productsObj[productIndex])
      : (orderList[productListIndex].Count += 1);
  } else {
    orderList.push(productsObj[productIndex]);
  }

  let totalCount = 0;
  orderList.map((orders) => {
    totalCount += orders.Count;
  });

  localStorage.setItem("orderList", JSON.stringify({ orderList, totalCount }));
}

function closePopUp() {
  orderPopUp.style.display = "none";
  document.querySelector("body").style.overflowY = "scroll";
}
