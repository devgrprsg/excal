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
    // alert("hey");
     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getFRequests", 
        {
            // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
            uemail:'devgrprsg'
        }
            ,function(result){
                fReq(result);      
                $(".accR").click(function(){
                    var id = $(this).attr('id');
                    var hid='\''+id+'\'';
                     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/acceptFriendRequest", 
                        {
                            // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
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
    // alert("hey");
     $.post("https://us-central1-linkbook-68850.cloudfunctions.net/api/getNotifications", 
        {
            // accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRfaW4iOnRydWUsImJvZHkiOnsia2luZCI6InBsdXMjcGVyc29uIiwiZXRhZyI6IlwiamIxWHphbm94Nmk4WnlzZTREY1lEOHNacXkwL2t4Z1N6Z3NhVXpqRzJVb1NqVFptZklIaHplRVwiIiwiZW1haWxzIjpbeyJ2YWx1ZSI6InNoYWtzaGlnYXJnOTQxNjg1ODg3NUBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjb3VudCJ9XSwib2JqZWN0VHlwZSI6InBlcnNvbiIsImlkIjoiMTE1NzY5NDU0NjI0NDIzNTk4NzU5IiwiZGlzcGxheU5hbWUiOiJTaGFrc2hpIGdhcmciLCJuYW1lIjp7ImZhbWlseU5hbWUiOiJnYXJnIiwiZ2l2ZW5OYW1lIjoiU2hha3NoaSJ9LCJ1cmwiOiJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTU3Njk0NTQ2MjQ0MjM1OTg3NTkiLCJpbWFnZSI6eyJ1cmwiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLTVMNmpqbTc5My13L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUJBL0d4UVBKejZjOTFvL3Bob3RvLmpwZz9zej01MCIsImlzRGVmYXVsdCI6ZmFsc2V9LCJpc1BsdXNVc2VyIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwiY2lyY2xlZEJ5Q291bnQiOjAsInZlcmlmaWVkIjpmYWxzZX0sImlhdCI6MTU0MDMyMTMxOCwiZXhwIjoxNTQwMzY0NTE4fQ.SSvuB-FuErJen37Tt3ZlLLwCe3IFezxiIYTiFCYznk0',
            uemail:'shakshigarg9416858875'
        }
            ,function(result){
                noti(result);      
    });
});
});
