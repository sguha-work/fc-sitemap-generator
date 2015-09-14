var readline = require('readline');
var fs = require('fs');
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
}];
function urlUnit(url) {
  var priority = 0.9;
  for(var i = 0; i < priorityRules.length; i++) {
    if(url.indexOf(priorityRules[i].pattern) !== -1) {
      priority = priorityRules[i].priority;
      break;
    }
  }
  return "<url><loc>" + url + "</loc><lastmod>"+ today + "</lastmod><changefreq>daily</changefreq><priority>" + priority.toString() +"</priority></url>";
}
rl.on('line', function(line) {
    fs.appendFile("gensitemaps/sitemap-dev-full.xml", urlUnit(line), function(err) {
        if (err) {
            return console.log(err);
        }
    });
});