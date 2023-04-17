// module "binding.js"

function init_component_with_shadow(style) {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const div = document.createElement('div');
    div.innerHTML = this.getContent();
    shadowRoot.appendChild(div.firstElementChild);

    // Apply external styles to the shadow DOM
    if(style){
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', style);
        linkElem.setAttribute('type', 'text/css');
        linkElem.setAttribute('media', 'screen,projection');
        // Attach the created element to the shadow DOM
        shadowRoot.appendChild(linkElem);
    }    
    setup_component.call(this, shadowRoot)
}

export default function init_component() {
    this.innerHTML = this.getContent();
    setup_component.call(this, this)
}

function collect_if_templates(html_element = document) {
    const if_elements = html_element.querySelectorAll("[if]");
    if_elements.forEach(element => {
        const condition = element.getAttribute("if")
        if (!condition) {
            console.log("invalid if attribute value")
            return
        }
        const if_element = {
            template: element,
            parentElement: element.parentElement,
            nextElement: element.nextElementSibling,
            commentElement: document.createComment("if comment"),
            condition: condition,
        }
        if (!this.if_elements) {
            this.if_elements = []
        }
        this.if_elements.push(if_element)
        if_element.template.parentElement.replaceChild(if_element.commentElement, if_element.template)
    });
}

function collect_for_loop_templates(html_element = document) {
    const for_loop_elements = html_element.querySelectorAll("[for-loop]");
    for_loop_elements.forEach(element => {
        const array_name = element.getAttribute("for-loop")
        if (!array_name) {
            console.log("invalid for-loop attribute value")
            return
        }
        const for_loop_element = {
            template: element,
            parentElement: element.parentElement,
            array_name: array_name,
        }
        if (!this.for_loop_elements) {
            this.for_loop_elements = []
        }
        this.for_loop_elements.push(for_loop_element)

        element.parentElement.removeChild(element)
    });
}

function setup_component(html_element) {
    collect_for_loop_templates.call(this, html_element)
    this.html_element = html_element
    const component = this;
    this.data = new Proxy(this.getData(), getHandler(component, ""));
    this.local_functions = getClassProperties(this);

    const ref_matches = html_element.querySelectorAll("[ref]");

    if (!component.refs) {
        component.refs = {}
    }
    ref_matches.forEach((ref_element) => {
        component.refs[ref_element.getAttribute('ref')] = ref_element
    });

    component.binding_matches = Array.from(html_element.querySelectorAll("[bind]"));

    set_bindings.call(component, component.binding_matches, html_element)

    set_for_loops.call(component)

    collect_if_templates.call(component, html_element)
    if(this.if_elements && this.if_elements.length){
        set_ifs.call(component)
    }
}

function set_bindings(binding_matches, parentTemplate) {
    if (!binding_matches) return
    const component = this;
    binding_matches.forEach((binding_element) => {
        binding_element.parentTemplate = parentTemplate
    })
    update_view.call(component, "", binding_matches)
    binding_matches.forEach((binding_element) => {
        for (let index = 0; index < binding_element.attributes.length; index++) {
            const attribute = binding_element.attributes[index];
            if (attribute.name.startsWith("@")) {
                const event_string = attribute.name.replace('@', '')
                var method_string = attribute.value
                if (method_string && this[method_string]) {
                    binding_element.addEventListener(event_string, (event) => {
                        component.event_by = binding_element
                        this[method_string](event)
                        component.event_by = null
                    })
                } else {

                    if (this.local_functions) {
                        this.local_functions.forEach(local_function => {
                            method_string = method_string.replaceAll(local_function, "this." + local_function)
                        });
                    }
                    const method = new Function("event", Object.keys(component.data), method_string)
                    binding_element.addEventListener(event_string, (event) => {
                        var values = Object.values(component.data)
                        values.unshift(event)
                        component.event_by = binding_element
                        method.apply(this, values)
                        component.event_by = null
                    })
                }
            }
        }
    });
}

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

            target[prop] = value

            var prop_path = prop
            if (this.path) {
                if (Array.isArray(target)) {
                    prop_path = this.path + "[" + prop + "]"
                } else {
                    prop_path = this.path + "." + prop
                }
            }
            if(component.if_elements && component.if_elements.length){
                set_ifs.call(component, prop_path)
            }
            if (Array.isArray(target[prop])) {
                set_for_loops.call(component, prop_path)
            }
            if (Array.isArray(target)) {
                if (added) {
                    added_to_for_loops.call(component, this.path, prop)
                }
            } else {
                update_view.call(component, this.path ? (prop_path) : prop, component.binding_matches)
            }
            return true
        }
    }
}

function update_view(prop = "", binding_matches) {
    if (!binding_matches) return
    if (!this.debounce_update_view) {
        this.debounce_update_view = {}
    }
    if (!this.debounce_update_view[prop]) {
        this.debounce_update_view[prop] = debounce((prop = "", binding_matches) => {
            if (!binding_matches) return
            binding_matches.forEach((binding_element) => {
                if (!binding_element.parentTemplate ) {
                    debugger
                }
                if (!binding_element.parentTemplate.parentElement ) {
                    return
                }
                if (binding_element != this.event_by) {
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
                                switch (attribute_name) {
                                    case "text":
                                        binding_element.textContent = method.apply(this, Object.values(this.data))
                                        break;
                                    case "class":
                                        if (binding_element.last_class) {
                                            binding_element.classList.remove(binding_element.last_class)
                                            binding_element.last_class = ""
                                        }
                                        const class_calculated = method.apply(this, Object.values(this.data))
                                        if (class_calculated) {
                                            binding_element.classList.add(class_calculated)
                                            binding_element.last_class = class_calculated
                                        }
                                        break;
                                    default:
                                        binding_element[attribute_name] = method.apply(this, Object.values(this.data))
                                        break;
                                }
                            } catch (error) {
                                console.log(error)
                                //debugger
                            }
                        }
                    }
                } else {
                    //console.log("skiping same element")
                }
            })
        }, 100)
    }
    this.debounce_update_view[prop](prop, binding_matches)
}

function set_for_loops(prop = "") {
    if (!this.for_loop_elements) return
    this.for_loop_elements.forEach((for_loop_element) => {
        if (prop && !for_loop_element.array_name.includes(prop)) { return }
        for_loop_element.parentElement.innerHTML = ""
        const method = new Function(Object.keys(this.data), "return (" + for_loop_element.array_name + ")")
        var loop_array = method.apply(this, Object.values(this.data))
        if (loop_array && Array.isArray(loop_array)) {
            for (let index = 0; index < loop_array.length; index++) {
                set_index_binding.call(this, for_loop_element, index)
            }
        }
    })
}

function added_to_for_loops(prop, index) {
    if (!this.for_loop_elements) return
    this.for_loop_elements.forEach((for_loop_element) => {
        if (prop && !for_loop_element.array_name.includes(prop)) { return }
        if (this.data[for_loop_element.array_name] && Array.isArray(this.data[for_loop_element.array_name])) {
            set_index_binding.call(this, for_loop_element, index)
        }
    })
}

function set_index_binding(for_loop_element, index) {
    let template_text = for_loop_element.template.outerHTML
    template_text = template_text.replaceAll("-index-", index)
    let div = document.createElement("div")
    if(template_text.startsWith("<th") || template_text.startsWith("<td")){
        div = document.createElement("tr")
    }
    div.innerHTML = template_text
    let clone = div.firstElementChild
    clone.setAttribute("index", index)
    for_loop_element.parentElement.appendChild(clone)
    var binding_matches = clone.querySelectorAll("[bind]");
    binding_matches = Array.from(binding_matches)
    if (clone.hasAttribute('bind')) {
        clone.parentTemplate = clone
        binding_matches.push(clone)
    }
    set_bindings.call(this, binding_matches, clone)
    this.binding_matches.push(...binding_matches)
}

function set_ifs(prop = "") {
    if (!this.if_elements) return
    this.if_elements.forEach((if_element) => {
        if (prop && !if_element.condition.includes(prop)) { return }

        var function_text = if_element.condition
        if (this.local_functions) {
            this.local_functions.forEach(local_function => {
                function_text = function_text.replaceAll(local_function, "this." + local_function)
            });
        }
        const method = new Function(Object.keys(this.data), "return (" + function_text + ")")
        const is_showed = method.apply(this, Object.values(this.data))

        if (is_showed && !if_element.template.parentElement) {
            if_element.parentElement.replaceChild(if_element.template, if_element.commentElement)
        } else if (!is_showed && if_element.template.parentElement) {
            if_element.template.parentElement.replaceChild(if_element.commentElement, if_element.template)
        }
    })
}

function getClassProperties(instanceOfClass) {
    const proto = Object.getPrototypeOf(instanceOfClass);
    const names = Object.getOwnPropertyNames(proto);
    return names.filter(name => name != 'constructor');
}

export { init_component, init_component_with_shadow, setup_component, getClassProperties, set_for_loops, set_ifs };