<html>
<head>
    <link rel="stylesheet" href="../bootstrap/theme/bootstrap.min.css">
    <title>AEGIS Job Preview</title>
</head>
<body>
<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="../bootstrap/js/bootstrap.min.js"></script>
<script src="../knockout-3.3.0.js"></script>

<style type="text/css">
body {margin:50px 0px; padding:0px; background-color: #000000;color: #ffffff;}
#content {width:620px; margin:0px auto;}
#desc {margin:10px; float:left; font-family: Arial, sans-serif; font-size: 12px;}
</style>

<!-- include CSS always before including js -->
<link type="text/css" rel="stylesheet" href="skins/tn3/tn3.css"></link>
<!-- include tn3 plugin -->
<script type="text/javascript" src="js/jquery.tn3lite.min.js"></script>


    <div class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a href="javascript:void(0)" class="navbar-brand">AEGIS</a>
          <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="navbar-collapse collapse" id="navbar-main">
          <ul class="nav navbar-nav ">

          </ul>
<form class="navbar-form navbar-right">
<div class="btn-group"></div><div class="btn-group"></div>
</form>

        </div>

      </div>
    </div>
<br /><br /><br /><!--  initialize the TN3 when the DOM is ready -->
<script type="text/javascript">
    $(document).ready(function() {
      var images = [
        {"baseUrl":"http://www.bankofamerica.com","target":"//div/a[5]","imageUrl":"http://127.0.0.1:8081/cr24/preview/examples/images/ss/1.png"},
        {"baseUrl":"http://www.bankofamerica.com","target":"//div/a[5]","imageUrl":"http://127.0.0.1:8081/cr24/preview/examples/images/ss/1.png"}
      ];

      var $ol=$('.mygallery div ol');
      for(var i=0,l=images.length;i<l;i++){
        var baseUrl=images[i].baseUrl;
        var target=images[i].target;
        var imageUrl=images[i].imageUrl;
        var smallImageUrl=images[i].imageUrl;
        $ol.append('<li><h4>'+baseUrl+'</h4><div class="tn3 description">'+target+'</div><a href="'+imageUrl+'"><img width="35px" height="35px" src="'+smallImageUrl+'" /></a></li>');
      }

      //Thumbnailer.config.shaderOpacity = 1;
      var tn1 = $('.mygallery').tn3({
        skinDir:"skins",
        imageClick:"fullscreen",
        image:{
          maxZoom:1.5,
          crop:true,
          clickEvent:"dblclick",
          transitions:[
            {
              type:"blinds"
            },{
              type:"grid"
            },{
              type:"grid",
              duration:460,
              easing:"easeInQuad",
              gridX:1,
              gridY:8,
              // flat, diagonal, circle, random
              sort:"flat",
              sortReverse:false,
              diagonalStart:"bl",
              // fade, scale
              method:"scale",
              partDuration:360,
              partEasing:"easeOutSine",
              partDirection:"left"
            }
          ]
        }
      });
    });
</script>
<div id="content">
    <div class="mygallery">
	<div class="tn3 album">
	    <h4>Fixed Dimensions</h4>
	    <div class="tn3 description">Images with fixed dimensions</div>
	    <div class="tn3 thumb">examples/images/35x35/1.jpg</div>
	    <ol>

	    </ol>
	</div>
    </div>
    <div id="desc">
	<p>Images toke in job's benchmark.</p>
    </div>
</div>


</body>
</html>
