const functions = require('firebase-functions');
const admin=require('firebase-admin');
admin.initializeApp();
const database=admin.database();
const jwt = require('jsonwebtoken');

exports.googleLogin=functions.https.onRequest(function(req,response){
    let accessToken=req.query.accessToken;
    const request=require('request');
    request('https://www.googleapis.com/plus/v1/people/me?access_token='+accessToken,{json:true},(err,res,body)=> {
        if(err){
            return console.log(err);
        }
        let email=body.emails[0].value;
        email=email.split(/[@]/)[0];
        let emailRef='users/'+email;
        let ref=database.ref();
        ref.once('value',function(snapshot){
            if(!snapshot.hasChild(emailRef)) {
                let rff = database.ref(emailRef);
                rff.set({
                    signed_in: true,
                });
                data={
                    signed_in: true,
                    body: body
                }
                const token=jwt.sign(data,'RSG',{ expiresIn:"12h"});
                return response.json(token);
            }
        });
        let reff = database.ref(emailRef);
        reff.once('value',function(snap) {
            data={
                signed_in: snap.val().signed_in,
                body: body
            }
            const token=jwt.sign(data,'RSG',{ expiresIn:"12h"});
            return response.json(token);
        });

    });
});

exports.getFriends = functions.https.onRequest((request , response) => {
    var email=request.query.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    reff.once('value',function(snapshot){
        if(!snapshot.hasChild('friends')) {
            console.log("no friend");
            items.push({
                message : "no friend",
            });
            console.log(items);
            response.send(200).json(items);
        }
    });
    database.ref('/users/'+email+'/friends/').on('value', function(snapshot) {
        snapshot.forEach(function(childSnap) {
            console.log(childSnap.val());
            items.push({
                uemail : childSnap.val(),
            });
        });
    });
    response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
    return response.json(items);
});



exports.addtimeline=functions.https.onRequest((req , res) => {
    console.log(req.query);
    let email=req.query.email;
    let link=req.query.link;
    let description=req.query.description;
    let node="posts";
    let ref=database.ref();
    //post added to posts node.
    let postId=ref.child(node).push().key;
    console.log(postId);
    admin.database().ref().child(node+"/"+postId).set({
        uname: email,
        like: 0,
        comment: ' ',
        description: description,
        link: link
    });
    //adding postId to uname timeline.
    let node2="users/"+email;
    ref.child(node2+"/timeline").push(postId);
    ref.child(node2+"/friends").once('value',(snapshot) => {
        let node3="users";
        snapshot.forEach(function(childSnapshot) {
            ref.child(node3+"/"+childSnapshot.val()+"/timeline").push(postId);
            ref.child(node3 +"/"+childSnapshot.val() + "/notifications").push(email+" "+"shared a link");
        });
    })
    res.status(200).json({
        message: "post added!"
    })
});

exports.getTimeline = functions.https.onRequest((request , response) => {
    let email=request.query.uemail;
    let items = [];
    var ref1=database.ref('/users/'+email);
    items.push({
        message : "ouside",
    });
    ref1.once('value',function(snapshot){
        if(!snapshot.hasChild('timeline')) {
            console.log("no post");
            items.push({
                message : "no post",
            });
            console.log(items);
            return response.json(items);
        }
    });
    let node1='/users/'+email+'/timeline/';
    database.ref(node1).on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            console.log(childSnapshot.val());
            database.ref('/posts/'+childSnapshot.val()).on('value',function(snap){
                console.log(snap.val());
                items.push(snap.key,{
                    uname: snap.val().uname,
                    like: snap.val().like,
                    comment: snap.val().comment,
                    description: snap.val().description,
                    link: snap.val().link
                });
            });
        });
    });
    console.log(items);
    response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
    response.status(200).json(items)
});

exports.getRecActs = functions.https.onRequest((request , response) => {
    var email=request.query.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    reff.once('value',function(snapshot){
        if(!snapshot.hasChild('recActs')) {
            console.log("no activities");
            items.push({
                message : "no activities",
            });
            console.log(items);
            response.send(200).json(items);
        }
    });
    database.ref('/users/'+email+'/recActs/').on('value', function(snapshot) {
        snapshot.forEach(function(childSnap) {
            items.push({
                link : childSnap.key,
                time : childSnap.val()
            });
            console.log(items);
        });
    });
    response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
    return response.json(items);
});


exports.getNotifications = functions.https.onRequest((request , response) => {
    var email=request.query.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    reff.once('value',function(snapshot){
        if(!snapshot.hasChild('notifications')) {
            console.log("no notifications");
            items.push({
                message : "no notifications",
            });
            console.log(items);
            response.send(200).json(items);
        }
    });
    database.ref('/users/'+email+'/notifications/').on('value', function(snapshot) {
        snapshot.forEach(function(childSnap) {
            console.log(childSnap.val());
            items.push({
                notification : childSnap.val(),
            });
        });
    });
    response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
    return response.json(items);
});

exports.getRequests = functions.https.onRequest((request , response) => {
    var email=request.query.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    reff.once('value',function(snapshot){
        if(!snapshot.hasChild('FriendRequests')) {
            console.log("no FriendRequests");
            items.push({
                message : "no request",
            });
            console.log(items);
            return response.send(200).json(items);
        }
    });
    database.ref('/users/'+email+'/FriendRequests/').on('value', function(snapshot) {
        snapshot.forEach(function(childSnap) {
            console.log(childSnap.key);
            items.push({
                uemail : childSnap.key,
            });
        });
    });
    response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
    return response.json(items);
});


exports.sendFriendRequest=functions.https.onRequest((req,res) => {
    let receiverEmail=req.query.receiverEmail;
    let senderEmail=req.query.email;
    let node="users/"+receiverEmail+"/FriendRequests/"+senderEmail;
    let ref=database.ref();
    ref.child(node).set({ bool : 1});
    res.status(200).json({
        message: "friend request sent!"
    })
});

exports.acceptFriendRequest=functions.https.onRequest((req,res) => {
    let senderEmail=req.query.senderEmail;
    let receiverEmail=req.query.email;
    let node1="users/";
    let node2=node1+"/"+receiverEmail+"/friends";
    let ref=database.ref();
    ref.child(node2).push(senderEmail);
    let node3=node1+"/"+senderEmail+"/friends";
    ref.child(node3).push(receiverEmail);
    let node4=node1+"/"+receiverEmail+"/FriendRequests/"+senderEmail;
    ref.child(node4).remove();
    res.status(200).json({
        message: "friend request accepted"
    })
});