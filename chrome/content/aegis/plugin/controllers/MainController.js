var MainController = {
    interface:{
        setMode:function(mode){
            aegis.mode=mode;
        },
        getMode:function(){
            return aegis.mode;
        },
        addEventListener:function(obj,event,fn){
            this.addEventListener(obj,event,fn);
        }
    },
    DOMID:"9222668072e3fbe70026460d9470dad6",
    init:function(contentWindow, callback){
        JavascriptAdapter.injectInterfaceTo(
            contentWindow,
            MainController.DOMID, 
            'AEGIS.IController',
            MainController.interface, 
            MainController, 
            function(chromeWindow, document) {
                callback(chromeWindow);
            }
        );
    },
    loadSelected:function(){
        this.notify("loadSelected", {});
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
        for(var i=0,l=this.listeners.length;i<l;i++){
            var item=this.listeners[i];
            if(item.event===event){
                try{
                    item.fn.call(item.obj, data);
                }catch(ex){
                    if(ex.message==="can't access dead object"){
                        this.listeners.splice(i,1);
                        i--;l--;
                    } else {
                        console.log(ex);
                    }
                }
            }
        }
    }
};