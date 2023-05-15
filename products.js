const productsObj = {
  1: {
    ProductID: 1,
    Title: "Codebell for Home",
    Photo: "./assets/img/3.5x5.png",
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
    Photo: "./assets/img/cccproduct2.png",
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
    Photo: "./assets/img/v1.png",
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
    productWrapperElem.innerHTML += `
                <div class="section wf-section product ${index}">
                  <div class="content">
                      <div class="w-layout-grid grid-focus-left">
                          <div class="focus-separate">
                              <div class="block-heading">
                                  <h2 class="heading">${
                                    products.Title
                                  }</span></h2>
                                  <div class="subtitle">
                                      <div class="text-subtitle">₹${
                                        products.Price
                                      }</div>
                                  </div>
                              </div>
                              <p class="paragraph">${products.Summary} 
                              </p>
                              <div style="display: flex; gap: 1em; color: white;">

                              <a href="/${products.Keyword}">
                              <div class="circle-button">
                                <span class="link-circle-button w-inline-block">
                                  <img
                                      src="./spectrum_assets_files/6392a552e9d57182f30245c9_arrow_dark.svg"
                                      loading="eager" alt="" class="icon-button">
                                </span>
                                <div class="text-button">Learn more</div>
                              </div>
                              </a>
  
                                  <button class="button" onclick="order(${
                                    index + 1
                                  }, 'addToCart'), setProductCount()" class="button w-inline-block"
                                      style="width: max-content; margin: auto 0 0 auto;">
                                      <div class="text-button" style="color: #f8f8f8">Add to Cart</div>
                                  </button>
                              </div>
                          </div>
                          <div class="app-focus-separate no_sm_mt">
                              <div class="app-focus---wrapper">
                                  <div class="app-focus---content"
                                      style="will-change: transform; transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(23deg) rotateY(-23deg) rotateZ(23deg) skew(0deg, 0deg); transform-style: preserve-3d;">
                                      <div class="app-focus---shadow"></div>
                                      <div class="app-focus---image"><img
                                              src="${products.Photo}"
                                              loading="eager"
                                              sizes="(max-width: 479px) 40vw, (max-width: 991px) 252px, (max-width: 1439px) 280px, (max-width: 1919px) 300px, 320px"
                                              
                                              alt="" class="image-app---focus-1">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
    `;
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
