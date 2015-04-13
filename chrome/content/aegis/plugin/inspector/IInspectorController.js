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
        console.log("******************************");
        console.log("***  Inject Inspection Editor");
        console.log("***  url: "+contentWindow.location.href);
        console.log("******************************");
        //Init communication channel with page
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
    },
    toggleInspect:function(){
        console.log("[IInspectorController@plugin] onToggleInspect!!!");
        this.notify("onToggleInspect", {});
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
