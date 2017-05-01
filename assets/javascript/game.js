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
var player1 = false;
var player2 = false;
var wins = 0;
var losses = 0;


//Starting game
function startGame() {
  if (database.ref('/player1') === true && database.ref('/player2') === true) {
    appendGame('.player1');
    appendGame('.player2');
  }
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

//adds players
function addPlayers() {
  var player1 = database.ref('/player1');
  var player2 = database.ref('/player2');
  console.log(player1.val().status);
}
addPlayers();

// Click event listener for log in
$('#play-btn').on('click', function() {
  var name = $('#usr').val();
  var user = firebase.auth().currentUser;
  firebase.auth().signInAnonymously().then(function(){
    firebase.auth().currentUser.updateProfile({
      displayName: name
    });
  })
});

// Click event listener for log out
$('.logout').on('click', function() {
  firebase.auth().currentUser.delete();
});

//Auth listener
firebase.auth().onAuthStateChanged(function(firebaseUser) {
  var user = firebase.auth().currentUser;
  if (firebaseUser) {
    $('.login').addClass('hide');
    $('.logout').removeClass('hide');
    $('.message-box').html('Welcome ' + user.displayName)
  } else {
    $('.login').removeClass('hide');
    $('.logout').addClass('hide');
    $('.message-box').html('Please log in')
    // user.delete()
  }
});


// //Player 1 value listener
// database.ref('/player1').on('value', function(snapshot) {
//   if (snapshot.val() === null && player2 === false) {
//     console.log('no player 1 found');
//     database.ref('/player1').set({
//       name: auth.currentUser.displayName,
//       id: auth.currentUser.uid,
//       wins: wins,
//       losses: losses
//     })
//     player1 = true;
//     console.log('You are Player 1 ' + player1)
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
