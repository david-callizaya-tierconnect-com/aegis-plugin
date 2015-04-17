//Source file: Z:\\WORKSPACEXUL\\SELENIUMIDE1\\AEGIS\\SRC\\MAIN\\JAVA\\COM\\AEGIS\\PLUGIN\\INJECTOR\\DOMINJECTOR.JAVA

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aegis.plugin.injector;

import com.aegis.core.ContentWindow;
import com.aegis.Callback;
import org.stjs.javascript.dom.Document;

/**
@author david
 */
public class DOMInjector 
{
   
   /**
   @param contentWindow
   @param callback
   @roseuid 552FF9E101EA
    */
   public void injectTo(ContentWindow contentWindow, Callback callback) 
   {
        try {
            Document document;
            org.stjs.javascript.Window chromeWindow;
            
            chromeWindow.$get(1);
            
           /* if(typeOf contentWindow.contentDocument!=="undefined"){
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
            callback(chromeWindow, document);*/
        } catch(Exception ex) {
            //console.log(ex);
        }
   }
   
   /**
   @param contentWindow
   @param html
   @param callback
   @roseuid 552FF9E101F5
    */
   public void injectHtmlTo(ContentWindow contentWindow, String html, Callback callback) 
   {
    
   }
   
   /**
   @param contentWindow
   @param link
   @param callback
   @roseuid 552FF9E101F9
    */
   public void readInjectCssTo(ContentWindow contentWindow, String link, Callback callback) 
   {
    
   }
   
   /**
   @param contentWindow
   @param link
   @param callback
   @roseuid 552FF9E10201
    */
   public void readInjectJavascriptTo(ContentWindow contentWindow, String link, Callback callback) 
   {
    
   }
   
   /**
   @param contentWindow
   @param url
   @param callback
   @roseuid 552FF9E10208
    */
   protected void makeGetRequest(ContentWindow contentWindow, String url, Callback callback) 
   {
    
   }
}
