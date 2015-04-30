// $(document).ready(function () {
//     DisplayBanner($(".home-banner").children("ul").eq(0));
// });

// $(document).ready(function () {
//      $(".nav>ul>li").hover(function () {
//           $(this).children(".expando-nav").delay(200).stop(true, true).slideToggle('slow'); return false;
//      },
//      function () {
//            $(this).children(".expando-nav").delay(200).stop(true, true).toggle(); return false;
//      });
// });

/*click code*/
function bs (argument) {
  // body...
  if(me.currentDisp.url !== null)
     $(".home-banner").on("click","div", function () {
      window.open(me.currentDisp.url,'_blank');
      alert("clicked");
    });
    // $(".home-banner").onclick = function () {
    //  window.open(me.currentDisp.url,'_blank');
    //  alert("clicked");
    // };
  else $(".home-banner").onclick = null;
}