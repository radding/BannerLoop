// function BannerLinkNode(){
// 	this.first = null;
// 	this.last = null;
// 	this.nextNode = null;
// }

function BannerImage(container,manager){
	this.manager = manager;
	this.mainContainer = container;
	this.childrenLi = new Array();
	for(i in $(container).children()){
		if(parseInt(i)<=5)
			this.childrenLi.push($(container).children()[i]);
	}
	if($(container).attr("data-link")){
		this.url = $(container).attr("data-link");
	}
	else this.url = null;
}

BannerImage.prototype.tilingFadein = function(number) {
	if(number > 5){
		if(window.hide !== null)
			window.hide.hide();
		return;
	}
	else{
		var me = this;
		$(me.childrenLi[number]).fadeIn("fast","linear",function  () {
			me.tilingFadein(number+1);
		});
	}
};

BannerImage.prototype.fadeIn = function (time){
	// $(this.mainContainer).show();
	// $(this.mainContainer).css("z-index","1");
	window.currentRefrence = this;
	for(i in this.childrenLi){
		var cur = this.childrenLi.shift();
		$(cur).fadeIn(time,'linear',function(){
			if(window.hide != null){
				window.hide.hide();
				// $(window.hide.mainContainer).css("opacity",0);
			}
		});
		this.childrenLi.push($(cur)[0]);
	}
	
	console.log(this.childrenLi);
}



BannerImage.prototype.show = function (){
	// this.fadeIn(this.manager.animObject["duration"]);
	$(this.mainContainer).css("z-index","1");
	$(this.mainContainer).show();
	this.tilingFadein(0);

}

BannerImage.prototype.prepHide = function(){
	$(this.mainContainer).css("z-index","0");
}

BannerImage.prototype.hide = function() {
	
	$(this.mainContainer).children("li").css("display","none");
	$(this.mainContainer).hide();
	console.log("hiding");
};

function BannerManager (obj) {
	this.currentNumber = 0;
	this.currentDisp = null;
	this.bannerImgs = new Array();
	this.arrows = null;
	this.controls = null;
	var current = this;
	this.animObject = obj;
	var me = this;
	var hackerCSSMagic = $('<style>').appendTo('head');
	$(".home-banner").children().each(function () {

		this.sizeOfBanner += 1
		var magic = "." + $(this).attr('class');
		magic += " > li{ background-image: ";
		console.log(magic);

		var backUrl = "url(" + $(this).attr("data-background") + ");}";
		magic += backUrl
		$(hackerCSSMagic).append(magic)
		newBanObj = new BannerImage(this,me);
		current.bannerImgs.push(newBanObj);
	});
}

BannerManager.prototype.transition = function() {
	// var currentlyDisplayed = this.bannerImgs[this.currentNumber];
	// this.currentNumber = (this.currentNumber++)%this.sizeOfBanner;
	window.hide = this.currentDisp;
	var me = this;
	this.currentDisp = this.bannerImgs.shift();
	this.currentDisp.show();
	if(hide !== null){
		this.bannerImgs.push(hide);
		// hide.hide();
		hide.prepHide();
	}
	if(me.currentDisp.url !== null)
		 $(".home-banner").on("click","li", function () {
			window.open(me.currentDisp.url,'_blank');
			alert("clicked");
		});
		// $(".home-banner").onclick = function () {
		// 	window.open(me.currentDisp.url,'_blank');
		// 	alert("clicked");
		// };
	else $(".home-banner").onclick = null;
	// this = stupid;
};

function runBanner (animObj) {
	if(typeof animObj === "undefined"){
		animObj = {"loop time":3000}
	}
	if(typeof animObj["loop time"] === "undefined"){
		animObj["loop time"] = 3000;
	}
	if(typeof animObj["duration"] === "undefined")
		animObj["duration"] = 1000;
	var BM = new BannerManager(animObj);
	BM.transition();
	var interval = setInterval(function () {
		BM.transition();
	},animObj["loop time"]);
	return BM;
}