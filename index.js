const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request = require("request");
const cheerio = require("cheerio");
const allMatchObj = require("./allMatch");
request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractAllResultPageLink(html);
  }
}

function extractAllResultPageLink(html) {
  let $ = cheerio.load(html);
  let anchorElem = $("a[data-hover='View All Results']");
  let link = anchorElem.attr("href");
  //   console.log(allResultPageUrl);
  let completeLink = "https://www.espncricinfo.com" + link;
  //   console.log(allResultPageUrlComplete);

  allMatchObj.gAlmatches(completeLink);
}
