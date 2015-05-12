var IInspectorController={
    interface:{
        init:function(){},
        notify:function(event, data){
            this.notify(event, data);
        },
        addEventListener:function(obj,event,fn){
            this.addEventListener(obj,event,fn);
        }
    },
    DOMID:"c5f978011b1d413128379aaa1d8463d3",
    init:function(contentWindow, callback){
        //console.log("******************************");
        //console.log("***  Inject Inspection Editor");
        //console.log("***  url: "+contentWindow.location.href);
        //console.log("******************************");
        
        //Initialize communication channel with page
        JavascriptAdapter.init(contentWindow, function(){
            JavascriptAdapter.injectInterfaceTo(
                contentWindow, 
                IInspectorController.DOMID, 
                'AEGIS.IInspectorController',
                IInspectorController.interface, 
                IInspectorController, 
                function(chromeWindow, document) {
                }
            );
            //Inject Inspector's css and js
            DOMInjector.readInjectCssTo(
                contentWindow,
                'chrome://selenium-ide/content/DOM-inspector-master/acid-dom/css/acid_dom.css',
                function(chromeWindow, document, nodes){
                    DOMInjector.readInjectJavascriptTo(
                        contentWindow,
                        'chrome://selenium-ide/content/aegis/page/inspector/utils.js?t='+new Date().getTime(),
                        function(window, document, nodes){}
                    );
                    DOMInjector.readInjectJavascriptTo(
                        contentWindow,
                        'chrome://selenium-ide/content/aegis/page/inspector/Selector.js?t='+new Date().getTime(),
                        function(window, document, nodes){}
                    );
                    DOMInjector.readInjectJavascriptTo(
                        contentWindow,
                        'chrome://selenium-ide/content/aegis/page/inspector/InspectorController.js?t='+new Date().getTime(),
                        function(window, document, nodes) {
                            DOMInjector.readInjectJavascriptTo(
                                contentWindow,
                                'chrome://selenium-ide/content/DOM-inspector-master/acid-dom/js/acid_dom.js?t='+new Date().getTime(),
                                function(chromeWindow, document, nodes) {
                                    callback(chromeWindow);
                                }
                            );
                        }
                    );
                }
            );
        });
        this.addEventListener(this, "onNoAjax", this.onNoAjax);
    },
    toggleInspect:function(){
        this.notify("onToggleInspect", {});
    },
    selectAll:function(){
        this.notify("onSelectAll", {});
    },
    activateLookup:function(){
        this.notify("onActivateLookup", {});
    },
    inactivateLookup:function(){
        this.notify("onInactivateLookup", {});
    },
    loadSelection:function(inspectorList){
        this.notify("onLoadSelection", {inspectorList:inspectorList});
    },
    //Wait for ajax
    waitAjaxQueue:[],
    waitForNoAjax:function(fn){
        if(typeof fn==="function"){
            console.log("WAITING FOR NO AJAX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log("notifing to: "+this.listeners.length);
            console.log(this.listeners);
            IInspectorController.waitAjaxQueue.push(fn);
            console.log(IInspectorController.waitAjaxQueue);
            this.notify("onWaitForNoAjax", {fn:fn.toString()});
        }
    },
    onNoAjax:function(){
        console.log("COOL NO AJAX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(IInspectorController.waitAjaxQueue);
        for(var i=0,l=IInspectorController.waitAjaxQueue.length;i<l;i++){
            IInspectorController.waitAjaxQueue[i]();
        }
        IInspectorController.waitAjaxQueue.length=0;
    },
    //OBSERVER PATTERN
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
            try{
                var item=this.listeners[i];
                if(item.event===event){
                    item.fn.call(item.obj, data);
                }
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
};
