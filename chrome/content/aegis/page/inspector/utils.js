window.AEGIS.utils={
    /**
     * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
     * by testing for a 'synthetic=true' property on the event object
     * @param {HTMLNode} node The node to fire the event handler on.
     * @param {String} eventName The name of the event without the "on" (e.g., "focus")
     */
    fireEvent: function(node, eventName) {
        // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
        var doc;
        if (node.ownerDocument) {
            doc = node.ownerDocument;
        } else if (node.nodeType === 9){
            // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
            doc = node;
        } else {
            throw new Error("Invalid node passed to fireEvent: " + node.id);
        }

         if (node.dispatchEvent) {
            // Gecko-style approach (now the standard) takes more work
            var eventClass = "";

            // Different events have different event classes.
            // If this switch statement can't map an eventName to an eventClass,
            // the event firing is going to fail.
            switch (eventName) {
                case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                case "mousedown":
                case "mouseup":
                    eventClass = "MouseEvents";
                    break;

                case "focus":
                case "change":
                case "blur":
                case "select":
                    eventClass = "HTMLEvents";
                    break;

                default:
                    throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                    break;
            }
            var event = doc.createEvent(eventClass);

            var bubbles = eventName === "change" ? false : true;
            event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

            event.synthetic = true; // allow detection of synthetic events
            // The second parameter says go ahead with the default action
            node.dispatchEvent(event, true);
        } else  if (node.fireEvent) {
            // IE-old school style
            var event = doc.createEventObject();
            event.synthetic = true; // allow detection of synthetic events
            node.fireEvent("on" + eventName, event);
        }
    },
    /**
     * The following function allows one to pass an element and an 
     * XML document to find a unique string XPath expression 
     * leading back to that element.
     * @param {type} el
     * @param {type} xml
     * @returns {String}
     */
    getXPathForElement1:function(el, xml) {
        var xpath = '';
        var pos, tempitem2;

        while(el !== xml.documentElement) {
                pos = 0;
                tempitem2 = el;
                while(tempitem2) {
                        if (tempitem2.nodeType === 1 && tempitem2.nodeName === el.nodeName) { // If it is ELEMENT_NODE of the same name
                                pos += 1;
                        }
                        tempitem2 = tempitem2.previousSibling;
                }

                xpath = "*[name()='"+el.nodeName+"' and namespace-uri()='"+(el.namespaceURI===null?'':el.namespaceURI)+"']["+pos+']'+'/'+xpath;

                el = el.parentNode;
        }
        xpath = '/*'+"[name()='"+xml.documentElement.nodeName+"' and namespace-uri()='"+(el.namespaceURI===null?'':el.namespaceURI)+"']"+'/'+xpath;
        xpath = xpath.replace(/\/$/, '');
        return xpath;
    },
    getXPathForElement2:function( element )
    {
        var xpath = '';
        for ( ; element && element.nodeType == 1; element = element.parentNode )
        {
            var id = $(element.parentNode).children(element.tagName).index(element) + 1;
            id > 1 ? (id = '[' + id + ']') : (id = '');
            xpath = '/' + element.tagName.toLowerCase() + id + xpath;
        }
        return xpath;
    },
    /**
     * Gets an XPath for an element which describes its hierarchical location.
     */
    getXPathForElement:function(element) {
        var getElementTreeXPath = function(element) {
            var paths = [];

            // Use nodeName (instead of localName) so namespace prefix is included (if any).
            for (; element && element.nodeType == 1; element = element.parentNode)  {
                var index = 0;
                // EXTRA TEST FOR ELEMENT.ID
                if (element && element.getAttribute('id')) {
                    paths.splice(0, 0, '/*[@id="' + element.getAttribute('id') + '"]');
                    break;
                }

                for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                    // Ignore document type declaration.
                    if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                      continue;

                    if (sibling.nodeName == element.nodeName)
                        ++index;
                }

                var tagName = element.nodeName.toLowerCase();
                var pathIndex = (index ? "[" + (index+1) + "]" : "");
                paths.splice(0, 0, tagName + pathIndex);
            }

            return paths.length ? "/" + paths.join("/") : null;
        };
        if (element && element.getAttribute('id')) {
            return '//*[@id="' + element.getAttribute('id') + '"]';
        } else
            return getElementTreeXPath(element);
    },
    getElementByXpath:function(path, ownerDocument) {
        if(typeof ownerDocument==="undefined") {
            ownerDocument=document;
        }
        return ownerDocument.evaluate(path, ownerDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    },
    removeClass:function(d, className){
        d.classList.remove(className);
    },
    addClass:function(d, className){
        d.classList.add(className);
    },
    ajaxListener:{
        callback: function () {
            // this.method :the ajax method used
            // this.url    :the url of the requested script (including query string, if any) (urlencoded) 
            // this.data   :the data sent, if any ex: foo=bar&a=b (urlencoded)
            AEGIS.utils.ajaxListener.checkNoAjax();
        },
        calls:0,
        minWait:1000,
        queue:[],
        waitForNoAjax:function(fn){
            if(typeof fn==="function"){
                this.queue.push(fn);
            }
            this.checkNoAjax();
        },
        checkNoAjax:function(){
            if(this.calls===0){
                setTimeout(function(){
                    if(AEGIS.utils.ajaxListener.calls===0){
                        for(var i=0,l=AEGIS.utils.ajaxListener.queue.length;i<l;i++){
                            AEGIS.utils.ajaxListener.queue[i]();
                        }
                        AEGIS.utils.ajaxListener.queue.length=0;
                    }
                }, AEGIS.utils.ajaxListener.minWait);
            }
        }
    }
};
(function(){
    var s_ajaxListener = AEGIS.utils.ajaxListener;
    s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
    s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(a,b) {
      if (!a) var a='';
      if (!b) var b='';
      s_ajaxListener.tempOpen.apply(this, arguments);
      s_ajaxListener.method = a;  
      s_ajaxListener.url = b;
      if (a.toLowerCase() == 'get') {
        s_ajaxListener.data = b.split('?');
        s_ajaxListener.data = s_ajaxListener.data[1];
      }
      s_ajaxListener.calls++;
    }

    XMLHttpRequest.prototype.send = function(a,b) {
      if (!a) var a='';
      if (!b) var b='';
      s_ajaxListener.tempSend.apply(this, arguments);
      if(s_ajaxListener.method.toLowerCase() == 'post') {
          s_ajaxListener.data = a;
      }
      s_ajaxListener.calls--;
      s_ajaxListener.callback();
    }
})();
