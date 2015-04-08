/* 
 * @author David Callizaya <david.callizaya@coderoad.com>
 */

/*AEGIS*/
var aegis={
        name:"AEGIS",
        version:"0.0.1",
        server:{
            host:"localhost:8081"
        },
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
             */
            console.log("[onContentLoaded] "+contentWindow.location.href);
            if(contentWindow.location.host==this.server.host) {
                this.injectTo(contentWindow);
                //disable recording on this page
                return false;
            } else {
                IInspectorController.init(contentWindow);
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
        injectTo:function(contentWindow){
            try {
                JavascriptAdapter.init(contentWindow, function(){
                    RecordingController.init(contentWindow, function(chromeWindow){

                    });
                    InspectionController.init(contentWindow, function(chromeWindow){
                        chromeWindow.eval("if(typeof bootAegis==='function'){ bootAegis(AEGIS); }");
                    });
                });
                
            } catch(ex) {
                console.log(ex);
            }
        }
    };
