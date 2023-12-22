const moves = [
  {
    "Start Date": "21/12/2023 00:00:00",
    "End Date": "21/12/2023 00:02:00",
    "Plate No.": "ع م ص 528",
    Branch: "main branch",
    "Sub Branch": "",
    Group: "",
    Driver: "",
    "From Address": "مصر,الفيوم,,,,",
    "To Address": "مصر,الفيوم,,,,",
    "Distance Travelled": "0.00",
    "Max Speed": "0",
    "Event Type": "Parking",
    Geofence: "",
    "": "30.476301",
  },
  {
    "Start Date": "21/12/2023 00:02:00",
    "End Date": "21/12/2023 08:28:04",
    "Plate No.": "ع م ص 528",
    Branch: "main branch",
    "Sub Branch": "",
    Group: "",
    Driver: "",
    "From Address": "مصر,الفيوم,,,,",
    "To Address": "مصر,الفيوم,,,,",
    "Distance Travelled": "0.00",
    "Max Speed": "0",
    "Event Type": "Parking",
    Geofence: "",
    "": "30.476301",
  },
  {
    "Start Date": "21/12/2023 08:28:04",
    "End Date": "21/12/2023 09:05:29",
    "Plate No.": "ع م ص 528",
    Branch: "main branch",
    "Sub Branch": "",
    Group: "",
    Driver: "",
    "From Address": "مصر,الفيوم,,,,",
    "To Address": "مصر,الفيوم,,,,",
    "Distance Travelled": "0.00",
    "Max Speed": "0",
    "Event Type": "Idle",
    Geofence: "",
    "": "30.476301",
  },
  {
    "Start Date": "21/12/2023 09:05:29",
    "End Date": "21/12/2023 23:47:45",
    "Plate No.": "ع م ص 528",
    Branch: "main branch",
    "Sub Branch": "",
    Group: "",
    Driver: "",
    "From Address": "مصر,الفيوم,,,,",
    "To Address": "مصر,الفيوم,,,,",
    "Distance Travelled": "0.00",
    "Max Speed": "0",
    "Event Type": "Parking",
    Geofence: "",
    "": "30.476301",
  },
  {
    "Start Date": "21/12/2023 23:47:45",
    "End Date": "21/12/2023 23:59:59",
    "Plate No.": "ع م ص 528",
    Branch: "main branch",
    "Sub Branch": "",
    Group: "",
    Driver: "",
    "From Address": "مصر,الفيوم,,,,",
    "To Address": "مصر,الفيوم,,,,",
    "Distance Travelled": "0.00",
    "Max Speed": "0",
    "Event Type": "Parking",
    Geofence: "",
    "": "30.476301",
  },
];
let fromAddress, toAddress, startDate, EndDate;
let counter = 0,
  distance = 0,
  moved = false;
moves.map((move, index) => {
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
  if (move["From Address"] !== move["To Address"]) {
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
