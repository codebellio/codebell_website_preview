class ModalView extends CodBellElement {
    static get observedAttributes() { return ["value", "closable", "from_bottom"]; }
    constructor() {
        super();
    }
    getContent() {
        return `
        <div class="modal-holder" :class="getClass(from_bottom, isopen) ">
            <div class="modal-bg" @click="close_modal" tabindex="1"></div>
            <div class="modal-content" :class="isopen?'animate__animated animate__slideInUp':''">
                <button if="closable" type="button" class="modal-close" @click="close_modal"></button>
                <slot><p>Some text in the Modal..</p></slot>                    
            </div>
        </div>
        `
    }
    getClass(from_bottom, isopen){
        var class_to_return = ""
        if(isopen){
            class_to_return = "open"
        }else{
            class_to_return = "closed"
        }
        if(from_bottom){
            class_to_return += " from_bottom"
        }
        return class_to_return
    }
    close_modal(event, override){
        if(this.data.closable || override ){
            this.data.isopen = false
            var event = new Event('closed', {
                data: false,
                bubbles: true,
                cancelable: true,
            });
            this.dispatchEvent(event);
        }
    }
    open_modal(event){
        this.data.isopen = true
        var event = new Event('opened', {
            data: true,
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(event);
    }
    getData() {
        return {
            error: false,
            success: false,
            closable: true,
            isopen : false,
            from_bottom : false,
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "value":
                if (newValue) {
                    this.open_modal()
                }else{
                    this.close_modal(null, true)
                }
                break;
            case "closable":
                this.data.closable = !!newValue
                break;
            case "from_bottom":
                this.data.from_bottom = !!newValue
                break;
            default:
                break;
        }
    }
}
if(customElements.get('modal-view') === undefined) window.customElements.define('modal-view', ModalView);