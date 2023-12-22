window.onload = onWindowLoad;

function main() {
  onWindowLoad();
}

function onWindowLoad() {
  var message = document.querySelector("#message");
  console.log();
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
      console.log(results[0].result);
      message.innerHTML = results[0].result;
    })
    .catch(function (error) {
      message.innerHTML =
        "There was an error injecting script : \n" + error.message;
    });
}

function DOMtoString(selector) {
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
    let fromAddress, toAddress, startDate, EndDate;
    let counter = 0,
      distance = 0,
      moved = false;
    moves.map((move, index) => {
      // no recordes to display
      if (move["Start Date"] === "No records to display.") {
        console.log("لا يكــــــــــــــــــــــــن");
      }
      // know if didn't move
      distance += +move["Distance Travelled"];
      // get first move (fromAddress & startDate)
      if (
        move["From Address"] !== move["To Address"] &&
        counter === 0 &&
        +move["Distance Travelled"] > 10
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
    });
    if (distance <= 10 || !moved) {
      fromAddress = "";
      toAddress = "";
      startDate = "";
      EndDate = "";
      console.log("لا يكــــــــــــــــــــــــن");
    } else {
      console.log(fromAddress);
      console.log(toAddress);
      console.log(startDate);
      console.log(EndDate);
    }
  }
  return selector.outerHTML;
}
