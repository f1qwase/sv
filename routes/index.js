/*
 * GET home page.
 */

exports.index = function(req, res){
	res.sendfile("public/index.htm")
	//res.render('index.htm', { title: 'SNAME' });
}