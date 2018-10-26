var accessToken= localStorage.getItem('accessToken');
var uemail = localStorage.getItem('uemail');
var name = localStorage.getItem('name');


function fun(res)
{
        console.log(res);
        res.forEach(getFolders);
}

function getFolders(item,index)
{
    var ref=document.getElementById('folder_repeat');
    

        var link='<div class="newfolder" name="'+item.folderName+'">'+
               '<div class="glyphicon glyphicon-folder-open" class="folder"></div>'+
                '<div class="folder_name" id="flip">'+item.folderName+'</div>'+
              '</div>';
   
    
     ref.innerHTML=ref.innerHTML+link;
}


function fun1(result)
{
        result.forEach(getLinks);
}

function getLinks(item,index)
{
    var ref=document.getElementById('link_repeat');
   
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
   
    var ref=document.getElementById('friendsCount');
    var link='<div class="friends">'+ ress.count +' Friends</div>';
    ref.innerHTML=ref.innerHTML+link;
   
}

function fun3(resss)
{
 
    var ref=document.getElementById('friendRequestsCount');
    var link='<div class="friend-requests">'+ resss.count +' Friend Requests</div>';
    ref.innerHTML=ref.innerHTML+link;
   
}


function fun_add_link(result_add_link)
{
    if(result_add_link.success==true)
    {
        // alert("link added");
        document.location.reload();
        // window.location="sample_profile.html";
    }
}




$(document).ready(function(){
    $("#user").append('<div class="username">'+uemail+'</div>');
 
    $("#name_of_user").append('<div class="name"><b>'+name+'</b></div>');
     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFriendsCount",
            {
                accessToken: accessToken,
               
            },
            function(result){
                fun2(result);
                $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFRequestsCount",
                                 {
                                     accessToken: accessToken,
                                    
                                 },
                                 function(result){
                                   
                                    fun3(result);

                }); 


                 $(".sub").click(function(){
                        
                        var link=document.getElementById("link").value;
                        var description=document.getElementById("des").value;
                        var category=document.getElementById("cat").value;
                     

                        $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addLink",
                        {
                            link: link,
                            description: description,
                            category: category,
                            
                             accessToken: accessToken,
                            timeStamp: null
                        },

                        function(dd)
                        {
                          
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
                   
                                        var data=$(this).attr('name');

                                         $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getLinks", 
                                        {
                                           
                                             accessToken: accessToken,
                                            folder: data
                                        }
                                            ,function(result){
                                                fun1(result); 

                                                 $(".call_share").click(function(){
                                                   
                                                    var data=$(this).attr('name');
                                                    var id=$(this).attr('id');
                                                    var link =data.split(/[@]/)[0];
                                                    var description = data.split(/[@]/)[1];

                                                     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/addTimeline", 
                                                    {
                                                        
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
                            
                                                                var data=$(this).attr('name');
                                                              
                                                                var id=$(this).attr('id');
                                                                 $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/deleteLink", 
                                                                {
                                                                    
                                                                     accessToken: accessToken,
                                                                    link: data,
                                                                }
                                                                    ,function(result){
                                                                      
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