var MainController = {
    interface:{
        setMode:function(mode){
            this.setMode(mode);
        },
        getMode:function(){
            return this.getMode();
        },
        getApikey:function(){
            return this.getApikey();
        },
        getSeleniumServer:function(){
            return this.getSeleniumServer();
        },
        getPluginServer:function(){
            return this.getPluginServer();
        },
        newJob:function(){
            return this.newJob();
        },
        closeJob:function(){
            return this.closeJob();
        },
        loadJob:function(job, callback){
            return this.loadJob(job, callback);
        },
        nextCase:function(callback){
            return this.nextCase(callback);
        },
        runScript:function(script){
            this.runScript(script);
        },
		minimizePlugin:function(){
			this.minimizePlugin();
		},
		maximizePlugin:function(){
			this.maximizePlugin();
		},
        notify:function(event,data){
            this.notify(event,data);
        },
        addEventListener:function(obj,event,fn){
            this.addEventListener(obj,event,fn);
        }
    },
    DOMID:"9222668072e3fbe70026460d9470dad6",
    /**
     * Initialize the plugin main controller
     * @param {type} contentWindow
     * @param {type} callback
     * @returns {undefined}
     */
    init:function(contentWindow, callback){
        JavascriptAdapter.injectInterfaceTo(
            contentWindow,
            MainController.DOMID, 
            'AEGIS.IController',
            MainController.interface, 
            MainController, 
            function(chromeWindow, document) {
                callback(chromeWindow);
            }
        );
    },
    /**
     * Loads the selected DOM elements
     * @returns {undefined}
     */
    loadSelected:function(){
        this.notify("loadSelected", {});
    },
    /**
     * Get the configured selenium server hostname:port
     * @returns {String}
     */
    getSeleniumServer:function(){
        return aegis.servers.selenium;
    },
    /**
     * Get the configured plugin server hostname:port
     * @returns {String}
     */
    getPluginServer:function(){
        return aegis.servers.plugin;
    },
    /**
     * Set the plugin's mode (recording|inspecting)
     * @param {string} mode : recording or inspecting
     * @returns {undefined}
     */
    setMode:function(mode){
        aegis.mode=mode;
    },
    /**
     * Get the plugin's mode (recording|inspecting)
     * @returns {string}
     */
    getMode:function(){
        return aegis.mode;
    },
    /**
     * Get the configured apikey
     * @returns {String}
     */
    getApikey:function(){
        return aegis.apikey;
    },
    newJob:function(){
        aegis.enabled=true;
        aegis.showPanel();
    },
    closeJob:function(){
        aegis.enabled=false;
        aegis.hidePanel();
    },
    /**
     * Load a Job Object
     * @param {object} job
     * @param {function} callback
     * @returns {undefined}
     */
    loadJob:function(job,callback){
        IInspectorController.inactivateLookup();
        ISeleniumController.loadJob(job, function(){
            //IInspectorController.waitForNoAjax(
            //    function(){
                    //console.log("ENTRO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    IInspectorController.inactivateLookup();
                    ISeleniumController.doCase(function(job, currentCase){
                        IInspectorController.loadSelection(job.cases[currentCase].inspector);
                        if(typeof callback==="function"){
                            callback(currentCase);
                        }
                    });
            //    });
        });
    },
    /**
     * Go to the next inspection case defined in the Job.
     * @param {function} callback
     * @returns {undefined}
     */
    nextCase:function(callback){
        IInspectorController.inactivateLookup();
        ISeleniumController.doCase(function(job, currentCase){
            IInspectorController.loadSelection(job.cases[currentCase].inspector);
            if(typeof callback==="function"){
                callback(currentCase);
            }
        });
    },
    /**
     * 
     * @param {type} script
     * @returns {undefined}
     */
    runScript:function(script){
        IInspectorController.runScript(script);
    },
	/**
	 * Minimizes the plugin like a status bar
	 * @returns {undefined}
	 */
	minimizePlugin:function(){
		aegis.setContainerHeight(51);
	},
	/**
	 * Maximizes the plugin to the default height
	 * @returns {undefined}
	 */
	maximizePlugin:function(){
		//@see also: aegis.lastPanelHeight
		aegis.setContainerHeight(390);
	},
    //observer pattern
    listeners:[],
    addEventListener:function(obj,event,fn){
        console.log("addEventListener@MainController");
        console.log(obj,event,fn);
        this.listeners.push({obj:obj,event:event,fn:fn});
    },
    removeEventListener:function(obj,event){
        this.listeners = this.listeners.filter(
            function(item) {
                if( (item.obj !== obj) || (item.event !== event) ) {
                    return item;
                }
            }
        );
    },
    notify:function(event, data){
        console.log("notify@MainController");
        console.log(event, data);
        for(var i=0,l=this.listeners.length;i<l;i++){
            var item=this.listeners[i];
            if(item.event===event){
                try{
                    item.fn.call(item.obj, data);
                }catch(ex){
                    if(ex.message==="can't access dead object"){
                        this.listeners.splice(i,1);
                        i--;l--;
                    } else {
                        console.log(ex);
                    }
                }
            }
        }
    }
};