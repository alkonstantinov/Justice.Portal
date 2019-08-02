function subMenuToggler() {

    $(".js-submenu-toggler").on("click", function(e){
        e.preventDefault();
        $("#show-menu").fadeToggle();
        $("body").toggleClass("prevent-scroll");
    });
}

function subMenuTogglerM() {

    $(".js-mmenu-toggler").on("click", function(e){
        e.preventDefault();
        $("#show-mmenu").slideToggle();
        $("body").toggleClass("prevent-scroll");
    });

}


//Toggle website verssion between Normal view & Handicape
function disabledVerssion() {
    

    $("#disabledVer").on("click", function(e){

        if ($(".disabled-ver")[0]) {
            location.reload();
        } else {
            $(".modal").remove();
            $("*").removeAttr('class');
            $("body").addClass("disabled-ver");
            $("#modalMenus").addClass('none-disabled');
            $("#showSearch").addClass('input-group');

        }
    });
}


$(document).ready(function(){

    var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};
    var hamburgers = document.querySelectorAll(".hamburger");
    var hamburgersm = document.querySelectorAll(".hamburger-m");
    
    if (hamburgers.length > 0) {
      forEach(hamburgers, function(hamburger) {
        hamburger.addEventListener("click", function() {
          this.classList.toggle("is-active");

          
        }, false);
      });
    }

    if (hamburgersm.length > 0) {
      forEach(hamburgersm, function(hamburgerm) {
        hamburgerm.addEventListener("click", function() {
          this.classList.toggle("is-active");
          //document.getElementById("megaHeaderW").style.height = "800px";
        }, false);
      });
    }

	$(function() {
    $('a[href*=\\#]:not([href=\\#])').on('click', function() {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.substr(1) +']');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top - 73
            }, 1000);
            return false;
        	}
    	});
	});

   

    window.onscroll = function() {scrollFunction()};
    //var stickyname = "sticky-nav";
    var lgh = $(".sticky-lg").outerHeight();
    //console.log("Hello! I am an alert box!!:" + " " + lgh);
    var sc = 70-lgh;
    
    function scrollFunction() {

        if ($(window).scrollTop() > Math.abs(lgh)) {
            $( "div.sticky-lg" ).addClass( "home-sticky");
            $("div.sticky-lg").css("top", sc);
            
        } else {

            if ($(window).scrollTop() < Math.abs(lgh)) {
                $( "div.sticky-lg" ).removeClass( "home-sticky" );
                $("div.sticky-lg").css("top", "");
            }
        }
    }

    subMenuToggler();
    subMenuTogglerM();
    disabledVerssion();
    
    

    $(window).resize(function(){
        if($(window).width()>768){
            $("#show-mmenu").show();
            $("#show-mmenu").removeAttr("style");
            $(".hamburger-m").removeClass("is-active");
        } 
         
    });

    // Gets the video src from the data-src on each button

    var $videoSrc;  
    $('.js-video').click(function() {
        $videoSrc = $(this).data( "src" );
    });
    console.log($videoSrc);

      
      
    // when the modal is opened autoplay it  
    $('#liveEmission').on('shown.bs.modal', function (e) {
        
    // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
    $("#video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
    })
      


    // stop playing the youtube video when I close the modal
    $('#liveEmission').on('hide.bs.modal', function (e) {
        // a poor man's stop video
        $("#video").attr('src',$videoSrc); 
    }) 
});