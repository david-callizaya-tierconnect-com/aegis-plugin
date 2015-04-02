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
            }
        },
        onContentLoaded:function(contentWindow, isRootDocument){
            /**
             * Injects the dom element to do as a bridge
             * between the window and the plugin.
             */
            if(contentWindow.location.host==this.server.host) {
                this.injectTo(contentWindow);
                //disable recording on this page
                return false;
            }
            return true;
        },
        onEditorLoaded:function(editor, contentWindow){
            var aegisBottomPanel=contentWindow.document.getElementById("aegisBottomPanel");
            if(aegisBottomPanel) {
                this.injectTo(aegisBottomPanel);
                this.editors.push(editor);
                this.editor = editor;
            }
        },
        injectTo:function(contentWindow){
            try {
                var document;
                if(typeof contentWindow.contentDocument!="undefined"){
                    document=contentWindow.contentDocument;
                }
                if(typeof contentWindow.document!="undefined"){
                    document=contentWindow.document;
                }
                var ee=document.createElement("b");
                ee.id="a1c622d9c9d1a180f16481caef451589";
                ee.style.display="none";
                var me=this;
                ee.onclick=function(interface,fn){
                    return function(){
                        var res=me.interfaces[interface][fn].apply(
                                me.interfaces[interface],
                                arguments
                            );
                        return Components.utils.cloneInto(
                            res,
                            contentWindow
                        );
                        return res;
                    }
                };
                /*ee.onclick=function(interface,fn){
                    return me.interfaces[interface][fn];
                };*/
                document.body.appendChild(ee);
            } catch(ex) {
                console.log(ex);
            }
        }
    };
