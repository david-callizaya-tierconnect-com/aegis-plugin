var aegis={
  init:function(config){
    for(var a in config){
      aegis[a]=config[a];
    }
  },
  onboot:function(){},
  onselect:function(data){},
  onrecord:function(data){},
  newJob:function(){
    AEGIS.IController.notify('newjob');
  },
  onLoadJobOpen:function(){},
  loadJob:function(job){
    aegis.onLoadJobOpen=function(){
      AEGIS.IController.notify('loadjob', job);
    }
  }
}


function bootAegis(){
  AEGIS.IInspector.addEventListener(
    aegis,
    "select",
    aegis.onselect
  );
  AEGIS.IRecorder.addEventListener(
    aegis,
    "record",
    aegis.onrecord
  );
  aegis.seleniumServer=AEGIS.IController.getSeleniumServer();
  aegis.apikey=AEGIS.IController.getApikey();
  aegis.onboot();
}