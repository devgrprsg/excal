function fReq(result)
{
        result.forEach(getFR);
}

function getFR(item,index)
{
    var ref=document.getElementById('frr');
    var fd='<div class="dropFlex b">'+
                               ' <div class="dropFlex-1 b">'+
                                    '<img src="111.jpg" alt="profile-pic" class="img1">'+
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


$(document).ready(function(){
$("#friendReq").click(function(){

     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFRequests", 
        {
           
            uemail:'devgrprsg'
        }
            ,function(result){
                fReq(result);      
                $(".accR").click(function(){
                    var id = $(this).attr('id');
                    var hid='\''+id+'\'';
                     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/acceptFriendRequest", 
                        {
                           
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

$(document).ready(function(){
$(".dropdown-content").hover(function(){
     },function(){
            $('#frr').empty();
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
    $('#'+id).empty();
    var ic='<span class="glyphicon glyphicon-ok"></span>';

    $('#'+id).append(ic);
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
                                    '<img src="111.jpg" alt="profile-pic" class="img1">'+
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


$(document).ready(function(){
$("#notify").click(function(){
   
     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getNotifications", 
        
            uemail:'shakshigarg9416858875'
        }
            ,function(result){
                noti(result);      
    });
});
});
