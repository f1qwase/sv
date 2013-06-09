var Filters = [ "academicYear", "semester", "subject", "type"];
var async = require('async');


exports.fupl = function(req, res) {
	req.models.file.create([
    {
        filename: "file1",
        description: "opisanie",
        academicYear_id : 1,
		semester_id: 1,
		subject_id: 1,
		type_id: 1		
    }], function (err, items) {
		console.log (err);
	})
}





exports.struct = function(req, res) {
	var params = (req.params.id == null)? Filters :(req.params.id).split(",");
	var Out = {};
	async.forEachSeries(params, function(klassificator, callback) 
	{ 
		(req.models[klassificator]==null)? res.send ( JSON.stringify(null) ):req.models[klassificator].find({  }, function (err, SearchRes)
		{
			Out[klassificator] = SearchRes.map(function(item) {return item.val})
			callback();
		});
    }, function(err){
		res.json( Out );
	});
}

exports.files = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	var Q = {};
	async.forEachSeries(Filters, function( flt, callback ) 
	{
		(query[flt] == null)? callback() :  req.models[flt].find( { val : query[flt].toString().split(",") } , function (err, t_r ) 
		{
			Q[flt + '_id'] = t_r.map(function(item) {return item.id});
			callback();
		})
	}, function( err ){
		Q["isdel"] =  [ 0 ];
		req.models.file.find( Q , function (err, files) {
			if (( err )|| (!files))
			{
				res.send( null );
				return;
			}
			jt = JSON.stringify(files.map(function(item) {return item.ToClientModel()}));
			res.send ( jt );
		});
	});
}

exports.structdata = function(req, res){
	if (req.body.tval!=null)
	{
		req.models[req.body.bdname].create([
    		{
        		val: req.body.tval ,
	    	}], function (err, items) {
			//;
		});
	}
	res.sendfile( require('path').dirname(require.main.filename) +'/public/test.htm')
}
exports.structdatai = function(req, res) {
	res.sendfile( require('path').dirname(require.main.filename) +'/public/test.htm')
}
