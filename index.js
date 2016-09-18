
var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require('url');
var Nightmare = require('nightmare');

const PORT = process.env.PORT || 80;

function handleRequest(request, response) {
    try {
        console.log(request.url);
        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
}

function sendError(response, text) {
    response.write("" + text);
    response.end();
}

// page render request     
dispatcher.onGet("/render", function (req, res) {

    var urlParts = url.parse(req.url, true);
    var query = urlParts.query;
    var renderUrl = query.url;
    if (!renderUrl)
        sendError(res, "No url parameter given!");
    else {
        console.log("Rendering URL : ", renderUrl);


        var mobile = query.mobile === "true";
        var width = query.width !== undefined ? parseInt(query.width) : (mobile ? 375 : 1280);
        var height = query.height !== undefined ? parseInt(query.height) : (mobile ? 667 : 800);
        var useragent = mobile ? "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5" : "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";
        var additionalWait = query.additionalwait !== undefined ? parseInt(query.additionalwait) : 100;

        console.log("width :", width, typeof width);
        console.log("height :", height);
        console.log("additionalWait :", additionalWait);

        var nightmare = Nightmare({ show: false, waitTimeout: 15000, width: width, height: height, x: 10, y: 10 });

        nightmare
            .viewport(width, height)
            .useragent(useragent)
            .goto(renderUrl)
            .wait("body")
            .wait(function () {
                return window["prerenderReady"] === true;
            })
            .wait(additionalWait)
            .screenshot()
            .end()
            .then(function (result) {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(result);
            })
            .catch(function (error) {
                if (error instanceof Array)
                    sendError(res, error);
                else if (error.message)
                    sendError(res, error.message + "\n" + error.details);
                else if (typeof error === 'object')
                    sendError(res, JSON.stringify(error));
                else
                    sendError(res, error);
                console.error('ERROR:', error);
            });
    }


});


var server = http.createServer(handleRequest);
server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});