const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request = require("request");
const cheerio = require("cheerio");
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
  let allResultPageAnchor = $("a[data-hover='View All Results']");
  let allResultPageUrl = allResultPageAnchor.attr("href");
  //   console.log(allResultPageUrl);
  let allResultPageUrlComplete =
    "https://www.espncricinfo.com" + allResultPageUrl;
  //   console.log(allResultPageUrlComplete);

  getAllMatchLink(allResultPageUrlComplete);
}

function getAllMatchLink(url) {
  request(url, function (err, response, html) {
    if (err) {
      console.log(err);
    } else {
      extractAllMatchScorecardLink(html);
    }
  });
}

function extractAllMatchScorecardLink(html) {
  let $ = cheerio.load(html);
  let scorecardElem = $("a[data-hover='Scorecard']");
  for (let i = 0; i < scorecardElem.length; i++) {
    let link = $(scorecardElem[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    console.log(fullLink);
  }
}
