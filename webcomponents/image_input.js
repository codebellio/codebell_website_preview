class ImageInput extends CodBellElement {
    static get observedAttributes() { return ["value", "max", "radius", "asitis"]; }
    constructor() {
        super();
    }
    getContent() {
        return `
        <loading-view :value="loading">
        <div ref="blog_photo_img_holder" class="flex-column flex-center" style="border-radius: 14px;border: 2px solid #E6EBF2;position: relative;margin: auto; overflow: hidden;">
            <img ref="blog_photo_img" :src="value?value:'/assets/img/empty.jpg'" :style="'height: '+(max)+'px; width: auto; border-radius: 14px;'"/>
            <a href="#" class="btn sm" type="button" @click="load_image" style="color: #FFF;position: absolute;bottom: 4px;right: 4px;background: #00000094;border: navajowhite;border-radius: 14px;padding: 10px;">
                <svg style="height: 1.15em; width: 1.15em;" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.33333 11.6666H2.26667L8.01667 5.91658L7.08333 4.98325L1.33333 10.7333V11.6666ZM10.8667 4.94992L8.03333 2.14992L8.96667 1.21659C9.22222 0.96103 9.53622 0.833252 9.90867 0.833252C10.2807 0.833252 10.5944 0.96103 10.85 1.21659L11.7833 2.14992C12.0389 2.40547 12.1722 2.71392 12.1833 3.07525C12.1944 3.43614 12.0722 3.74436 11.8167 3.99992L10.8667 4.94992ZM9.9 5.93325L2.83333 12.9999H0V10.1666L7.06667 3.09992L9.9 5.93325Z" fill="currentColor"/>
                </svg>
            </a>
        </div>
        <loading-view>
        `
    }
    load_image(event) {
        event.preventDefault()
        event.stopPropagation()
        var component = this
        // <input accept="image/*" type='file' class="btn" @change="load_image"> Change</button>
        if(!this.file_input){
            this.file_input = document.createElement('input');
            this.file_input.type = 'file';
            this.file_input.onchange = (event) => {
                // you can use this method to get file and perform respective operations
                //let files = Array.from(this.file_input.files);
                console.log("File uploded");
                console.log(event.target.files.length);
                if(event.target.files.length){
                    console.log(event.target.files[0]);
                    console.log(event.target.files[0].name);
                    if(event.target.files[0].name.includes(".heic")){                        
                        component.toPngFile(event.target.files[0])
                    }else if(this.data.asitis){
                        const file = event.target.files[0];
                        const reader = new FileReader();

                        reader.addEventListener("load", () => {
                            // convert image file to base64 string
                            debugger
                            component.toDataURL(reader.result);
                        }, false);

                        if (file) {
                            reader.readAsDataURL(file);
                        }
                    }else{
                        component.toDataURL(URL.createObjectURL(event.target.files[0]))
                    }
                }
            };
        }
        this.file_input.click();        
    }
    toPngFile(src, callback){
        debugger
        var filename = src.name.replaceAll(".heic",".png" )
        this.data.loading = true
        heic2any({
            blob: src,
            toType: "image/png",
        }).then((resultBlob) => {
            this.saveFile(resultBlob, filename);
        }).catch((x) => {
            console.log(x)
            window.show_error("Faile to decode image file please upload jpg, jpeg, png type of file orsmaller heic file")
        }).finally(() => {
            this.data.loading = false;
        });
    }
    saveFile(blob, filename) {
        debugger
        var reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
            var base64data = reader.result; 
            this.toDataURL(base64data)
        }
    }
    toDataURL(src) {    
        debugger      
        if(this.data.asitis){
            var event = new InputEvent('input', {
                data: src,
                bubbles: true,
                cancelable: true,
            });
            this.dispatchEvent(event);
        }else{
            var image = new Image();
            image.crossOrigin = 'Anonymous';
            var component = this
            image.onload = (event)=>{
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var height =  image.height
                var width = image.width

                //(x/400) = (height/width)
                // x =  (height/width) * 400
                if(width > component.data.max){
                    height = (height/width) * component.data.max
                    width = component.data.max
                }
                if(height > component.data.max){
                    width = (width/height) * component.data.max
                    height = component.data.max
                }            
                canvas.height = height ;
                canvas.width = width;
                this.refs.blog_photo_img.style.height = height+"px" 
                this.refs.blog_photo_img.style.width = width+"px" 
                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
                var dataURL = canvas.toDataURL('image/png');
                component.data.value = dataURL
                console.log("Image length")
                console.log(component.data.value.length)
                var event = new InputEvent('input', {
                    data: dataURL,
                    bubbles: true,
                    cancelable: true,
                });
                this.dispatchEvent(event);
            };
            image.src = src;
        }
    }
    getData() {
        return {
            loading: false,
            submited: false,
            max : 400,
            asitis : false,
            radius : "17px",
            value : "",
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "value":
                this.data.value = newValue
                break;
            case "max":
                this.data.max = parseInt(newValue)
                break;
            case "radius":
                this.refs.blog_photo_img_holder.style.borderRadius = newValue
                this.refs.blog_photo_img.style.borderRadius = newValue
                break;
            case "asitis":
                this.data.asitis = true
            default:
                break;
        }
    }
}
window.customElements.define('image-input', ImageInput);