var RecordingController = {
    interface:{
        toggleRecord:function(){
            this.toggleRecord();
        },
        addEventListener:function(obj,event,fn){
            this.addEventListener(obj,event,fn);
        }
    },
    DOMID:"ce85dcd1619557a719a74e0af0d37356",
    init:function(contentWindow, callback){
        ISeleniumController.addEventListener(
            RecordingController,
            "record",
            RecordingController.onrecord
        );
        //JavascriptAdapter.init(contentWindow, function(){
            JavascriptAdapter.injectInterfaceTo(
                contentWindow, 
                RecordingController.DOMID, 
                'AEGIS.IRecorder', 
                RecordingController.interface, 
                RecordingController, 
                function(chromeWindow, document) {
                    callback(chromeWindow);
                }
            );
        //});
    },
    onrecord:function(data){
        this.notify("record", data);
    },
    toggleRecord:function(){
        ISeleniumController.toggleRecord();
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