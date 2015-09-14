var request = require("request");
var cheerio = require('cheerio');
var domainName = 'http://www.fusioncharts.com';
var urlList = ['http://www.fusioncharts.com/'];
var duplicateList = [];

function requestUrl(url) {
    setTimeout(function() {
        //console.log('currently crawling ', url);
        request({
            uri: url,
            method: "GET",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36'
            },
            timeout: 15000,
            followRedirect: true,
            maxRedirects: 10
        }, processFile);
    }, 0);
}

function processFile(error, response, responseBody) {
    var $;
    if (responseBody) {
        $ = cheerio.load(responseBody);
        //var path = response.socket._httpMessage.path;
        //path = path.substring(0, path.lastIndexOf('/')+1);


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
                    //if(path === '/' || path.indexOf('/') === -1)
                    nextLink = domainName + '/' + nextLink;
                    //else {
                    //   nextLink = domainName + path + nextLink;
                    //}
                    flag = true;
                }
                if (nextLink.indexOf('.xml') !== -1 || nextLink.indexOf('.json') !== -1 || nextLink.indexOf('/javascript:') !== -1) {
                    flag = false;
                }
                if (flag && urlList.indexOf(nextLink) === -1 && nextLink.indexOf('/dev/') === -1) {
                    urlList.push(nextLink);
                    if ($('link[rel=canonical]').length > 1 && duplicateList.indexOf($('link[rel=canonical]')[0].attribs.href) === -1) {
                        console.log('Duplicate Canonical in ', $('link[rel=canonical]')[0].attribs.href);
                        duplicateList.push($('link[rel=canonical]')[0].attribs.href);
                    }
                    requestUrl(nextLink);
                }
            }
        });
        delete $;
    }
}
requestUrl('http://www.fusioncharts.com/extensions/');