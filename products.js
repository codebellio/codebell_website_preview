const productsObj = {
  1: {
    name: "Codebell with proximity light",
    price: "200",
    count: 1,
    image:
      "https://s3.ap-south-1.amazonaws.com/device.localhost/products/cproduct3.png",
  },
  2: {
    name: "Car codbell",
    price: "350",
    count: 1,
    image:
      "https://s3.ap-south-1.amazonaws.com/device.localhost/products/product5.png",
  },
  3: {
    name: "Free Codebell",
    price: "15",
    count: 1,
    image:
      "https://s3.ap-south-1.amazonaws.com/device.localhost/products/cproduct1.png",
  },
};

let orderList = [];

function order(productIndex) {
  if (sessionStorage.getItem("orderList")) {
    orderList = JSON.parse(sessionStorage.getItem("orderList"));

    let productListIndex = orderList.findIndex(
      (product) => product.name === productsObj[productIndex].name
    );

    productListIndex < 0
      ? orderList.push(productsObj[productIndex])
      : (orderList[productListIndex].count += 1);
  } else {
    orderList.push(productsObj[productIndex]);
  }

  sessionStorage.setItem("orderList", JSON.stringify(orderList));
}
