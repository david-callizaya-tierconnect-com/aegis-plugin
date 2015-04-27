var PluginWindowManager=function(){
    this.init=function(contentWindow, callback){
        try {
            var me=this;
            JavascriptAdapter.init(contentWindow, function(){
                MainController.init(contentWindow, function(chromeWindow){

                });
                RecordingController.init(contentWindow, function(chromeWindow){

                });
                InspectionController.init(contentWindow, function(chromeWindow){
                    chromeWindow.eval("if(typeof bootAegis==='function'){ bootAegis(AEGIS); }");
                    callback(chromeWindow);
                    me.loadState(chromeWindow);
                });
            });

        } catch(ex) {
            console.log(ex);
        }
    };
    this.loadState=function(chromeWindow){
        
    };
}