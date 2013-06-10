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

var attributesDictionary = {
	"Курс": "academicYear",
	"Семестр": "semester",
	"Предмет": "subject",
	"Тип": "type",
	"ss": "ss",
	"Описание": "description",
	"Название": "filename"
}

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
			// autocomplete: { source: [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ] }
		})
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
			getParameters[attributesDictionary[key]] = parameters[key].join(",")
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
		var that = this
		this.uploadButton = $("#upload-file-button")
	    // Change this to the location of your server-side upload handler:
	    var url = ('/files/');
	    $('#fileupload').fileupload({
	        url: url,
	        // dataType: 'json',
	        maxNumberOfFiles: 1,
	        autoUpload: false,
	        add: function (e, data) {
                that.__data = data;
	        },
	        change: function (e, data) {
	        	$("#files").empty()
		        switch (data.files.length) {
		        	case 0:
		        		console.log("asdasdasd")
		        		break
		        	case 1:
		        		data.context = $('<div/>').appendTo('#files');
				        var file = data.files[0]
			            var node = $('<div class="fade in"><button id="cancelUpload" type="button" class="close" data-dismiss="alert">×</button>' + file.name + '</div>')
			            node.bind("closed", function() {
			            	that.__data = undefined
			            })
			            node.appendTo(data.context);
		        		break
		        	default:
		        		throw("multiple file upload disabled")
		        		break
		        }
	        },
	        done: function (e, data) {
	        	that.refresh()
	        	that.hide()
	        	that.searchString.go()
	        },
	        always: function(e, data) {
	        	console.log(data)
	        },
	        progressall: function (e, data) {
	            var progress = parseInt(data.loaded / data.total * 100, 10);
	            $('#progress .bar').css(
	                'width',
	                progress + '%'
	            );
	        }
	    });
	    this.uploadButton.click(function() {
	    	var params = that.getParameters()
			$('#fileupload').fileupload("option", "formData", params)
			if (that.__data != undefined && that.validate(params) == true) {
				$('#progress .bar').show()
				that.__data.submit()
			}
			else {
				alert("надо тут все заполнить")
			}
	    })
	},
	getParameters: function() {
		var params = {}
		this.view.find("select").each(function(select) {
			// console.log(this)
			var key = attributesDictionary[$(this).attr("title")]
			var value = $(this).find(":selected").text()
			params[key] = value
		})
		this.view.find("input[type='text']").each(function() {
			var key = attributesDictionary[$(this).siblings("label").text()]
			var value = $(this).val()
			params[key] = value
		})
		this.view.find("textarea").each(function() {
			var key = attributesDictionary[$(this).siblings("label").text()]
			var value = $(this).val()
			params[key] = value
		})
		return params
	},
	validate: function(parameters) {
		for (var i in parameters) {
			if (!parameters[i]) {
				return false
			}
		}
		return true
	},
	refresh: function() {
		this.view.find("select").each(function(select) {
			$(this).find(":selected").removeAttr("selected")
		})
		this.view.find("input[type=text]").each(function() {
			$(this).val("")
		})
		this.view.find("textarea").each(function() {
			$(this).val("")
		})
		this.view.find("#cancelUpload").alert('close')
		this.view.find('#progress .bar').hide()
	},
	hide: function() {
		this.view.modal("hide")
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
				view: $("#modal_file_upload"),
				searchString: searchString
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