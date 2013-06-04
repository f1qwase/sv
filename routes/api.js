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

exports.struct = function(req, res) {
	var params = req.params.id;
	var Klassif = ["academicYear", "semester", "subject", "type"]
	
//res.writeHead(200, {'Content-Type': 'text/plain'});

//"type", "academicYear", "semester", "subject"
	req.models[(params==null)?Klassif[0]:params].find({  }, function (err, SearchRes) {
		res.send( SearchRes[0].val );
	});
//    res.write(" ok");
//	res.end();
}

exports.files = function(req, res) {
	req.models.file.find({ /*name: "file1"*/ }, function (err, files) {
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

	        files[0].subj = "0";
	        files[0].save( function (err) { console.log( err ); } );
		}
	})
	//res.send('form worked ' );
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
	res.sendfile("./public/test.htm")
}
exports.structdatai = function(req, res) {
	res.sendfile("./public/test.htm")
}