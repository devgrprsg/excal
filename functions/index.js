const functions = require('firebase-functions');
const admin=require('firebase-admin');
//the folllowing statement should be used before using any firebase services
admin.initializeApp();
const database=admin.database();
const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser')
// const express = require('express')
//
// const app = express();
// app.use(bodyParser.urlencoded({extended:false}));

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});


exports.googleLogin=functions.https.onRequest(function(req,response){
    let accessToken=req.query.accessToken;
    console.log(accessToken);
    const request=require('request');
    //const body=req.body;
    console.log("i ma gete");
    request('https://www.googleapis.com/plus/v1/people/me?access_token='+accessToken,{json:true},(err,res,body)=> {
        if(err){
            return console.log(err);
        }
        console.log(body);
        console.log("here");
        console.log("ffff");
        let email=body.emails[0].value;
        email=email.split(/[@]/)[0];
        console.log(email);
        let emailRef='users/'+email;
        let ref=database.ref();
        ref.once('value',function(snapshot){
            if(!snapshot.hasChild(emailRef)) {
                let rff = database.ref(emailRef);
                rff.set({
                    signed_in: true,
                });
                data={
                    signed_in:true,
                    body: body
                }
                const token=jwt.sign(data,"rsg",{ expiresIn:"12h"});
                return response.json(token);
            }
        });
        let reff = database.ref(emailRef);
        reff.once('value',function(snap) {
            data={
                signed_in: snap.val().signed_in,
                body: body
            }
            const token=jwt.sign(data,"rsg",{ expiresIn:"12h"});
            return response.json(token);
        });

    });
});

exports.getFriends = functions.https.onRequest((request , response) => {
    var email=request.query.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    return reff.once('value').then((snapshot)=> {
            if (!snapshot.hasChild('friends')) {
                items.push({
                    message: "no friends",
                });
                return response.json(items);
            }
            else {
                    database.ref('/users/' + email + '/friends/').once('value').then((snapshot) => {
                        snapshot.forEach(function (childSnap) {
                            items.push({
                                uemail : childSnap.val()
                            });
                        });
                        response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
                        return response.json(items);
                        }).catch((err) => {
                            return response.json({
                                location : "error in get friends",
                                error : err
                            });
                        })
                }
            return response.json(items);
    }).catch((err)=>{
        response.json(err);
    })
});





// function authenticate(req,res,next){
//
//     if(req.body.accessToken === undefined || req.body.accessToken === '')
//     {
//         return res.json({error : true,location : "empty or undefined access token"})
//     }
//
//     let accessToken = req.body.accessToken
//
//     console.log(accessToken);
//
//     jwt.verify(accessToken,"rsg",(err,data) => {
//
//         if(err !== null)
//         {
//             return res.json({error : err,location : "falied to verify"})
//         }
//         else
//         {
//             console.log(data);
//             let email1 = data.body.emails[0].value.split(/[@]/)[0];
//             let uname = email1.replace(/\./g,',');
//             req.body.uname = uname;
//             return next();
//
//         }
//     })
// }



exports.getRecActs = functions.https.onRequest((request , response) => {
    var email=request.query.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    return reff.once('value').then((snapshot)=> {
        if (!snapshot.hasChild('recActs')) {
            items.push({
                message: "no activities",
            });
            return response.json(items);
        }
        else {
            database.ref('/users/' + email + '/recActs/').once('value').then((snapshot) => {
                snapshot.forEach(function (childSnap) {
                    items.push({
                        link: childSnap.key,
                        time: childSnap.val()
                    });
                });
                response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
                return response.json(items);
            }).catch((err) => {
                return response.json({
                    location : "error in get recent activities",
                    error : err
                });
            })
        }
    }).catch((err)=>{
        response.json(err);
    })
});

exports.getNotifications = functions.https.onRequest((request , response) => {
    var email=request.query.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    return reff.once('value').then((snapshot)=> {
        if (!snapshot.hasChild('notifications')) {
            items.push({
                message: "no notifications",
            });
            return response.json(items);
        }
        else {
            database.ref('/users/' + email + '/notifications/').once('value').then((snapshot) => {
                snapshot.forEach(function (childSnap) {
                    items.push({
                        notification: childSnap.val()
                    });
                });
                response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
                return response.json(items);
            }).catch((err) => {
                return response.json({
                    location : "error in get notifications",
                    error : err
                });
            })
        }
    }).catch((err)=>{
        response.json(err);
    })
});


exports.getFriendRequests = functions.https.onRequest((request , response) => {
    var email=request.query.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    return reff.once('value').then((snapshot)=> {
        if (!snapshot.hasChild('FriendRequests')) {
            items.push({
                message: "no Friendrequests",
            });
            return response.json(items);
        }
        else {
            database.ref('/users/' + email + '/FriendRequests/').once('value').then((snapshot) => {
                snapshot.forEach(function (childSnap) {
                    items.push({
                        uemail : childSnap.key
                    });
                });
                response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
                return response.json(items);
            }).catch((err) => {
                return response.json({
                    location : "error in get friendrequests",
                    error : err
                });
            })
        }
    }).catch((err)=>{
        response.json(err);
    })
});



