var files = [
	{
		name: "конспект по физике",
		url: "http://google.com&q=конспект по физике",
		subject: "физика",
		semester: 4,
		type: "лекция",
		author: "Виктор Пепяка",
		date: ""
	},
	{
		name: "лаба по ЗИ",
		url: "http://google.com&q=лаба по ЗИ",
		subject: "защита информации",
		semester: 4,
		type: "задание",
		author: "Андрей И",
		date: ""
	},
	{
		name: "моя лаба по ЗИ 1",
		url: "http://google.com&q=моя лаба по ЗИ 1",
		subject: "готовая работа",
		semester: 4,
		type: "лекция",
		author: "John Doe",
		date: ""
	}
]
$(function(){
	$.Mustache.load('./views/templates.html')
	    .done(function ( ) {
	    	// console.log(arguments)
	    	var fileListView = $.Mustache.render('fileList', files)
	    	$("body").append(fileListView)
  		})
})