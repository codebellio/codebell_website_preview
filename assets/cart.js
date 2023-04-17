class CartView extends CodBellElement {
    constructor() {
        super();
        var component = this
        window.AddCodebellToCart = (item) => {
            try {
                var codebell = JSON.parse(item)
                if (codebell && codebell.ID) {
                    component.add_codebell_to_cart(codebell)
                }
            } catch (error) {
                console.log(error)
                debugger
            }
        }
        window.OrderCodebellNow = (item) => {
            try {
                var codebell = JSON.parse(item)
                if (codebell && codebell.ID) {
                    component.add_codebell_to_cart(codebell)
                    window.location.href = "/order";
                }
            } catch (error) {
                console.log(error)
                debugger
            }
        }
        window.AddPlanToCart = (item) => {
            try {
                var plan = JSON.parse(item)
                if (plan && plan.ID) {
                    component.add_plan_to_cart(plan)
                }
            } catch (error) {
                console.log(error)
                debugger
            }
        }
        window.OrderPlanNow = (item) => {
            try {
                var plan = JSON.parse(item)
                if (plan && plan.ID) {
                    component.add_plan_to_cart(plan)
                    window.location.href = "/order";
                }
            } catch (error) {
                console.log(error)
                debugger
            }
        }
        window.codebell_cart = this
        this.includePageStyle()
    }
    includePageStyle() {
        // TODO : search css included in document and include it here if allowed
        var style = "./spectrum_assets_files/spectrum-template.webflow.1bb7513c7.cs"
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', style);
        linkElem.setAttribute('type', 'text/css');
        linkElem.setAttribute('media', 'screen,projection');
        // Attach the created element to the shadow DOM
        this.shadowRoot.appendChild(linkElem);
    }
    getContent() {
        return `
        <a if="codebells_count || plan" href="/order" class="nav-button w-inline-block" style="
        display: flex;
        padding: 0.5em 1.7em;
        grid-column-gap: 0.3em;
        border-radius: 10em;
        background-color: #fff;
        color: inherit;
    ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <span if="!codebells_count && plan" :text="1" ></span>
            <span if="codebells_count && plan" :text="codebells_count+ 1" ></span>
            <span if="codebells_count && !plan" :text="codebells_count" ></span>
        </a>
        `
    }
    goToPage(blog) {
        var page = JSON.parse(JSON.stringify(blog))
        window.codebell_navigate('/page/' + blog.ID, page)
    }
    getData() {
        var codebells_count = 0
        var codebells = {}
        var codebells_json = localStorage.getItem("codebells")
        if (codebells_json) {
            try {
                codebells = JSON.parse(codebells_json)
            } catch (error) {
                console.log(error)
                codebells = {}
            }
        }
        if (codebells) {
            let ids = Object.keys(codebells);
            ids.forEach((id) => {
                codebells_count += codebells[id].quantity
            });
        }
        var plan = null
        var plan_json = localStorage.getItem("plan")
        if (plan_json) {
            try {
                plan = JSON.parse(plan_json)
            } catch (error) {
                console.log(error)
                plan = null
            }
        }
        if (this.data && this.data.codebells) {
            this.data.codebells = codebells
            this.data.codebells_count = codebells_count
            this.data.plan = plan
        } else {
            return {
                codebells_count: codebells_count,
                codebells: codebells,
                plan: plan,
            }
        }
    }
    add_codebell_to_cart(item) {
        if(item && item.ID){
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
            localStorage.setItem("codebells", JSON.stringify(this.data.codebells))
            this.data.codebells_count++
        }
    }
    add_plan_to_cart(item) {
        if (item && item.ID) {
            this.data.plan = item
            localStorage.setItem("plan", JSON.stringify(this.data.plan))
        }
    }
}
window.customElements.define('cart-view', CartView);