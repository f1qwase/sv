/*
 * GET home page.
 */

exports.index = function(req, res){
	res.sendfile( require('path').dirname(require.main.filename) +'/public/index.htm')
}