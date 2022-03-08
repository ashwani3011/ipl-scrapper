const request = require("request");
const cheerio = require("cheerio");
const getPlayerAllDetailsObj = require("./scorecard.js");
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
    getPlayerAllDetailsObj.getPlayerAllDetails(fullLink);
  }
}

module.exports = {
  gAlmatches: getAllMatchLink,
};
