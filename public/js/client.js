$(document).bind("ajaxError", function(event, response, request) {
	switch (response.status) {
		case 500:
			alert("опять сервак отвалился!")
			break
		case 503:
			alert("авторизуйтесь, будьте добры")
			break
		case 404:
			alert("блин, 404 при запросе по адресу " + request.url)
			break
	}
})

var tagFormat = function(key, value) {
	return key + ":" + value
}
var tagDeformat = function(string) {
	var arr = string.split(":")
	if (arr.length == 2) {
		return {
			key: arr[0],
			value: arr[1]
		}
	}
}


var FilesView = function(params) {
	$.extend(this, params)
}
FilesView.prototype = {
	render: function(file) {
		return $.Mustache.render('fileView', file)
	},
	add: function(file) {
		this.view.append(this.render(file))
	},
	reload: function(parameters) {
		parameters = parameters || this.__lastParamters
		this.__lastParamters = parameters
		var that = this
		$.getJSON("/files", parameters || {}, function(files) {
			that.view.empty()
			if (files.length == 0) {
				that.view.append("нету ничего")
			}
			else {
				files.forEach(function(file) {
					that.add(file)
				})
			}
		})
	}
}

var NavbarView = function(params) {
	$.extend(this, params)
	this.init()
}

NavbarView.prototype = {
	init: function() {
		var that = this
		this.selectors = this.view.find("select")
		this.selectors.selectpicker()
		this.selectors.change(function(e) { //change tooltip
			var tooltipText = $(this).siblings().find(".filter-option").text()
			$(this).parent().attr("title", tooltipText)
		})
		this.selectors.change(function(e) {
			var key = this.title
			var options = $(this).find("option") 
			var selected = options.filter(":selected").toArray().map(function(option) {
				return $(option).val()
			})
			var notSelected = options.not(":selected").toArray().map(function(option) {
				return $(option).val()
			})
			var existedTags = that.searchString.getTags()
			selected.forEach(function(value) {
				that.searchString.addTag(tagFormat(key, value))
			})
			notSelected.forEach(function(value) {
				that.searchString.tryRemoveTag(tagFormat(key, value))
			})
		})

		this.searchString.view.tagit({
			afterTagRemoved: function(e, ui) {
				var deletedTag = tagDeformat(ui.tagLabel)
				if (deletedTag) {
					that.updateOption(deletedTag.key, deletedTag.value, false)
				}
				that.searchString.go()
			},
			afterTagAdded: function(e, ui) {
				var newTag = tagDeformat(ui.tagLabel)
				if (newTag) {
					that.updateOption(newTag.key, newTag.value, true)
				}
				that.searchString.go()
			}
		})
	},
	getSelector: function(name) {
		return this.selectors.filter("[title='" + name + "']")
	},
	updateOption: function(selector, option, isSelected) {
		var selector = this.getSelector(selector)
		var optionView = selector.find("option:contains('" + option + "')")
		isSelected ? optionView.attr("selected", "selected") : optionView.removeAttr("selected")
		selector.selectpicker("refresh")
	}
}

var SearchString = function(params) {
	$.extend(this, params)
	this.init()
}

SearchString.prototype = {
	init: function() {
		var that = this
		this.view.tagit({
			allowSpaces: true,
			caseSensitive: false,
			placeholderText: "Поиск",
			singleFieldDelimiter: "\t"
		})
	},
	dictionary: {
		"Курс": "academicYear",
		"Семестр": "semester",
		"Предмет": "subject",
		"Тип": "type",
		"ss": "ss"
	},
	go: function() {
		this.filesView.reload(this.asGetParams())
	},
	getTags: function() {
		return this.view.tagit("assignedTags")
	},
	addTag: function(tag) {
		return this.view.tagit("createTag", tag)
	},
	tryRemoveTag: function(tag) {
		if (this.getTags().indexOf(tag) != -1) {
			this.view.tagit("removeTagByLabel", tag)
		}
	},
	asGetParams: function() {
		var that = this
		var parameters = {}
		this.getTags().forEach(function(param) {
			var tagsKeyValuePair = tagDeformat(param)
			if (!tagsKeyValuePair) {
				tagsKeyValuePair = {key: "ss", value: param}
			}
			parameters[tagsKeyValuePair.key] = parameters[tagsKeyValuePair.key] || []
			parameters[tagsKeyValuePair.key].push(tagsKeyValuePair.value)

		})
		var getParameters = {}
		for (var key in parameters) {
			getParameters[this.dictionary[key]] = parameters[key].join(",")
		}
		return getParameters
	}
}

var UploadLayout = function(params) {
	$.extend(this, params) 
	this.init()
}

UploadLayout.prototype = {
	init: function() {
		this.view.find(".selectpicker").selectpicker()
	}
}


$(function(){
	$.Mustache.load('/templates').done(function ( ) {
		$.getJSON("/structure/", function(data) {
			$("#navbar_position").append($.Mustache.render('navbarView', data))

			var filesView = new FilesView({
				view: $("#accordion2")
			})

			var searchString = new SearchString({
				view: $("#search-string"),
				filesView: filesView
			})

			var navbarView = new NavbarView({
				view: $(".navbar"),
				searchString: searchString	
			})

			var uploadLayout = new UploadLayout({
				view: $("#modal_file_upload")
			})

			$(".alert").alert();
			filesView.reload()
		
			deleteFile = function(id) {
				$("#modal_file_deleting .confirm-deleting-file").unbind("click").click(function() {
					$.ajax({
						url: '/files/' + id,
						type: 'DELETE',
					}).done(function() {
						$("#modal_file_deleting").modal('hide')
						searchString.go()
					}).fail(function() {
						// alert("fail")
					})
				})
				$("#modal_file_deleting").modal()
			}
		})
	})
})