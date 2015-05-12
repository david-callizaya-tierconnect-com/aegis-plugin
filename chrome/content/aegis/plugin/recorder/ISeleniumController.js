var ISeleniumController = {
    interface:{
        init:function(){},
        notify:function(event, data){
            this.notify(event, data);
        },
        addEventListener:function(obj,event,fn){
            this.addEventListener(obj,event,fn);
        }
    },
    /**
     * Init the ISelenimController to work with the Selenium objects.
     */
    init:function(){
        
    },
    /**
     * Toggles the recording state of Selenium
     */
    toggleRecord:function(){
        aegis.editor.toggleRecordingEnabled();
    },
    /**
     * Activate the recording state of Selenium
     */
    activateRecord:function(){
        aegis.editor.toggleRecordingEnabled(true);
    },
    /**
     * Inactivate the recording state of Selenium
     */
    inactivateRecord:function(){
        aegis.editor.toggleRecordingEnabled(false);
    },
    //Play test case
    /**
     * Load a Job into Selenium test cases
     */
    loadJob:function(job, callback){
        console.log("***** loadJob *****");
        this.job=job;
        this.runRecord(
                [
                    {type:"command","command":"open",lastURL:job.baseUrl,target:"/",value:""},
                    {type:"command","command":"waitForPageToLoad",lastURL:job.baseUrl,target:"5000",value:""},
                    {type:"command","command":"pause",lastURL:job.baseUrl,target:"5000",value:""}
                ],
                function(seleniumJob, result){
                    ISeleniumController.currentCase=-1;
                    callback(ISeleniumController.job, ISeleniumController.currentCase);
                }
            );
    },
    /**
     * Forward to the next case
     */
    doCase:function(callback){
        console.log("*********************************************");
        console.log("doCase");
        console.log(this.currentCase+1,this.job.cases.length);
        console.log("*********************************************");
        if(this.job.cases.length<=this.currentCase+1){
            return;
        }
        var records=this.convert(this.job.cases[this.currentCase+1].recorder);
        this.runRecord(
                records,
                function(seleniumJob, result){
                    ISeleniumController.currentCase++;
                    callback(ISeleniumController.job, ISeleniumController.currentCase);
                }
            );
    },
        //private methods.
        /**
         * Convert a Aegis record to Selenium record
         * @param {type} record
         * @returns {Array|ISeleniumController.convert.seleniumRecord}
         */
	convert: function(record){
            var seleniumRecord=[];
            for(var i=0,l=record.length;i<l;i++){
                seleniumRecord.push({
                    type:"command",
                    lastURL:record[i].baseUrl,
                    command:record[i].command,
                    target:record[i].target["xpath:position"],
                    targetCandidates:ISeleniumController.object2array(record[i].target),
                    value:record[i].value,
                });
            }
            return seleniumRecord;
	},
        /**
         * Convert an object of xpaths to an Selenium array of xpaths
         * @param {type} object
         * @returns {Array|ISeleniumController.object2array.array}
         */
	object2array: function (object){
            var array=[];
            for(var i in object) if((typeof object[i]==="string")){
                array.push([object[i],i]);
            }
            return array;
	},
	currentCase:-1,
        running:false,
        runQueue:[],
        /**
         * Run an individual Aegis record array
         * @param {type} commands
         * @param {type} callback
         * @returns {undefined}
         */
        runRecord:function(commands, callback){
            this.runQueue.push({commands:commands, callback:callback});
            //console.log("Queue:",this.runQueue,this.running);
            try{
                this.runSelenium();
            } catch(ee){
                console.log(ee);
                console.log(ee.stack);
            }
        },
        castCommands:function(array){
            var arrayCommands=[];
            if(typeof Command==="function"){
                console.log("*************************************");
                console.log("EXISTE");
                console.log("*************************************");
            } else if(typeof window.parent.Command==="function"){
                console.log("*************************************");
                console.log("EXISTE EN PADRE");
                console.log("*************************************");
                var Command=window.parent.Command;
            }
            for(var i=0,l=array.length;i<l;i++){
                arrayCommands.push( new aegis.editor.window.Command(array[i].command, array[i].target, array[i].value) );
            }
            return arrayCommands;
        },
        /**
         * Run a Selenium test case
         * @returns {undefined}
         */
        runSelenium:function(){
            if(!ISeleniumController.running && ISeleniumController.runQueue.length>0){
                var run=ISeleniumController.runQueue.shift();
                aegis.editor.getTestCase().setCommands(ISeleniumController.castCommands(run.commands));
                console.log("Runnig:", run.commands);
                ISeleniumController.running=true;
                if(run.commands.length===0){
                    console.log("Done 0:");
                    ISeleniumController.running=false;
                    try{
                        run.callback(null, null);
                    } catch(ee) {
                        console.log(ee);
                        console.log(ee.stack);
                    }
                    ISeleniumController.runSelenium();
                } else {
                    aegis.waitPlayDone(function(job, result){
                        console.log("Done:", job, result);
                        ISeleniumController.running=false;
                        try{
                            run.callback(job, result);
                        } catch(ee) {
                            console.log(ee);
                            console.log(ee.stack);
                        }
                        ISeleniumController.runSelenium();
                    });
                    aegis.editor.playCurrentTestCase();
                }
            }
        },
    //OBSERVER PATTERN
    listeners:[],
    addEventListener:function(obj,event,fn){
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