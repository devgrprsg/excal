const express = require('express')
const app = express()

var port = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/',express.static(__dirname+'/public_static'))

app.listen(port,function(){
    console.log("Server started")
})