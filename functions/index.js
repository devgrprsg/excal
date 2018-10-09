const functions = require('firebase-functions');
const admin=require('firebase-admin');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

admin.initializeApp();
const database=admin.database();
const app = express();
app.use(bodyParser.urlencoded({extended:false}));

const authenticate = (req, res, next) => {
     if(req.body.accessToken === undefined || req.body.accessToken === '')
    {
        console.log("No accessToken");
        return res.json({error : true})
    }
     let accessToken = req.body.accessToken;
     console.log(accessToken);
     jwt.verify(accessToken,"RSG",(err,data) => {
         if(err)
        {
            console.log("i am here");
            return res.json({error : true})
        }
        else
        {
            if(data.error !== null)
            {
                return res.json({
                    authenticatedRequest : false
                })
            }
            else
            {
                let email1 = body.emails[0].value.split(/[@]/)[0];
                let email = email1.replace(/\./g,',');
                req.body.email = email;
                return next();
            }
        }
    })
}

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
        });
    })
    res.status(200).json({
        message: "post added!"
    })
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