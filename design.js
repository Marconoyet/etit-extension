// Function to open a tab

function openTab(event, tabName) {
  // Hide all tab contents
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove 'active' class from all tab links
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the specific tab content and mark the button as active
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");
}

// Assign event listeners to tab buttons
document.addEventListener("DOMContentLoaded", function () {
  var tablinks = document.querySelectorAll(".tablinks");
  tablinks.forEach(function (tablink) {
    tablink.addEventListener("click", function (event) {
      openTab(event, tablink.dataset.tab);
    });
  });

  // Open the default tab on page load
  document.getElementById("defaultOpen").click();
});
