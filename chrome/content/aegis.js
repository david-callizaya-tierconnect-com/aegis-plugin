/* 
 * @author David Callizaya <david.callizaya@coderoad.com>
 */

/*AEGIS*/
var aegis={
        name:"AEGIS",
        version:"0.0.1",
        server:{
            host:"10.100.0.207:8081",
            frontend:"10.100.0.137:8080",
        },
        //container:document.getElementById("viewSeleniumIDESidebar").parentNode,
        editor:null,
        editors:[],
        interfaces:{
            recorder:{
                start:function(contentWindow, isRootDocument){
                    console.log( SeleniumIDE.Loader.reloadRecorder(contentWindow, isRootDocument) );
                },
                getWindowId:function(wnd){
                    for(var i=0,l=window.length;i<l;i++){
                        if(window[i]==wnd){
                            return i;
                        }
                    }
                },
                evalua:function(c){
                    return eval(c);
                },
                listCommands:function(){
                    var commands=aegis.editor.getTestCase().commands;
                    var aCommands=[];
                    for(var i=0,l=commands.length;i<l;i++){
                        aCommands.push(commands[i]);
                    }
                    return aCommands;
                }
            },
            main:{
                reloadFrame:function(){
                    var frame=aegis.editor.window.document.getElementById("aegisBottomPanel");
                    frame.reload();
                    aegis.injectTo(frame);
                }
            }
        },
        onContentLoaded:function(contentWindow, isRootDocument){
            /**
             * Injects the dom element to do as a bridge
             * between the window and the plugin.
             * only for tabs
             */
            console.log("[onContentLoaded] "+contentWindow.location.href);
            if(contentWindow.location.host==this.server.host) {
                this.injectTo(contentWindow, function(chromeWindow){
                    chromeWindow.onfocus=function(){
                        aegis.setContainerHeight(1);
                    }
                    chromeWindow.onblur=function(){
                        //aegis.setContainerHeight(1);
                    }
                });
                //disable recording on this page
                return false;
            } else if(contentWindow.location.host==this.server.frontend) {
                this.injectTo(contentWindow, function(){
                    chromeWindow.onfocus=function(chromeWindow){
                        aegis.setContainerHeight(1);
                    }
                    chromeWindow.onblur=function(){
                        //aegis.setContainerHeight(1);
                    }
                });
                //disable recording on this page
                return false;
            } else {
                IInspectorController.init(contentWindow, function(chromeWindow){
                    chromeWindow.onfocus=function(){
                        aegis.setContainerHeight(400);
                    }
                    chromeWindow.onblur=function(){
                        //aegis.setContainerHeight(1);
                    }
                });
            }
            return true;
        },
        onLoadEditorIframe:function(browser){
            //TODO: catch a subEditor frame's reload
            console.log("---------------");
            console.log(browser);
        },
        onEditorLoaded:function(editor, contentWindow){
            var aegisBottomPanel=contentWindow.document.getElementById("aegisBottomPanel");
            contentWindow.ISeleniumController=ISeleniumController;
            if(aegisBottomPanel) {
                this.injectTo(aegisBottomPanel);
                this.editors.push(editor);
                this.editor = editor;
            }
        },
        injectTo:function(contentWindow, callback){
            try {
                JavascriptAdapter.init(contentWindow, function(){
                    RecordingController.init(contentWindow, function(chromeWindow){

                    });
                    InspectionController.init(contentWindow, function(chromeWindow){
                        chromeWindow.eval("if(typeof bootAegis==='function'){ bootAegis(AEGIS); }");
                        callback(chromeWindow)
                    });
                });
                
            } catch(ex) {
                console.log(ex);
            }
        },
        setContainerHeight:function(height){
            var container=aegis.container;
            if(typeof container==="undefined" || !container){
                container=document.getElementById("viewSeleniumIDESidebar").parentNode;
            }
            if(typeof container!=="undefined" && container){
                container.height=height;
            }
        }
    };
