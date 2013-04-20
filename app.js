// var orm = require("orm")
var express = require("express")
var fs = require("fs")

var app = express()

// var config = JSON.parse(fs.readFileSync("config.json"))

console.log("mysql://" + config.dbUser + ":" + config.dbPassword + "@" + config.dbHost + "/" + config.dbDatabase)

// app.use(orm.express("mysql://" + config.dbUser + ":" + config.dbPassword + "@" + config.dbHost + "/" + config.dbDatabase, {
//     define: function (db, models) {
//         models.file = db.define("file", {
//         	name: String,
// 			url: String,
// 			subject: String,
// 			semester: Number,
// 			type: ["лекции", "задание", "готовая работа", "вопросы", "другое"],
// 			date: Number
//         });
//     }
// }));

app.get('/files', function(req, res) {
	// file.create([
	//     {
	//         name: "рарар",
	//         url: "http://google.com",
	//         semester: 3,
	//         type: "лекции"
	//     }], function (e, items) {
	//     	console.log(e)
	// });
    res.send('hello world')
})

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});