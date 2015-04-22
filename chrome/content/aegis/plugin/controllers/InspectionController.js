/**
 * Ex.
 *  AEGIS.IInspector.toggleInspect();
 * @type type
 */
var InspectionController={
    interface:{
        toggleInspect:function(){
            this.toggleInspect();
        },
        selectAll:function(){
            this.selectAll();
        },
        activateLookup:function(){
            this.activateLookup();
        },
        addEventListener:function(obj,event,fn){
            this.addEventListener(obj,event,fn);
        }
    },
    DOMID:"833742103a68a8b65037bf3fc1130766",
    init:function(contentWindow, callback){
        IInspectorController.addEventListener(
            InspectionController,
            "select",
            InspectionController.onselect
        );
        //JavascriptAdapter.init(contentWindow, function(){
            JavascriptAdapter.injectInterfaceTo(
                contentWindow, 
                InspectionController.DOMID, 
                'AEGIS.IInspector', 
                InspectionController.interface, 
                InspectionController, 
                function(chromeWindow, document) {
                    callback(chromeWindow);
                }
            );
        //});
    },
    onselect:function(data){
        this.notify("select", data);
    },
    toggleInspect:function(){
        IInspectorController.toggleInspect();
    },
    selectAll:function(){
        IInspectorController.selectAll();
    },
    activateLookup:function(){
        IInspectorController.activateLookup();
    },
    //observer pattern
    listeners:[],
    addEventListener:function(obj,event,fn){
        this.listeners.push({obj:obj,event:event,fn:fn});
    },
    removeEventListener:function(obj,event){
        this.listeners = this.listeners.filter(
            function(item) {
                if( (item.obj !== obj) || (item.event !== event) ) {
                    return item;
                }
            }
        );
    },
    notify:function(event, data){
        this.listeners.forEach(function(item){
            if(item.event===event){
                try{
                    item.fn.call(item.obj, data);
                }catch(ex){
                    console.log(ex);
                }
            }
        });
    }
};