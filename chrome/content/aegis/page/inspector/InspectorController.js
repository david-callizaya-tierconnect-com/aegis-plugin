/**
 * InspectorController@page
 */
window.AEGIS.InspectorController={
    init:function(Interface, ADI){
        this.addEventListener(
            this,
            "select",
            function(data){
                var xpath = window.AEGIS.utils.getXPathForElement(data.target, data.target.ownerDocument);
                var outerHTML = data.target.outerHTML;
                data.target.setAttribute('style', data.outlinedStyle);
                var outerHTMLWithStyle = data.target.outerHTML;
                data.target.setAttribute('style', data.styleBackup);
                Interface.notify("select", {
                    baseUrl:data.target.ownerDocument.location.href,
                    xpath: xpath,
                    outerHTML: outerHTML,
                    outerHTMLWithStyle: outerHTMLWithStyle
                });
            }
        );
        Interface.addEventListener(
            window.AEGIS.InspectorController,
            "onToggleInspect",
            function(){
                console.log("[InspectorController@page] onToggleInspect!!");
                ADI.toggleLookup();
            }
        );
    },
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
