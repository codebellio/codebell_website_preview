const productsObj = {
  1: {
    ID: 1,
    Summary: "",
    Title: "Codebell with proximity light",
    Price: 200,
    Count: 1,
    Photo:
      "https://s3.ap-south-1.amazonaws.com/device.localhost/products/cproduct3.png",
  },
  2: {
    ID: 2,
    Title: "Car codbell",
    Summary: "",
    Price: 350,
    Count: 1,
    Photo:
      "https://s3.ap-south-1.amazonaws.com/device.localhost/products/product5.png",
  },
  3: {
    ID: 3,
    Title: "Free Codebell",
    Summary: "",
    Price: 15,
    Count: 1,
    Photo:
      "https://s3.ap-south-1.amazonaws.com/device.localhost/products/cproduct1.png",
  },
};

let orderList = [];

function order(productIndex) {
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

  localStorage.setItem(
    "orderList",
    JSON.stringify({ orderList, totalCount })
  );
}

// sessionStorage.clear("orderList")
