/*var IRecorder={
  init:function(success){
    var e=document.getElementById("a1c622d9c9d1a180f16481caef451589");
    if(e) {
      this.bridge={
        link: e.onclick
      };
      success();
    } else {
      setTimeout(function(){IRecorder.init(success)},200);
    }
  },
  start:function(){
    this.connection.log("hello plugin");
  }
};
*/
var aegis={
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
    console.log(job);
    document.getElementById("log").value=JSON.stringify(job);
    $.ajax({
      type: "POST",
      url: "http://10.100.1.200:8080/myProjectSelenium/api/aegis/services",
      cache:false,
      data: JSON.stringify(job),
      contentType: "text/plain",
      crossDomain: true,
      dataType: "json",
      success: function (data, status, jqXHR) {
        console.log(data);
        $.ajax({
          type: "get",
          url: "http://10.100.0.207:8081/cr24/preview/setimages.php",
          cache:false,
          data: {"data":JSON.stringify(data)},
          //contentType: "text/plain",
          //crossDomain: true,
          //dataType: "json",
          success: function (data) {
            console.log(data);
            window.open("http://10.100.0.207:8081/cr24/preview/index.html", "_blank");
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
  selectAll:function(){
    AEGIS.IInspector.selectAll();
  },
  onselect:function(data){
    try{
      document.getElementById("log").value+="\n"+JSON.stringify(data);
      var last = actionlogKO.data()[actionlogKO.data().length-1];
      var next = {
        first: null,
        baseUrl: data.baseUrl,
        type: 'include',
        target: data.xpath,
        actions: ''
      };
      if(data.baseUrl!=aegis.lastUrl){aegis.lastUrl=data.baseUrl; aegis.newCase=true;}
      if(typeof last!=="undefined") {var s=last.first;last.first=null;}
      if(aegis.newCase || (JSON.stringify(last.target)!==JSON.stringify(next.target))){
        setTimeout(function(){ AEGIS.IInspector.activateInspect(); }, 0);
        next.first=aegis.newCase;
        actionlogKO.data.push(next);
        aegis.newCase=false;
        aegis.currentCase.inspector.push({
          baseUrl: data.baseUrl,
          type: Math.floor(Math.random()*2) ? "watch" : "ignore",
          //computedStyle: {},
          xpath: data.xpath,
          outerHTML: data.outerHTML,
          outerHTMLWithStyle: data.outerHTMLWithStyle
        });
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
          value: data.value
        };
        if(aegis.lastUrl && (data.baseUrl!=aegis.lastUrl)){
          aegis.lastUrl=data.baseUrl;
          aegis.newCase=true;
        }
        if(typeof last!=="undefined") {var s=last.first;last.first=null;}
        if(aegis.newCase || (JSON.stringify(last)!==JSON.stringify(next))){
          next.first=aegis.newCase;
          /*if(aegis.newCase) {
            aegis.startCase();
          }*/
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
            value: data.value
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