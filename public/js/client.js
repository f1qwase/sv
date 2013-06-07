var getStartFileList = function(callback) {
	// $.getJSON("filesStub.json", callback
	$.get("filesStub.json", {}, callback)
}

var File = Backbone.Model.extend({
})

var FileView = Backbone.View.extend({
	model: File,
	template: Mustache.compile($("#fileTpl").text()),
	// initialize: function() {
	// },
	render: function() {
		// console.log(this.model, this.template)
		// return JSON.stringify(this.model.toJSON())
		return this.template(this.model.toJSON())
	}
})

var FilesCollection = Backbone.Collection.extend({
	model: File,
	url: "/files/",
	initialize: function() {
	}
})

FilesCollectionView = Backbone.View.extend({
	template: "<div>hi, I'm template</div>",
	initialize: function() {
		this.collection.bind("reset", this.onReset, this)
		this.collection.fetch({
			reset: true
		})
	},
	render: function(filter) {
		var filter = filter || {}
		console.log("render called")
		var collectionView = this.collection.filter(function(file) {
				for (var i in filter) {
					//пока поиск объединется по "и"
					if (file.get(i) != filter[i]) {
						return false
					}
				}
				return true
			}).map(function(file) {
				var fileView = new FileView({model: file})
				return fileView.render()
			}).join("")
		return collectionView
	},
	onReset: function() {
		console.log(this.render())
		$("#accordion2").append(this.render())
	}
})







$(function(){
	$.Mustache.load('element_template.htm').done(function ( ) {
		getStartFileList(function(data) {
			data.forEach(function(file) {
				var fileView = $.Mustache.render('fileView', file)
				$("#accordion2").append(fileView)
			})
		})
	})
	var filesCollectionView = new FilesCollectionView({
		collection: new FilesCollection()
	})
})

var getStartNavbar = function(callback) {
	$.get("structure", {}, callback)
}

$(function(){
	$.Mustache.load('navbar_template.htm').done(function ( ) {
		getStartNavbar(function(data) {
			var navbarView = $.Mustache.render('navbarView', data)
			console.log(navbarView, data)
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