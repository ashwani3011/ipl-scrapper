const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

// venue date oponent result runs balls fours sixes sr
// ipl
//      team
//          player.xsl

// venue date result will remain same for both team players

const request = require("request");
const cheerio = require("cheerio");
request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractMatchDetails(html);
  }
}

function extractMatchDetails(html) {
  let $ = cheerio.load(html);
  let matchDesc = $(".header-info .description");
  let result = $(".event .status-text");
  let matchDescArray = matchDesc.text().split(",");
  let venue = matchDescArray[1].trim();
  let date = matchDescArray[2].trim();
  result = result.text();
  //   console.log(venue, date, result);

  // segregating the scorecard table

  let scorecardTables = $(
    ".card.content-block.match-scorecard-table .Collapsible"
  );
  let htmlString = "";
  for (let i = 0; i < scorecardTables.length; i++) {
    htmlString += $(scorecardTables[i]).html();
  }
  console.log(htmlString);
}
