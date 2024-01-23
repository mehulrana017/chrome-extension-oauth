chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: "popup.html" });
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action == "changePopup") {
//     chrome.action.setPopup({ popup: request.newPopup });
//   }
// });
