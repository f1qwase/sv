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


var getStartFileList = function(callback) {
	$.getJSON("/files", {}, callback)
}

var searchFormat = function(key, value) {
	return key + ":" + value
}
var searchDeformat = function(string) {
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
	reload: function(files) {
		var that = this
		this.view.empty()
		if (files.length == 0) {
			this.view.append("нету ничего")
		}
		else {
			files.forEach(function(file) {
				that.add(file)
			})
		}
	}
}

$(function() {
	$.Mustache.load('element_template.htm').done(function ( ) {
		filesView = new FilesView({
			view: $("#accordion2")
		})
		getStartFileList(function(fileList) {
			filesView.reload(fileList)
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

			var searchString = $("#search-string")
			$(".navbar select").change(function(e) { //change tooltip
				var tooltipText = $(this).siblings().find(".filter-option").text()
				$(this).parent().attr("title", tooltipText)
			})

			$(".navbar select").change(function(e) {
				var key = this.title
				var options = $(this).find("option") 
				var selected = options.filter(":selected").toArray().map(function(option) {
					return $(option).val()
				})
				var notSelected = options.not(":selected").toArray().map(function(option) {
					return $(option).val()
				})
				existedTags = searchString.tagit("assignedTags")
				selected.forEach(function(value) {
					searchString.tagit("createTag", searchFormat(key, value))
				})
				notSelected.filter(function(value) {
					return existedTags.indexOf(searchFormat(key, value)) != -1
				}).forEach(function(value) {
					searchString.tagit("removeTagByLabel", searchFormat(key, value))
				})
			})
			deleteFile = function(id) {
				$.ajax({
					url: '/files/' + id,
					type: 'DELETE',
					success: searchString.go
				})
			}

			searchString.go = function() {
				$.getJSON("/files", searchString.asGetParams(), function(data) {
					filesView.reload(data)
				})
			}
			searchString.tagit({
				allowSpaces: true,
				hello: "asd",
				caseSensitive: false,
				placeholderText: "Поиск",
				afterTagRemoved: function(e, ui) {
					var deletedTag = searchDeformat(ui.tagLabel)
					if (deletedTag) {
						$(".navbar select[title='" + deletedTag.key + "'] option:contains('" + deletedTag.value + "')").removeAttr("selected")
						$('.selectpicker').selectpicker('refresh');
					}

					searchString.go()
				},
				afterTagAdded: function(e, ui) {
					searchString.go()
				}
			})
			searchString.asGetParams = function() {
				var dictionary = {
					"Курс": "academicYear",
					"Семестр": "semester",
					"Предмет": "subject",
					"Тип": "type",
					"ss": "ss"
				}
				var parameters = {}
				var tags = searchString.tagit("assignedTags").forEach(function(param) {
					var tagsKeyValuePair = searchDeformat(param)
					if (!tagsKeyValuePair) {
						tagsKeyValuePair = {key: "ss", value: param}
					}
					parameters[tagsKeyValuePair.key] = parameters[tagsKeyValuePair.key] || []
					parameters[tagsKeyValuePair.key].push(tagsKeyValuePair.value)

				})
				var getParameters = {}
				for (var key in parameters) {
					getParameters[dictionary[key]] = parameters[key].join(",")
				}
				return getParameters
			}
		})
	})
})