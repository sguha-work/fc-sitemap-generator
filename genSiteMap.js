var readline = require('readline');
var fs = require('fs');
fs.writeFile("gensitemaps/sitemap.xml", "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><urlset xmlns=\"http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9\">");
var rl = readline.createInterface({
    input: fs.createReadStream('fc_url_list.txt'),
    output: process.stdout,
    terminal: false
});
var today = (new Date()).toISOString().slice(0,10);
var priorityRules = [{
  pattern: "/resources/",
  priority: "0.8"
}, {
  pattern: "/chart-primers/",
  priority: "0.8"
}, {
  pattern: "/whitepapers/",
  priority: "0.8"
}, {
  pattern: "/charting-best-practices/",
  priority: "0.8"
}, {
  pattern: "/dev/",
  priority: "0.7"
}, {
  pattern: "/company/",
  priority: "0.4"
}, {
  pattern: "/customers/",
  priority: "0.4"
}, {
  pattern: "/buy/",
  priority: "0.6"
},{
  pattern: "/blog/",
  priority: "0.7"
}];
function urlUnit(url) {
  var priority = 0.9;
  for(var i = 0; i < priorityRules.length; i++) {
    if(url.indexOf(priorityRules[i].pattern) !== -1) {
      priority = priorityRules[i].priority;
      break;
    }
  }
  return "<url><loc>" + url.split("&").join("&amp;").split(".com//").join(".com/") + "</loc><lastmod>"+ today + "</lastmod><changefreq>daily</changefreq><priority>" + priority.toString() +"</priority></url>";
}
rl.on('line', function(line) {

    fs.appendFile("gensitemaps/sitemap.xml", urlUnit(line), function(err) {
        if (err) {
            return console.log(err);
        }
    });
});
rl.on('close', function() {
  fs.appendFile("gensitemaps/sitemap.xml", "</urlset>", function(err) {
        if (err) {
            return console.log(err);
        }
    });
})
