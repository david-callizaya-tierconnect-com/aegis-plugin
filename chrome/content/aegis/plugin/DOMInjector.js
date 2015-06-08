var DOMInjector = {
    injectTo:function(contentWindow, callback) {
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
            callback(chromeWindow, document);
        } catch(ex) {
            console.log(ex);
        }
    },
    injectHtmlTo:function(contentWindow, html, callback){
        DOMInjector.injectTo(contentWindow, function(window, document){
            var b=document.createElement("b");
            b.innerHTML=html;
            var f=function(){
                if(typeof document.body==='undefined'){
                    setTimeout(f,100);
                } else {
                    callback(window, document, b.childNodes);
                }
            };
            f();
        })
    },
    /**
     * Avoid the Security Police that avoid load non secure CSS into https
     * servers.
     * @param {type} contentWindow
     * @param {type} link
     * @param {type} callback
     * @returns {undefined}
     */
    readInjectCssTo:function(contentWindow, link, callback){
        DOMInjector.makeGetRequest(window, link, function(httpRequest){
            if(httpRequest.readyState===4){
                if(httpRequest.status===200){
                    var html='<'+'style type="text/css">'+httpRequest.responseText+'<'+'/style>';
                    DOMInjector.injectHtmlTo(contentWindow, html, function(chromeWindow, document, nodes){
                        var refNodes=[];
                        while(nodes.length>0){
                            refNodes.push(nodes[0]);
                            document.body.appendChild(nodes[0]);
                        }
                        if(typeof callback==="function") {
                            callback(window, document, refNodes);
                        }
                    });
                }
            }
        });
    },
    readInjectJavascriptTo:function(contentWindow, link, callback){
        DOMInjector.makeGetRequest(window, link, function(httpRequest){
            if(httpRequest.readyState===4){
                if(httpRequest.status===200){
                    var html='<'+'script type="text/javascript">'+httpRequest.responseText+'<'+'/script>';
                    DOMInjector.injectHtmlTo(contentWindow, html, function(chromeWindow, document, nodes) {
                        try{
                            var i=0;
                            var refNodes=[];
                            while(nodes.length>i){
                                try{
                                    chromeWindow.eval(nodes[i].textContent);
                                } catch(exp) {
                                    console.log("["+link+"] "+exp);
                                    console.log(exp.stack);
                                }
                                try{
                                    refNodes.push(nodes[i]);
                                    document.body.appendChild(nodes[i]);
                                } catch(exp) {
                                    console.log("["+link+"] "+exp);
                                    console.log(exp.stack);
                                    i++;
                                }
                            }
                            if(typeof callback==="function") {
                                callback(chromeWindow, document, refNodes);
                            }
                        } catch(e) {
                            console.log(e);
                            console.log(e.stack);
                        }
                    });
                }
            }
        });
    },
    makeGetRequest:function(window, url, callback) {
        var httpRequest;
        //console.log("[ajax] "+url);
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
          httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
          try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } 
          catch (e) {
            try {
              httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } 
            catch (e) {}
          }
        }
        if (!httpRequest) {
          throw 'Giving up :( Cannot create an XMLHTTP instance';
        }
        httpRequest.onreadystatechange = function(){
            callback(httpRequest);
        }
        httpRequest.open('GET', url);
        httpRequest.send();
  }
};
