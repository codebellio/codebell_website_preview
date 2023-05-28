class TableView extends CodBellElement {
    static get observedAttributes() { return ["api", "delete_api", "sort_by", "desc", "can_add", "can_delete"]; }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "api":
                this.data.api = newValue
                break;
            case "delete_api":
                this.data.delete_api = newValue
                break;
            case "sort_by":
                this.data.sort_by = newValue
                break;
            case "desc":
                var desc = eval(newValue)
                if(desc){
                    this.data.desc = true
                }else{
                    this.data.desc = false
                }
                break;
            case "can_add":
                var can_add = eval(newValue)
                if(can_add){
                    this.data.can_add = true
                }else{
                    this.data.can_add = false
                }
                break;
            case "can_delete":
                var can_delete = eval(newValue)
                if(can_delete){
                    this.data.can_delete = true
                }else{
                    this.data.can_delete = false
                }
                break;
            default:
                break;
        }
    }
    constructor() {
        super();
    }
    toggle_sorting(column){
        if(!column.sortable) return
        if(column.key == this.data.sort_by){
            this.data.desc = !this.data.desc
        }else{
            this.data.sort_by = column.key
        }
    }
    setSearch(event){
        this.doSearch()
    }
    doSearch = debounce(() => {
        this.data.search = this.refs.searchbox.value
    }, 300)
    getContent() {
        return `
        <div class="card" style="max-height: calc(100vh - 98px);">
            <div class="flex-row">
                <div class="flex-row"> Search : <input ref="searchbox" @input="setSearch" type="search" class="sm" style="margin: 0;"></div>
                <div class="flex-row">
                    <button if="can_add" class="btn sm" @click="add_record">Add New</button>
                    <button class="btn sm ml-1" @click="reload">Reload</button>
                    <div class="dropdown hoverable" style="float:right;">
                        <button class="btn sm ml-1">Columns</button>
                        <div class="dropdown-content">
                            <div class="flex-column" for-loop="columns.length">
                                <div class="flex-row">
                                    <div class="switch">
                                        <input type="checkbox" :id="'switch_column_visibility'+(index)" bind @input="setColumnVisibility(index)" :checked="columns[index].visible" >
                                        <label :for="'switch_column_visibility'+(index)"></label>
                                    </div>
                                    <label bind :text="getColumnName(columns[index])"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-column" for-loop="bulk_actions">
                        <button class="btn sm ml-1" @click="do_bulk_action(event, bulk_actions[index])"  :text="getColumnName(bulk_actions[index])">Bulk Action</button>
                    </div>
                </div>
            </div>
            <div class="table_holder">
                <table class="table" title="Table on Plain Background">
                    <thead class="">
                        <tr for-loop="columns.length">
                            <th if="columns[index].visible" @click="toggle_sorting(columns[index])">
                                <svg if="columns[index].sortable && sort_by != columns[index].key" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                                <svg if="columns[index].sortable && sort_by == columns[index].key && !desc" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                                </svg>
                                <svg if="columns[index].sortable && sort_by == columns[index].key && desc" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                                </svg>
                                <label :text="getColumnName(columns[index])"></label>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="" for-loop="records.length">
                        <tr for-loop="columns.length" index_var="column_index">
                            <td if="columns[column_index].visible">
                                <img if="columns[column_index].type && columns[column_index].type == 'image' "
                                    :src="records[index][columns[column_index].key]" />
                                <span if="columns[column_index].type && columns[column_index].type == 'date_time' "
                                    :text="getFullDateTime(records[index][columns[column_index].key])"></span>
                                <span if="columns[column_index].type && columns[column_index].type == 'date' "
                                    :text="getFullDate(records[index][columns[column_index].key])"></span>
                                <button class="btn" if="columns[column_index].type && columns[column_index].type == 'file'" @click="download(records[index][columns[column_index].key])"> Download </button>
                                <span if="columns[column_index].type && columns[column_index].type == 'boolean' ">
                                    <span if='records[index][columns[column_index].key]'
                                        class="badge bg-success">Yes</span>
                                    <span if='!records[index][columns[column_index].key]'
                                        class="badge bg-danger">No</span>
                                </span>
                                <div if="columns[column_index].type && columns[column_index].type == 'actions'" class="btns">
                                    <button class="btn sm" @click="edit_record(event, records[index])">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                        </svg>
                                    </button>
                                    <button if="can_delete" class="btn sm danger" @click="delete_record(event, records[index])">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </button>
                                </div>
                                <span if="!columns[column_index].type"
                                    :text="records[index][columns[column_index].key]"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <list-loader ref="listloader" :api="api" :sort_by="sort_by" :desc="desc" @input="change_page" :search="search"></list-loader>
        </div>
        <modal-view :value="RecordstoDelete.length" @closed="model_updated">
            <div class="flex-column">
                <label if="RecordstoDelete.length == 1" style="font-size: larger;"> Do you want to delete this record ? </label>
                <label if="RecordstoDelete.length > 1" style="font-size: larger;"> Do you want to delete these records ? </label>
                <div if="!loading" class="flex-row p-1" style="justify-content: end; padding-bottom: 0;">
                    <button class="btn sm danger" @click="delete_now">Yes</button>
                    <button class="btn sm ml-1" @click="cancel_delete">No</button>
                </div>
                <label if="loading" class="p-1" if="RecordstoDelete.length == 1"> Ok Deleting ...... </label>
            </div>
        </modal-view>
        `
    }
    download(file){
        debugger
        var file_name = file.split("/").pop()
        saveAs(file, file_name);
    }
    setColumnVisibility(index){
        this.data.columns[index].visible = !this.data.columns[index].visible
        if(!this.data.api) return
        this.visibility = {}
        for (let index = 0; index < this.data.columns.length; index++) {
            this.visibility[this.data.columns[index].key] = this.data.columns[index].visible;            
        }
        localStorage.setItem(this.data.api + "_column_visibility", JSON.stringify(this.visibility) )
    }
    setColumns(columns){
        if(this.data.api){
            var visibility_json = localStorage.getItem(this.data.api + "_column_visibility" )
            try {
                if(visibility_json){
                    this.visibility = JSON.parse(visibility_json)
                }else{
                    this.visibility = {}
                }
            } catch (error) {
                this.visibility = {}
            }
            if(Object.keys(this.visibility).length){
                for (let index = 0; index < columns.length; index++) {
                    if(this.visibility[columns[index].key] != undefined){
                        columns[index].visible = this.visibility[columns[index].key]
                    }         
                }
            }
        }
        this.data.columns = columns
    }
    change_page(event){
        this.data.records = this.refs.listloader.currentData
    }
    getData() {
        return {
            api : "",
            delete_api : "",
            loading : false,
            can_delete : true,
            can_add : true,
            sort_by : "id",
            desc : true,
            search : "",
            records : [],
            RecordstoDelete:[],
            columns :[],
            bulk_actions : [],
        }
    }
    delete_record(event, record){
        this.data.RecordstoDelete.push(record.ID)
    }
    model_updated(event, record){
        this.cancel_delete()
    }
    delete_now(){
        this.deletedata({
            records_to_delete : this.data.RecordstoDelete,
        })
    }
    cancel_delete(){
        this.data.RecordstoDelete = []
    }
    deletedata = debounce((request_data) => {
        if (!request_data) {
            alert("wrong request")
            return
        }
        this.data.loading = true;
        window.call_api(this.data.delete_api, request_data).then((data) => {
            if (data.Status == 2) {
                this.data.RecordstoDelete = []
                this.refs.listloader.reset()
            }
            return data
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            this.data.loading = false;
        });
    }, 300)
    edit_record(event, record){
        this.record_to_edit = record
        var event = new Event('onedit');
        this.dispatchEvent(event);
    }
    do_bulk_action(event, key){
        var event = new Event('on_bulk_action');
        event.data = key
        this.dispatchEvent(event);
    }
    add_record(event){
        var event = new Event('onaddnew');
        this.dispatchEvent(event);
    }
    reload(){
        this.refs.listloader.reload()
    }
}
window.customElements.define('table-view', TableView);