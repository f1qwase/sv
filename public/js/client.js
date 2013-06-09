var getStartFileList = function(callback) {
	$.getJSON("/files/", {}, callback)
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
				console.log(notSelected, existedTags)
				notSelected.filter(function(value) {
					return existedTags.indexOf(searchFormat(key, value)) != -1
				}).forEach(function(value) {
					console.log("rm " + value)
					searchString.tagit("removeTagByLabel", searchFormat(key, value))
				})
			})

			searchString.tagit({
				allowSpaces: true,
				caseSensitive: false,
				placeholderText: "Поиск",
				afterTagRemoved: function(e, ui) {
					var deletedTag = searchDeformat(ui.tagLabel)
					if (deletedTag) {
						console.log(deletedTag)
						console.log($(".navbar select[title='" + deletedTag.key + "'] option:contains('" + deletedTag.value + "')"))
						$(".navbar select[title='" + deletedTag.key + "'] option:contains('" + deletedTag.value + "')").removeAttr("selected")
						$('.selectpicker').selectpicker('refresh');
					}
				}
			})


		})
	})
})