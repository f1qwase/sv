var getStartFileList = function(callback) {
	$.getJSON("/files/", {}, callback)
}

$(function(){
	$.Mustache.load('element_template.htm').done(function ( ) {
		getStartFileList(function(data) {
			data.forEach(function(file) {
				var fileView = $.Mustache.render('fileView', file)
				$("#accordion2").append(fileView)
			})
		})
	})
})


$(function(){
	$.Mustache.load('navbar_template.htm').done(function ( ) {
		$.getJSON("/structure/", function(data) {
			var navbarView = $.Mustache.render('navbarView', data)
			$("#navbar_position").append(navbarView)
			$(".alert").alert();
			$('.selectpicker').selectpicker();

			$(".navbar select").change(function(e) {
				var tooltipText = $(this).siblings().find(".filter-option").text()
				$(this).parent().attr("title", tooltipText)
				// var selected = $(".navbar select :selected").map(function(item) {
				// 	return $(this).text()
				// }).toArray()
				// console.log(selected)
			})
		})
	})
})