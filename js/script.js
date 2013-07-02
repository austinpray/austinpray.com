//precompiler imports jQuery.scrolly.js, waypoints.min.js, & plugins.js
/*
Author: Austin Pray
slideMenu object creates jQuery for menu
usage: var siteMenu = new slideMenu($('#button'),$('#menu'));
*/
function slideMenu(btn, mnu) {
	var button = btn;
	var menu = mnu;
	var sup = this;
	button.click(function(event) {
		event.preventDefault();
		sup.slide();
	});
	this.slide = function() {
		if (menu.hasClass("active")) {
			menu.removeClass("active");
			button.html("&#201;");
		} else {
			menu.addClass("active");
			button.html("X");
		}
	};
}
$(document).ready(function() {
	$('.parallax').scrolly({
		bgParallax: true
	});
	$('#nav').waypoint('sticky');
	//make a responsive navbar
	var menuButton = $('#menu-button');
	var theNav = $('#nav-menu');
	var siteMenu = new slideMenu(menuButton, theNav);
	theNav.find("a").each(function() {
		$(this).click(function() {
			siteMenu.slide();
		});
	}); // end responsive nav bar
	$('#details-for-nerds').hide();
	$('#details-for-nerds-show').click(function(event) {
		event.preventDefault();
		$('#details-for-nerds').slideToggle(100);
	});
	FastClick.attach(document.body);
});