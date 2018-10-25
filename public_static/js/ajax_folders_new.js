var accessToken= localStorage.getItem('accessToken');
var uemail = localStorage.getItem('uemail');
var name = localStorage.getItem('name');

// var name=localStorage.getItem('name');

// document.getElementById('user').innerHTML=uemail;


function fun(res)
{
        console.log(res);
        res.forEach(getFolders);
}

function getFolders(item,index)
{
    // alert('1');
    var ref=document.getElementById('folder_repeat');
    // var link='<div class="newfolder"><div class="glyphicon glyphicon-folder-open" class="folder"></div><div class="folder_name" id="flip">'+ item.folderName+'</div></div></div>';

        var link='<div class="newfolder" name="'+item.folderName+'">'+
               '<div class="glyphicon glyphicon-folder-open" class="folder"></div>'+
                '<div class="folder_name" id="flip">'+item.folderName+'</div>'+
              '</div>';
     // alert(item.folderName);
    
     ref.innerHTML=ref.innerHTML+link;
}


function fun1(result)
{
        result.forEach(getLinks);
}

function getLinks(item,index)
{
    var ref=document.getElementById('link_repeat');
    // var link='<div class="links-middle b"><div class="hard-link"><b>LINK:</b></div><br><div class="linkmain b">'+item.link+'</div><div class="space2 b"></div><div class="hard-description"><b>DESCRIPTION:</b></div><br><div class="description b">'+item.description+'</div><div class="space3 b"></div><div class="share b call_share" name="'+item.link+'@'+item.description+'" id="link'+ index +'"><button>Add To Timeline</button></div></div>';
    var link='<div class="links-middle b">'+
                '<div class="hard-link"><b>LINK:</b></div>'+
                '<br>'+
                '<div class="linkmain b">'+ item.link+'</div>'+
                '<div class="space2 b"></div>'+
                '<div class="hard-description"><b>DESCRIPTION:</b></div>'+
                '<br>'+
                '<div class="description b">'+item.description+'</div>'+
                '<div class="space3 b"></div>'+
                '<div class="share">'+
                  '<div class="sub_share b call_share" name="'+item.link+'@'+item.description+'" id="link'+index+'"><button style="background-color: #fafafa; text-color: black; text-decoration: none;  border: 1px solid lightgrey;"><b>Add to timeline</b></button></div>'+
                  '<div class="sub_space"></div>'+
                '<div class="delete b call_delete" name="'+item.link+'" id="delete'+index+'"><button style="background-color: #fafafa; text-color: black; text-decoration: none;  border: 1px solid lightgrey;"><b>Delete</b></button>'+
                '</div>'+
              '</div> '
    ref.innerHTML=ref.innerHTML+link;
}


function share(result_share,id)
{
    if(result_share.success==true)
    {
        changeShare(id);
    }
    else
    {
        alert("cannot be shared!");
    }
}

function changeShare(id)
{
    $('#'+id).empty();
}


function fun_delete(result_delete,id)
{
    if(result_delete.success==true)
    {
        changeDelete(id);
    }
    else
    {
        alert("Link cannot be deleted");
    }
}

function changeDelete(id)
{
    $('#'+id).empty();
}

function fun2(ress)
{
    // console.log(ress.count);
    var ref=document.getElementById('friendsCount');
    var link='<div class="friends">'+ ress.count +' Friends</div>';
    ref.innerHTML=ref.innerHTML+link;
    // ress.forEach(call);
}

function fun3(resss)
{
    // console.log(ress.count);
    var ref=document.getElementById('friendRequestsCount');
    var link='<div class="friend-requests">'+ resss.count +' Friend Requests</div>';
    ref.innerHTML=ref.innerHTML+link;
    // ress.forEach(call);
}

// function call(item,index)
// {
//     var ref=document.getElementById('friendsCount');
//     var link=' <div class="friend-requests">'+ item.count+' Friend Requests</div>';
//     ref.innerHTML=ref.innerHTML+link;
// }

function fun_add_link(result_add_link)
{
    if(result_add_link.success==true)
    {
        // alert("link added");
        document.location.reload();
        // window.location="sample_profile.html";
    }
}

// function username(v1)
// {
//     var j='<div class="username">'+uemail+'</div>';
//     v1.innerHTML=v1.innerHTML+j;
// }



$(document).ready(function(){
    $("#user").append('<div class="username">'+uemail+'</div>');
    // alert(name);
    $("#name_of_user").append('<div class="name"><b>'+name+'</b></div>');
     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFriendsCount",
            {
                accessToken: accessToken,
                // uemail: 'devgrprsg',
            },
            function(result){
                fun2(result);
                $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFRequestsCount",
                                 {
                                     accessToken: accessToken,
                                    // uemail: 'devgrprsg',
                                 },
                                 function(result){
                                    // alert("in f request");
                                    fun3(result);

                }); 


                 $(".sub").click(function(){
                        // var link=$("#link").attr('value');
                        // var description=$("#des").attr('value');
                        // var category=$("#cat").attr('value');
                        var link=document.getElementById("link").value;
                        var description=document.getElementById("des").value;
                        var category=document.getElementById("cat").value;
                        // alert(link);
                        // alert(description);
                        // alert(category);

                        $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addLink",
                        {
                            link: link,
                            description: description,
                            category: category,
                            // uemail: 'devgrprsg',
                             accessToken: accessToken,
                            timeStamp: null
                        },

                        function(dd)
                        {
                            // alert("in_add_link");
                            console.log(dd);
                            fun_add_link(dd);
                        });


                        $.ajax({

                                url : "https://us-central1-linkbook-68850.cloudfunctions.net/api/addLink",
                                type : "POST",
                                data : {
                                  
                                        link: link,
                                        description: description,
                                        category: category,
                                        // uemail: 'devgrprsg',
                                         accessToken: accessToken,
                                },
                                success : function(result,status) {

                                  // console.log("access token = ")
                                  // console.log(result)
                                  // console.log("hello")
                                  // console.log(status)
                                  
                                  // alert(result);
                                  // console.log(profile.ig);
                                  // let uemail = profile.U3.split(/[@]/)[0]
                                  // localStorage.setItem('accessToken',result)
                                  // localStorage.setItem('uemail',uemail)
                                  // localStorage.setItem('name',profile.ig)
                                  // localStorage.setItem('profilePic',profile.picture)

                                  // location.href = "./html/1.html"
                                  // alert("in_add_link");
                                    console.log(dd);
                                    fun_add_link(dd);
                                }
                              })

                 });

                $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFolderName", 
                                { 
                                      accessToken: accessToken, 
                                    email: uemail,
                                }
                                ,function(res){
                                    console.log(res);
                                    fun(res);  
                                     $(".newfolder").click(function(){
                    // alert("in in");
                                        var data=$(this).attr('name');

                                         $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getLinks", 
                                        {
                                            // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
                                            // uemail:'devgrprsg',
                                             accessToken: accessToken,
                                            folder: data
                                        }
                                            ,function(result){
                                                fun1(result); 

                                                 $(".call_share").click(function(){
                                                    // alert("in share");
                                                    var data=$(this).attr('name');
                                                    var id=$(this).attr('id');
                                                    var link =data.split(/[@]/)[0];
                                                    var description = data.split(/[@]/)[1];

                                                     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addTimeline", 
                                                    {
                                                        // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
                                                        // uemail:'devgrprsg',
                                                         accessToken: accessToken,
                                                        link: link,
                                                        description: description,
                                                    }
                                                        ,function(result){
                                                            console.log(result);
                                                            share(result,id);   

                                                });

                                                });


                                                              $(".call_delete").click(function(){
                                // alert("in share");
                                                                var data=$(this).attr('name');
                                                                // alert(data);
                                                                var id=$(this).attr('id');
                                                                 $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/deleteLink", 
                                                                {
                                                                    // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
                                                                    // uemail:'devgrprsg',
                                                                     accessToken: accessToken,
                                                                    link: data,
                                                                }
                                                                    ,function(result){
                                                                        // console.log(result);
                                                                        // alert("in delete");
                                                                        fun_delete(result,id);   

                                                            });

                                                            });

   
                                                    $(".links-middle").slideToggle("5000");
                                                    $(".links-middle").css('display','flex');
                                                    $(".links-middle").css('flex-direction','column');  
                                                    location.href="#sample"; 



                                            });
                                    });
                });

            }); 
});