class NotificationView extends CodBellElement {
    static get observedAttributes() { return ["value", "error", "success", "closable"]; }
    constructor() {
        super();
    }
    getContent() {
        return `
        <div ref="message_box" class="notification warning" style="display:none;">
            <button class="delete" @click="close"></button>
            <span ref="message"></span>
        </div>
        `
    }
    close() {
        this.refs.message_box.style.display = "none"
        var event = new InputEvent('input', {
            data: "",
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
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "value":
                this.refs.message.innerHTML = newValue
                if (newValue) {
                    this.refs.message_box.style.display = "block"
                }else{
                    this.refs.message_box.style.display = "none"
                }
                break;
            case "error":
                if (newValue) {
                    this.refs.message_box.classList.add("error")
                } else {
                    this.refs.message_box.classList.remove("error")
                }
                break;
            case "success":
                if (newValue) {
                    this.refs.message_box.classList.add("success")
                } else {
                    this.refs.message_box.classList.remove("success")
                }
                break;
            default:
                break;
        }
    }
}
window.customElements.define('notification-view', NotificationView);