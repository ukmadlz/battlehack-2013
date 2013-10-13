
var Pusher = require( 'pusher' );

var pusher = new Pusher({ 
	appId: '56562', 
	key: '3bd6278ea3f874361959', 
	secret: 'f02ede8fa04714e14d2d'
});

var url = require('url');

var http = require('http');
http.createServer(function (req, res) {

    // Send correct header
    res.writeHead(200, {'Content-Type':'text/plain'});
    
    // URL
    var url_parts = url.parse(req.url, true);
    
    // Get params
    var query = url_parts.query;
    
    // Do Something
    console.log('number:'+query.action);

    // Send Pusher Request
    pusher.trigger('test_channel', 'player_events', {
        'message':query.action
    });

    res.end('{number:'+query.action+'}');

}).listen(1337, '127.0.0.1');