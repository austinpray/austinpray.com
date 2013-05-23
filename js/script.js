//precompiler imports jQuery.scrolly.js, waypoints.min.js, & plugins.js

/*
https://coderwall.com/p/ahazha
Jack Hsu slightly modified by Austin Pray
*/
$.fn.redraw = function(){
  $(this).each(function(){
    return this.offsetHeight;
  });
};

/*
Author: Austin Pray
sMenu object creates jQuery for menu
usage: var siteMenu = new slideMenu($('#button'),$('#menu'));
*/
function slideMenu(btn, mnu) {
	var button = btn;
	var menu = mnu;
	var open = false;
	var sup = this;
	button.click(function(event) {
		event.preventDefault();
		sup.slide();
	});
	this.slide = function() {
		if (open) {
			open = false;
			button.html("&#201;");
		} else {
			open = true;
			button.html("X");
		}
		menu.slideToggle(100).redraw();
	};
}





$(document).ready(function() {
	$('.parallax').scrolly({
		bgParallax: true
	});
	$('#nav').waypoint('sticky');
	var menuButton = $('#menu-button');
	var theNav = $('#nav-menu');
	var siteMenu = new slideMenu(menuButton, theNav);
	theNav.find("a").each(function() {
		$(this).click(function() {
			if ($(window).width() <= 767) {
				siteMenu.slide();
			}
		});
	});
	$('#details-for-nerds').hide();
	$('#details-for-nerds-show').click(function(event) {
		event.preventDefault();
		$('#details-for-nerds').slideToggle(100);
	});
});
$(window).smartresize(function() {
	var w = $(window).width();
	if (w > 767 && $('#nav-menu').is(':hidden')) {
		$('#nav-menu').removeAttr('style');
	}
});