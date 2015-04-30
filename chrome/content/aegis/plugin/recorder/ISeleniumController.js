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
    init:function(){
        
    },
    toggleRecord:function(){
        aegis.editor.toggleRecordingEnabled();
    },
    activateRecord:function(){
        aegis.editor.toggleRecordingEnabled(true);
    },
    inactivateRecord:function(){
        aegis.editor.toggleRecordingEnabled(false);
    },
    //Play test case
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
	object2array: function (object){
            var array=[];
            for(var i in object) if((typeof object[i]==="string")){
                array.push([object[i],i]);
            }
            return array;
	},
	currentCase:-1,
	loadJob:function(job, callback){
            console.log("***** loadJob *****");
            this.job=job;
            this.runRecord(
                    [
                        {type:"command","command":"open",lastURL:job.baseUrl,target:"/",value:""}
                    ],
                    function(seleniumJob, result){
                        ISeleniumController.currentCase=-1;
                        callback(ISeleniumController.job, ISeleniumController.currentCase);
                    }
                );
	},
	doCase:function(callback){
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
        running:false,
        runQueue:[],
        runRecord:function(commands, callback){
            this.runQueue.push({commands:commands, callback:callback});
            console.log("Queue:",this.runQueue,this.running);
            try{
                this.runSelenium();
            } catch(ee){
                console.log(ee);
                console.log(ee.stack);
            }
        },
        runSelenium:function(){
            if(!ISeleniumController.running && ISeleniumController.runQueue.length>0){
                var run=ISeleniumController.runQueue.shift();
                aegis.editor.getTestCase().setCommands(run.commands);
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
                    aegis.editor.playCurrentTestCase();
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
        this.listeners.forEach(function(item){
            if(item.event===event){
                try{
                    item.fn.call(item.obj, data);
                }catch(ex){
                    console.log(ex);
                }
            }
        });
    }
};