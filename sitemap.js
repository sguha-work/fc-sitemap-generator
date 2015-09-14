/*
    To run this file type
    node sitemap.js > fc_url_list.txt
    This will create a txt filr fc_url_list
    And then run
    node genSiteMap.js
    This will create a sitemap.xml file and place it in gensitemaps folder
    This file hangs sometimes. Needed to be fixed.
    As a temporary work around, you can run this program twice one without dev center 
    and one with dev center. You can do so by editing line number 62, for dev center the condition should be !==-1 and 
    for without dev center it should be ===-1.
*/
var request = require("request");
var cheerio = require('cheerio');
var domainName = 'http://www.fusioncharts.com';
var urlList = ['http://www.fusioncharts.com/'];
var listIndex = 0;

function requestUrl(url) {
    process.nextTick(function() {
        if (url && url !== 'undefined' && url !== '') {
            console.log(url);
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
    });
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
                if (nextLink.indexOf('.xml') !== -1 || nextLink.indexOf('.json') !== -1 || nextLink.indexOf('/javascript:') !== -1) {
                    flag = false;
                }
                if (flag && urlList.indexOf(nextLink) === -1 && nextLink.indexOf('/dev/') !== -1) {
                    urlList.push(nextLink);
                }
            }
        });
        listIndex++;
        callNext();
    }
}

function callNext() {
    requestUrl(urlList[listIndex]);
}
requestUrl('http://www.fusioncharts.com/');