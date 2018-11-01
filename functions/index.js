const functions = require('firebase-functions');
const firebase = require('firebase')
require('firebase/database')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.getUserMenus = functions.https.onRequest((req, res) => {
    firebase.database().ref('restaurant/').on('value', function(snapshot){
        res.send(snapshot.val())
    })

})
