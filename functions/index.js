const functions = require('firebase-functions');
const admin=require('firebase-admin');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const crypto = require('crypto');

admin.initializeApp();
const database=admin.database();

const app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use('/addLike',authenticate,addLike,addLikedBy)
app.use('/addComment',authenticate,addComment)
app.use('/addLink',authenticate,addLink)
app.use('/addTimeline',authenticate,addTimeline)
app.use('/sendFriendRequest',authenticate,sendFriendRequest)
app.use('/addLikedBy',authenticate,addLikedBy)
app.use('/getNotifications',authenticate,getNotifications)
app.use('/getFRequests',authenticate,getFRequests)
app.use('/getFriends',authenticate,getFriends)
app.use('/acceptFriendRequest',authenticate,acceptFriendRequest)
app.use('/googleLogin',authenticate,googleLogin)

//hard-coded string
let notification="posted on timeline";

function authenticate(req,res,next){

    if(req.body.accessToken === undefined || req.body.accessToken === '')
    {
        return res.json({error : true,location : "empty or undefined access token"})
    }

    let accessToken = req.body.accessToken

    console.log(accessToken);

    jwt.verify(accessToken,"rsg",(err,data) => {

        if(err !== null)
        {
            return res.json({error : err,location : "falied to verify"})
        }
        else
        {
            console.log(data);
                let email1 = data.body.emails[0].value.split(/[@]/)[0];
                let uname = email1.replace(/\./g,',');
                req.body.uemail = uname;
                return next();

        }
    })
}

function googleLogin(req,response){
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
}


function addLikedBy(req,res)
{
    let link = req.body.link
    let uemail=req.body.uemail
    let postId=crypto.createHash('md5').update(link+uemail).digest('hex')
    let uid = req.body.uid/*it is the uemail of person who is liking the post*/
    let postPath = `posts/${postId}/likedBy/${uid}/`
    let likkes=0;


    return database.ref().child(postPath).once('value',function(snap){
        if(snap.val())
        {
            likkes=snap.val().likes;
        }
        database.ref(postPath).set({
            likes : likkes+1
        });
    })
        .then((snap) => {

            return res.json({
                success : true,
                message : 'likeed by uemail successfully added'
            })
        })
        .catch((err) => {

            return res.json({
                success : false,
                message : 'error in adding liked by in the post',
                err : err
            })
        })
}

function addLike(req,res,next)
{
    let link = req.body.link
    let uemail=req.body.uemail
    let hashkey = link+uemail;
    let postId=crypto.createHash('md5').update(hashkey).digest('hex');
    let uid = req.body.uid
    let postPath = `posts/${postId}/`


    return database.ref().child(postPath).once('value',function(snap){
        let likkes=0;
        if(snap.val())
        {
            if(snap.val().likes)
            likkes=snap.val().likes;
        }
       database.ref(postPath).update({
           likes : likkes+1
       });
    })
        .then((snap) => {

            res.json({
                success : true,
                message : 'like successfully added'
            })
            return next();
        })
        .catch((err) => {

            res.json({
                success : false,
                message : 'error in adding like in the post',
                err : err
            })
        })
}


function addComment(req,res)
{
    let link = req.body.link
    let uemail=req.body.uemail
    let postId=crypto.createHash('md5').update(link+uemail).digest('hex')
    let uid = req.body.uid
    let comment = req.body.comment
    let postPath = `posts/${postId}/comments`

    return database.ref().child(postPath).push({
        uemail : uid,
        comment : comment
    })
        .then((snap) => {

            return res.json({
                success : true,
                message : 'comment successfully added'
            })
        })
        .catch((err) => {

            res.json({
                success : false,
                message : 'error in commenting the post',
                err : err
            })
        })
}


function addLink(req,res)
{
    let link = req.body.link;
    let category = req.body.category;
    let description = req.body.description;
    let timeStamp = req.body.timeStamp;
    let uemail = req.body.uemail;

    if(category === null || category === undefined)
    {
        category = 'misc'
    }

    if(description === null || description === undefined)
    {
        description = 'no description provided';
    }

    let hash = crypto.createHash('md5').update(link).digest('hex')

    return database.ref().child(`users/${uemail}/data/${category}/${hash}`).set({

        link : link,
        description : description,
        timeStamp : timeStamp,
        privacy : 'private'
    })
        .then((snap) => {

            return res.json({
                success : true,
                message : 'Link added successfully',
            })
        })
        .catch((err) => {

            res.json({
                errorLocation : 'error in adding link',
                error : err
            })
        })
}


function addTimeline(req,res)
{
    let email = req.body.uemail;
    let link = req.body.link;
    let description = req.body.description;
    let node = "posts";
    let ref = database.ref();
    //post added to posts node.
    let hashkey = link+email;
    let postId = crypto.createHash('md5').update(hashkey).digest('hex');
    console.log(postId);
    admin.database().ref().child(node+"/"+postId).set({
        uname: email,
        description: description,
        link: link
    });
    //adding postId to uname timeline.
    let node2 = "users/"+email;
    ref.child(node2+"/timeline").push(postId);
    ref.child(node2+"/friends").once('value',(snapshot) => {
        let node3 = "users";
        snapshot.forEach(function(childSnapshot) {
            ref.child(node3+"/"+childSnapshot.val()+"/timeline").push(postId);
            ref.child(node3 +"/"+childSnapshot.val() + "/notifications").push(email+" "+notification);
        })
    }).then((snap) => {
            return  res.json({
                success: true,
                message: "post added!",
                postId: postId         
        })
    }).catch((err) => {
            return res.json({
                success: false,
                message: err
        })
    })
}

function sendFriendRequest(req,res){
    let receiverEmail = req.body.receiverEmail;
    let senderEmail = req.body.uemail;
    let node = "users/" + receiverEmail + "/FriendRequests/" + senderEmail;
    let ref = database.ref();
    ref.child(node).set({ bool : 1}).then((snap) => {
        return res.status(200).json({
            success: true,
            message: "friend request sent!"
        })
    }).catch((err) => {
        return res.json({
            success: false,
            message: err
        })
    })
}

function acceptFriendRequest(req,res) {
    let senderEmail = req.body.senderEmail;
    let receiverEmail = req.body.uemail;
    let node1 = "users/";
    let node2 = node1+"/"+receiverEmail+"/friends";
    let ref = database.ref();
    ref.child(node2).push(senderEmail);
    let node3 = node1+"/"+senderEmail+"/friends";
    ref.child(node3).push(receiverEmail);
    let node4 = node1+"/"+receiverEmail+"/FriendRequests/"+senderEmail;
    ref.child(node4).remove().catch((err) => {
         return res.json({
            success: false,
            message: err
        })
    })
}

function getFriends(request,response)
{
    var email=request.body.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    reff.once('value',(snapshot)=> {
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
                return response.json(items);
            })
                .catch((err) => {
                    return response.json({
                        message : "Error in getting friends",
                        err : err
                    });
                })
        }


    });
}

function getFRequests(request,response){
    var email=request.body.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    reff.once('value',(snapshot)=> {
        if (!snapshot.hasChild('FriendRequests')) {
            items.push({
                message: "no requests",
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
            })
                .catch((err) => {
                    return response.json({
                        message : "Error in getting friendsRequests",
                        err : err
                    });
                })
        }


    });
}



function getNotifications(request , response) {
    var email=request.body.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);
    reff.once('value',(snapshot)=> {
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
            })
                .catch((err) => {
                    return response.json({
                        message : "Error in getting notifications",
                        err : err
                    });
                })
        }


    });
}

exports.api = functions.https.onRequest(app);