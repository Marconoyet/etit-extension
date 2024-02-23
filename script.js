window.onload = onWindowLoad;

function onWindowLoad() {
  var message = document.querySelector("#message");
  let from = document.querySelector(".from-place");
  let to = document.querySelector(".to-place");
  let start = document.querySelector(".from-time");
  let end = document.querySelector(".to-time");
  let carNumber = document.querySelector(".car-code");
  let dayDate = document.querySelector(".day-date");
  let distance = document.querySelector(".distance");
  let maxSpeed = document.querySelector(".max-speed");
  let totalTime = document.querySelector(".total-time");
  let tabContent = document.querySelector(".tabcontent");
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
      if (results[0].result.tabContent !== undefined) {
        tabContent.innerHTML = `<h2>Date: <span class="day-date">${results[0].result.dayDate}</span></h2>
        <h2 class="car-code">${results[0].result.carNumber}</h2> <h2 class="car-code">${results[0].result.tabContent}</h2>`;
      } else {
        from.innerHTML = results[0].result.from;
        to.innerHTML = results[0].result.to;
        start.innerHTML = results[0].result.start;
        end.innerHTML = results[0].result.end;
        carNumber.innerHTML = results[0].result.carNumber;
        dayDate.innerHTML = results[0].result.dayDate;
        distance.innerHTML = results[0].result.totalDistance;
        maxSpeed.innerHTML = results[0].result.maxSpeed;
        totalTime.innerHTML = results[0].result.totalTime;
      }
    })
    .catch(function (error) {
      message.innerHTML =
        "There was an error injecting script : \n" + error.message;
    });
}

function DOMtoString(selector) {
  let result = {};
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
    let travelledDistance = 0;
    maxSpeed = 0;
    let totalDistances = [];
    let carNumber = moves[0]["Plate No."];
    let placeMoved = moves[0]["From Address"];
    let dayDate = moves[0]["Start Date"].split(" ")[0];
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
      travelledDistance += +move["Distance Travelled"];
      if (+move["Distance Travelled"] > biggestDistance) {
        biggestDistance = +move["Distance Travelled"];
      }
      if (placeMoved !== move["From Address"]) {
        placeMoved = true;
      }

      if (+move["Max Speed"] > maxSpeed) {
        maxSpeed = +move["Max Speed"];
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
      result.dayDate = dayDate;
      result.carNumber = carNumber;
      result.tabContent = `لا يكـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــن`;
    } else if (fromAddress !== "") {
      console.log(fromAddress);
      console.log(toAddress);
      console.log(startDate);
      console.log(EndDate);
      result.from = replaceCommas(removeExtraCommas(fromAddress));
      result.to = replaceCommas(removeExtraCommas(toAddress));
      result.start = startDate;
      result.end = EndDate;
      result.carNumber = carNumber;
      result.dayDate = dayDate;
      result.maxSpeed = `${maxSpeed.toFixed(2)} KM/H`;
      result.totalDistance = `${travelledDistance.toFixed(2)} KM`;
      var timeDifference = calculateTimeDifference(startDate, EndDate);
      result.totalTime = `${timeDifference} H`;
    } else {
      // result = `<div><strong>totalDistance:</strong> ${totalDistance}</div> <br/>
      //           <div><strong>moved:</strong> ${moved}</div> <br/>
      //           <div><strong>backCheck:</strong> ${backCheck}</div> <br/>
      //           <div><strong>placeMoved:</strong> ${placeMoved}</div> <br/>
      //           <div><strong>From:</strong> ${fromAddress}</div> <br/>
      //           <div><strong>biggestDistance:</strong> ${biggestDistance}</div> <br/>
      // `;
    }
    function calculateTimeDifference(time1, time2) {
      // Parse input strings into Date objects
      var parts1 = time1.split(":");
      var parts2 = time2.split(":");
      var date1 = new Date();
      date1.setHours(
        parseInt(parts1[0]),
        parseInt(parts1[1]),
        parseInt(parts1[2] || 0)
      );
      var date2 = new Date();
      date2.setHours(
        parseInt(parts2[0]),
        parseInt(parts2[1]),
        parseInt(parts2[2] || 0)
      );

      // Calculate time difference in milliseconds
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());

      // Convert time difference from milliseconds to hours, minutes, and seconds
      var hours = Math.floor(timeDiff / (1000 * 60 * 60));
      var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      // Format the result
      var result =
        padWithZero(hours) +
        ":" +
        padWithZero(minutes) +
        ":" +
        padWithZero(seconds);
      return result;
    }
    function removeExtraCommas(str) {
      // Split the string by commas
      var parts = str.split(",");

      // Filter out empty elements
      parts = parts.filter(function (part) {
        return part.trim() !== ""; // Trim whitespace and check if the part is not empty
      });

      // Join the array back together with commas
      return parts.join(",");
    }

    function replaceCommas(str) {
      // Split the string by commas
      var parts = str.split(",");

      // Join the array back together with Arabic comma "،"
      return parts.join(" ،  ");
    }

    // Helper function to pad numbers with leading zeros
    function padWithZero(number) {
      return (number < 10 ? "0" : "") + number;
    }
  }
  return result;
}
