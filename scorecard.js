const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

// venue date oponent result runs balls fours sixes sr
// ipl
//      team
//          player.xsl

// venue date result will remain same for both team players

const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

function getPlayerAllDetails(url) {
  request(url, cb);
}

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
  //   let htmlString = "";
  for (let i = 0; i < scorecardTables.length; i++) {
    // htmlString += $(scorecardTables[i]).html();

    // team and oponent
    let teamName = $(scorecardTables[i]).find("h5").text();
    teamName = teamName.split("INNINGS")[0].trim();
    let opponentIndex = i == 0 ? 1 : 0;
    let opponentName = $(scorecardTables[opponentIndex]).find("h5").text();
    opponentName = opponentName.split("INNINGS")[0].trim();
    // console.log(
    //   `${teamName} | ${oponentName} | ${venue} | ${date} | ${result}`
    // );
    //player all details of the inning
    let currentInning = $(scorecardTables[i]);
    let allRows = currentInning.find(".table.batsman tbody tr");

    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      let isWorthy = $(allCols[0]).hasClass("batsman-cell");
      if (isWorthy == true) {
        // console.log(allCols.text());
        //       Player  runs balls fours sixes sr
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();
        console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
        processPlayer(
          teamName,
          playerName,
          runs,
          balls,
          fours,
          sixes,
          sr,
          opponentName,
          venue,
          date,
          result
        );
      }
    }
  }
  //   console.log(htmlString);
}

function processPlayer(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixes,
  sr,
  opponentName,
  venue,
  date,
  result
) {
  let teamPath = path.join(__dirname, "IPL", teamName);
  dirCreater(teamPath);
  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = excelReader(filePath, playerName);
  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    sr,
    opponentName,
    venue,
    date,
    result,
  };
  content.push(playerObj);
  excelWriter(filePath, content, playerName);
}

function dirCreater(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}
function excelWriter(filePath, json, sheetName) {
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read
//  workbook get
function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) == false) {
    return [];
  }
  let wb = xlsx.readFile(filePath);
  let excelData = wb.Sheets[sheetName];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

module.exports = {
  getPlayerAllDetails: getPlayerAllDetails,
};
