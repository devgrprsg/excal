function onSignIn(googleUser) {

  var profile = googleUser.getBasicProfile(); 

  console.log(profile)
  
  let token = googleUser.getAuthResponse().id_token;

  console.log("id token",token)

  $.ajax({

    url : "https://us-central1-linkbook-68850.cloudfunctions.net/api/googleLogin",
    type : "GET",
    data : {
      "accessToken" : token
    },
    success : function(result,status) {

      console.log(result);
      let uemail = profile.U3.split(/[@]/)[0]
      localStorage.setItem('accessToken',result)
      localStorage.setItem('uemail',uemail)
      localStorage.setItem('name',profile.ig)
      localStorage.setItem('profilePic',profile.picture)
      localStorage.setItem('login',true);

      location.href = "./html/1.html"
    }
  })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    localStorage.clear();
      localStorage.setItem('login',false);
  });
}