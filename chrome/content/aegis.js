/* 
 * @author David Callizaya <david.callizaya@coderoad.com>
 */

/*AEGIS*/
var aegisSettings=Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.aegis.");
var aegis={
        name:"AEGIS",
        version:"0.0.1",
        settings:aegisSettings,
        apikey:aegisSettings.prefHasUserValue("apikey")?aegisSettings.getCharPref("apikey"):"9222668072e3fbe70026460d9470dad6",
        servers:{
            /**
             * Plugin web resources
             * @type String
             */
            plugin:aegisSettings.prefHasUserValue("pluginServer")?aegisSettings.getCharPref("pluginServer"):"52.6.171.25",
            /**
             * Front end
             * @type String
             */
            frontend:aegisSettings.prefHasUserValue("frontendServer")?aegisSettings.getCharPref("frontendServer"):"localhost:8080",
            /**
             * Selenium WebDriver Server
             * @type String
             */
            selenium:aegisSettings.prefHasUserValue("backendServer")?aegisSettings.getCharPref("backendServer"):"52.6.171.25:8080",
            /**
             * chrome://aegis plugin resources
             * @type String
             */
            aegis:"aegis"
        },
        mode:"recording",
        editor:null,
        editors:[],
        lastPanelHeight:420,
        onContentLoaded:function(contentWindow, isRootDocument){
            /**
             * Injects the dom element to do as a bridge
             * between the window and the plugin.
             * only for tabs
             */
            if(contentWindow.location.protocol==="chrome:"){
                return false;
            }
            for(var i in aegis.servers) {
                if(typeof aegis.servers[i]==="string"){
                    if(contentWindow.location.host===aegis.servers[i]){
                        var manager=new PluginWindowManager();
                        manager.init(contentWindow, function(chromeWindow){
                            chromeWindow.onfocus=function(){
                                aegis.hidePanel();
                            }
                            aegis.hidePanel();
                        });
                        return false;
                    }
                }
            }
            var manager=new OtherWindowManager();
            manager.init(contentWindow, isRootDocument, function(chromeWindow){
                aegis.showPanel();
            });
            return true;
        },
        onLoadEditorIframe:function(browser){
            //TODO: catch a subEditor frame's reload
        },
        onEditorLoaded:function(editor, contentWindow){
            var aegisBottomPanel=contentWindow.document.getElementById("aegisBottomPanel");
            contentWindow.ISeleniumController=ISeleniumController;
            if(aegisBottomPanel) {
                var manager=new PluginWindowManager();
                manager.init(aegisBottomPanel, function(chromeWindow){ });
                this.editors.push(editor);
                this.editor = editor;
            }
        },
        onPlayDone:function(seleniumJob, result){
            if(typeof this.waitPlayDoneFn==="function"){
                this.waitPlayDoneFn(seleniumJob, result);
            }
        },
        waitPlayDoneFn:function(seleniumJob, result){},
        waitPlayDone:function(fn){
            this.waitPlayDoneFn=fn;
        },
        showPanel:function(){
            var height=this.getContainerHeight();
            if(height===null){
            } else {
                if(height<=1) height=aegis.lastPanelHeight;
                this.setContainerHeight(height);
            }
        },
        hidePanel:function(){
            var height=this.getContainerHeight();
            if(height>100) aegis.lastPanelHeight=height;
            this.setContainerHeight(1);
        },
        setContainerHeight:function(height){
            var container=aegis.container;
            if(typeof container==="undefined" || !container){
                container=document.getElementById("viewSeleniumIDESidebar").parentNode;
            }
            if(typeof container!=="undefined" && container){
                container.height=height;
            }
        },
        getContainerHeight:function(){
            var container=aegis.container;
            if(typeof container==="undefined" || !container){
                container=document.getElementById("viewSeleniumIDESidebar").parentNode;
            }
            if(typeof container!=="undefined" && container){
                return container.height;
            }
            return null;
        }
    };