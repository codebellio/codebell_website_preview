class LoadingView extends CodBellElement {
    static get observedAttributes() { return ["value", "full_screen"]; }
    constructor() {
        super();
    }
    on__load() {
        //this.style.display = "block"
    }
    getContent() {
        return `
        <!-- The Loader -->
        <div :class="full_screen?'':'loading-overlay-holder'">
            <style>
                .loading-overlay-holder{
                    position: relative;
                }
                .loading-overlay{
                    position: absolute;
                    display: none;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    backdrop-filter: blur(3px);
                    z-index: 2;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .loading_animation{
                    border: 7px solid transparent;
                    border-radius: 50%;
                    border-left: 7px solid #000;
                    border-top: 7px solid #000;
                    border-bottom: 7px solid #000;
                    max-width: 120px;
                    max-height: 120px;
                    height: 50px;
                    width: 50px;
                    -webkit-animation: spin 2s linear infinite; /* Safari */
                    animation: spin 2s linear infinite;
                }
                /* Safari */
                @-webkit-keyframes spin {
                0% { -webkit-transform: rotate(0deg); }
                100% { -webkit-transform: rotate(360deg); }
                }

                @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
                }
            </style>
            <div if="loading" class="loading-overlay">
                <!-- Modal content -->
                <div class="loading_animation"></div>
            </div>
            <slot><p>Some Content...</p></slot>
        </div>
        `
    }
    getData() {
        return {
            loading: false,
            full_screen : false,
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "value":
                newValue = eval(newValue)
                if (newValue) {
                    this.data.loading = true
                }else{
                    this.data.loading = false
                }
                break;
            case "full_screen":
                if(newValue == "full_screen"){
                    this.data.full_screen = true
                }else{
                    this.data.full_screen = false
                }
            default:
                break;
        }
    }
}
window.customElements.define('loading-view', LoadingView);