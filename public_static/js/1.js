// localStorage.setItem('accessToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImF6cCI6IjQ4MTk5NDkyMDY4OC1zcHJvY3IzbzFnNjQyazRldm11OHJtOXRyOHZjcmE1cy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjQ4MTk5NDkyMDY4OC1zcHJvY3IzbzFnNjQyazRldm11OHJtOXRyOHZjcmE1cy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwOTkyNzAyNzU0NzkxNDUyNTEzOCIsImVtYWlsIjoiZGV2Z3JwcnNnQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJpOS03RGNUUkpmdnFsWnJiWUJZZHZ3IiwibmFtZSI6IkV4Y2FsIFRlY2hzcGFyZGhhIiwicGljdHVyZSI6Imh0dHBzOi8vbGg2Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tMGlFMG5KMHIzOFkvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUJ0TmxiQUY3STdEaE9GekQ4V0l5bjFNa3otS1ZXWndydy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiRXhjYWwiLCJmYW1pbHlfbmFtZSI6IlRlY2hzcGFyZGhhIiwibG9jYWxlIjoiZW4iLCJpYXQiOiIxNTQwNDY0ODYxIiwiZXhwIjoiMTU0MDQ2ODQ2MSIsImp0aSI6ImMyNDJmNDVkODI0NGIzZjI0YmIzMjYyZDdlYmYxZjYyOWIwOWEyZmMiLCJhbGciOiJSUzI1NiIsImtpZCI6IjcyOGY0MDE2NjUyMDc5YjllZDk5ODYxYmIwOWJhZmM1YTQ1YmFhODYiLCJ0eXAiOiJKV1QifSwiaWF0IjoxNTQwNDY0ODYyLCJleHAiOjE1NDA1MDgwNjJ9.hzbgJXLx7A6gBNjr7tKZFq_nzNdXWTInioodY5zuveI');

var accessToken=localStorage.getItem('accessToken');
var uemail=localStorage.getItem('uemail');
var name=localStorage.getItem('name');
// document.getElementById('name').innerHTML=name;
// document.getElementById('x1').innerHTML=uemail;
// $("#x1").empty();
$.noConflict();

function fun(result)
{
		result.forEach(getFriends);
}

function getFriends(item,index)
{
	var ref=document.getElementById('friends_json');
    var friend='<div class="t4-f-profile b"><div class="t4-f-p-1 b"><img src="../images/111.jpg" alt="profile-pic" class="img1"></div><div class="t4-f-p-2"><b>'+item.uemail+'</b><br></div>';
	ref.innerHTML=ref.innerHTML+friend;
}

function get_post(result)
{
        result.forEach(getPosts);
}




function addLike(result,id,nL,ind)
{
        if(result.success==true)
        {
            if(ind=='undefined')
            // alert(yup);
            changeLike(id,nL,ind);
        }
        else
        {
            alert("some problem encountered!!");
        }
}

function changeLike(id,nL,ind)
{
    jQuery('#'+id).empty();
    var g=+(nL);
    g=g+1;
    var ic='<span class="glyphicon glyphicon-heart"></span>'+
    '<span class="nLikes" id="n-likes'+ind+'" name="'+g+'">'+g+'</span>';

    jQuery('#'+id).append(ic);
}



function getComm(res,id)
{
    localStorage.setItem('id',id);
        res.forEach(getComms);
}



function getComms(item,index)
{
    id=localStorage.getItem('id');
    // alert('index '+index);
    var ref=document.getElementById(id);
    var j='<div class="comment">'+
                                '<div class="t2-p-c-n">'+
                                    '<b>'+item.uemail+' : </b>'+
                                '</div>'+
                                '<div class="t2-p-c-d">'+
                                    item.comment+
                                '</div>'+
                                '</div>';
    ref.innerHTML=j+ref.innerHTML;
}



function add_to_prof(result,id)
{
        if(result.success==true)
        {
            changeSend(id);
        }
        else
        {
            alert("some problem encountered!!");
        }
}


function changeSend(id)
{
    jQuery('#'+id).empty();
    var ic='<span class="glyphicon glyphicon-ok"></span>';

    jQuery('#'+id).append(ic);
}



function getPosts(item,index)
{
    // alert('index '+index);
    var ref=document.getElementById('posts');
    var post='<div class="t2-p b1">'+

                            '<div class="t2-p-profile b">'+
                                '<div class="t2-p-p-1 b">'+
                                   ' <img src="../images/111.jpg" alt="profile-pic" class="img2">'+
                                '</div>'+
                                '<div class="t2-p-p-2 b">'+
                                    '<b>'+item.uname+'</b><br>'+
                               ' </div>'+
                                
                            '</div>'+

                            '<div class="t2-p-link b">'+
                                '<b>LINK :</b><br>'+
                                item.link+
                            '</div>'+

                            '<div class="t2-p-desc b">'+
                                '<b>Description :</b><br>'+
                                item.description+
                            '</div>'+

                            '<div class="t2-p-icons b">'+
                                '<div class="icon1 icon b like" name="'+item.link+'@'+item.uname+'@like" id="like-'+index+'" >'+
                                '<span class="glyphicon glyphicon-heart-empty"></span><span class="nLikes" id="n-likes'+index+'" name="'+item.likes+'">'+item.likes+'</span>'+
                                '</div>'+
                               ' <div class="icon2 icon b" name="'+item.link+'@'+item.uname+'@link-'+index+'" id="comment-'+index+'">'+
                                '<span class="glyphicon glyphicon-comment"></span>'+
                                '</div>'+
                                '<div class="icon3 icon b add" name="'+item.link+'@'+item.description+'@send" id="send-'+index+'">'+
                                '<span class="glyphicon glyphicon-send addToProf"></span>'+
                                '</div>'+
                            '</div>'+

                            '<div class="t2-p-comments" id="link-'+index+'">'+
                            '<div class="comment">'+
                                        '<div class="t2-p-c-n">'+
                                            '<b>Add Comment : </b>'+
                                        '</div>'+
                                        '<div class="t2-p-c-d">'+
                                            '<input class="inC" id="link'+index+'" type="text" name="comment"><br>'+
                                            '<div class="submit" name="'+item.link+'@'+item.uname+'" id="'+index+'"><button>Comment</button></div>'+
                                        
                                        '</div>'+
                                        '</div>'+
                            '</div>';
    ref.innerHTML=ref.innerHTML+post;
}



function add_com(result)
{
    console.log(result);
        if(result.success==true)
        {
            // alert("here");
            document.location.reload();
        }
        else{
            alert("error");
        }
}



jQuery(document).ready(function(){
        jQuery("#x1").append('<b>'+uemail+'</b>'+'<br>');
        jQuery("#x1").append(name);
        jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFriends", 
        {
        	accessToken: accessToken
        	// uemail:'devgrprsg'
        }
        	,function(result){
        		fun(result);   

                jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getTimeline", 
                    {
                        accessToken: accessToken
                        // uemail:'devgrprsg'
                    }
                        ,function(res){
                            console.log(res);
                            get_post(res);   

                            jQuery(".like").click(function(){
                            var id = jQuery(this).attr('id');
                            var data=jQuery(this).attr('name');
                            var ind=id.split(/[-]/)[1];
                            var link=data.split(/[@]/)[0];
                            var postuemail=data.split(/[@]/)[1];
                            var type=data.split(/[@]/)[2];
                            var nL=jQuery("#n-likes"+ind).attr('name');
                            if(nL=='undefined')
                            {
                                // alert("yes un");
                                nL=0;
                            }

                             jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addLike", 
                                {
                                    accessToken : accessToken,
                                    uid: uemail,
                                    uemail: postuemail,
                                    link: link
                                }
                                    ,function(result){
                                        // alert(id);
                                        addLike(result,id,nL,ind);      
                                        
                        });



                        });   

                            jQuery(".add").click(function(){
                                var id = jQuery(this).attr('id');
                                var data=jQuery(this).attr('name');;
                                var link=data.split(/[@]/)[0];
                                var description=data.split(/[@]/)[1];
                            //      jQuery.load("https://us-central1-linkbook-68850.cloudfunctions.net/api/addLink", 
                            //         {
                            //             accessToken : accessToken,
                            //             uemail:uemail,
                            //             link:link,
                            //             category: 'misc',
                            //             description: description,
                            //             timeStamp: null
                            //         }
                            //             ,function(r){
                            //                 alert("in function");
                            //                 console.log(r);
                            //                 add_to_prof(r,id);      
                                            
                            // });

                              jQuery.ajax({

                                        url : "https://us-central1-linkbook-68850.cloudfunctions.net/api/addLink",
                                        type : "POST",
                                        data : {
                                        accessToken : accessToken,
                                        uemail:uemail,
                                        link:link,
                                        category: 'misc',
                                        description: description,
                                        // timeStamp: null
                                    },
                                    success : function(r,status) {

                                    console.log(r);
                                    add_to_prof(r,id); 
                                      // location.href = "./html/1.html"
                                    }
                                  })


                            });


                            jQuery(".icon2").click(function(){
                            var data = jQuery(this).attr('name');
                            var link=data.split(/[@]/)[0];
                            var post_uemail=data.split(/[@]/)[1];
                            var id = data.split(/[@]/)[2];
                            // alert(link+' '+post_uemail+' '+id);

                            jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getComments", 
                            {
                                accessToken: accessToken,
                                email:post_uemail,
                                link:link,
                            }
                                ,function(result){
                                    getComm(result,id);    
                                         jQuery(".submit").click(function(){

                                        var data=jQuery(this).attr('name');
                                        var link_num=jQuery(this).attr('id');
                                        var link=data.split(/[@]/)[0];
                                        var post_uemail=data.split(/[@]/)[1];
                                        // alert(link_num);
                                        var iid='link'+link_num;
                                        // alert(iid);

                                        // alert("link: "+link);
                                        // alert("uemail"+post_uemail);
                                        var comment=document.getElementById(iid).value;

                                        // alert(comment);


                                    //      jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addComment", 
                                    //     {
                                    //         accessToken: accessToken,
                                    //         uid:uemail,
                                    //         link: link,
                                    //         uemail:post_uemail,
                                    //         comment: comment
                                    //     }
                                    //         ,function(result_c){
                                    //             // alert("in in");
                                    //             console.log(result_c);
                                    //             add_com(result_c);       
                                    // });


                                    jQuery.ajax({

                                        url : "https://us-central1-linkbook-68850.cloudfunctions.net/api/addComment",
                                        type : "POST",
                                        data : {
                                            accessToken: accessToken,
                                            uid:uemail,
                                            link: link,
                                            uemail:post_uemail,
                                            comment: comment
                                        },
                                    success : function(result_c,status) {
                                    console.log(result_c);
                                    add_com(result_c);      
                                     
                                    }
                                  })




                                    });
                                    jQuery("#"+id).slideToggle("slow"); 
                    });

                             // $(".t2-p-comments").css('display','flex');
                        });

                });    
    });

    //  jQuery(".submit").click(function(){

    //     var data=jQuery(this).attr('name');
    //     var link_num=jQuery(this).attr('id');
    //     var link=data.split(/[@]/)[0];
    //     var post_uemail=data.split(/[@]/)[1];
    //     alert(link_num);
    //     var iid='link'+link_num;
    //     alert(iid);
    //     var comment=document.getElementById(iid).value;

    //     alert(comment);
    //     alert(link);
    //     alert(post_uemail);

    //      jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addComment", 
    //     {
    //         uid:'devgrprsg',
    //         link: link,
    //         uemail:post_uemail,
    //         comment: comment
    //     }
    //         ,function(result){
    //             add_com(result);       
    // });
    // });
});



//jQuery(document).ready(function(){
    // jQuery(".submit").click(function(){

    //     var data=jQuery(this).attr('name');
    //     var link_num=jQuery(this).attr('id');
    //     var link=data.split(/[@]/)[0];
    //     var post_uemail=data.split(/[@]/)[1];
    //     alert(link_num);
    //     var iid='link'+link_num;
    //     alert(iid);
    //     var comment=document.getElementById(iid).value;

    //     alert(comment);


    //      jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addComment", 
    //     {
    //         uid:'sakshi2k07',
    //         link: link,
    //         uemail:post_uemail,
    //         comment: comment
    //     }
    //         ,function(result){
    //             console.log(result);
    //             add_com(result);       
    // });
    // });
//});


function fReq(result)
{
        result.forEach(getFR);
}

function getFR(item,index)
{
    var ref=document.getElementById('frr');
    var fd='<div class="dropFlex b">'+
                               ' <div class="dropFlex-1 b">'+
                                    '<img src="../images/111.jpg" alt="profile-pic" class="img1">'+
                                '</div>'+
                                '<div class="dropFlex-2 b">'+
                                    '<div class="text">'+
                                    '<b>'+item.uemail+'</b> sent you a friend request<br>'+
                                    '</div>'+
                                    '<div class="accR" id="'+item.uemail+'">'+
                                   ' <span class="glyphicon glyphicon-star-empty"></span>Accept'+
                                    '</div>'+
                               ' </div>'+
                                
                    '</div>';
    ref.innerHTML=ref.innerHTML+fd;
}


jQuery(document).ready(function(){
jQuery("#friendReq").click(function(){
	// alert("hey");
	 jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFRequests", 
        {
            accessToken: accessToken,
        	uemail:uemail
        }
        	,function(result){
        		fReq(result);      
                jQuery(".accR").click(function(){
                    var id = jQuery(this).attr('id');
                    var hid='\''+id+'\'';
                     jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/acceptFriendRequest", 
                        {
                            accessToken: accessToken,
                            uemail:'devgrprsg',
                            senderEmail :id
                        }
                            ,function(result_acc_fr){
                                accReq(result_acc_fr,id);       
                    });

                }); 
    });
});
});

jQuery(document).ready(function(){
jQuery(".dropdown-content").hover(function(){
     },function(){
            jQuery('#frr').empty();
     });
});


function accReq(result,id)
{
		if(result.success==true)
        {
            changeIcon(id);
        }
        else
        {
            alert("some problem encountered!!");
        }
}

function changeIcon(id)
{
    jQuery('#'+id).empty();
    var ic='<span class="glyphicon glyphicon-ok"></span>';

    jQuery('#'+id).append(ic);
}




function noti(result)
{
        result.forEach(getN);
}

function getN(item,index)
{
 
        var ref=document.getElementById('notf');
        var fd=   '<div class="dropFlex b">'+
                                    '<div class="dropFlex-1 b">'+
                                        '<img src="../images/111.jpg" alt="profile-pic" class="img1">'+
                                   ' </div>'+
                                    '<div class="dropFlex-2 b">'+
                                        '<div class="text">'+
                                        item.notification+
                                        '</div>'+
                                    '</div>'+
                                    
                        '</div>'+
                        
                      '</div>';
        ref.innerHTML=ref.innerHTML+fd;
}


jQuery(document).ready(function(){
jQuery("#notify").click(function(){
    // alert("hey");
     jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getNotifications", 
        {
            accessToken : accessToken,
            uemail:uemail
        }
            ,function(result){
                console.log(result);
                noti(result);      
    });
});
});




// function addLike(result,id)
// {
//         if(result.success==true)
//         {
//             // alert("done upto here");
//             changeLike(id);
//         }
//         else
//         {
//             alert("some problem encountered!!");
//         }
// }

// function changeLike(id)
// {
//     jQuery('#'+id).empty();
//     var ic='<span class="glyphicon glyphicon-heart"></span>';

//     jQuery('#'+id).append(ic);
// }



jQuery(document).ready(function(){
// jQuery(".like").click(function(){
//     var id = jQuery(this).attr('id');
//     var data=jQuery(this).attr('name');
//     var link=data.split(/[@]/)[0];
//     var uemail=data.split(/[@]/)[1];
//     var type=data.split(/[@]/)[2];
//     alert(link);
//     alert(uemail);
//     alert(type);
//      jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addLike", 
//         {
//             // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
//             uid:'sakshi2k07',
//             uemail: uemail,
//             link: link
//         }
//             ,function(result){
//                 // alert(id);
//                 addLike(result,id);      
                
// });
// });
});




// jQuery(document).ready(function(){
// jQuery(".add").click(function(){
//     var id = jQuery(this).attr('id');
//     var data=jQuery(this).attr('name');;
//     var link=data.split(/[@]/)[0];
//     var description=data.split(/[@]/)[1];
//      jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addLink", 
//         {
//             // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
//             uemail:'devgrprsg',
//             link:link,
//             category: 'misc',
//             description: description,
//             timeStamp: null
//         }
//             ,function(result){
//                 add_to_prof(result,id);      
                
// });
// });
// });


// function getComm(res,id)
// {
//     localStorage.setItem('id',id);
//         res.forEach(getComms);
// }



// function getComms(item,index)
// {
//     id=localStorage.getItem('id');
//     alert('index '+index);
//     var ref=document.getElementById(id);
//     var j='<div class="comment">'+
//                                 '<div class="t2-p-c-n">'+
//                                     '<b>'+item.uemail+' : </b>'+
//                                 '</div>'+
//                                 '<div class="t2-p-c-d">'+
//                                     item.comment+
//                                 '</div>'+
//                                 '</div>';
//     ref.innerHTML=j+ref.innerHTML;
// }


jQuery(document).ready(function(){
//     jQuery(".icon2").click(function(){
//         var data = jQuery(this).attr('name');
//         var link=data.split(/[@]/)[0];
//         var post_uemail=data.split(/[@]/)[1];
//         var id = data.split(/[@]/)[2];
//         alert(link+' '+post_uemail+' '+id);

//         jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getComments", 
//         {
//             // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
//             uemail:post_uemail,
//             link:link,
//         }
//             ,function(result){
//                 getComm(result,id);    
//                      jQuery(".submit").click(function(){

//                     var data=jQuery(this).attr('name');
//                     var link_num=jQuery(this).attr('id');
//                     var link=data.split(/[@]/)[0];
//                     var post_uemail=data.split(/[@]/)[1];
//                     alert(link_num);
//                     var iid='link'+link_num;
//                     alert(iid);
//                     var comment=document.getElementById(iid).value;

//                     alert(comment);


//                      jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addComment", 
//                     {
//                         uid:'sakshi2k07',
//                         link: link,
//                         uemail:post_uemail,
//                         comment: comment
//                     }
//                         ,function(result){
//                             console.log(result);
//                             add_com(result);       
//                 });
//                 });
//                 jQuery("#"+id).slideToggle("slow"); 
// });

//          // $(".t2-p-comments").css('display','flex');
//     });
});

