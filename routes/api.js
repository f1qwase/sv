/*
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
	}
*/

var Filters = [ "academicYear", "semester", "subject", "type"];
var async = require('async');


exports.struct = function(req, res) {
	var params = (req.params.id == null)? Filters :(req.params.id).split(",");
	var Out = {};
	async.forEachSeries(params, function(klassificator, callback) 
	{ 
		(req.models[klassificator]==null)? res.send ( JSON.stringify(null) ):req.models[klassificator].find({  }, function (err, SearchRes)
		{
			var ContArray=[];
			SearchRes.forEach( function( KlasData )
			{
				ContArray.push( KlasData.val );
			})
			Out[klassificator] = ContArray;
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
			var tmp =[];
			t_r.forEach(function(tt)
			{
				tmp.push( tt.id );
			});
			Q[flt + '_id'] = tmp;
			callback();
		})
	}, function( err ){
		console.log( Q );
		req.models.file.find( Q , function (err, files) {
			if (( err )|| (!files))
			{
				res.send( null );
				return;
			}
			var clientArray = [];
			files.forEach(function(file)
			{
				clientArray.push(file.ToClientModel() );
			});
			jt = JSON.stringify(clientArray);
			res.send ( jt );
		});
	});



/*
	req.models.file.find({  }, function (err, files) {  //name: "file1"
		console.log("Files found: %d", files.length);
		if (files.length>0)
		{
        	console.log( 	"The 1st file is : %s", files[0].fullData() ) ;
			var clientArray = [];
			files.forEach(function(file)
			{
				clientArray.push(file.ToClientModel() );
			});
			jt = JSON.stringify(clientArray);
			res.send ( jt );
//	        files[0].subj = "0";
//	        files[0].save( function (err) { console.log( err ); } );
		}
	})
	//res.send('form worked ' );
*/
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