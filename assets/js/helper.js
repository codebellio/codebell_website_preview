const zeroPad = (num, places) => String(num).padStart(places, '0')
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

function isANumber(str) {
    return !/\D/.test(str);
}

function onlyLettersAndNumbers(str) {
    return /^[A-Za-z0-9]*$/.test(str);
}

window.getFullDateTime = (timestamp) => {
    var date
    if (!timestamp) {
        return "Unknown"
    }
    if (isANumber(timestamp)) {
        timestamp = parseInt(timestamp)
        date = (new Date(timestamp * 1000))
    } else if (typeof (timestamp) == 'string') {
        date = (new Date(timestamp))
    } else if (typeof (timestamp) == "object") {
        date = timestamp
    } else if (timestamp == 0 || timestamp == undefined || timestamp == "") {
        return "Unknown"
    } else {
        date = (new Date(timestamp * 1000))
    }
    return months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() + " - " + (date.getHours() % 12).toString() + ":" + date.getMinutes() + (((date.getHours() / 12) > 1) ? "PM" : "AM")
}

window.getFullDate = (timestamp) => {
    var date
    if (!timestamp) {
        return "Unknown"
    }
    if (isANumber(timestamp)) {
        timestamp = parseInt(timestamp)
        date = (new Date(timestamp * 1000))
    } else if (typeof (timestamp) == 'string') {
        date = (new Date(timestamp))
    } else if (typeof (timestamp) == "object") {
        date = timestamp
    } else if (timestamp == 0 || timestamp == undefined || timestamp == "") {
        return "Unknown"
    } else {
        date = (new Date(timestamp * 1000))
    }
    return months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear()
}

window.getShortDate = (timestamp) => {
    var date
    if (!timestamp) {
        return "Unknown"
    }
    if (isANumber(timestamp)) {
        timestamp = parseInt(timestamp)
        date = (new Date(timestamp * 1000))
    } else if (typeof (timestamp) == 'string') {
        date = (new Date(timestamp))
    } else if (typeof (timestamp) == "object") {
        date = timestamp
    } else if (timestamp == 0 || timestamp == undefined || timestamp == "") {
        return "Unknown"
    } else {
        date = (new Date(timestamp * 1000))
    }
    return months[date.getMonth()] + " " + date.getDate()
}

window.getTime = (timestamp) => {
    var date
    if (!timestamp) {
        return "Unknown"
    }
    if (isANumber(timestamp)) {
        timestamp = parseInt(timestamp)
        date = (new Date(timestamp * 1000))
    } else if (typeof (timestamp) == 'string') {
        date = (new Date(timestamp))
    } else if (typeof (timestamp) == "object") {
        date = timestamp
    } else if (timestamp == 0 || timestamp == undefined || timestamp == "") {
        return "Unknown"
    }
    var hour = date.getHours() % 12
    if (!hour) {
        hour = 12
    }
    return zeroPad(hour, 2) + ":" + zeroPad(date.getMinutes(), 2) + ((((date.getHours() + 1) / 12) > 1) ? "PM" : "AM")
}

window.getTimeWithSeconds = (timestamp) => {
    var hours = Math.floor(timestamp / 3600)
    var one_hour_timestamp = timestamp % 3600
    var minuts = Math.floor(one_hour_timestamp / 60)
    var seconds = one_hour_timestamp % 60
    if (hours > 0) {
        return (zeroPad(hours, 2)).toString() + ":" + (zeroPad(minuts, 2)).toString() + ":" + (zeroPad(seconds, 2)).toString()
    }
    return (zeroPad(minuts, 2)).toString() + ":" + (zeroPad(seconds, 2)).toString()
}

function getSeconds(value) {
    debugger
    var seconds = value
    if (seconds > 1000) {
        seconds = seconds / 1000
    } else {
        seconds = 0
    }
    return seconds
}

String.prototype.trimStart = function (charlist) {
    if (!charlist && charlist != "0") charlist = " ";
    return this.replace(new RegExp("^[" + charlist + "]+"), "");
};

String.prototype.trimEnd = function (charlist) {
    if (!charlist && charlist != "0") charlist = " ";
    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

String.prototype.trim = function (charlist) {
    return this.trimStart(charlist).trimEnd(charlist);
};

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str, newStr) {

        // If a regex pattern
        if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
            return this.replace(str, newStr);
        }

        // If a string
        return this.replace(new RegExp(str, 'g'), newStr);

    };
}

function isEmpty(value) {
    if (value == undefined || value == null || value == 0 || value == "") {
        return true
    } else {
        return false
    }
}

const debounce = (func, delay) => {
    let debounceTimer
    return function () {
        const context = this
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
}

function add_route_change_event_handler(handler) {
    if (!window.RouteChangeEventHandlers) {
        window.RouteChangeEventHandlers = []
    }
    window.RouteChangeEventHandlers.push(handler)
}

function loadwebcomponents(name, link) {
    return new Promise((resolve, reject) => {
        if (!document.getElementById(name)) {
            const script = document.createElement('script');
            script.onload = (link) => {
                resolve(true);
            };
            script.src = link;
            script.type = "module";
            script.id = name;
            document.body.appendChild(script);
        } else {
            resolve(true);
        }
    });
}

function getColumnName(column) {
    var columnTitle = ""
    if (column.title) {
        columnTitle = column.title
    } else if (column.key) {
        columnTitle = column.key
    } else {
        columnTitle = column
    }
    if (columnTitle) {
        //columnTitle = _.camelCase(columnTitle)
        columnTitle = columnTitle.replaceAll("_", " ")
        columnTitle = columnTitle.replace(/([a-z])([A-Z])/g, '$1 $2');
        //columnTitle = columnTitle.replace("_", ' ').trim()
    } else {
        debugger
    }
    return columnTitle
}

Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}



var startX,
    startY,
    dist,
    threshold = 100, //required min distance traveled to be considered swipe
    allowedTime = 1000, // maximum time allowed to travel that distance
    elapsedTime,
    startTime;

window.addEventListener('touchstart', function (event) {
    //touchsurface.innerHTML = ''
    var touchobj = event.changedTouches[0]
    dist = 0
    startX = touchobj.pageX
    startY = touchobj.pageY
    startTime = new Date().getTime() // record time when finger first makes contact with surface
    //e.preventDefault()

    // event.target.addEventListener('touchmove', function(e){
    //     e.preventDefault() // prevent scrolling when inside DIV
    // }, false)

    event.target.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]
        dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
        var swiperightBol = (elapsedTime <= allowedTime && Math.abs(dist) >= threshold && Math.abs(touchobj.pageY - startY) <= 100)

        var dir_str = "none";
        var dir_int = 0;
        if (swiperightBol) {
            if (dist > 0) {
                dir_str = "right";
                dir_int = 1;
            } else {
                dir_str = "left";
                dir_int = 2;
            }

            var _e = new CustomEvent("swap", {
                target: event.target,
                detail: {
                    direction: dir_str,
                    direction_int: dir_int
                },
                bubbles: true,
                cancelable: true
            });

            if (window.SwapEventHandlers && window.SwapEventHandlers) {
                for (let index = 0; index < window.SwapEventHandlers.length; index++) {
                    window.SwapEventHandlers[index](_e);
                }
            }
        }

        //handleswipe(swiperightBol, event.target);
        //event.preventDefault()
    }, false)

    function trigger(elem, name, event) {

        elem.dispatchEvent(event);
        eval(elem.getAttribute('on' + name));
    }

}, false)

window.add_swap_event_handler = (handler) => {
    if (!window.SwapEventHandlers) {
        window.SwapEventHandlers = []
    }
    window.SwapEventHandlers.push(handler)
    return window.SwapEventHandlers.length - 1
}
window.remove_swap_event_handler = (index_to_delete) => {
    if (!window.SwapEventHandlers) {
        return
    }
    if (index_to_delete > -1) {
        window.SwapEventHandlers.splice(index_to_delete, 1);
    }
}