var accessToken=localStorage.getItem('accessToken');
var uemail=localStorage.getItem('uemail');
var name=localStorage.getItem('name');
var login=localStorage.getItem('login');

function login_check(){

    if(login == false){

        console.log("out")
        window.location.replace("https://obscure-dawn-58274.herokuapp.com/")
    }
}

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
            //if(ind=='undefined')
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
                                '<b>LINK :</b><br>'+'<a href = " ' +
                                item.link + ' " >' + item.link + '</a>' +  
                            '</div>'
                            
                            +

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
            
            document.location.reload();
        }
        else{
            alert("error");
        }
}



jQuery(document).ready(function(){

        login_check();

        jQuery("#x1").append('<b>'+uemail+'</b>'+'<br>');
        jQuery("#x1").append(name);
        jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFriends", 
        {
        	accessToken: accessToken
        	
        }
        	,function(result){
        		fun(result);   

                jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getTimeline", 
                    {
                        accessToken: accessToken
                       
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
                           
                                        var comment=document.getElementById(iid).value;



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

   
});





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
    
    //  $(this).attr("disabled","disabled")

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


function getUsers(result)
{
        result.forEach(getU);
}

function getU(item,index)
{
 
        var ref=document.getElementById('show_all');
        var fd='<div class="p-profile b">'+
                                            '<div class="p-p-1 b">'+
                                                '<img src="../images/111.jpg" alt="profile-pic" class="img2">'+
                                            '</div>'+
                                            '<div class="p-p-2 b">'+
                                                '<b>'+item+'</b><br>'+
                                            '</div>'+
                                            '<div class="p-p-3 b">'+
                                                '<button class="new_b click" id="'+item+'"><b>Send Friend Request</b></button>'+
                                            '</div>'+
                                            
                                        '</div>';
        ref.innerHTML=ref.innerHTML+fd;
}

function send_R(result,id)
{
    console.log(result);
        if(result.success==true)
        {

            jQuery("#"+id).empty();
            jQuery("#"+id).append("<b>friend Req Sent</b>");
            // alert("here");
           
        }
        else{
            alert("error");
        }
}

jQuery(document).ready(function(){
jQuery("#getUsers").click(function(){
     jQuery.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getAllUsers", 
        {
            accessToken : accessToken,
        }
            ,function(result){
                console.log(result);
                getUsers(result);  
                jQuery(".click").click(function(){ 
                var r_uemail=jQuery(this).attr('id');
                jQuery.ajax({

                                        url : "https://us-central1-linkbook-68850.cloudfunctions.net/api/sendFriendRequest",
                                        type : "POST",
                                        data : {
                                            accessToken: accessToken,
                                            receiverEmail:r_uemail,
                                            email:uemail
                                            
                                        },
                                    success : function(result_c,status) {
                                    console.log(result_c);
                                    send_R(result_c,r_uemail);      
                                     
                                    }
                                  })
                         });
            });
});
});




