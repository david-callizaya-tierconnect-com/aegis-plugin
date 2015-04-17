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
  newCase:true,
  lastUrl:"",
  runJob:function(){
    var baseUrl = typeof aegis.cases[0]==="undefined"?"":(typeof aegis.cases[0].recorder[0]==="undefined"?"":(typeof aegis.cases[0].recorder[0].baseUrl==="undefined"?"":aegis.cases[0].recorder[0].baseUrl));
    if(!baseUrl) {
      baseUrl="https://www.bankofamerica.com/";
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
      url: "http://10.100.0.81:8080/myProjectSelenium/api/aegis/services",
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
    AEGIS.IRecorder.toggleRecord();
    AEGIS.IInspector.toggleInspect();
    vm.isRecording(!vm.isRecording());
    if( vm.isRecording() ) {
      $('#mainTabs a[href="#records"]').tab('show'); 
    } else {
      $('#mainTabs a[href="#actionlog"]').tab('show'); 
    }
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
      if(aegis.newCase || (JSON.stringify(last)!==JSON.stringify(next))){
        setTimeout(function(){ AEGIS.IInspector.toggleInspect(); }, 1000);
        next.first=aegis.newCase;
        actionlogKO.data.push(next);
        aegis.newCase=false;
        aegis.currentCase.inspector.push({
          baseUrl: data.baseUrl,
          type: "include",
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
        if(data.baseUrl!=aegis.lastUrl){aegis.lastUrl=data.baseUrl; aegis.newCase=true;}
        if(typeof last!=="undefined") {var s=last.first;last.first=null;}
        console.log(JSON.stringify(last) , JSON.stringify(next));
        if(aegis.newCase || (JSON.stringify(last)!==JSON.stringify(next))){
          next.first=aegis.newCase;
          if(aegis.newCase) {
            aegis.startCase();
          }
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