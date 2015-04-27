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
                data.outlinedStyle = 'outline: 4px solid green; opacity : 0.7; '+data.styleBackup;
                data.target.setAttribute('style', data.outlinedStyle);
                var outerHTMLWithStyle = data.target.outerHTML;
                data.target.setAttribute('style', data.styleBackup);
                //window.AEGIS.Selector.mark(data.target);
                var offset=window.AEGIS.Selector.getOffset(data.target);
                Interface.notify("select", {
                    baseUrl:data.target.ownerDocument.location.href,
                    xpath: xpath,
                    computedStyle: {
                        left:offset.left,
                        top:offset.left,
                        width:data.target.clientWidth,
                        height:data.target.clientHeight
                    },
                    outerHTML: outerHTML,
                    outerHTMLWithStyle: outerHTMLWithStyle
                });
            }
        );
        Interface.addEventListener(
            window.AEGIS.InspectorController,
            "onToggleInspect",
            function(){
                //console.log("[InspectorController@page] onToggleInspect!!");
                window.AEGIS.Selector.clearMarks();
                ADI.toggleLookup();
            }
        );
        Interface.addEventListener(
            window.AEGIS.InspectorController,
            "onActivateLookup",
            function(){
                ADI.activateLookup();
            }
        );
        Interface.addEventListener(
            window.AEGIS.InspectorController,
            "onInactivateLookup",
            function(){
                window.AEGIS.Selector.clearMarks();
                ADI.inactivateLookup();
            }
        );
        Interface.addEventListener(
            window.AEGIS.InspectorController,
            "onSelectAll",
            function(){
                AEGIS.InspectorController.selectAll();
            }
        );
        Interface.addEventListener(
            window.AEGIS.InspectorController,
            "onLoadSelection",
            function(data){
                AEGIS.InspectorController.loadSelection(data.inspectorList);
            }
        );
    },
    selectAll:function(){
        var allDivs=AEGIS.Selector.findNodes(document.body, []);
        allDivs.forEach(function(target){
            var data={
                target:target, 
                outlinedStyle: 'outline: 4px solid green; opacity : 0.7; '+target.getAttribute('style'), 
                styleBackup: target.getAttribute('style')
            };
            AEGIS.InspectorController.notify('select', data);
        });
    },
    loadSelection:function(inspectorList){
        var url=window.location.href;
        window.AEGIS.Selector.clearMarks();
        for(var i=0,l=inspectorList.length;i<l;i++){
            var inspection=inspectorList[i];
            if(inspection.baseUrl===url){
                var dom=window.AEGIS.utils.getElementByXpath(inspection.xpath);
                window.AEGIS.Selector.mark(dom, inspection.type);
            }
        }
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
