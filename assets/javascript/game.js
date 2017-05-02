// Initialize Firebase
var config = {
  apiKey: "AIzaSyAtfqb64Vtdm2_5H8enPVyicTSPrexzjaU",
  authDomain: "rps-multiplayer-1773e.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-1773e.firebaseio.com",
  projectId: "rps-multiplayer-1773e",
  storageBucket: "rps-multiplayer-1773e.appspot.com",
  messagingSenderId: "154881258297"
};

firebase.initializeApp(config);

var database = firebase.database();
var player1ref = database.ref('/player1');
var player2ref = database.ref('/player2');
var userStatus = 'spectator';
var user;
var userUid;
var signedIn = false;
var player1Status = 'open';
var player1Status = 'open';

//debug
function debug () {
  console.log('user: ' + user.displayName);
  console.log('userUid: ' + userUid);
  console.log('signedIn: ' + signedIn);
  console.log('userStatus: ' + userStatus);
}

//reset db
function resetDb () {
  resetPlayerOne ();
  resetPlayerTwo ();
};

function resetPlayerOne () {
  player1ref.update({
    status: 'open',
    name: 'player1',
    player2: 'false'
  })
}
function resetPlayerTwo () {
  player2ref.update({
    status: 'open',
    name: 'player2',
    player1: 'false'
  })
}


//Starting game
function startGame() {
  
};

function appendGame(target) {
  var rock = $('<div class="rock">Rock</div>')
  var paper = $('<div class="paper">Paper</div>')
  var scissors = $('<div class="scissors">Scissors</div>')
  var choices = $('<div class="choices">Make your choice:</div><br>')
  choices.append(rock)
  choices.append(paper)
  choices.append(scissors)
  $(target).append(choices);
}

function handleErrors (errors) {
  console.log(errors);
}

function changeLogInBtn (firebaseUser){
  if (firebaseUser) {
    $('.login').addClass('hide');
    $('.logout').removeClass('hide');
    $('.message-box').html('Welcome ' + firebaseUser.displayName)
    signedIn = true;
  } else {
    $('.login').removeClass('hide');
    $('.logout').addClass('hide');
    $('.message-box').html('Please log in')
  }
}

  

function playerOne () {
player1ref.on('value', function(snapshot) {
  if (snapshot.val().status == 'open' && userStatus === 'spectator' && signedIn === true) {
    userStatus = 'player1';
    player1ref.update({
      name: user.displayName,
      uid: userUid,
      status: 'closed'
    }).then(function(){
      
      $('.message-box').append('<div class="player">You are Player 1</div>');
      player2ref.update({
      player1: 'true'
    });
    })
  }
})
}



function playerTwo () {
player2ref.on('value', function(snapshot) {
  console.log('playerTwo function runs user status is ' + userStatus)
  if (snapshot.val().status == 'open' && userStatus === 'spectator' && signedIn === true && player1Status === 'closed') {
    userStatus = 'player2';
    player2ref.update({
      name: user.displayName,
      uid: userUid,
      status: 'closed'
    }).then(function(){
      
      $('.message-box').append('<div class="player">You are Player 2</div>');
      player1ref.update({
      player2: 'true'
    });
    })    
  }
})
}






// Click event listener for log in
$('#play-btn').on('click', function() {
  var name = $('#usr').val();
  firebase.auth().signInAnonymously().then(function() {
    user = firebase.auth().currentUser;
    firebase.auth().currentUser.updateProfile({
      displayName: name
    }).then(function() {
      userUid = firebase.auth().currentUser.uid;
      firebase.auth().onAuthStateChanged(function(firebaseUser) {
        changeLogInBtn (firebaseUser)
        // playerOne();
        // playerTwo();
      });
    }).then(function(){
      debug();
      playerOne();
    }).then(function(){
      playerTwo();
    })
  }).catch(function(){
    handleErrors()
  })
});

// Click event listener for log out
$('.logout').on('click', function() {
  if (userStatus === 'player1') {
    resetPlayerOne();
    player2ref.update({
      player1: 'false'
    })
  } else if (userStatus === 'player2') {
    resetPlayerTwo();
    player1ref.update({
      player2: 'false'
    })
  };
  firebase.auth().currentUser.delete();
  userStatus = 'spectator';
  signedIn = false;
});










//handlers
firebase.auth().onAuthStateChanged(function(firebaseUser) {
  changeLogInBtn (firebaseUser);
})

player1ref.on('value',function(snapshot) {
  player1Status = snapshot.val().status;
})

player2ref.on('value',function(snapshot) {
  player2Status = snapshot.val().status;
})










// player2ref.on('value', function(snapshot) {
//   var user = firebase.auth().currentUser.displayName;
//   var userUid = firebase.auth().currentUser.uid
//   if (snapshot.val().status == 'open' && userUid !== player1ref.val().uid) {
//     console.log('line 79: player1 status is: ' + snapshot.val().status)
//     player2ref.update({
//       name: user,
//       uid: userUid
//     })
//   }
// })

// database.ref('/player2').on('value', function(snapshot) {
//   if (snapshot.val() === null && player1 === true) {
//     console.log('no player 1 found or player 2 found');
//     database.ref('/player2').set({
//       name: auth.currentUser.displayName,
//       id: auth.currentUser.uid,
//       wins: wins,
//       losses: losses
//     })
//     player2 = true;
//     console.log('You are Player 2')
//   }
// })

//RPS game logic
// function compare (choice1, choice2) {
//     if(choice1 === choice2) {
//         return "The result is a tie!";
//     }
//     else if(choice1 === "rock") {
//         if(choice2 === "scissors") {
//             return "rock wins";
//         }
//     else{
//         return"paper wins";
//     }
//     }
//     else if(choice1 === "paper") {
//         if(choice2 === "rock") {
//             return "paper wins";
//         }
//     }
//     else {
//         return "scissors wins";
//     }
//     else if(choice1 === "scissors") {
//         if(choice2 === "rock") {
//             return "rock wins";
//         }
//     else {
//         return "scissors wins";
//     }
//     }
// }
