# smallstack-webpage-renderer
This is a tiny server that renders a given url and returns it as PNG image. At smallstack.io we use it to render previews of javascript enabled pages. 

**Note:** The server will always wait for window.prerenderReady=true to be set.


## How-to run
### via node
```npm install && npm run serve```

### via docker
``` docker run -p 80:80 -d smallstack/smallstack-webpage-renderer```


## How-to use
The tiny server has only one endpoint so far, which is ```/render```. Possible Parameters are : 

Parameter     | Optional  | Default Value       | Example               | Description
------------  | ------    | -------------       | -------               | -------------
url           | no        | -                   | https://smallstack.io | The url to be rendered
mobile        | yes       | false               | true                  | Sets useragent to iPhone and uses smaller screen size
width         | yes       | 1280 (mobile: 375)  | 3840                  | The browser width
height        | yes       | 800 (mobile: 677)   | 2160                  | The browser height
additionalWait| yes       | 100                 | 5000                  | additional ms to wait after page got loaded

### Example
http://localhost/render?url=https://smallstack.io&width=600&height=800&mobile=true&additionalWait=2000
