const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const allMatchObj = require("./allMatch");

const iplPath = path.join(__dirname, "IPL");
dirCreater(iplPath);
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

function dirCreater(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}
