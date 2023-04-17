class OrderView extends CodBellElement {
    constructor() {
        super();
        var component = this
        this.includePageStyle()
    }
    includePageStyle() {
        // TODO : search css included in document and include it here if allowed
        var style = "/style4.css"
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', style);
        linkElem.setAttribute('type', 'text/css');
        linkElem.setAttribute('media', 'screen,projection');
        // Attach the created element to the shadow DOM
        this.appendChild(linkElem);
    }
    getContent() {
        return `
<style>
    .order_nav {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 90%;
        overflow: hidden;
        min-height: 142px;

    }

    .order_nav .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70px;
        height: 70px;
        white-space: nowrap;
    }

    .order_nav .step_number {
        min-width: 70px;
        min-height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(111deg, #e0d8d480 0.6%, #aea7a44a 100.62%);
        backdrop-filter: blur(10px);
        border-radius: 40px;
    }

    .order_nav .step.current .step_number {
        background: linear-gradient(111deg, #2F8AB2 0.6%, #2F8AB2 100.62%);
        color : #FFF
    }

    .order_nav .step.success .step_number {
        background: linear-gradient(111deg, #198754 0.6%, #198754 100.62%);
        color : #FFF
    }

    .step_span {
        background: linear-gradient(111deg, #e0d8d480 0.6%, #aea7a44a 100.62%);
        backdrop-filter: blur(10px);
        /* Note: backdrop-filter has minimal browser support */
        width: 270px;
        height: 8px;
        border-radius: 20px;
    }

    .order_nav .step_span.current {
        background: linear-gradient(111deg, #2F8AB2 0.6%, #2F8AB2 100.62%);
    }

    .order_nav .step_span.success {
        background: linear-gradient(111deg, #198754 0.6%, #198754 100.62%);
    }
</style>
<div class="container flex column center">
    <div class="order_nav m-1">
        <div class="step" :class="getClass(order, 'step1')">
            <div class="step_number">1</div>
            <label>Shipping <br /> Details</label>
        </div>
        <div class="step_span" :class="getClass(order, 'step1')"></div>
        <div class="step" :class="getClass(order, 'step2')">
            <div class="step_number">2</div>
            <label>Order <br /> Summary</label>
        </div>
        <div class="step_span" :class="getClass(order, 'step2')"></div>
        <div class="step" :class="getClass(order, 'step3')">
            <div class="step_number">3</div>
            <label>Payment</label>
        </div>
        <div class="step_span" :class="getClass(order, 'step3')"></div>
        <div class="step" :class="getClass(order, 'step4')">
            <div class="step_number">4</div>
            <label>Delivery</label>
        </div>
    </div>
    
    <div if="order.PaymentStatus == 'Done'" class="flex column center" >
        <h3 if="!order.DeliveryMethod"> Thank you for purchase, We will be processing your order soon </h3>
        <h3 if="order.DeliveryMethod && !order.DeliveryStatus"> Thank you for purchase, We are processing your order </h3>
        <h3 if="order.DeliveryMethod && order.DeliveryStatus && !order.DeliveryLink"> 
            Thank you for purchase, We will be dispatching your order with <span :text="order.DeliveryMethod"></span>
        </h3>
        <h3 if="order.DeliveryMethod && order.DeliveryStatus && order.DeliveryLink"> 
            Thank you for purchase, We dispatched your order with <span :text="order.DeliveryMethod"></span>, You can track your order bellow 
        </h3>
    </div>
    <loading-view :value="loading" style="width: 90%;">
    <div class="flex center wrap gap-1" style="align-items: start;">
        <div if="order" style="text-align: left; flex:2;">
            <form if="order.Step == 'step1'" class="flex column order_box" @submit="submit_address" autocomplete="on">
                <h3>Shipping/ Billing Address</h3>
                <div class="flex wrap gap-1">
                    <div class="flex-fill flex column">
                        <label>Name *</label>
                        <input class="input" :value="order.Name" @input="setValue('Name', event )" autocomplete="name">
                        <span :text="name_error" class="input_error"></span>
                    </div>
                    <div class="flex-fill flex column">
                        <label>Mobile Number *</label>
                        <input class="input" :value="order.Mobile" @input="setValue('Mobile', event )" autocomplete="mobile">
                        <span :text="mobile_error" class="input_error"></span>
                    </div>
                    <div class="flex-fill flex column" style="min-width: 70%;">
                        <label>Address *</label>
                        <textarea class="input" :text="order.Address" @input="setValue('Address', event )" autocomplete="street-address"></textarea>
                        <span :text="address_error" class="input_error"></span>
                    </div>
                    <div class="flex-fill flex column">
                        <label>House/ House No./ Apt, Suite *</label>
                        <input class="input" :value="order.Apt" @input="setValue('Apt', event )" autocomplete="address-line1">
                        <span :text="apt_error" class="input_error"></span>
                    </div>
                    <div class="flex-fill flex column">
                        <label>City*</label>
                        <input class="input" :value="order.City" @input="setValue('City', event )" autocomplete="address-level2">
                        <span :text="city_error" class="input_error"></span>
                    </div>
                    <div class="flex-fill flex column">
                        <label>Country*</label>
                        <input class="input" :value="order.Country" @input="setValue('Country', event )" autocomplete="country">
                        <span :text="country_error" class="input_error"></span>
                    </div>
                    <div class="flex-fill flex column">
                        <label>Pin*</label>
                        <input class="input" :value="order.Pin" @input="setValue('Pin', event )" autocomplete="postal-code">
                        <span :text="pin_error" class="input_error"></span>
                    </div>
                    <div class="flex-fill flex column" style="min-width: 70%;">
                        <label>Address Type</label>
                        <div class="flex between m-1">
                            <label for="address_type_checked">
                                <input type="radio" id="address_type_checked" name="address_type_radio"
                                    :checked="order.AddressType =='Home'"
                                    @input="setRadioChecked('AddressType', event, 'Home')">
                                <strong>Home</strong>(All Day Delivery)
                            </label>
                            <label for="address_type_unchecked">
                                <input type="radio" id="address_type_unchecked" name="address_type_radio"
                                    :checked="order.AddressType =='Office'"
                                    @input="setRadioChecked('AddressType', event, 'Office')">
                                <strong>Office</strong>(Delivery Between 10am - 5pm)
                            </label>
                        </div>
                    </div>
                    <div class="flex-fill flex" style="min-width: 70%;">
                        <div class="flex-fill"></div>
                        <button type="submit" class="button">
                            Continue
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 12L8.6 10.55L12.15 7H0V5H12.15L8.6 1.45L10 0L16 6L10 12Z" fill="white" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
            <div if="order.Step != 'step1'" class="flex column gap-1">
                <div class="p-1 order_box">
                    <div class=" flex column">
                        <h3 if="order.Step == 'step2'">Verify Address</h3>
                        <h3 if="order.Step != 'step2'">Delivery Address</h3>
                        <p>
                            <strong :text="order.Name"></strong><br />
                            <span :text="order.Mobile"></span><br />
                            <span :text="order.Apt"></span><br />
                        <pre :text="order.Address" style="white-space: pre-wrap;"></pre>
                        <span :text="order.City"></span>
                        <span :text="order.Country"></span>
                        <strong :text="order.Pin"></strong>
                        </p>
                    </div>
                    <div if="order.Step == 'step2'" class="flex wrap between gap-1 center">
                            <div class="flex-fill flex column">
                                
                            </div>
                            <button type="button" class="button" @click="editAddress">
                                Edit
                            </button>
                        </div>
                </div>
                <form if="order.Step == 'step2'" class="p-1 order_box" @submit="submit_address">
                    <div class=" flex column">
                        <h3>Verify Mobile Number</h3>
                        <p> You may have received otp sms on your mobile number <span :text="order.Mobile"></span>.
                            Please enter it below to verify your mobile number.</p>
                        <div class="flex wrap between gap-1 center">
                            <div class="flex-fill flex column">
                                <label>OTP*</label>
                                <input class="input" @input="setValue('OrderOTP', event )" type="number">
                                <span :text="otp_error" class="input_error"></span>
                            </div>
                            <button type="submit" class="button">
                                Confirm Order and Make Payment
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 12L8.6 10.55L12.15 7H0V5H12.15L8.6 1.45L10 0L16 6L10 12Z" fill="white" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>
                <div if="order.Step == 'step3'" class="p-1 order_box flex column gap-1 center">
                    <button type="submit" class="button half_width_button" @click="payWithCashOnDelivery">
                        Pay with Cash on delivery
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12L8.6 10.55L12.15 7H0V5H12.15L8.6 1.45L10 0L16 6L10 12Z" fill="white" />
                        </svg>
                    </button>
                    <button type="submit" class="button half_width_button" @click="payWithRazorpay">
                        Pay with Razorpay 
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12L8.6 10.55L12.15 7H0V5H12.15L8.6 1.45L10 0L16 6L10 12Z" fill="white" />
                        </svg>
                    </button>
                </div>
                <div class="flex start wrap gap-1">
                    <div if="order.Step == 'step4'" class="p-1 order_box flex column gap-1">
                        <h3>Payment Status</h3>
                        <table>
                            <tr>
                                <th>Method</th>
                                <th> : </th>
                                <td :text="order.PaymentMethod"></td>
                            </tr>
                            <tr>
                                <th>Result</th>
                                <th> : </th>
                                <td :text="order.PaymentResult"></td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <th> : </th>
                                <td :text="order.PaymentStatus"></td>
                            </tr>
                            <tr>
                                <th>Done On </th>
                                <th> : </th>
                                <td :text="getFullDateTime(order.PaymentDoneOn)"></td>
                            </tr>
                            <tr>
                                <th>Received On</th>
                                <th> : </th>
                                <td :text="getFullDateTime(order.PaymentReceivedOn)"></td>
                            </tr>
                        </table>
                    </div>
                    <div if="order.DeliveryMethod" class="p-1 order_box flex column gap-1">
                        <h3>Delivery Status</h3>
                        <table>
                            <tr>
                                <th>Method</th>
                                <th> : </th>
                                <td :text="order.DeliveryMethod"></td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <th> : </th>
                                <td :text="order.DeliveryStatus"></td>
                            </tr>
                            <tr>
                                <th>Dispatched On </th>
                                <th> : </th>
                                <td :text="getFullDateTime(order.DispatchedOn)"></td>
                            </tr>
                            <tr>
                                <th>Delivered On</th>
                                <th> : </th>
                                <td :text="getFullDateTime(order.DeliveredOn)"></td>
                            </tr>
                            <tr>
                                <td colspan="3" style="max-width: 250px;">
                                    <label style="font-size: x-small;" if="!order.DeliveryLink">Shipment Tracking Details will be Available Soon</label> 
                                    <a if="order.DeliveryLink" target="_blank" :href="order.DeliveryLink">Click Here To Track Shipment</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex column order_box gap-1" style="flex:1;">
            <h3 style="text-align: left;">Your Order</h3>
            <div for-loop="codebells_ids.length" class="flex column gap-1">
                <div class="flex center wrap order_box">
                    <div style="height: 100px; width: 100px;">
                        <img :src="codebells[codebells_ids[index]].item.Photo"
                            style="max-height: 100px;max-width: 100px;height: auto;width: auto;margin: auto;" />
                    </div>
                    <div class="flex-fill flex column">
                        <label :text="codebells[codebells_ids[index]].item.Title">Title</label>
                        <div class="flex between center gap-1">
                            <p class="muted"> Count <br> <span
                                    :text="codebells[codebells_ids[index]].quantity"></span>
                            </p>
                            *
                            <p class="muted"> Price <br> ₹<span
                                    :text="codebells[codebells_ids[index]].item.Price"></span>
                            </p>
                            =
                            <p class="muted"> Cost <br> ₹<span
                                    :text="codebells[codebells_ids[index]].item.Price * codebells[codebells_ids[index]].quantity"></span>
                            </p>
                        </div>
                        <div if="order.PaymentStatus != 'Done'" class="flex between">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-cart-plus" viewBox="0 0 16 16"
                                @click="add_codebell_to_cart(codebells[codebells_ids[index]].item)">
                                <path
                                    d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                                <path
                                    d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-cart-dash" viewBox="0 0 16 16"
                                @click="remove_codebell_from_cart(codebells[codebells_ids[index]].item)"
                                style="margin-left: auto;">
                                <path d="M6.5 7a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z" />
                                <path
                                    d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div if="plan" class="flex-fill flex column order_box" style="width: auto;">
                <label :text="plan.Title">Title</label>
                <div class="flex between center gap-1">
                    <p class="muted"> Days: <span :text="plan.Days"></span></p>
                    <p class="muted"> Cost: ₹<span :text="plan.Price"></span></p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-cart-dash" viewBox="0 0 16 16" @click="remove_plan_from_cart(plan)"
                    style="margin-left: auto;">
                    <path d="M6.5 7a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z" />
                    <path
                        d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
            </div>
            <div if="order.Subtotal" class="flex-fill flex column order_box">
                <h3>Total</h3>
                <div class="flex between center gap-1">
                    <span class="muted"> Subtotal</span>
                    <span class="muted"> ₹<span :text="order.Subtotal"></span></span>
                </div>
                <div class="flex between center gap-1">
                    <span class="muted"> Delivery Charges</span>
                    <span class="muted"> ₹<span :text="order.Delivery"></span></span>
                </div>
                <hr />
                <div class="flex between center gap-1">
                    <label> You Pay </label>
                    <label> ₹<span :text="order.Total"></span></label>
                </div>
            </div>
        </div>
    </div>
    </loading-view>
</div>
`
    }
    editAddress() {
        this.data.order.Step = "step1"
    }
    payWithCashOnDelivery(event) {
        event.preventDefault()
        event.stopPropagation()
        this.data.submited = true
        if (this.data.name_error || this.data.mobile_error || this.data.address_error || this.data.apt_error ||
            this.data.city_error || this.data.country_error || this.data.pin_error) {
            window.show_error("Please, Fill in the required information to proceed")
            return
        }
        if (this.data.MobileVerified) {
            window.show_error("Please, verify your mobile first")
            return
        }

        this.data.order.PaymentMethod = "Cash On Delivery"

        if(!this.data.order || !this.data.order.Items || this.data.order.Items == "{}"){
            window.show_error("Cart is empty, Add codebell or plan to purchase")
            return
        }

        this.save_record({
            record: this.data.order,
        })
    }
    getClass(order, step) {
        var div_class = ""
        if (step == "step1" && order && order.UUID) {
            div_class += "success"
        }
        if (step == "step2" && order && order.MobileVerified) {
            div_class += "success"
        }
        if (step == "step3" && order && order.MobileVerified && order.PaymentStatus == 'Done') {
            div_class += "success"
        }
        if (step == "step4" && order && order.DeliveryStatus == 'Delivered') {
            div_class += "success"
        }
        if (order.Step == step) {
            div_class += " current"
        }
        return div_class
    }
    submit_address(event) {
        event.preventDefault()
        event.stopPropagation()
        this.data.submited = true
        if (this.data.name_error || this.data.mobile_error || this.data.address_error || this.data.apt_error ||
            this.data.city_error || this.data.country_error || this.data.pin_error) {
            window.show_error("Please, Fill in the required information to proceed")
            return
        }
        if (this.data.step == "step2" && this.data.otp_error) {
            window.show_error("Please, Entrt OTP to proceed")
            return
        }
        if(!this.data.order || !this.data.order.Items || this.data.order.Items == "{}"){
            window.show_error("Cart is empty, Add codebell or plan to purchase")
            return
        }
        this.save_record({
            record: this.data.order,
        })
    }
    save_record = debounce((request_data) => {
        if (!request_data || !request_data.record  ) return
        this.data.loading = true
        window.call_api("update_order", request_data).then((data) => {
            if (data.Result.Order) {
                if (this.data.order && !this.data.order.UUID) {
                    localStorage.removeItem("codebells")
                    localStorage.removeItem("plan")
                }
                this.data.order = data.Result.Order
                if(this.data.order.Items){
                    var items = JSON.parse(this.data.order.Items)
                    this.data.codebells = items.codebells
                    this.data.codebells_ids = Object.keys(this.data.codebells)
                    this.data.plan = items.plan
                }
                if (this.data.order.UUID) {
                    if (!window.location.search) {
                        window.history.replaceState({}, "", "/order?id=" + this.data.order.UUID)
                    }
                }
            } else {
                this.updateTotal()
            }
            return data
        }).catch((error) => {
            console.error('Error:', error)
        }).finally(() => {
            this.data.loading = false
        })
    }, 300)
    validate_name() {
        if (this.data.submited && !this.data.order.Name.trim()) {
            this.data.name_error = "Please enter valid name"
        } else {
            this.data.name_error = ""
            return true
        }
    }
    validate_mobile() {
        if (this.data.submited && !this.data.order.Mobile.trim()) {
            this.data.mobile_error = "Please enter mobile number"
        } if (this.data.submited && !this.check(this.data.order.Mobile.trim())) {
            this.data.mobile_error = "Please enter valid mobile number"
        } else {
            this.data.mobile_error = ""
            return true
        }
    }
    check(number) {
        if (number.length != 10) {
            return false
        }
        var reg = /^[0-9]{1,10}$/;
        var checking = reg.test(number);

        if (checking) {
            return true;
        } else {
            return false;
        }
    }
    validate_address() {
        if (this.data.submited && !this.data.order.Address.trim()) {
            this.data.address_error = "Please enter valid address"
        } else {
            this.data.address_error = ""
            return true
        }
    }
    validate_apt() {
        if (this.data.submited && !this.data.order.Apt.trim()) {
            this.data.apt_error = "Please enter valid house name or house number or apt no"
        } else {
            this.data.apt_error = ""
            return true
        }
    }
    validate_city() {
        if (this.data.submited && !this.data.order.City.trim()) {
            this.data.city_error = "Please enter valid city"
        } else {
            this.data.city_error = ""
            return true
        }
    }
    validate_country() {
        if (this.data.submited && !this.data.order.Country.trim()) {
            this.data.country_error = "Please enter valid country"
        } else {
            this.data.country_error = ""
            return true
        }
    }
    validate_pin() {
        if (this.data.submited && !this.data.order.Pin.trim()) {
            this.data.pin_error = "Please enter valid pin"
        } else {
            this.data.pin_error = ""
            return true
        }
    }
    validate_otp() {
        if (this.data.submited && (!this.data.order.OrderOTP || !this.data.order.OrderOTP.trim())) {
            this.data.otp_error = "Please enter valid otp"
        } else {
            this.data.otp_error = ""
            return true
        }
    }
    setValue(prop, event) {
        this.data.order[prop] = event.target.value
    }
    setRadioChecked(prop, event, value) {
        if (event.target.checked) {
            this.data.order[prop] = value
        }
    }
    getData() {
        var data = {
            codebells: false,
            plan: false,
            submited: false,
            codebells_ids: [],
            order: {},
            name_error: "",
            mobile_error: "",
            address_error: "",
            apt_error: "",
            city_error: "",
            country_error: "",
            pin_error: "",
            otp_error: "",
            loading : false,
        }
        var codebells_json = localStorage.getItem("codebells")
        if (codebells_json) {
            try {
                data.codebells = JSON.parse(codebells_json)
                data.codebells_ids = Object.keys(data.codebells);
            } catch (error) {
                console.log(error)
                data.codebells = null
                data.codebells_ids = []
            }
        }
        var plan_json = localStorage.getItem("plan")
        if (plan_json) {
            try {
                data.plan = JSON.parse(plan_json)
            } catch (error) {
                console.log(error)
                data.plan = null
            }
        }
        return data
    }
    add_codebell_to_cart(item) {
        if (this.data.codebells[item.ID]) {
            if (this.data.codebells[item.ID]) {
                this.data.codebells[item.ID] = {
                    item: item,
                    quantity: this.data.codebells[item.ID].quantity + 1
                }
            } else {
                this.data.codebells[item.ID] = {
                    item: item,
                    quantity: 1
                }
            }
        }
        this.data.codebells = JSON.parse(JSON.stringify(this.data.codebells))
        if (this.data.codebells) {
            this.data.codebells_ids = Object.keys(this.data.codebells);
        }
        localStorage.setItem("codebells", JSON.stringify(this.data.codebells))
        window.codebell_cart.getData()
        this.updateTotal()
    }
    remove_codebell_from_cart(item) {
        if (this.data.codebells[item.ID]) {
            if (this.data.codebells[item.ID].quantity > 1) {
                this.data.codebells[item.ID] = {
                    item: item,
                    quantity: this.data.codebells[item.ID].quantity - 1
                }
            } else {
                delete this.data.codebells[item.ID]
            }
        }
        if (this.data.codebells) {
            this.data.codebells_ids = Object.keys(this.data.codebells);
        }
        localStorage.setItem("codebells", JSON.stringify(this.data.codebells))
        window.codebell_cart.getData()
        this.updateTotal()
    }
    remove_plan_from_cart() {
        this.data.plan = null
        localStorage.setItem("plan", JSON.stringify(this.data.plan))
        window.codebell_cart.getData()
        this.updateTotal()
    }
    on__load() {
        //window.history.replaceState({}, "", "/")
        var order_id = (new URLSearchParams(location.search)).get("id")
        if (order_id) {
            this.save_record({
                record: {
                    UUID: order_id
                }
            })
        } else {
            this.updateTotal()
        }
    }
    updateTotal() {
        if (!this.data.plan && !this.data.codebells_ids.length) {
            window.location.href = "/";
        } else {
            var Items = {
                codebells: this.data.codebells,
                plan: this.data.plan,
            }
    
            try {
                var items = JSON.stringify(Items)
                if (!this.data.order || !this.data.order.Subtotal) {
                    this.data.order = {
                        Name: "",
                        Mobile: "",
                        Address: "",
                        Apt: "",
                        City: "",
                        Country: "India",
                        Pin: "",
                        AddressType: "Home",
                        Subtotal: 0,
                        Delivery: 50,
                        Total: 0,
                        Step: "step1",
                        Items: items,
                    }
                } else {
                    this.data.order.Subtotal = 0
                }
                this.data.codebells_ids.forEach((id) => {
                    this.data.order.Subtotal += this.data.codebells[id].quantity * this.data.codebells[id].item.Price
                });
                if (this.data.plan) {
                    this.data.order.Subtotal += this.data.plan.Price
                }
                this.data.order.Total = this.data.order.Subtotal + this.data.order.Delivery
            } catch (error) {
                window.show_error("Unable to create cart")
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
                return
            }
        }
    }
    propertyChangedCallback(prop, old_value, new_value) {
        switch (prop) {
            case "loading":
                if (new_value) {
                    this.data.submited = false
                }
                break;
            case "submited":
                this.validate_name()
                this.validate_mobile()
                this.validate_address()
                this.validate_apt()
                this.validate_city()
                this.validate_country()
                this.validate_pin()
                this.validate_otp()
                break;
            case "order.Name":
                this.validate_name()
                break;
            case "order.Mobile":
                this.validate_mobile()
                break;
            case "order.Address":
                this.validate_address()
                break;
            case "order.Apt":
                this.validate_apt()
                break;
            case "order.City":
                this.validate_city()
                break;
            case "order.Country":
                this.validate_country()
                break;
            case "order.Pin":
                this.validate_pin()
                break;
            case "order.OTP":
                this.validate_otp()
                break;
            default:
                break;
        }
    }
}
window.customElements.define('order-view', OrderView);