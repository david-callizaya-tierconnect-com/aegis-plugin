<html>
<body>
<input name="abc" id="abc">
<script src="aegis.js"></script>
<script>
IRecorder.init(function(){
  console.log("se cargo");
  IRecorder.bridge.link("recorder", "start")(window);
  console.log( IRecorder.bridge.link("recorder", "getWindowId")(window) );
});
</script>
</body>
</html>