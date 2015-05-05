var OtherWindowManager=function(){
    /**
     * Initializes the plugin inside the "other" window
     * @param {type} contentWindow
     * @param {type} isRootDocument
     * @param {type} callback
     * @returns {undefined}
     */
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
    /**
     * Loads the current state into the "other" window
     * @param {type} chromeWindow
     * @returns {undefined}
     */
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