class RouterView extends HTMLElement {
    constructor() {
        super();
    }
    isConnected
    connectedCallback() {
        this.isConnected = true
        setTimeout(() => {
            if (this.isConnected) {
                this.on__load()
            }
        }, 100);
    }
    disconnectedCallback() {
        this.isConnected = false
    }
    on__load() {
        var component = this
        window.onclick = (e) => {
            try {
                var link_element = component.get_href_link_target(e)
                if (!link_element || link_element.href.trim() == "#") {
                    return
                }
                var url = new URL(link_element.href);
                var path = link_element.href.replace(location.origin, "")
                if (url.hostname != location.host) {
                    e.preventDefault()
                    e.stopPropagation()
                    if (typeof android != "undefined" && android != null) {
                        android.processResult(link_element.href);
                    } else {
                        window.open(link_element.href, '_blank');
                    }
                    return
                } else if (url.pathname == "/back") {
                    e.preventDefault()
                    e.stopPropagation()
                    if (typeof android != "undefined" && android != null) {
                        android.backPressed()
                    } else {
                        if (window.history.length) {
                            window.history.back()
                        } else {
                            codebell_navigate("/home")
                        }
                    }
                    return
                }else if(location.pathname == path){
                    e.preventDefault()
                    e.stopPropagation()
                    return
                }

                var route = component.getRoute(path)
                if (!route) {
                    return
                }
                e.preventDefault()
                e.stopPropagation()
                window.history.pushState({}, "", location.origin + path)
                component.setRoute(route)
            } catch (error) {
                alert("Loading page error : " + error.message);
                console.log(error)
            }
        };
        var path = location.pathname
        var route = component.getRoute(path)
        if (route) {
            component.setRoute(route)
        }
        window.onpopstate = () => {
            const onpopstatepath = window.location.pathname;
            var route = component.getRoute(onpopstatepath)
            if (route) {
                component.setRoute(route)
            }
        };
        window.codebell_goback = () => {
            if (typeof android != "undefined" && android != null) {
                android.backPressed()
            } else {
                if (window.history.length > 1) {
                    window.history.back()
                } else {
                    codebell_navigate("/home")
                }
            }
        }
        window.codebell_navigate = (path, data, replace) => {
            var route = component.getRoute(path)
            if (route) {
                if(replace){
                    window.history.replaceState({}, "", location.origin + path)
                }else{
                    window.history.pushState({}, "", location.origin + path)
                }                
                component.setRoute(route, data)
            } else {
                window.location.href = path
            }
        }
    }
    getRoute(path) {
        for (let index = 0; index < routes.length; index++) {
            const route = routes[index];
            if (path.startsWith(route.path)) {
                if (route.path == "/" && route.path != path) {
                    continue
                }
                return route
            }
        }
    }
    async setRoute(route, data) {
        // if(this.component_element && this.component_element.onExit){
        //     this.component_element.onExit(this, route, data)
        // }
        //this.innerHTML = ""
        /*
        window.import(value.component_path).then(module => {
            module.hello('world');
            var component = document.createElement(value.tag_name);
            component.appendChild(component)
        });
        */

        // dynamically insert script (if doesn't already exist)
        //try {
        //debugger
        //await import(route.component_path);
        //} catch (error) {
        //}
        loadwebcomponents(route.tag_name, route.component_path).then((loded) => {
            if (loded) {
                if (!route.element || !route.element.keep_alive) {
                    route.element = document.createElement(route.tag_name);
                    if (route.element.setProperties) {
                        route.element.setProperties(data)
                    }
                }
                
                // dynamically insert element
                var section = document.createElement("section")
                section.style.left = 0
                section.style.top = 0
                //section.style.overflow = "hidden"
                if (route.element.noTransetion) {                    
                    section.style.opacity = 1
                }else{
                    section.style.opacity = 0
                    section.style.transition = "opacity 0.2s ease 0s, left 0.2s ease 0s"
                }
                section.append(route.element);
                window.codebellpagesection = section
                if (this.firstChild) {
                    var firstChild = this.firstChild
                    firstChild.style.opacity = 0
                    setTimeout(() => {
                        while (this.childElementCount > 1) {
                            this.removeChild(this.firstChild)
                        }
                        section.style.position = ""
                    }, 200);
                }
                this.appendChild(section);
                setTimeout(() => {
                    section.style.opacity = 1
                }, 100);
                if (window.RouteChangeEventHandlers) {
                    for (let index = 0; index < window.RouteChangeEventHandlers.length; index++) {
                        window.RouteChangeEventHandlers[index]({
                            old_route: this.old_route,
                            new_route: route.path,
                            title: route.title,
                        });
                    }
                }
                this.old_route = route.path
            }
        })
    }
    get_href_link_target(event) {
        var path = event.composedPath()
        for (let index = 0; index < path.length; index++) {
            const element = path[index];
            if (element.tagName == "A" || element.tagName == "a") {
                return element
            }
        }
        return false
    }
}
window.customElements.define('router-view', RouterView);