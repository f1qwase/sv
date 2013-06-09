var getStartFileList = function(callback) {
	$.getJSON("/files", {}, callback)
}

var searchFormat = function(key, value) {
	return key + ":" + value
}
var searchDeformat = function(string) {
	var arr = string.split(":")
	if (arr.length = 2) {
		return {
			key: arr[0],
			value: arr[1]
		}
	}
}

$(function() {

	$.Mustache.load('element_template.htm').done(function ( ) {
		filesView = {
			render: function(file) {
				return $.Mustache.render('fileView', file)
			},
			view: $("#accordion2"),
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

			$(".navbar select").change(function(e) {
				var tooltipText = $(this).siblings().find(".filter-option").text()
				$(this).parent().attr("title", tooltipText)
				// var selected = $(".navbar select :selected").map(function(item) {
				// 	return $(this).text()
				// }).toArray()
				// console.log(selected)
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

					$.getJSON("/files", searchString.asGetParams(), function(data) {
						filesView.reload(data)
					})
				},
				afterTagAdded: function(e, ui) {
					$.getJSON("/files", searchString.asGetParams(), function(data) {
						filesView.reload(data)
					})
				}
			})
			searchString.asGetParams = function() {
				var dictionary = {
					"Курс": "academicYear",
					"Семестр": "semester",
					"Предмет": "subject",
					"Тип": "type"
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
				// console.log(parameters)
				// console.log(searchString)
				var getParameters = {}
				for (var key in parameters) {
					getParameters[dictionary[key]] = parameters[key].join(",")
				}
				return getParameters
			}


		})
	})
})