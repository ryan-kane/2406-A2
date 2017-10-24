var http = require('http');
var url = require('url');
var fs = require('fs');

ROOT_DIR = 'html';

var MIME_TYPES = {
    'css': 'text/css',
    'gif': 'image/gif',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript', 
    'json': 'application/json',
    'png': 'image/png',
    'txt': 'text/text'
};

var get_mime = function(filename) {
    var ext, type;
    for (ext in MIME_TYPES) {
        type = MIME_TYPES[ext];
        if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
            return type;
        }
    }
    return MIME_TYPES['txt'];
};


http.createServer((request, response)=>{
	var urlObj = url.parse(request.url, true, false);	
	console.log('\n============================');
	console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + urlObj.pathname);
    console.log("METHOD: " + request.method);
	
	if(request.method == "GET"){       
		
		var filePath = ROOT_DIR + urlObj.pathname;
		if(urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'; 
		
		fs.readFile(filePath, function(err,data){
			if(err){

				//report error to console
				console.log('ERROR: ' + JSON.stringify(err));
				
				//respond with not found 404 to client
				response.writeHead(404);
				response.end(JSON.stringify(err));
				return;
			}
		response.writeHead(200, {'Content-Type': get_mime(filePath)});response.end(data);});
    }
}).listen(3000);