const functions = require('firebase-functions');
const admin=require('firebase-admin');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors')

admin.initializeApp();
const database=admin.database();

const app = express();
app.use(cors({origin:true}))

app.use(function(req,res,next) {

    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    next()
})

app.use(bodyParser.urlencoded({extended:false}));

app.use('/authenticate',authenticate)
app.use('/addLike',authenticate,addLike,addLikedBy)
app.use('/addComment',authenticate,addComment)
app.use('/addLink',authenticate,addLink)
app.use('/addTimeline',authenticate,addTimeline)

app.use('/sendFriendRequest',authenticate,sendFriendRequest)

app.use('/addLikedBy',authenticate,addLikedBy)
app.use('/acceptFriendRequest',authenticate,acceptFriendRequest)
app.use('/googleLogin',googleLogin)

app.use('/getLinks',authenticate,getLinks)

app.use('/getFolders',authenticate,getFolders)
app.use('/getFolderName',authenticate,getFolderName)
app.use('/getNotifications',authenticate,getNotifications)
app.use('/getFRequests',authenticate,getFRequests)

app.use('/getFriends',authenticate,getFriends)

app.use('/getTimeline',authenticate,getTimeline)
app.use('/getLikes',authenticate,getLikes)
app.use('/getComments',authenticate,getComments)
app.use('/getFriendsCount',authenticate,getFriendsCount)
app.use('/getFRequestsCount',authenticate,getFRequestsCount)
app.use('/deleteLink',authenticate,deleteLink)

//hard-coded string
let notification="posted on timeline";

function authenticate(req,res,next)
{
    if(req.body.accessToken === undefined || req.body.accessToken === '')
    {
        return res.json({error : true,location : "empty or undefined access token"})
    }

    let accessToken = req.body.accessToken

    //let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImF6cCI6IjQ4MTk5NDkyMDY4OC1zcHJvY3IzbzFnNjQyazRldm11OHJtOXRyOHZjcmE1cy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjQ4MTk5NDkyMDY4OC1zcHJvY3IzbzFnNjQyazRldm11OHJtOXRyOHZjcmE1cy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNTE5NjU3MTU0NDAyMTc1NDcxMSIsImVtYWlsIjoiZ29nYXJhdHRhbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdF9oYXNoIjoiUTRXbl9tcFZzdm4wTHVoUzg4TWoxUSIsIm5hbWUiOiJHYXVyYXYgUmF0dGFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8ta1dpX2xvZ19BOUUvQUFBQUFBQUFBQUkvQUFBQUFBQUFBRkkvT043NnhKQkdRd3cvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkdhdXJhdiIsImZhbWlseV9uYW1lIjoiUmF0dGFuIiwibG9jYWxlIjoiZW4iLCJpYXQiOiIxNTQwNDUyNjE4IiwiZXhwIjoiMTU0MDQ1NjIxOCIsImp0aSI6IjE5MzBjNjZmMjA3MGE3NzA3NzI0ZmMxZjc2OTA4MmY3ZTM4MjMzNzEiLCJhbGciOiJSUzI1NiIsImtpZCI6IjcyOGY0MDE2NjUyMDc5YjllZDk5ODYxYmIwOWJhZmM1YTQ1YmFhODYiLCJ0eXAiOiJKV1QifSwiaWF0IjoxNTQwNDUzNTc0LCJleHAiOjE1NDA0OTY3NzR9.Ol6VqSNKjuNoP0KRTAIFojjwbWnGmJVH_OCUZHsziIY"

    jwt.verify(accessToken,'gaurav',(err,data)=>{

        if(err !== null)
        {
            return res.json({error : err,location : "falied to verify"})
        }
        else
        {

            let email1 = data.body.email.split(/[@]/)[0];
            // let uname = email1.replace(/\./g,',');
            var uname=email1;
            req.body.uemail = uname;
            console.log(uname);
            console.log("Inside body",req.body.uemail)
            
            return next();
        }
    })
}

function googleLogin(req,response){

    let accessToken=req.query.accessToken;

    const request = require('request');

    request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+accessToken,{json:true},(err,res,body)=> {
        if(err){
            return console.log(err);
        }
        
        let email=body.email;
        email=email.split(/[@]/)[0];

        let ref=database.ref('/users');

        ref.once('value')
        .then((snapshot) => {

            if(!snapshot.hasChild(email)) {

                let rff = database.ref('/users' + '/' + email);

                rff.set({
                    signed_in: true,
                })
                .then((snap) => {

                    data={
                        signed_in: true,
                        body: body
                    }

                    console.log("before")
                    const token = jwt.sign(data,'gaurav',{ expiresIn:'12h' });
                    console.log("after")
                    return response.json(token);
                })
                .catch((err) => {

                    res.json({
                        err : err
                    })
                })
            }
            else
            {
                let reff = database.ref('/users' + '/' + email);
                reff.once('value')
                .then((snap) => {
                    data={
                        signed_in: true,
                        body: body
                    }
                    const token=jwt.sign(data,'gaurav',{ expiresIn:'12h' });

                    return response.json(token);
                })
                .catch((err) => {

                    return response.json({
                        success : false,
                        error : err
                    })
                })
            }
        })
        .catch((err) => {

            return response.json({
                success : false,
                error : err
            })
        })
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
    //let timeStamp = req.body.timeStamp;
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
    ref.child(node4).remove().then((snap)=>{
         return res.json({
            success: true,
            message: "friend request accepted!"
        })
    }).catch((err) => {
         return res.json({
            success: false,
            message: err
        })
    })

}

function getFriends(request,response)
{
    console.log("Inside getFriends")

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

function getLinks(request,response)
{
    var email=request.body.uemail;
    var folder=request.body.folder;
    let items = [];
    var reff=database.ref('/users/'+email);
    reff.once('value',(snapshot)=> {
        if (!snapshot.hasChild('data')) {
            items.push({
                message: "no data",
            });
            return response.json(items);
        }
        else {
            database.ref('/users/' + email + '/data/'+folder+'/').once('value').then((snapshot) => {
                snapshot.forEach(function (childSnap) {
                    items.push({
                        description: childSnap.val().description,
                        link: childSnap.val().link,
                        timeStamp: childSnap.val().timeStamp,
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

function getFolders(request,response)
{
    var email=request.body.uemail;
    let items = [];
    var reff=database.ref('/users/'+email);

    reff.once('value',(snapshot)=> {
        if (!snapshot.hasChild('data')) {
            items.push({
                message: "no data",
            });
            return response.json(items);
        }
        else {
            database.ref('/users/' + email + '/data/').once('value').then((snapshot) => {
                // snapshot.forEach(function (childSnap) {
                //     items.push({
                //         folder: childSnap.val(),
                //     });
                // });
                // return response.json(items);
                 return response.json(snapshot.val());
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

function getFolderName(request,response){

    let email = request.body.email;
    let output = [];
    
    let reff = database.ref('/users/'+email)

    reff.once('value')
    .then((snapshot) => {
        
        if(!snapshot.hasChild('data')){

            output.push({
                message : 'no data'
            })
        
        return response.json(output)
        }
        else
        {
            reff.child(`data`).once('value')
            .then((snapshot) => {

                let allData = snapshot.val()

                for(i in allData)
                {
                    output.push({
                        "folderName" : i
                    })
                }
            return response.json(output)
            })
            .catch((err) => {

                return response.json({
                    message : "Error in getting friends",
                    err : err
                })
            });
        }
    })
    .catch((err) => {

        return response.json({
            message : "Error occured in accessing database"
        })
    })
}

function getTimeline(req,res){

    let uemail = req.body.uemail;
    let timelinePath = `users/${uemail}/timeline`

    let output = []
    let promises = [];

    database.ref(timelinePath).once('value')
    .then((snapshot) => {

        snapshot = snapshot.val();

        for(let i in snapshot) {

            let x = database.ref('posts/' + snapshot[i]).once('value')
            .then((snap) => {

             let d = snap.val();   
                output.push(d);
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    err: err
                })
            })

            promises.push(x);
        }

        Promise.all(promises)
        .then(() => {
            res.send(output);
        })
        .catch(() => {
            res.send("error in fetching posts");
        })

    })
    .catch(() => {
        res.send("error in fetching timeline");
    })
}

function getLikes(req,res) {

    let link = req.body.link
    let uemail = req.body.uemail

    let postId = crypto.createHash('md5').update(link+uemail).digest('hex')

    let postPath = `posts/${postId}`

    database.ref().child(postPath).once('value')
    .then((snapshot) => {

        console.log(snapshot.val())

        let allData = snapshot.val()

        if(allData.likes === undefined || allData.likes === null)
        {
            return res.json({
                likes : 0
            })
        }

        return res.json({
            likes : allData.likes
        })
    })
    .catch((err) => {

        res.json({
            success : false,
            message : "Error in fetching the likes"
        })
    })
}

function getComments(req,res){

    let uemail = req.body.email
    let link = req.body.link
    let postId = crypto.createHash('md5').update(link+uemail).digest('hex')

    let postPath = `posts/${postId}/comments`

    let allComments = []

    database.ref().child(postPath).once('value')
    .then((snapshot) => {

        let allData = snapshot.val()

        for(i in allData)
        {
            allComments.push({
                uemail : allData[i].uemail,
                comment : allData[i].comment
            })
        }

    return res.send(allComments)
    })
    .catch((err) => {

        res.json({
            success : false,
            message : "Error in fetching the comments"
        })
    })
}

function getFriendsCount(req,res){

    let uemail = req.body.uemail

    let friendsPath = `users/${uemail}/friends`

    let count = 0

    database.ref().child(friendsPath).once('value')
    .then((snapshot) => {

        let allData = snapshot.val()

        for(i in allData)
        {
            count++
        }

        res.json({
            count : count
        })
    })
    .catch((err) => {

        res.json({
            success : false,
            message : "Error in counting friends"
        })
    })
}

function getFRequestsCount(request,response){

    var email=request.body.uemail;
    let count = 0
    var reff=database.ref('/users/'+email);
    reff.once('value',(snapshot)=> {
        if (!snapshot.hasChild('FriendRequests')) {

            return response.json({
                count : count
            });
        }
        else {

            database.ref('/users/' + email + '/FriendRequests/').once('value').then((snapshot) => {
                snapshot.forEach(function (childSnap) {
                    count++
                });
                response.set('Cache-Control', 'public, max-age=300 , s-maxage=600');
                return response.json({
                    count : count
                });
            })
            .catch((err) => {
                return response.json({
                    message : "Error in counting friendsRequests",
                    err : err
                });
            })
        }
    });
}

function deleteLink(req,res){

    let uemail = req.body.uemail
    let link = req.body.link

    let linkId = crypto.createHash('md5').update(link).digest('hex')

    let dataPath = `users/${uemail}/data`

    database.ref().child(dataPath).once('value')
    .then((snapshot) => {

        let allData = snapshot.val()

        for(let folder in allData)
        {
            for(let link in allData[folder])
            {
                if(link === linkId)
                {
                    console.log(folder)
                    console.log(linkId)

                    database.ref().child(dataPath + '/' + folder + '/' + linkId).remove()
                    .then((snapshot) => {

                        return res.json({
                            success : true,
                            message : "Link deleted successfully"
                        })
                    })
                    .catch((err) => {

                        return res.json({
                            success : false,
                            message : "Error in deleting the post"
                        })
                    })
                }
            }
        }
    })
    .catch((err) => {

        res.json({
            success : false,
            message : "Error in accessing database"
        })
    })
}


exports.api = functions.https.onRequest(app);