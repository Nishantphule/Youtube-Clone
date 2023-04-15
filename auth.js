// let API_KEY = 'AIzaSyCU7LomXvsy8Q-atxxHJmH3ZuAiPceVoXc'
// let CLIENT_ID = "725121126436-5flbb3htfh905rap6bmg3q6srtm782hc.apps.googleusercontent.com"
// let CLIENT_SECRET = "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"


// function authenticate() {
//     return gapi.auth2.getAuthInstance()
//         .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
//         .then(function() { console.log("Sign-in successful"); },
//               function(err) { console.error("Error signing in", err); });
//   }
//   function loadClient() {
//     gapi.client.setApiKey("AIzaSyCU7LomXvsy8Q-atxxHJmH3ZuAiPceVoXc");
//     return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
//         .then(function() { console.log("GAPI client loaded for API"); },
//               function(err) { console.error("Error loading GAPI client for API", err); });
//   }
//   // Make sure the client is loaded and sign-in is complete before calling this method.
//   function execute() {
//     return gapi.client.youtube.channels.list({
//       "part": [
//         "snippet"
//       ],
//       "mine": true
//     })
//         .then(function(response) {
//                 // Handle the results here (response.result has the parsed body).
//                 console.log("Response", response);
//               },
//               function(err) { console.error("Execute error", err); });
//   }
//   gapi.load("client:auth2", function() {
//     gapi.auth2.init({client_id: "725121126436-5flbb3htfh905rap6bmg3q6srtm782hc.apps.googleusercontent.com"});
//   });