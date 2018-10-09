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

/*
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
                let uname = email1.replace(/\./g,',');
                req.body.uname = uname;
                next();
            }
        }
    })
} */

app.use('/addLink',addLink)
app.use('/addToTimeline',addToTimeline)

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

function addToTimeline(req,res)
{
    let uname = 'devgrprsg';
    let postId = req.body.postId;
    let category = req.body.category;
    let timeOfAdding = req.body.timeStamp;
    let linkPath = `users/${uname}/data/${category}/${postId}`;
    let postPath = `users/${uname}/timeline/${category}/${postId}`;

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

        post = {
            link : post.link,
            description : post.description,
            privacy : 'public',
            timeStamp : post.timeStamp,
            likes : '0',
            comment : 'nothing'
        }
        return database.child(postPath).set(post)
    })
    .then((snapshot) => {

        res.json('Post added successfully to timeline')
    })
    .catch((err) => {

        return res.json(err)
    })
}

exports.api = functions.https.onRequest(app);