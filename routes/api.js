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
	res.send(params);
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