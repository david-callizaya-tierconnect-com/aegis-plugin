var JavascriptAdapter = {
    init:function(contentWindow, callback){
        DOMInjector.readInjectJavascriptTo(
            contentWindow,
            'chrome://selenium-ide/content/aegis/page/aegis.js?t='+new Date().getTime(),
            function(chromeWindow, document, nodes) {
                callback(chromeWindow, document);
            }
        );
    },
    close:function(contentWindow){
        
    },
    injectInterfaceTo:function(contentWindow, id, InterfaceName, interface, context, callback){
        DOMInjector.injectTo(contentWindow, function(chromeWindow, document) {
            var ee=document.createElement("b");
            ee.id=id;
            ee.style.display="none";
            ee.onclick=(function(interface, context){ return function(fn){
                return function(){
                    var args=[];
                    for(var i=0,l=arguments.length;i<l;i++){
                        if(typeof arguments[i]==='function'){
                            args.push(
                                (function(fn0){ return function(){
                                    var args0=[];
                                    for(var i=0,l=arguments.length;i<l;i++){
                                        args0.push(Components.utils.cloneInto(
                                            arguments[i],
                                            chromeWindow
                                        ));
                                    }
                                    fn0.apply(null, args0);
                                };})(arguments[i])
                            );
                        } else {
                            args.push(arguments[i]);
                        }
                    }
                    if(typeof interface[fn]!=="function"){
                        console.log(interface);
                        throw fn+" of "+interface+" is not a function ["+(typeof interface[fn])+"]";
                    }
                    var res=interface[fn].apply(
                            context,
                            args
                        );
                    var res1=Components.utils.cloneInto(
                        res,
                        chromeWindow
                    );
                    return res1;
                };
            };})(interface, context);
            document.body.appendChild(ee);
            //Create Interface
            var functions=[];
            for(var fn in interface) if(typeof interface[fn]==="function"){
                functions.push('"'+fn+'":ee.onclick("'+fn+'")');
            }
            var localInterface='(function(){var ee=document.getElementById('+JSON.stringify(ee.id)+');'+
            'window.'+InterfaceName+'={'+functions.join(",")+'};'+
            '})();';
            chromeWindow.eval(localInterface);
            callback(chromeWindow, document);
        });
    }
};
