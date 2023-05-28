class ListLoader extends CodBellElement {
    static get observedAttributes() { return ["api", "sort_by", "per_page", "desc", "filter", "fix_filter", "search"]; }
    pages = {}
    sort_by = "id"
    desc = true
    filter = false
    fix_filter = false
    search = false
    constructor() {
        super();
    }
    getData() {
        return {
            loading: false,
            api: "",
            perPage : 10,
            currentPage : 1,
            pageTotal : 0,
            Total : 0,
            Filtered : 0,
        }
    }
    reload(){
        if(this.pages[this.data.currentPage]){
            delete this.pages[this.data.currentPage]
        }
        this.change_page(this.data.currentPage)
    }
    reset(){
        if(this.loading_done_once){
            this.pages = {}
            this.data.Total = 0
            this.data.Filtered = 0
            this.change_page(1)
        }
    }
    on_page_change(event){
        if(this.loading_done_once){
            var page_no = parseInt(event.data)
            if(page_no){
                this.change_page(page_no)
            }
        }
    }
    change_page(page_no){
        this.data.currentPage = page_no 
        if(!this.pages[this.data.currentPage]){   
            this.setList([])
            this.loadData({
                page: this.data.currentPage
            })
        }else{
            this.setList(this.pages[this.data.currentPage])
        }
    }
    setList(data){
        this.currentData = data
        this.data.pageTotal = data.length
        var event = new InputEvent('input', {
            data: this.data.currentPage,
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(event);
    }
    loadData = debounce((request_data) => {
        if (!request_data || !request_data.page || !this.api) {
            alert("wrong request")
            return
        }
        if(this.sort_by) {
            request_data.sort = this.sort_by
            request_data.sortdesc = this.desc
        }
        if(this.fix_filter) request_data.fix_filter = this.fix_filter
        if(this.filter) request_data.filter = this.filter
        if(this.search) request_data.search = this.search
        request_data.limit = this.data.perPage
        if(this.data.conditions){
            request_data.fix_condition = this.data.conditions
        }
        this.data.loading = true;
        window.call_api(this.api, request_data).then((data) => {
            if(Array.isArray(data.data)){                
                this.pages[request_data.page] = data.data
                this.data.Total = data.recordsTotal
                this.data.Filtered = data.recordsFiltered
                if(request_data.page == this.data.currentPage){
                    this.setList(this.pages[request_data.page])
                }
            }
            return data
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            this.data.loading = false;
        });
    }, 300)
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "api":
                this.api = newValue
                this.reset()
                break;
            case "sort_by":
                this.sort_by = newValue
                this.reset()
                break;
            case "search":
                this.search = newValue
                this.reset()
                break;
            case "per_page":
                this.data.perPage = newValue
                break;
            case "desc":
                var desc = eval(newValue)
                if(desc){
                    this.desc = true
                }else{
                    this.desc = false
                }
                this.reset()
                break;
            default:
                break;
        }
    }
    propertyChangedCallback(prop, old_value, new_value) {
        switch (prop) {
            case "loading":
                if (!new_value && old_value) {
                    this.loading_done_once = true
                }
                break;
            case "perPage":
                this.reset()
                break;
            default:
                break;
        }
    }
    setPerPage(event){
        this.data.perPage = parseInt(event.target.value)
    }
    getContent() {
        return `
        <div class="flex-row flex-wrap" style="align-items: center;">
            <label>
                Page Size : 
                <select :value="perPage" @input="setPerPage" style="margin: 0;padding: 0.5em;background: transparent;border-radius: 50px;">
                    <option :selected="perPage == 5" value="5">5</option>
                    <option :selected="perPage == 7" value="7">7</option>
                    <option :selected="perPage == 8" value="8">8</option>
                    <option :selected="perPage == 10" value="10">10</option>
                    <option :selected="perPage == 20" value="20">20</option>
                    <option :selected="perPage == 50" value="50">50</option>
                    <option :selected="perPage == 100" value="100">100</option>
                    <option :selected="perPage == 200" value="200">200</option>
                    <option :selected="perPage == 500" value="500">500</option>
                    <option :selected="perPage == 1000" value="1000">1000</option>
                </select>
            </label>
            
            <label if="loading" class="error">Loading...</label>
            <label if="!loading">
                Showing <span bind :text="pageTotal"></span>
                out of <span bind :text="Filtered.toString()"></span>
                <span if="Total > Filtered">(total <span bind :text="Total.toString()"></span>)</span>
            </label>
            <pagination-view if="Total > perPage" @input="on_page_change" :value="currentPage" :max="Filtered/perPage"/>
        </div>
        `
    }
}
window.customElements.define('list-loader', ListLoader);