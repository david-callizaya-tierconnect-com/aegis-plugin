var aegis={
  seleniumServer:"10.100.0.137:8080",
  cases:[
  ],
  newCase:false,
  lastUrl:"",
  runJob:function(){
    var baseUrl = typeof aegis.cases[0]==="undefined"?"":(typeof aegis.cases[0].recorder[0]==="undefined"?"":(typeof aegis.cases[0].recorder[0].baseUrl==="undefined"?"":aegis.cases[0].recorder[0].baseUrl));
    if(!baseUrl) {
      baseUrl = typeof aegis.cases[0]==="undefined"?"":(typeof aegis.cases[0].inspector[0]==="undefined"?"":(typeof aegis.cases[0].inspector[0].baseUrl==="undefined"?"":aegis.cases[0].inspector[0].baseUrl));
    }
    if(!baseUrl) {
      return;
    }
    var job={
      "baseUrl":baseUrl,
      "screen":{width:1800,height:760},
      "window":{width:1800,height:760},
      cases:aegis.cases
    };
    document.getElementById("log").value=JSON.stringify(job);
    $.ajax({
      type: "POST",
      url: "http://"+aegis.seleniumServer+"/myProjectSelenium/api/aegis/services",
      cache:false,
      data: JSON.stringify(job),
      contentType: "text/plain",
      crossDomain: true,
      dataType: "json",
      success: function (data, status, jqXHR) {
        console.log(data);
        $.ajax({
          type: "get",
          url: "http://10.100.0.244:8081/cr24/preview/setimages.php",
          cache:false,
          data: {"data":JSON.stringify(data)},
          success: function (data) {
            console.log(data);
            window.open("http://10.100.0.244:8081/cr24/preview/index.html", "_blank");
          }
        });
      },
      error: function (jqXHR, status) {
        // error handler
        console.log(jqXHR);
        alert('fail' + status.code);
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
      AEGIS.IRecorder.activateRecord();
      AEGIS.IInspector.inactivateInspect();
      $('#mainTabs a[href="#records"]').tab('show'); 
    } else {
      AEGIS.IRecorder.inactivateRecord();
      AEGIS.IInspector.activateInspect();
      AEGIS.IInspector.loadSelection( aegis.currentCase.inspector );
      $('#mainTabs a[href="#actionlog"]').tab('show'); 
    }
  },
  openEditAction:function(callback, cancelCallback){
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
  },
  editAction:function(extraData, callback, cancelCallback){
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
  },
  closeEditAction:function(){
    $('#wrapper').removeClass("toggled");
  },
  selectAll:function(){
    AEGIS.IInspector.selectAll();
  },
  onselectInspectionRow:function(rowInspection){
    aegis.editAction(rowInspection.inspection.extra, 
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
              aegis.onselectInspectionRow( array[j] );
              return;
            }
          }
          break;
        }
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
      if(aegis.newCase || (JSON.stringify(last.target)!==JSON.stringify(next.target))){
        aegis.openEditAction(function(extraData){
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
  }
};
aegis.startCase();
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
}