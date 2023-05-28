function getHandler(component, path) {
    return {
        path: path,
        get(target, prop, receiver) {
            if (typeof target[prop] === 'object' && target[prop]) {
                if (!target[prop].isProxy) {
                    var newpath = prop
                    if (this.path) {
                        if (Array.isArray(target)) {
                            newpath = this.path + "[" + prop + "]"
                        } else {
                            newpath = this.path + "." + prop
                        }
                    }
                    // make Proxy
                    target[prop] = new Proxy(target[prop], getHandler(component, newpath))

                    Object.defineProperty(target[prop], "isProxy", {
                        enumerable: false,
                        configurable: false,
                        writable: false,
                        value: true
                    });
                }
            }
            return target[prop];
        },
        set(target, prop, value) {
            var added = false
            if (Array.isArray(target) && target[prop] == undefined) {
                added = true
            }
            var old_value = target[prop]
            if (old_value == value) {
                return true
            }
            target[prop] = value

            var prop_path = prop
            if (this.path) {
                if (Array.isArray(target)) {
                    prop_path = this.path + "[" + prop + "]"
                } else {
                    prop_path = this.path + "." + prop
                }
            }
            if (component.if_elements && component.if_elements.length) {
                //set_ifs.call(component, prop_path)
            }
            if (Array.isArray(target[prop])) {
                //set_for_loops.call(component, prop_path)
            }
            if (Array.isArray(target)) {
                if (added) {
                    //debugger
                    //added_to_for_loops.call(component, this.path, prop)
                    component.processAllElement(this.path, old_value, target)
                } else {
                    component.processAllElement(this.path ? (prop_path) : prop, old_value, target[prop])
                }
            } else {
                component.processAllElement(this.path ? (prop_path) : prop, old_value, target[prop])
            }
            return true
        }
    }
}

class CodBellElement extends HTMLElement {
    constructor() {
        super();
        if (this.getData) {
            this.data = new Proxy(this.getData(), getHandler(this, ""));
        }

        this.local_functions = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
        this.isShadowRoot = true
        var shadow_root = this.getAttribute("shadow_root")
        if (shadow_root == "false") {
            this.isShadowRoot = false
        }
        var ref_matches
        if (this.getContent) {
            if (this.isShadowRoot) {
                const shadowRoot = this.attachShadow({ mode: "open" });
                shadowRoot.innerHTML = this.getContent();
                ref_matches = shadowRoot.querySelectorAll("[ref]");
                this.includePageStyle()
            } else {
                this.innerHTML = this.getContent();
                ref_matches = this.querySelectorAll("[ref]");
            }
        }
        if (!this.refs) {
            this.refs = {}
        }
        if (ref_matches != null) {
            ref_matches.forEach((ref_element) => {
                this.refs[ref_element.getAttribute('ref')] = ref_element
            });
        }
        //setTimeout(() => {
        this.processAllElement()
        //}, 100);
    }
    isConnected
    connectedCallback() {
        this.isConnected = true
        setTimeout(() => {
            if (this.on__load && this.isConnected) {
                this.on__load()
            }
        }, 110);
    }
    disconnectedCallback() {
        this.isConnected = false
        if (this.on__unload) {
            this.on__unload()
        }
    }
    includePageStyle() {
        // TODO : search css included in document and include it here if allowed
        var style = "/spectrum_assets_files/spectrum-template.webflow.1bb7513c7.css"
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', style);
        linkElem.setAttribute('type', 'text/css');
        linkElem.setAttribute('media', 'screen,projection');
        // Attach the created element to the shadow DOM
        this.shadowRoot.appendChild(linkElem);
    }
    // processAllElement = debounce((prop = "") => {
    //     this.processElement(firstElement, prop)
    // }, 300)
    processAllElement(prop, old_value, new_value) {
        var firstElement = this.firstElementChild
        if (this.shadowRoot) {
            firstElement = this.shadowRoot.firstElementChild
        }
        this.processElement(firstElement, prop)
        if (this.propertyChangedCallback) {
            this.propertyChangedCallback(prop, old_value, new_value)
        }
    }
    processElement(element, prop) {
        if (!element) return
        if (!(element.localName == 'script' || element.localName == 'link' || element.localName == 'style')) {

            if (element.localName == "tbody") {
                //debugger
            }
            var new_children = false
            this.checkForRefElement(element)
            // process if
            var old_element = element
            element = this.updateIfBindings(element, prop)
            if (element != old_element) {
                new_children = true
            }
            if (!element || !element.localName) {
                debugger
                console.log(old_element.localName)
                return
            }

            // process for-loop
            if (this.updateForLoopBindings(element, prop)) {
                new_children = true
            }
            // process events
            if (!element.event_binding_done) {
                this.updateEventBindings(element)
            }

            // process bindings
            if (new_children) {
                this.updateBindings(element, "")
            } else {
                this.updateBindings(element, prop)
            }

        }
        if(element.nodeName.includes("-") && element.getAttribute("shadow_root") == "false" ){
            //debugger
            console.log(element.nodeName + " has shadow_root false")
        }else{
            if (element.firstElementChild) {

                if (new_children) {
                    this.processElement(element.firstElementChild, "")
                } else {
                    this.processElement(element.firstElementChild, prop)
                }

            }
        }
        if (element.nextElementSibling) {
            this.processElement(element.nextElementSibling, prop)
        }
    }

    updateEventBindings(binding_element) {
        var component = this
        for (let index = 0; index < binding_element.attributes.length; index++) {
            let attribute = binding_element.attributes[index];
            if (attribute.name.startsWith("@")) {
                let event_string = attribute.name.replace('@', '')
                let method_string = attribute.value
                if (method_string && this[method_string]) {
                    binding_element.addEventListener(event_string, (event) => {
                        // if(binding_element.id == "user_table_view"){
                        //     debugger
                        // }
                        let method_string = binding_element.getAttribute("@" + event.type)
                        this[method_string](event)
                    })
                } else {
                    binding_element.addEventListener(event_string, (event) => {

                        var method_string = binding_element.getAttribute("@" + event.type)
                        if (component.local_functions) {
                            component.local_functions.forEach(local_function => {
                                method_string = method_string.replaceAll(local_function, "this." + local_function)
                            });
                        }
                        let method = new Function("event", Object.keys(component.data), method_string)

                        var values = Object.values(component.data)
                        values.unshift(event)
                        method.apply(component, values)
                    })
                }
                binding_element.event_binding_done = true
            }
        }
    }

    updateBindings(binding_element, prop) {
        for (let index = 0; index < binding_element.attributes.length; index++) {
            const attribute = binding_element.attributes[index];
            if (attribute.name.startsWith(":") && (!prop || attribute.value.includes(prop))) {
                var function_text = attribute.value
                if (this.local_functions) {
                    this.local_functions.forEach(local_function => {
                        function_text = function_text.replaceAll(local_function, "this." + local_function)
                    });
                }
                try {
                    const method = new Function(Object.keys(this.data), "return (" + function_text + ")")
                    const attribute_name = attribute.name.replace(":", "")
                    var new_value = method.apply(this, Object.values(this.data))
                    switch (attribute_name) {
                        case "text":
                            if (binding_element.textContent != new_value)
                                binding_element.textContent = new_value
                            break;
                        case "class":
                            if (new_value) {
                                new_value = new_value.trim()
                            }
                            if (binding_element.last_class && new_value != binding_element.last_class) {
                                let classValues = binding_element.last_class.split(" ")
                                for (let index = 0; index < classValues.length; index++) {
                                    let new_class = classValues[index];
                                    if (new_class) {
                                        binding_element.classList.remove(new_class)
                                    }
                                }
                                binding_element.last_class = ""
                            }
                            if (new_value && new_value != binding_element.last_class) {
                                let classValues = new_value.split(" ")
                                for (let index = 0; index < classValues.length; index++) {
                                    let new_class = classValues[index];
                                    if (new_class) {
                                        binding_element.classList.add(new_class)
                                    }
                                }
                                binding_element.last_class = new_value
                            }
                            break;
                        default:
                            if (!new_value) {
                                if (binding_element.getAttribute(attribute_name)) {
                                    binding_element.removeAttribute(attribute_name)
                                }
                            } else if (binding_element.getAttribute(attribute_name) != new_value)
                                binding_element.setAttribute(attribute_name, new_value)
                            break;
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    checkForRefElement(binding_element){
        var ref_text = binding_element.getAttribute("ref")
        if (ref_text) {
            this.refs[ref_text] = binding_element
        }
    }

    updateIfBindings(binding_element, prop) {
        var function_text = binding_element.getAttribute("if")
        if (function_text && (!prop || function_text.includes(prop))) {
            if (!binding_element.if_not && !binding_element.if_true) {
                binding_element.if_not = this.getIfNotElement(binding_element)
            }

            if (this.local_functions) {
                this.local_functions.forEach(local_function => {
                    function_text = function_text.replaceAll(local_function, "this." + local_function)
                });
            }
            try {
                const method = new Function(Object.keys(this.data), "return (" + function_text + ")")
                const new_value = method.apply(this, Object.values(this.data))
                if (new_value) {
                    if (binding_element.if_true) {
                        if (binding_element.parentNode)
                            binding_element.parentNode.replaceChild(binding_element.if_true, binding_element)
                            binding_element = binding_element.if_true
                    }
                } else {
                    if (binding_element.if_not) {
                        if (binding_element.parentNode)
                            binding_element.parentNode.replaceChild(binding_element.if_not, binding_element)
                            binding_element = binding_element.if_not
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        
        if (binding_element.tagName == "TEMPLATE") {
            var real_element = this.getElementInsideTemplate(binding_element)
            if (real_element) {
                binding_element.parentNode.replaceChild(real_element, binding_element)
                binding_element = real_element
            }
        }
        return binding_element
    }

    getElementInsideTemplate(binding_element) {
        var div_element = document.createElement("div")
        div_element.innerHTML = binding_element.innerHTML
        var real_element = null
        if (div_element.children.length > 1) {
            real_element = div_element
        } else if (div_element.firstElementChild) {
            real_element = div_element.firstElementChild
        }
        if (real_element) {
            real_element.setAttribute("if", binding_element.getAttribute("if"))

            if (binding_element.hasAttribute("class")) {
                real_element.setAttribute("class", binding_element.getAttribute("class"))
            }

            if (binding_element.hasAttribute("style")) {
                real_element.setAttribute("style", binding_element.getAttribute("style"))
            }

            if (binding_element.if_true) {
                real_element.if_true = binding_element.if_true
            }
            if (binding_element.if_not) {
                real_element.if_not = binding_element.if_not
            }
        }
        return real_element
    }

    getIfNotElement(element) {
        var if_not_element
        if (element.nextElementSibling && element.nextElementSibling.hasAttribute("else")) {
            if_not_element = element.nextElementSibling
            if_not_element.parentElement.removeChild(if_not_element)
            if_not_element.removeAttribute("else")
        } else {
            var if_not_element = document.createElement("span")
            if_not_element.style = "display: none !important;"
        }
        if_not_element.setAttribute("if", element.getAttribute("if"))
        if_not_element.if_true = element
        return if_not_element
    }

    // binding_element.getAttribute("for-loop")
    updateForLoopBindings(binding_element, prop) {
        var function_text = binding_element.getAttribute("for-loop")
        if (function_text && (!prop || function_text.includes(prop))) {
            if (!binding_element.forlooptemplate) {
                var forlooptemplate = binding_element.innerHTML

                forlooptemplate = forlooptemplate.trim(" ")
                forlooptemplate = forlooptemplate.trim("\n")
                forlooptemplate = forlooptemplate.trim(" ")

                binding_element.forlooptemplate = forlooptemplate
            }
            binding_element.innerHTML = ""
            if (this.local_functions) {
                this.local_functions.forEach(local_function => {
                    function_text = function_text.replaceAll(local_function, "this." + local_function)
                });
            }
            try {
                const method = new Function(Object.keys(this.data), "return (" + function_text + ")")
                var new_value = method.apply(this, Object.values(this.data))
                if (typeof new_value === 'object' && new_value !== null) {
                    new_value = Object.keys(new_value)
                }
                if (new_value && Array.isArray(new_value)) {
                    new_value = new_value.length
                }
                if (new_value) {
                    new_value = parseInt(new_value)
                } else {
                    new_value = 0
                }
                if (new_value > 0) {
                    for (let index = 0; index < new_value; index++) {
                        var index_var = binding_element.getAttribute("index_var")
                        if (!index_var) {
                            index_var = "index"
                        } else {
                            index_var = index_var.trim(" ")
                        }
                        var forlooptemplate = binding_element.forlooptemplate
                        forlooptemplate = forlooptemplate.replaceAll("[" + index_var + "]", "[" + index + "]")
                        forlooptemplate = forlooptemplate.replaceAll("(" + index_var + ")", "(" + index + ")")
                        let div = document.createElement("div")
                        if (forlooptemplate.startsWith("<th") || forlooptemplate.startsWith("<td")) {
                            div = document.createElement("tr")
                        }
                        if (forlooptemplate.startsWith("<tr")) {
                            div = document.createElement("tbody")
                        }
                        div.innerHTML = forlooptemplate
                        // if(binding_element.debug || binding_element.id == "fields"){
                        //     debugger
                        // }
                        while (div.children.length) {
                            const element = div.children[0];
                            binding_element.appendChild(element)
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }
            return true
        }
        return false
    }
}