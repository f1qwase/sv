var getStartFileList = function(callback) {
	$.getJSON("/files/", {}, callback)
}


//{view(jQuery set)}
// var SearchString = function(view) {
// 	this.view = view
// 	this.getText = function() {
// 		return this.view.val()
// 	}
// 	this.setText = function(value) {
// 		this.view.val(value)
// 		return this
// 	}
// 	this.addText = function(value) {
// 		var oldText = this.getText()
// 		var newText = (oldText == "") ? value : oldText + ", " + value
// 		this.setText(newText)
// 	}
// 	this.isSet = function(key, value) {
// 		var isSetRegexp =  new RegExp(key + ": ?" + value)
// 		return isSetRegexp.test(this.getText())
// 	}
// 	this.onDublicate = function(value) {
// 		console.log("dublicate(" + value + ")")
// 	}
// 	this.add = function(key, value) {
// 		if (!this.isSet(key, value)) {
// 			this.addText(key + ": " + value)
// 		}
// 		else {
// 			this.onDublicate(key + ": " + value)
// 		}
// 	}
// }

// SearchString.prototype = {
// 	init: function() {
// 		this.view.change(function(e) {

// 		})
// 	},
// 	render: function() {
// 		this.params.forEach(function(param))
// 	},
// 	change: function() {
// 		this.view.text(this.render())
// 	},
// 	add: function(key, value) {
// 		var _key = this.params[key] || []
// 		if (inArray(_key, value) {
// 			_key.push(value)
// 		}
// 		this.change()		
// 	},
// 	translate: function() {}

// }

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
			$("#search-string").tagit()
		})
	})
})