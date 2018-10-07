const functions = require('firebase-functions');
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken')

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

exports.authenticate = functions.https.onRequest((req,res,next) => {

    if(req.body.accessToken == undefined || req.body.accessToken == '')
    {
        return res.json({error : true})
    }

    let accessToken = req.body.accessToken

    jwt.verify(accessToken,"rsg",(err,data) => {

        if(err)
        {
            return res.json({error : true})
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
                let email1 = body.emails[0].value.split(/[@]/)[0];
                let email = email1.replace(/\./g,',');
                req.body.email = email;
                next();
            }
        }
    })
})