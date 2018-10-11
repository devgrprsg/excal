const functions = require('firebase-functions');
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

admin.initializeApp();
const database = admin.database().ref();
const app = express();

app.use(bodyParser.urlencoded({extended:false}));

exports.googleLogin = functions.https.onRequest(function(req,response){
    let accToken = req.query.accessToken;
    const request = require('request');

    request('https://www.googleapis.com/plus/v1/people/me?access_token='+accToken, { json: true }, (err, res, body) => {
        let data;

        if(err)
        {
            return console.log(err)
        }
        if(body.err != null)
        {
            console.log('error in access token')
            data = {
                authenticatedRequest : false
            };
            return response.json(data);
        }
        console.log(body)
        let email1 = body.emails[0].value.split(/[@]/)[0];
        let email = email1.replace(/\./g,',');

        database.child('users').once('value',(snapshot) => {

            if(snapshot.hasChild(email))
            {
                console.log('present')
                database.child(`users/${email}`).once('value',(snapshot) => {

                    data = {
                        registered : true,
                        body : body
                    }
                    const token = jwt.sign(data,"rsg",{ expiresIn : "12h" });
                    return response.json(token)
                })
            }
            else
            {
                console.log('not present')
                database.child(`users/${email}`).set({
                    registered : true
                })

                data = {
                    registered : true,
                    body : body
                }
                const token = jwt.sign(data,"rsg",{ expiresIn : "12h"});

                return response.json(token)
            }
        })
    })
})

app.use('/addLink',authenticate,addLink)
app.use('/makePublic',authenticate,makePublic)
app.use('/addPost',authenticate,addPost)
app.use('/addLike',authenticate,addLike)
app.use('/addComment',authenticate,addComment)
app.use('/addFriend',authenticate,addFriend)
app.use('/acceptFriendRequest',authenticate,acceptFriendRequest)

function authenticate(req,res,next){

    if(req.body.accessToken == undefined || req.body.accessToken == '')
    {
        return res.json({error : true,location : "empty or undefined access token"})
    }

    let accessToken = req.body.accoessToken

    console.log(accessToken);

    jwt.verify(accessToken,"rsg",(err,data) => {

        if(err != null)
        {
            return res.json({error : err,location : "falied to verify"})
        }
        else
        {
            if(data.error != null)
            {
                return res.json({
                    authenticatedRequest : false
                })
            }
            else
            {
                let email1 = data.body.emails[0].value.split(/[@]/)[0];
                let uid = email1.replace(/\./g,',');
                req.body.uid = uname;
                next();
            }
        }
    })
}

function addLink(req,res)
{
    let link = req.body.link;
    let category = req.body.category;
    let description = req.body.description;
    let timeStamp = req.body.timeStamp;
    let uname = 'devgrprsg'

    if(category == null || category == undefined)
    {
        category = 'misc'
    }

    if(description == null || description == undefined)
    {
        description = 'no description provided';
    }

    let hash = crypto.createHash('md5').update(link).digest('hex')

    database.child(`users/${uname}/data/${category}/${hash}`).set({

        link : link,
        description : description,
        timeStamp : timeStamp,
        privacy : 'private'
    })
    .then((snap) => {

        res.json({
            success : true,
            message : 'Link added successfully',
            postId : hash
        })
    })
    .catch((err) => {

        res.json({
            errorLocation : 'error in adding link',
            error : err
        })
    })
}

function makePublic(req,res)
{
    let uname = 'devgrprsg';
    let postId = req.body.postId;
    let category = req.body.category;
    let linkPath = `users/${uname}/data/${category}/${postId}`;

    let post = {};

    return database.child(linkPath).once('value')
    .then((snapshot) => {

        post = {
            link : snapshot.val().link,
            description : snapshot.val().description,
            privacy : 'public',
            timeStamp : snapshot.val().timeStamp
        }
        console.log('updating post')
        return database.child(linkPath).update(post);
    })
    .then((snapshot) => {

        return res.json({
            success : true,
            message : "post made public successfully"
        })
    })
    .catch((err) => {

        return res.json({
            success : false,
            message : "error in making post public"
        })
    })
}

function addPost(req,res)
{
    let uid = req.body.uid;
    let linkId = req.body.linkId;
    let category = req.body.category;
    let description = req.body.description;

    let postId = uid + linkId;
    let hash = crypto.createHash('md5').update(postId).digest('hex')

    let linkPath = `users/${uid}/data/${category}/${postId}`;
    let postPath = `posts/${hash}`

    let post = {}

    return database.child(linkPath).once('value')
    .then((link) => {
        
        post = link.val()

        return database.child(postPath).set(post)
    })
    .then((snapshot) => {

        let friendsPath = `users/${uid}/friends`;

        return database.child(friendsPath).once('value')
    })
    .then((friendList) => {

        friendList.forEach(function(friendId){

            database.child(`users/${friendId}/timeline/${hash}`).set({
                friendId : uid,
                timeStamp : timeStamp
            })
            .then((snapshot) => {
                console.log('post added to friends timeline')
            })
        })

        database.child(`users/${uid}/timeline/${hash}`).set({
            friendId : uid,
            timeStamp : timeStamp
        })
        .then((snapshot) => {
            console.log('post added to my own timeline')
        })
    })
    .catch((err) => {

        res.json({
            success : false,
            message : 'error in adding post to timeline'
        })
    })
}

function addLike(req,res)
{
    let postId = req.body.postId
    let uid = req.body.uid
    let path = `posts/${postId}/likes`

    let post = {}

    return database.child(postPath).push({

        uid : uid
    })
    .then((snap) => {

        res.json({
            success : true,
            message : 'comment successfully added'
        })
    })
    .catch((err) => {

        res.json({
            success : false,
            message : 'error in commenting the post'
        })
    })
}

function addComment(req,res)
{
    let postId = req.body.postId
    let uid = req.body.uid
    let comment = req.body.comment
    let postPath = `posts/${postId}/comments`

    let post = {}

    return database.child(postPath).push({

        uid : uid,
        comment : comment
    })
    .then((snap) => {

        res.json({
            success : true,
            message : 'comment successfully added'
        })
    })
    .catch((err) => {

        res.json({
            success : false,
            message : 'error in commenting the post'
        })
    })
}

function addFriend(req,res)  
{
    let receiverId=req.body.receiverId;
    let senderId=req.body.senderId;

    let node="users/"+receiverId+"/FriendRequests/"+senderId;
    let ref=database.ref();

    ref.child(node).set({ bool : 1});

    res.status(200).json({
        message: "friend request sent!"
    })
}

function acceptFriendRequest(req,res)
{
    let uid = req.body.uid
    let senderId = req.body.senderId
    let path = `users/${uid}/friends/${senderId}`

    database.child(path).set({
        bool : true
    })
    .then((snap) => {
        res.json({
            success : true,
            message : 'friend request accepted'
        })
    })
    .catch((err) => {
        res.json({
            success : false,
            message : 'error in accepting friend request'
        })
    })
}

exports.api = functions.https.onRequest(app);