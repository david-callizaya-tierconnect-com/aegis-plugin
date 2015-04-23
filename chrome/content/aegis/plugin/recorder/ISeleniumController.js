var ISeleniumController = {
    interface:{
        init:function(){},
        notify:function(event, data){
            this.notify(event, data);
        },
        addEventListener:function(obj,event,fn){
            this.addEventListener(obj,event,fn);
        }
    },
    init:function(){
        
    },
    toggleRecord:function(){
        aegis.editor.toggleRecordingEnabled();
    },
    activateRecord:function(){
        aegis.editor.toggleRecordingEnabled(true);
    },
    inactivateRecord:function(){
        aegis.editor.toggleRecordingEnabled(false);
    },
    //OBSERVER PATTERN
    listeners:[],
    addEventListener:function(obj,event,fn){
        console.log("[IInspectorController.addEventListener@plugin] ",obj,event,fn);
        console.trace();
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