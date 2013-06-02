var getStartFileList = function(callback) {
	// $.getJSON("filesStub.json", callback
	$.get("filesStub.json", {}, callback)
}

var upload_file = function(file, callback) {

}

$(function(){
	$.Mustache.load('element_template.htm').done(function ( ) {
		// console.log(arguments)
		getStartFileList(function(data) {
			console.log(data)
			data.forEach(function(file) {
				var fileView = $.Mustache.render('fileView', file)
				console.log(file)
				$("#accordion2").append(fileView)
			})
		})
	})
	
})

var getStartNavbar = function(callback) {
	$.get("dataNavbarStub.json", {}, callback)
}

$(function(){
	$.Mustache.load('navbar_template.htm').done(function ( ) {
		getStartNavbar(function(data) {
			console.log(data)
			data.forEach(function(file) {
				var navbarView = $.Mustache.render('navbarView', file)
				console.log(file)
				$("#navbar_position").append(navbarView)
			})
			$(".alert").alert();
			$('.selectpicker').selectpicker();
		})
	})

})