var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
	var cookies = request.cookies;
	console.log(cookies);
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			response.setHeader('Set-Cookie', 'session_id=' + sid);
			response.end(login.hello(sid));	
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login via HTTP POST\n");
	}
};



function post(request, response) {
	// TODO: read 'name and email from the request.body'
	// var newSessionId = login.login('xxx', 'xxx@gmail.com');
	// TODO: set new session id to the 'session_id' cookie in the response
	// replace "Logged In" response with response.end(login.hello(newSessionId));
	//console.log("inside post method");
	var cookies = request.cookies;
	var name = request.body.name; //fetch name from request body 
	var email=request.body.email; // 
	var newSessionId=login.login(name,email);
	response.setHeader('Set-Cookie', 'session_id=' +newSessionId);
	response.end(login.hello(newSessionId));

	//console.log("post method end....*****///")
};


function del(request, response) {
	console.log("DELETE:: Logout from the server");
 	// TODO: remove session id via login.logout(xxx)
 	// No need to set session id in the response cookies since you just logged out!
        var cookies = request.cookies;
        console.log(cookies);
        if ('session_id' in cookies) {
                var sid = cookies['session_id'];
                if ( login.isLoggedIn(sid) ) {
                        login.logout(sid);
                        response.end('Logged out from the server');
        }
                else
                {
                        response.end('Logged out Previously');
                }
        }
        else
        {
                response.end('Invalid Session ID.');             
        }
  	
};

function put(request, response) {
	console.log("PUT:: Re-generate new session_id for the same user");
        // TODO: refresh session id; similar to the post() function
        var cookies = request.cookies;
        if ('session_id' in cookies){

                var sessionId = cookies['session_id'];
                var name=login.isName(sessionId);
                var email=login.isEmail(sessionId);
                login.logout(sessionId);
		var reSessionId=login.login(name,email);        
                response.setHeader('Set-Cookie', 'session_id=' + reSessionId);
                response.end("Re-freshed session id\n");
        }       
        else
        {
                response.end("Session Id not found\n");
        }

};

app.listen(8000);

console.log("Node.JS server running at 8000...");
