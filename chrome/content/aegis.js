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
            console.log("---------------------------------------");
            console.log(contentWindow.location.host);
            if(contentWindow.location.host==this.server.host) {
                this.injectTo(contentWindow);
                //disable recording on this page
                return false;
            } else {
                console.log("******************************");
                console.log("***  Inject DOM Inspector  ***");
                console.log("***  url: "+contentWindow.location.href);
                console.log("******************************");
                DOMInjector.readInjectCssTo(
                    contentWindow,
                    'chrome://selenium-ide/content/DOM-inspector-master/acid-dom/css/acid_dom.css',
                    function(window, document, nodes){
                        while(nodes.length>0){
                            document.body.appendChild(nodes[0]);
                        }
                        DOMInjector.readInjectJavascriptTo(
                            contentWindow,
                            'chrome://selenium-ide/content/DOM-inspector-master/acid-dom/js/acid_dom.js',
                            function(window, document, nodes) {
                                while(nodes.length>0){
                                    window.eval(nodes[0].textContent);
                                    document.body.appendChild(nodes[0]);
                                }
                            }
                        );
                    }
                );
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
            if(aegisBottomPanel) {
                this.injectTo(aegisBottomPanel);
                this.editors.push(editor);
                this.editor = editor;
            }
        },
        injectTo:function(contentWindow){
            try {
                var document;
                var chromeWindow;
                if(typeof contentWindow.contentDocument!=="undefined"){
                    document=contentWindow.contentDocument;
                }
                if(typeof contentWindow.document!=="undefined"){
                    document=contentWindow.document;
                }
                chromeWindow = contentWindow;
                if(typeof contentWindow.constructor!=="undefined"){
                    if(typeof contentWindow.constructor.name==="string"){
                        if(contentWindow.constructor.name==="XULElement"){
                            chromeWindow = contentWindow._contentWindow;
                        }
                    }
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
                        var res1=Components.utils.cloneInto(
                            res,
                            chromeWindow
                        );
                        return res1;
                        return res;
                    }
                };
                document.body.appendChild(ee);
            } catch(ex) {
                console.log(ex);
            }
        }
    };
