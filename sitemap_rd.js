var request = require("request");
var cheerio = require('cheerio');
var domainName = 'http://www.fusioncharts.com';
var urlList = ['http://www.fusioncharts.com/'];
var listIndex = 0;
function requestUrl(url) {
    console.log('currently crawling ', url);
    request({
        uri: url,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
        },
        timeout: 15000,
        followRedirect: true,
        maxRedirects: 10
    }, processFile);
}
function processFile(error, response, responseBody) {
    var $;
    //console.log("content type is ", response.headers['content-type']);
    if (responseBody) {
        $ = cheerio.load(responseBody);
        $('body').find('a').each(function() {
            var nextLink = $(this).attr('href'),
                flag = false;
            if (nextLink) {
                nextLink = nextLink.split('#')[0];
                nextLink = nextLink.split('?PageSpeed=noscript')[0];
                nextLink = nextLink.split('&PageSpeed=noscript')[0];
                if (nextLink.indexOf('http') === 0 || nextLink.indexOf('www') === 0) {
                    if (nextLink.indexOf(domainName) > -1 && urlList.indexOf(nextLink) === -1) {
                        flag = true;
                    }
                } else if (nextLink.indexOf('/') === 0) {
                    nextLink = domainName + nextLink;
                    flag = true;
                } else if (nextLink.indexOf('mailto:') !== 0) {
                    nextLink = domainName + '/' + nextLink;
                    flag = true;
                }
                if(nextLink.indexOf('.xml') !== -1 || nextLink.indexOf('.json') !== -1 || nextLink.indexOf('/javascript:') !== -1) {
                    flag = false;
                }
                if (flag && urlList.indexOf(nextLink) === -1 && nextLink.indexOf('/dev/') !== -1) {
                    urlList.push(nextLink);
                    //requestUrl(nextLink);
                }
            }
        });
        listIndex++;
        requestUrl(urlList[listIndex]);
    }
}
requestUrl('http://www.fusioncharts.com/');