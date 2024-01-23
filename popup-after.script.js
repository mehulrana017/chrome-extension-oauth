window.onload = function () {
  // document.querySelector(".logout").style.display = "none";
  document.querySelector(".logout").addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      let revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${token}`;

      fetch(revokeUrl).then(() => {
        // Update extension state to reflect that user is logged out
        // ...

        // Remove the token from the cache
        chrome.identity.removeCachedAuthToken({ token: token }, function () {
          // Handle the logout UI update or redirect
          // ...
          changePopup();
        });
      });
    });
  });
};

function changePopup() {
  chrome.action.setPopup({ popup: "popup.html" }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error setting popup: ${chrome.runtime.lastError.message}`);
    }
    window.location.reload();
  });
}
