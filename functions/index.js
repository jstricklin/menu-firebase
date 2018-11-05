const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// exports.getUserMenus = functions.https.onRequest((req, res) => {
//     let menuArr = []
//     admin.database().ref('restaurants/').on('value', function(snapshot){
//         snapshot.forEach((menu) => {
//             let addMenu = {
//                 id: menu.key,
//                 menuData: menu
//             }
//             menuArr.push(addMenu);
//             return false
//         });
//         // menuArr.push(snapshot.val())
//         res.send({menus: menuArr})
//     })

// })
exports.getUserMenus = functions.https.onRequest((req, res) => {
    admin.database().ref('Restaurants/').on('value', function(snapshot){
        let menuArr = []
        for(let restaurant in snapshot.val()){
            Object.keys(snapshot.val()[restaurant]).map(addy => {
                let menu = {
                    name: restaurant,
                    address: addy,
                    menuData: snapshot.val()[restaurant][addy].menu
                }
                menuArr.push(menu)
            })
        }
        res.send({menus: menuArr})
    })
})

exports.getMenu = functions.https.onRequest((req, res) => {
    let params = req.params[0].slice(1).split('/')
    let name = params[0]
    let address = params[1]
    admin.database().ref('dummyRestaurants/').orderByKey().equalTo(`${name}`).on('value', (snapshot)=>{
        for( name in snapshot.val()  ){
            for( menuAddress in snapshot.val()[name] ){
                if (address == menuAddress){
                    var newMenu = {
                        name: name,
                        address: address,
                        menu: snapshot.val()[name][menuAddress].menu
                    }
                    res.send({menu: newMenu})
                }
            }
        }
    })
})
exports.getUserData = functions.https.onRequest((req, res) => {
    const userID = 12461241;
    // let userID = req.params[0].slice(1)
    let userData = {  }
    admin.database().ref('users').orderByKey().equalTo(`${userID}`).on('value', (snapshot) => {
        userData = Object.keys(snapshot.val()).map(key => {
            return snapshot.val()[key];
        })[0]
        // userData = Object.values(snapshot.val())[0]
        switch(userData.type){
            case "registered" :
                admin.database().ref('userProfiles').orderByKey().equalTo(`${userData.profile}`).on('value', ((snapshot) => {
                    userData.userID = userID
                    userData.profile = Object.keys(snapshot.val()).map(key => {
                        return snapshot.val()[key]
                    })[0]
                    // userData.profile = Object.values(snapshot.val())[0]
                    res.send({data: userData})
                }))
                break
                default : res.send("unregistered")
        }
    })
})
