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
            }
        });
        let reff = database.ref(emailRef);
        reff.once('value',function(snap) {
            data={
                signed_in: snap.val().signed_in,
            }
            const token=jwt.sign(data,'RSG',{ expiresIn:"12h"});
            return response.json(token);
        });

    });
});