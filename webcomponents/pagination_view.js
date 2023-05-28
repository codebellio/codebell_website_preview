class PaginationView extends CodBellElement {
    static get observedAttributes() { return ["value", "max"]; }
    constructor() {
        super();
    }
    getContent() {
        return `
        <div class="pagination">
            <a :href="(current > 1)?'#':''" @click="previous_page(event)">&laquo;</a>
        
            <a if="current > 1" href="#" @click="change_page(event, 1)">1</a>
        
            <a if="current > 3">...</a>
        
            <a if="current > 2" href="#" @click="change_page(event, current - 1)" :text="current - 1"></a>
            <a if="current" class="active" :text="current"></a>
            <a if="max > (current + 1)" href="#" @click="change_page(event, current + 1)" :text="current + 1"></a>
        
            <a if="max > (current + 2)">...</a>
        
            <a if="max > current" href="#" @click="change_page(event, max)" :text="max">6</a>
        
            <a :href="(max > current)?'#':''" href="#" @click="next_page(event)">&raquo;</a>
        </div>
        `
    }
    getData() {
        return {
            current: 0,
            max : 0,
        }
    }
    previous_page(event) {
        this.change_page(event, this.data.current - 1)
    }
    next_page(event) {
        this.change_page(event, this.data.current + 1)
    }
    change_page(event, page_no) {
        event.preventDefault()
        event.stopPropagation()
        if(page_no == this.data.current || page_no < 1 || page_no > this.data.max){
            return
        }
        var event = new InputEvent('input', {
            data: page_no,
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(event);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "value":
                this.data.current = parseInt(newValue)
                break;
            case "max":
                this.data.max = Math.ceil(parseFloat(newValue))
                break;
        
            default:
                break;
        }
    }
}
window.customElements.define('pagination-view', PaginationView);