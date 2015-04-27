/* 
 * @author David Callizaya <david.callizaya@coderoad.com>
 */

/*AEGIS*/
var aegis={
        name:"AEGIS",
        version:"0.0.1",
        servers:{
            plugin:"10.100.0.244:8081",
            frontend:"10.100.0.81:78",
            backend:"10.100.0.81:8080"
        },
        mode:"recording",
        editor:null,
        editors:[],
        lastPanelHeight:400,
        onContentLoaded:function(contentWindow, isRootDocument){
            /**
             * Injects the dom element to do as a bridge
             * between the window and the plugin.
             * only for tabs
             */
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
