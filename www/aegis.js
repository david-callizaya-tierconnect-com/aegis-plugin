var aegis={
//  seleniumServer:"10.100.0.137:8080",
//  apikey:"",
//  previewServer:"52.6.171.25",
  previewServer:"localhost:8081",
  cases:[
  ],
  newCase:false,
  lastUrl:"",
  config:{},
  init:function(config){
    if(typeof config==="object"){
      aegis.config=config;
    }
  },
  runJob:function(){
    var baseUrl = typeof aegis.cases[0]==="undefined"?"":(typeof aegis.cases[0].recorder[0]==="undefined"?"":(typeof aegis.cases[0].recorder[0].baseUrl==="undefined"?"":aegis.cases[0].recorder[0].baseUrl));
    if(!baseUrl) {
      baseUrl = typeof aegis.cases[0]==="undefined"?"":(typeof aegis.cases[0].inspector[0]==="undefined"?"":(typeof aegis.cases[0].inspector[0].baseUrl==="undefined"?"":aegis.cases[0].inspector[0].baseUrl));
    }
    if(!baseUrl) {
      return;
    }
    var job={
      "jobId":"ppGr1ll0",
      "baseUrl":baseUrl,
      "screen":{width:1800,height:760},
      "window":{width:1800,height:760},
      cases:aegis.cases
    };
    document.getElementById("log").value=JSON.stringify(job);
    aegis.apikey=AEGIS.IController.getApikey();
    $.ajax({
      type: "POST",
      url: "http://"+aegis.seleniumServer+"/aegis24-1.0-POC/api/aegis/services",
      cache:false,
      /*beforeSend: function (request)
      {
          request.setRequestHeader("apikey", aegis.apikey);
      },*/
      data: JSON.stringify(job),
      contentType: "text/plain",
      crossDomain: true,
      dataType: "json",
      success: function (data, status, jqXHR) {
        $.ajax({
          type: "get",
          url: "http://"+aegis.previewServer+"/cr24/preview/setimages.php",
          cache:false,
          data: {"data":JSON.stringify(data)},
          success: function (data) {
            window.open("http://"+aegis.previewServer+"/cr24/preview/index.html", "_blank");
          }
        });
      },
      error: function (jqXHR, status) {
        console.log(jqXHR);
        alert('Fail. ' + status);
      }
    });
  },
  startCase:function(){
    if(typeof aegis.currentCase!=="undefined" && 
        aegis.currentCase.recorder.length===0 &&
        aegis.currentCase.inspector.length===0 ){
      return;
    }
    aegis.currentCase={
      recorder:[],
      inspector:[]
    };
    aegis.cases.push(aegis.currentCase);
  },
  array2object: function(array){
    var object={};
    for(var i=0,l=array.length;i<l;i++){
      object[array[i][1]]=array[i][0];
    }
    return object;
  },
  toggle:function(){
    aegis.newCase=true;
    vm.isRecording(!vm.isRecording());
    if( vm.isRecording() ) {
      AEGIS.IController.setMode("recording");
      AEGIS.IRecorder.activateRecord();
      AEGIS.IInspector.inactivateInspect();
      $('#mainTabs a[href="#records"]').tab('show'); 
    } else {
      AEGIS.IController.setMode("inspecting");
      AEGIS.IRecorder.inactivateRecord();
      AEGIS.IInspector.activateInspect();
      AEGIS.IInspector.loadSelection( aegis.currentCase.inspector );
      $('#mainTabs a[href="#actionlog"]').tab('show'); 
    }
  },
  openEditAction:function(fromSelectAll, callback, cancelCallback){
    /*autoSetInspectionValues*/
    if(fromSelectAll){
      try{
        aegis.autoSetInspectionValues.doit();
        var userOrGroupTitle="";//$("#userOrGroup option:selected").text();
        callback({
          title:actionSettings.title(),
          notification:actionSettings.notification(),
          action:actionSettings.action(),
          userOrGroup:actionSettings.userOrGroup(),
          userOrGroupTitle:userOrGroupTitle
        });
      } catch(ee){
      }
    } else {
      actionSettings.title("");
      actionSettings.notification("none");
      actionSettings.action("watch");
      actionSettings.userOrGroup("");
      $('#wrapper').addClass("toggled");
      $('#confirmAction').unbind("click").click(function(){
        var userOrGroupTitle=$("#userOrGroup option:selected").text();
        callback({
          title:actionSettings.title(),
          notification:actionSettings.notification(),
          action:actionSettings.action(),
          userOrGroup:actionSettings.userOrGroup(),
          userOrGroupTitle:userOrGroupTitle
        });
      });
      $('#cancelAction').unbind("click").click(cancelCallback);
      $('#removeAction').hide();
    }
  },
  editAction:function(inspection, extraData, callback, cancelCallback){
    actionSettings.title(extraData.title);
    actionSettings.notification(extraData.notification);
    actionSettings.action(extraData.action);
    actionSettings.userOrGroup(extraData.userOrGroup);
    $('#wrapper').addClass("toggled");
    $('#confirmAction').unbind("click").click(function(){
      var userOrGroupTitle=$("#userOrGroup option:selected").text();
      actionlogKO.currentSelectedRow(null);
      callback({
        title:actionSettings.title(),
        notification:actionSettings.notification(),
        action:actionSettings.action(),
        userOrGroup:actionSettings.userOrGroup(),
        userOrGroupTitle:userOrGroupTitle
      });
    });
    $('#cancelAction').unbind("click").click(function(){
      actionlogKO.currentSelectedRow(null);
      cancelCallback();
    });
    $('#removeAction').show();
    $('#removeAction').unbind("click").click(function(){
      aegis.removeInspection(inspection);
      cancelCallback();
    });
  },
  closeEditAction:function(){
    $('#wrapper').removeClass("toggled");
  },
  removeInspection:function(inspection){
      /* Find selection in current case*/
      for(var i=0,l=aegis.currentCase.inspector.length;i<l;i++){
        if( (aegis.currentCase.inspector[i].baseUrl===inspection.baseUrl) &&
            (aegis.currentCase.inspector[i].xpath===inspection.xpath) ) 
        {
          //find row of inspection
          var array=actionlogKO.data();
          for(var j=0,k=array.length;j<k;j++){
            if( array[j].inspection===aegis.currentCase.inspector[i] ) {
              setTimeout(function(){ AEGIS.IInspector.activateInspect(); }, 0);
              actionlogKO.data.splice(j,1);
              aegis.currentCase.inspector.splice(i,1);
              AEGIS.IInspector.loadSelection( aegis.currentCase.inspector );
              return;
            }
          }
          break;
        }
      }
  },
  selectAll:function(){
    AEGIS.IInspector.selectAll();
  },
  onselectInspectionRow:function(rowInspection){
    aegis.editAction(rowInspection.inspection, rowInspection.inspection.extra, 
    function(extraData){
      rowInspection.title=extraData.title;
      rowInspection.type=extraData.action;
      rowInspection.notification=extraData.notification;
      rowInspection.userOrGroup=extraData.userOrGroup;
      rowInspection.userOrGroupTitle=extraData.userOrGroupTitle;

      rowInspection.inspection.type=extraData.action;
      rowInspection.inspection.extra=extraData;

      //actionlogKO.data.valueHasMutated();
      var rowI=actionlogKO.data.indexOf(rowInspection);
      actionlogKO.data.splice(rowI,1);
      actionlogKO.data.splice(rowI,0, rowInspection);

      AEGIS.IInspector.loadSelection( aegis.currentCase.inspector );
      aegis.closeEditAction();
    }, 
    function(){
      aegis.closeEditAction();
    });
  },
  onselect:function(data){
    try{
      /* Find selection in current case*/
      for(var i=0,l=aegis.currentCase.inspector.length;i<l;i++){
        if( (aegis.currentCase.inspector[i].baseUrl===data.baseUrl) &&
            (aegis.currentCase.inspector[i].xpath===data.xpath) ) 
        {
          //find row of inspection
          var array=actionlogKO.data();
          for(var j=0,k=array.length;j<k;j++){
            if( array[j].inspection===aegis.currentCase.inspector[i] ) {
              setTimeout(function(){ AEGIS.IInspector.activateInspect(); }, 0);
              if(!data.fromSelectAll){
                aegis.onselectInspectionRow( array[j] );
              }
              return;
            }
          }
          break;
        }
      }
      if(vm.isEditing()) {
        return;
      }
      /* Insert new selection */
      document.getElementById("log").value+="\n"+JSON.stringify(data);
      var last = actionlogKO.data()[actionlogKO.data().length-1];
      var next = {
        first: null,
        baseUrl: data.baseUrl,
        type: "inspect",
        target: data.xpath,
        actions: ''
      };
      if(data.baseUrl!=aegis.lastUrl){aegis.lastUrl=data.baseUrl; aegis.newCase=true;}
      if(typeof last!=="undefined") {var s=last.first;last.first=null;}
      if(aegis.newCase || (typeof last==="undefined") || (JSON.stringify(last.target)!==JSON.stringify(next.target))){
        aegis.openEditAction(data.fromSelectAll, function(extraData){
          var inspection={
            baseUrl: data.baseUrl,
            type: extraData.action,
            computedStyle: data.computedStyle,
            xpath: data.xpath,
            extra:extraData,
            outerHTML: data.outerHTML,
            outerHTMLWithStyle: data.outerHTMLWithStyle
          };
          setTimeout(function(){ AEGIS.IInspector.activateInspect(); }, 0);
          next.first=aegis.newCase;//actionlogKO.data.length===0?true:(actionlogKO.data[actionlogKO.data.length-1].baseUrl!==data.baseUrl);
          next.type=extraData.action;
          next.title=extraData.title;
          next.notification=extraData.notification;
          next.userOrGroup=extraData.userOrGroup;
          next.userOrGroupTitle=extraData.userOrGroupTitle;
          next.inspection=inspection;
          actionlogKO.data.push(next);
          aegis.newCase=false;
          aegis.currentCase.inspector.push(inspection);
          AEGIS.IInspector.loadSelection( aegis.currentCase.inspector );
          aegis.closeEditAction();
        }, function(){
          aegis.closeEditAction();
          setTimeout(function(){ AEGIS.IInspector.activateInspect(); }, 0);
        });
      } else {
          setTimeout(function(){ AEGIS.IInspector.activateInspect(); }, 0);
      }
      if(typeof last!=="undefined") {last.first=s;}
    } catch(e) {
      console.log(e);
    }
  },
  onrecord:function(data){
    if(vm.isEditing()) {
      return;
    }
    try{
        document.getElementById("log").value+="\n"+JSON.stringify(data);
        var last = recordsKO.data()[recordsKO.data().length-1];
        var next = {
          first: null,
          baseUrl: data.baseUrl,
          command: data.command,
          target: data.target[data.target.length-1],
          value: data.value,
          user:"",
          userName:"",
          timestamp:new Date().getTime()
        };
        if(data.baseUrl!=aegis.lastUrl){
          aegis.lastUrl=data.baseUrl;
          aegis.newCase=true;
        }
        if(typeof last!=="undefined") {var s=last.first;last.first=null;}
        if(aegis.newCase || (JSON.stringify(last.baseUrl+last.command+last.target+last.value)!==JSON.stringify(next.baseUrl+next.command+next.target+next.value))){
          next.first=aegis.newCase;
          if(aegis.currentCase.inspector.length>0) {
            aegis.startCase();
          }
            aegis.startCase();
          recordsKO.data.push(next);
          aegis.newCase=false;
          aegis.currentCase.recorder.push({
            baseUrl: data.baseUrl,
            command: data.command,
            target: aegis.array2object(data.target, "xpath:attributes"),
            value: data.value,
            extra:{
              user:next.user,
              userName:next.userName,
              timestamp:next.timestamp
            }
          });
        }
        if(typeof last!=="undefined") {last.first=s;}
    } catch(e) {
      console.log(e);
    }
  },
  onloadselection:function(){
    AEGIS.IInspector.loadSelection( aegis.currentCase.inspector );
  },
  autoSetInspectionValues:{
    enabled:false,
    counter:0,
    doit:function(){
      this.counter++;
      actionSettings.title("Action-"+this.counter);
      actionSettings.notification("none");
      actionSettings.action("watch");
      actionSettings.userOrGroup("");
    }
  },
  newJob:function(url){
    vm.isEditing(false);
    actionlogKO.data.removeAll();
    recordsKO.data.removeAll();
    aegis.cases=[];
    aegis.startCase();
  },
  loadJob:function(job){
    vm.isEditing(true);
    actionlogKO.data.removeAll();
    recordsKO.data.removeAll();
    aegis.cases=job.cases;
    for(var i=0,l=aegis.cases.length;i<l;i++){
      for(var j=0,k=aegis.cases[i].recorder.length;j<k;j++){
        var data=aegis.cases[i].recorder[j];
        recordsKO.data.push({
          first: j===0,
          baseUrl: data.baseUrl,
          command: data.command,
          target: data.target["xpath:position"],
          value: data.value,
          user: typeof data.extra!=="undefined" ? data.extra.user:"",
          userName: typeof data.extra!=="undefined" ? data.extra.userName:"",
          timestamp: typeof data.extra!=="undefined" ? data.extra.timestamp:""
        });
      }
      for(var j=0,k=aegis.cases[i].inspector.length;j<k;j++){
        var data=aegis.cases[i].inspector[j];
        actionlogKO.data.push({
          first: j===0,
          baseUrl: data.baseUrl,
          type: data.type,
          target: data.xpath,
          title: typeof data.extra!=="undefined" ? data.extra.title:"",
          notification: typeof data.extra!=="undefined" ? data.extra.notification:"",
          userOrGroup: typeof data.extra!=="undefined" ? data.extra.userOrGroup:"",
          userOrGroupTitle: typeof data.extra!=="undefined" ? data.extra.userOrGroupTitle:"",
          inspection: data
        });
      }
    }
    aegis.currentCase=aegis.cases[0];
    if( vm.isRecording() ) {
      aegis.toggle();
    }
    AEGIS.IController.loadJob(job, function(currentCase){
      console.log("TERMINO DE CARGAR JOB");
      aegis.currentCase=aegis.cases[currentCase];
    });
  },
  nextCase:function(){
    if(aegis.cases.indexOf(aegis.currentCase)===aegis.cases.length-1){
      return;
    }
    AEGIS.IController.nextCase(function(currentCase){
      aegis.currentCase=aegis.cases[currentCase];
    });
  },
  onDoLoadJob:function(job){
    aegis.loadJob(job);
  },
  onDoNewJob:function(){
    aegis.newJob("");
  }
};
aegis.newJob("");

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
  AEGIS.IController.addEventListener(
    aegis,
    "loadSelected",
    aegis.onloadselection
  );
  AEGIS.IController.addEventListener(
    aegis,
    "loadjob",
    aegis.onDoLoadJob
  );
  AEGIS.IController.addEventListener(
    aegis,
    "newjob",
    aegis.onDoNewJob
  );
  aegis.seleniumServer=AEGIS.IController.getSeleniumServer();
  aegis.apikey=AEGIS.IController.getApikey();
}