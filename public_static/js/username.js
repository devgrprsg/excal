// function fun(details)
// {
//     // console.log(details);
//     // details.forEach(project_names);
//     username(details);

// }
var v1= document.getElementById("user");
var v2=document.getElementById("friendsCount");
localStorage.setItem('currentUser','ritu');
function username()
{
    var j='<div class="username">'+localStorage.getItem('currentUser')+'</div>';
    v1.innerHTML=v1.innerHTML+j;
}
username();

// $(document).ready(function(){
 
//         $.getJSON("http://us-central1-hackathon-692e4.cloudfunctions.net/api/getPersonalData", 
//         {
//             rollNo: 11610171
//         }
//             ,function(result){
//             fun(result);       
//     });
// });
