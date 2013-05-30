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