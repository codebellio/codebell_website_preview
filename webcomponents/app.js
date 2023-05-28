class AppDiv extends CodBellElement {
    async call_api(api, request_data) {
        if (!api) {
            return
        }
        if (!request_data) {
            request_data = {}
        }
        var url = "/api/" + api
        if(location.hostname == "localhost"){
            url = "http://api.localhost/api/" + api
        }else{
            url = "https://api.codebell.io/api/" + api
        }
        this.startTimeToConnectToServer = Date.now()
        return fetch(url, {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: JSON.stringify(request_data)
        }).then(response => response.json()).then((data) => {
            console.log(data);
            if (data.Message && data.Message != this.last_message) {
                this.last_message = data.Message
                setTimeout(() => {
                    this.last_message = ""
                }, 1000);
                if (data.Status == 2) {
                    window.show_success(data.Message)
                } else {
                    window.show_error(data.Message)
                }
            }
            return data
        }).catch((error) => {
            window.show_error("Unable to complete current action. " + error.message)
        }).finally(() => {
            this.timeToConnectToServer = Date.now() - this.startTimeToConnectToServer
        })
    }
    getContent() {
        return (`
        <style>
            label {
                color: #4a4a4a;
                line-height: 45px;
            }
        
            input,
            textarea {
                padding: 1em;
                border-radius: 1em;
                width: 300px;
                border: 2px solid #2F8AB2;
                margin-bottom: 1em !important;
            }
        
            .error {
                margin-top: -1em;
                color: red;
                font-size: small;
            }
        
            .orderPopUpOverlay {
                display: flex;
                z-index: 9999;
                position: fixed;
                top: 0px;
                bottom: 0px;
                left: 0px;
                width: 100%;
                margin: auto;
                background: rgb(164 164 164 / 84%);
                background: linear-gradient(132deg, #cacacad4, #c8c8c8);
                align-items: center;
                justify-content: center;
            }
        
            .orderPopUp {
                width: fit-content;
                margin: auto;
                max-width: 80vw;
                max-height: 80vh;
                overflow: auto;
                background-color: rgb(204 204 204 / 65%);
                background: linear-gradient(180deg, #f8f7f3, #f8f7f3);
                backdrop-filter: blur(5px);
                padding: 4em;
                border-radius: 1.63em;
                display: flex;
                flex-direction: column;
                position: relative;
            }
        
            .form_grid {
                display: grid;
                grid-template-columns: auto auto;
                gap: 1em;
            }
        
            @media (max-width: 740px) {
                .orderPopUp {
                    padding: 1em;
                    max-width: 97vw;
                    max-height: 97vh;
                }
            }
        </style>
        <div if="Show" class="orderPopUpOverlay">
            <loading-view :value="loading">
                <form if="!Order" class="orderPopUp" @submit="checkout">
                    <label style="font-weight: 400;font-size: 20px;line-height: 30px; margin-bottom: 1em;">We need your details
                        to continue</label>
                    <div style="display: flex; flex-wrap: wrap; gap: 1em; justify-content: center; padding-bottom: 2em;">
                        <div class="form_grid">
                            <label for="name_input"> Name* </label>
                            <div>
                                <input id="name_input" name="name_input" :value="Name" @input="setValue('Name', event)" type="text" placeholder="Alex">
                                <span class="error" :text="name_error"></span>
                            </div>
        
                            <label for="email_input"> Email* </label>
                            <div>
                                <input id="email_input" name="email_input" :value="Email" @input="setValue('Email', event)" type="text" placeholder="Alex@test.com">
                                <span class="error" :text="email_error"></span>
                            </div>
        
                            <label for="mobile_input"> Mobile* </label>
                            <div>
                                <input id="mobile_input" name="mobile_input" :value="Mobile" @input="setValue('Mobile', event)" type="text" placeholder="Alex">
                                <span class="error" :text="mobile_error"></span>
                            </div>
        
                            <label style="display: flex;grid-column-end: 3;grid-column-start: 1;font-weight: 100;">
                                Optional value to be filled by sales agent.
                            </label>
                            <label for="agent_code_input"> Agent Code </label>
                            <div>
                                <input id="agent_code_input" name="agent_code_input" :value="AgentCode" @input="setValue('AgentCode', event)" type="text" placeholder="optional field">
                                <span class="error" :text="agent_code_error"></span>
                            </div>
                        </div>
                        <div class="form_grid">
                            <label for="address_input"> Address* </label>
                            <div>
                                <textarea id="address_input" name="address_input" :text="Address" @input="setValue('Address', event)" placeholder="Your delivery address" style="height: 94px;"></textarea>
                                <span class="error" :text="address_error"></span>
                            </div>
        
                            <label for="pincode_input"> Postal Pin Code* </label>
                            <div>
                                <input id="pincode_input" name="pincode_input" :value="Pin" @input="setValue('Pin', event)" type="text"
                                    placeholder="pin code / postal code / area code " />
                                <span class="error" :text="pincode_error"></span>
                            </div>
        
                            <label for="city_input"> City* </label>
                            <div>
                                <input id="city_input" name="city_input" :value="City" @input="setValue('City', event)" type="text" placeholder="Delhi" />
                                <span class="error" :text="city_error"></span>
                            </div>
        
                            <label for="country_input"> Country* </label>
                            <div>
                                <input id="country_input" name="country_input" :value="Country" @input="setValue('Country', event)" type="text" placeholder="India" />
                                <span class="error" :text="country_error"></span>
                            </div>
                        </div>
                    </div>
                    <button class="button w-inline-block" style="width: 13em;align-self: flex-end;" type="submit">
                        <div class="text-button" style="color: #f8f8f8">Continue</div>
                    </button>
                </form>
                <div if="Order" class="orderPopUp" style="width: fit-content; max-width:90vw; flex-direction: row; gap:1em; " >
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1em; width: 400px; max-width: 80vw; min-height: 40vh;">
                        <h4><span :text="Order.Name"></span> You are just 1 step away from geting codebell</h4>

                        <div style="margin-top: 2em; width: -webkit-fill-available;">
                            <h5>Price Details</h5>
                            <div if="Order.Subtotal != Order.Total" style="margin: 1em 0;">
                                <b>
                                    <p if="Order.Subtotal" class="subtotal" style="width: 100%;"> 
                                        Sub total 
                                        <span style="float: right;" :text="'₹'+Order.Subtotal">₹00.00</span>
                                    </p>

                                    <p if="Order.Delivery" class="deliveryCharges" style="width: 100%;">
                                        Delivery Charges 
                                        <span style="float: right;" :text="'₹'+Order.Delivery">₹00.00</span>
                                    </p>
                                </b>
                                <b if="Order.Discount" style="display: flex; align-items: center; gap: 0.5em;">
                                    <p id="appliedCouponDetails" style="width: 100%; height: 20px; align-items: center;">
                                        Discount 
                                        <span style="float: right;" :text="'-₹'+Order.Discount">-₹00.00</span>
                                    </p>
                                </b>
                            </div>
                            <div style="height: 1px; background-color: black; margin: 1.5em 0;"></div>
                            <h6 class="finalAmount" style="width: 100%;">
                                You Pay 
                                <strong style="float: right;" :text="'₹'+Order.Total">₹00.00</strong>
                            </h6>
                        </div>

                        <p>Scan the QRcode via any UPI app to make payment of 
                            <span :text="'₹'+order.Total"></span></span>
                        </p>
                        <p>Page will automatically get refreshed after payment got successful</p>
                    </div>
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1em; width: 400px; max-width: 80vw; min-height: 40vh">
                        <img src="/assets/img/Rectangle1.png"/>
                        <p>QR code expire in 5:00 minutes</p>
                        <p>OR</p>
                        <button class="button w-inline-block" style="width: 13em;align-self: flex-end;" type="button" @click="makePayment">
                            <div class="text-button" style="color: #f8f8f8">Make Payment from this device </div>
                        </button>
                    </div>
                </div>
            </loading-view>
        </div>
    `)
    }
    setValue(prop, event) {
        localStorage.setItem(prop,event.target.value)
        this.data[prop] = event.target.value
    }
    getData() {
        return {
            Name : localStorage.getItem("Name"),
            Email : localStorage.getItem("Email"),
            Mobile : localStorage.getItem("Mobile"),
            AgentCode : localStorage.getItem("AgentCode"),
            Address : localStorage.getItem("Address"),
            Pin : localStorage.getItem("Pin"),
            City : localStorage.getItem("City"),
            Country : localStorage.getItem("Country"),
            Show : false,
            Order : false,
            loading : false,
            name_error : "",
            email_error: "",
            mobile_error: "",
            agent_code_error: "",
            address_error: "",
            pincode_error: "",
            city_error: "",
            country_error: "",
            Products : {},
            SelectedProducts : {},
        }
    }
    add_to_cart(){

    }
    buyNow(id){
        debugger
        if(this.data.SelectedProducts[id]){
            this.data.SelectedProducts[id].Count++
            this.data.Show = true
        }else if(this.data.Products[id]){
            this.data.SelectedProducts[id] = this.data.Products[id]
            this.data.SelectedProducts[id].Count = 1
            this.data.Show = true
        }else{
            window.show_error("Invalid Product")
        }
    }
    on__load() {
        window.call_api = (api, request_data = {}) => {
            return this.call_api(api, request_data)
        }
        window.buyNow = (product_id)=>{
            this.buyNow(product_id)
        } 
        
        window.show_error = (message) => {
            Snackbar.show({
                text: message, pos: 'top-center', actionText: 'Ok', backgroundColor: "#dc3545", actionTextColor: "#FFF"
            });
        }

        window.show_success = (message) => {
            Snackbar.show({
                text: message, pos: 'top-center', actionText: 'Ok', backgroundColor: "#198754", actionTextColor: "#FFF"
            });
        }

        window.show_warning = (message) => {
            Snackbar.show({
                text: message, pos: 'top-center', actionText: 'Ok', backgroundColor: "#ffff00", textColor: "#000", actionTextColor: "#000"
            });
        }
        this.getProducts()
    }
    checkout(event){
        event.preventDefault()
        event.stopPropagation()
        if(this.data.loading){
            return
        }
        this.data.loading = true
        var request_data = {
            Name : this.data.Name,
            Email : this.data.Email,
            Mobile : this.data.Mobile,
            AgentCode : this.data.AgentCode,
            Address : this.data.Address,
            Pin: this.data.Pin,
            City: this.data.City,
            Country : this.data.Country,
            products: Object.values(this.data.SelectedProducts)
        }
        window.call_api("place_order", request_data).then((data) => {
            if(data && data.Status == 2 && data.Result.Order){
                this.data.Order = data.Result.Order
            }
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            this.data.loading = false;          
        });
    }
    getProducts(){
        this.data.loading = true
        window.call_api("products", {}).then((data) => {
            if(data && data.Status == 2 && data.data){
                this.data.Products = {}
                data.data.forEach(Product => {
                    this.data.Products[Product.ProductID] = Product
                })
            }
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            this.data.loading = false;          
        });
    }
    makePayment(event){
        event.preventDefault()
        event.stopPropagation()
        this.startPayment()
    }
    async startPayment(){
        // Initialization of PaymentRequest arguments are excerpted for the sake of
        // brevity.
        const methods = [
            {
              supportedMethods: "https://pay.google.com/pay",
            },
          ];
          
        const details = {
            total: {
              label: "Total",
              amount: { value: this.data.Order.Total, currency: "INR" },
            },
          };
        const payment = new PaymentRequest(methods, details, []);
        try {
          const response = await payment.show();
          // Process response here, including sending payment instrument
          // (e.g., credit card) information to the server.
          // paymentResponse.methodName contains the selected payment method
          // paymentResponse.details contains a payment method specific response
          await response.complete("success");
        } catch (err) {
          console.error("Uh oh, something bad happened", err.message);
        }
    };
}
window.customElements.define('app-div', AppDiv);