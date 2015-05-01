
function BannerImage(container,manager,number){
	this.manager = manager;
	this.mainContainer = container;
	this.childrenLi = new Array();
	this.number = number;
	for(i in $(container).children()){
		if(parseInt(i)<=5)
			this.childrenLi.push($(container).children()[i]);
	}
	if($(container).attr("data-link")){
		$(container).on("click", function () {
		 	window.open($(container).attr("data-link"),'_blank');
		});
	}
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
	
	// console.log(this.childrenLi);
}



BannerImage.prototype.show = function (){
	if(typeof this.manager.animObject["type"] === "undefined" || this.manager.animObject["type"] === "tiles"){
		this.tilingFadein(0);
	}
	else if (this.manager.animObject["type"] === "fade")
		this.fadeIn(this.manager.animObject["duration"]);
	$(this.mainContainer).css("z-index","1");
	$(this.mainContainer).show();
	// this.tilingFadein(0);
	// this.fadeIn();

}

BannerImage.prototype.prepHide = function(){
	$(this.mainContainer).css("z-index","0");
}

BannerImage.prototype.hide = function() {
	window.lock = false;
	$(this.mainContainer).children("li").css("display","none");
	$(this.mainContainer).hide();
	// console.log("hiding");
};

function BannerManager (obj) {
	this.currentDisp = null;
	this.bannerImgs = new Array();
	this.position = 0;
	var current = this;
	this.animObject = obj;
	var me = this;
	var number = 1;
	var hackerCSSMagic = $('<style>').appendTo('head');
	$(".home-banner").children().each(function () {

		this.sizeOfBanner += 1
		var magic = "." + $(this).attr('class');
		magic += " > li{ background-image: ";
		console.log(magic);

		var backUrl = "url(" + $(this).attr("data-background") + ");}";
		magic += backUrl
		$(hackerCSSMagic).append(magic)
		newBanObj = new BannerImage(this,me,number);
		current.bannerImgs.push(newBanObj);
		number++;
	});
	if ($(".home-banner").attr("data-controls") == "numbers" || $(".home-banner").attr("data-controls") == "both" ){
			olButtons = $("<ol id = 'SkipTo'>").appendTo(".home-banner");
			number = 0;
			$(".home-banner").children().each(function () {
				var newButton = $("<li>").appendTo($(olButtons));
				$(newButton).on("click",{number:number},skipAhead);
				++number;
			});
		}
	if($(".home-banner").attr("data-controls") == "arrows" || $(".home-banner").attr("data-controls") == "both"){
		left = $("<input id = 'left' type = 'button'></input>").appendTo(".home-banner");
		right = $("<div class = 'right'><span style = 'display:none;'>right</span></div>").appendTo(".home-banner");
		// $(".left").on("click",function () {
		// 	this.transition("back");
		// });
		$("body").on("click","#left",goBack);
		$("body").on("click",".right",skip);
	}
	
}

BannerManager.prototype.skipTo = function(number) {
	if(this.currentDisp.number === number) return;
	this.position = number - 1;
	this.transition();
}

BannerManager.prototype.transition = function(direction) {
	if(this.bannerImgs.length == 1 && this.currentDisp) return;
	window.lock = true;
	var me = this;
	if(typeof direction === "undefined" || direction === "forward"){
		this.position = (this.position+1)%this.bannerImgs.length;
		window.hide = this.currentDisp;
		
		this.currentDisp = this.bannerImgs[Math.abs(this.position)];
		this.currentDisp.show();
		if(hide !== null){
			// hide.hide();
			hide.prepHide();
		}
		
	}
	else if(direction === "back"){
		window.hide = this.currentDisp;
		var me = this;
		this.position = (this.position-1)%this.bannerImgs.length;
		this.currentDisp = this.bannerImgs[Math.abs(this.position)];
		this.currentDisp.show();
		if(hide !== null){
			// this.bannerImgs.unshift(hide);
			// hide.hide();
			hide.prepHide();
		}
	}
};

function skip (ev) {
	if(window.lock) return;
	if(typeof ev !== "undefined")
		ev.stopPropagation();
	if(typeof window.BM !== "undefined"){
		clearInterval(window.interval);
		window.BM.transition();
		window.interval = setInterval(function () {
			BM.transition();
		},window.ao["loop time"]);
	}
}

function goBack(ev){
	if(window.lock) return;
	if(typeof ev !== "undefined")
		ev.stopPropagation();
	if(typeof window.BM !== "undefined"){
		clearInterval(window.interval);
		window.BM.transition("back");
		window.interval = setInterval(function () {
			BM.transition();
		},window.ao["loop time"]);
	}
}
function skipAhead(ev){
	if(window.lock) return;
	ev.stopPropagation();
	clearInterval(window.interval);
	BM.skipTo(ev.data.number);
	window.interval = setInterval(function () {
			BM.transition();
		},window.ao["loop time"]);
}

function runBanner (animObj) {
	if(typeof animObj === "undefined"){
		animObj = {"loop time":3000}
	}
	if(typeof animObj["loop time"] === "undefined"){
		animObj["loop time"] = 3000;
	}
	if(typeof animObj["duration"] === "undefined")
		animObj["duration"] = 1000;
	window.ao = animObj;
	window.BM = new BannerManager(animObj);
	BM.transition();
	window.interval = setInterval(function () {
		BM.transition();
	},animObj["loop time"]);
}