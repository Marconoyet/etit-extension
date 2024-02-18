window.onload = onWindowLoad;

function main() {
  onWindowLoad();
}

function onWindowLoad() {
  var message = document.querySelector("#message");
  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(function (tabs) {
      var activeTab = tabs[0];
      var activeTabId = activeTab.id;

      return chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
        func: DOMtoString,
        // args: ['body']  // you can use this to target what element to get the html for
      });
    })
    .then(function (results) {
      console.log(results);
      message.innerHTML = results[0].result;
    })
    .catch(function (error) {
      message.innerHTML =
        "There was an error injecting script : \n" + error.message;
    });
}

function DOMtoString(selector) {
  let result = "";
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node";
  } else {
    // selector = document.documentElement;
    selector = document.querySelector(".rgMasterTable");
    let moves = [];

    // Iterate over rows in the table (skipping the header row)
    for (var i = 1; i < selector.rows.length - 1; i++) {
      var row = selector.rows[i];
      var rowData = {};

      // Iterate over cells in the row
      for (var j = 0; j < row.cells.length; j++) {
        // Get the header text for the current column
        var headerText = selector.rows[1].cells[j].textContent.trim();
        // Set the value in the rowData object with the header as the key
        rowData[headerText] = row.cells[j].textContent.trim();
      }
      if (i !== 1)
        // Add the rowData object to the data array
        moves.push(rowData);
    }

    // Display the resulting array of objects
    console.log(moves);
    // selectTruePath(moves);
    let fromAddress = "",
      toAddress = "",
      startDate = "",
      EndDate = "",
      counter = 0,
      biggestDistance = 0,
      tempArr = [],
      backMoves = [],
      moved = false,
      backCheck = false;
    let totalDistance = 0;
    let distance = 0;
    let totalDistances = [];
    let placeMoved = moves[0]["From Address"];

    const indexOfFirstObject = moves.findIndex(
      (obj) => obj["Distance Travelled"] > 5
    );

    const reversemoves = [...moves].reverse();
    const indexOfLastObject =
      moves.length -
      reversemoves.findIndex((obj) => obj["Distance Travelled"] > 5) -
      1;
    // console.log(indexOfFirstObject, indexOfLastObject);
    if (indexOfFirstObject !== -1 && indexOfLastObject !== -1) {
      // Select objects above the first
      const objectsAboveFirst = moves
        .slice(0, indexOfFirstObject)
        .map((obj) => {
          if (!tempArr.includes(obj["From Address"])) {
            tempArr.push(obj["From Address"]);
            return obj["From Address"];
          } else if (!tempArr.includes(obj["To Address"])) {
            tempArr.push(obj["To Address"]);
            return obj["To Address"];
          }
        })
        .filter(Boolean);

      tempArr.splice(0, tempArr.length);

      // Select objects below the last
      const objectsBelowLast = moves
        .slice(indexOfLastObject + 1)
        .map((obj) => {
          if (!tempArr.includes(obj["From Address"])) {
            tempArr.push(obj["From Address"]);
            return obj["From Address"];
          } else if (!tempArr.includes(obj["To Address"])) {
            tempArr.push(obj["To Address"]);
            return obj["To Address"];
          }
        })
        .filter(Boolean);

      const commonElements = objectsAboveFirst.filter((element) =>
        objectsBelowLast.includes(element)
      );
      if (commonElements.length !== 0) backCheck = true;
      console.log(commonElements); // Output: [3, 4, 5]
      // console.log("Objects above the first one:", objectsAboveFirst);
      // console.log("Objects below the last one:", objectsBelowLast);
    } else {
      console.log("Error in select indexing");
    }

    backMoves = moves.map((move, index) => {
      // know if didn't move
      distance += +move["Distance Travelled"];
      if (+move["Distance Travelled"] > biggestDistance) {
        biggestDistance = +move["Distance Travelled"];
      }
      if (placeMoved !== move["From Address"]) {
        placeMoved = true;
      }

      // get first move (fromAddress & startDate)
      if (
        move["From Address"] !== move["To Address"] &&
        counter === 0 &&
        +move["Distance Travelled"] > 5
      ) {
        moved = true;
        fromAddress = move["From Address"];
        startDate = move["Start Date"].split(" ")[1];
        counter++;
      }
      // get last move (toAddress & endDate)
      if (
        move["From Address"] !== move["To Address"] &&
        +move["Distance Travelled"] > 5
      ) {
        toAddress = move["To Address"];
        EndDate = move["End Date"].split(" ")[1];
      }

      // fix bug of select last move
      // last position is changed in from address without matched with to address in above column
      if (
        index < moves.length - 1 &&
        move["To Address"] !== moves[index + 1]["From Address"]
      ) {
        toAddress = moves[index + 1]["To Address"];
        EndDate = moves[index + 1]["End Date"].split(" ")[1];
      }
      if (backCheck) {
        totalDistance += +move["Distance Travelled"];
        totalDistances.push(totalDistance);
        move["Total Distance"] = totalDistance;
        return move;
      }
    });
    if (backCheck) {
      const closestNumber = findClosestNumber(
        totalDistance / 2,
        totalDistances
      );
      // console.log("Closest number:", closestNumber);
      targetBackMoves = backMoves.filter(
        (move) => move["Total Distance"] === closestNumber
      );
      lastMove = targetBackMoves[targetBackMoves.length - 1];
      toAddress = lastMove["To Address"] + " والعودة ";
    }

    function findClosestNumber(target, numbers) {
      return numbers.reduce((closest, current) => {
        return Math.abs(current - target) < Math.abs(closest - target)
          ? current
          : closest;
      });
    }
    if (!moved) {
      backCheck = false;
    }
    if ((biggestDistance < 5 || !moved) && !backCheck) {
      fromAddress = "";
      toAddress = "";
      startDate = "";
      EndDate = "";
      result = `<div>لا يكــــــــــــــــــــــــن</div> <br/> <div><strong>Total Distance</strong> ${distance.toFixed(
        2
      )} KM</div> `;
    } else if (fromAddress !== "") {
      console.log(fromAddress);
      console.log(toAddress);
      console.log(startDate);
      console.log(EndDate);
      result = `<div><strong>From:</strong> ${fromAddress}</div> <br/>
                <div><strong>To:</strong> ${toAddress}</div> <br/>
                <div><strong>Start Move Time:</strong> ${startDate}</div> <br/>
                <div><strong>End Move Time:</strong> ${EndDate}</div> <br/>
                <div><strong>Total Distance</strong> ${distance.toFixed(
                  2
                )} KM</div> <br/>
      `;
    } else {
      result = `<div><strong>totalDistance:</strong> ${totalDistance}</div> <br/>
                <div><strong>moved:</strong> ${moved}</div> <br/>
                <div><strong>backCheck:</strong> ${backCheck}</div> <br/>
                <div><strong>placeMoved:</strong> ${placeMoved}</div> <br/>
                <div><strong>From:</strong> ${fromAddress}</div> <br/>
                <div><strong>biggestDistance:</strong> ${biggestDistance}</div> <br/>
      `;
    }
  }
  return result;
}
