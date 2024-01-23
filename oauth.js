const API_KEY = process.env.API_KEY;
window.onload = function () {
  // document.querySelector(".logout").style.display = "none";

  document.querySelector("#after_login").style.display = "none";
  document.querySelector(".login").addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      let init = {
        method: "GET",
        async: true,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        contentType: "json",
      };
      fetch(
        `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${API_KEY}`,
        init
      )
        .then((response) => {
          if (response.ok) {
            document.querySelector("#after_login").style.display = "block";
            document.querySelector("#before_login").style.display = "none";
          } else {
            // Handle the error or non-successful response here
            console.error("Response not OK");
          }
          // window.location.href("popup-after.html");
          return response.json();
        })
        .then(function (data) {
          console.log(data); // Inspect the returned data
          let photoDiv = document.querySelector("#friendDiv");
          let returnedContacts = data.memberResourceNames;

          if (returnedContacts && returnedContacts.length > 0) {
            for (let i = 0; i < returnedContacts.length; i++) {
              fetch(
                "https://people.googleapis.com/v1/" +
                  returnedContacts[i] +
                  `?personFields=photos&key=${API_KEY}`,
                init
              )
                .then((response) => response.json())
                .then(function (data) {
                  if (data.photos && data.photos.length > 0) {
                    let profileImg = document.createElement("img");
                    profileImg.src = data.photos[0].url;
                    photoDiv.appendChild(profileImg);
                  }
                });
            }
          } else {
            console.log(
              "No contacts found or memberResourceNames is undefined."
            );
          }
        });
    });
  });

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
          document.querySelector("#before_login").style.display = "block";
          document.querySelector("#after_login").style.display = "none";
        });
      });
    });
  });
};

// function logout() {
//   chrome.identity.getAuthToken({ interactive: false }, function (token) {
//     let revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${token}`;

//     fetch(revokeUrl).then(() => {
//       // Update extension state to reflect that user is logged out
//       // ...

//       // Remove the token from the cache
//       chrome.identity.removeCachedAuthToken({ token: token }, function () {
//         // Handle the logout UI update or redirect
//         // ...
//         window.location.href = "popup.html";
//       });
//     });
//   });
// }

// function changePopup() {
//   chrome.action.setPopup({ popup: "popup-after.html" }, () => {
//     // if (chrome.runtime.lastError) {
//     //   console.error(`Error setting popup: ${chrome.runtime.lastError.message}`);
//     // }
//     window.location.reload();
//   });
// }
