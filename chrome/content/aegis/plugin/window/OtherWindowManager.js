var OtherWindowManager=function(){
    this.init=function(contentWindow, isRootDocument, callback){
        var me=this;
        if(isRootDocument){
            contentWindow.document.body.style.opacity="0.5";
        }
        IInspectorController.init(contentWindow, function(chromeWindow){
            if(isRootDocument){
                chromeWindow.onfocus=function(){
                    aegis.showPanel();
                }
                chromeWindow.onblur=function(){
                }
            }
            contentWindow.document.body.style.opacity="1";
            
            me.loadState(chromeWindow);
            callback(chromeWindow);
        });
    };
    this.loadState=function(chromeWindow){
        if(aegis.mode==="recording"){
            
        }
        if(aegis.mode==="inspecting"){
            chromeWindow.eval('ADI.activateLookup();');
            console.log("loadSelected@pluginOtherWindow");
            MainController.loadSelected();
        }
    };
}