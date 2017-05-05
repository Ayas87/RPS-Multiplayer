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
var userStatus = 'a spectator';
var user = 'spectator';
var userUid;
var signedIn = false;
var player1Status = 'open';
var player2Status = 'open';






//console log useful info
function debug() {
  console.log('user: ' + user.displayName);
  console.log('userUid: ' + userUid);
  console.log('signedIn: ' + signedIn);
  console.log('userStatus: ' + userStatus);
}

//reset db
function resetDb() {
  resetPlayerOne();
  resetPlayerTwo();
};

//debug btns
function debugBtns() {
  $('.debug').on('click',function(){
    debug();
  })
  $('.reset').on('click',function(){
    resetDb();
  })
}
debugBtns();








function resetPlayerOne() {
  player1ref.update({
    status: 'open',
    name: 'player1',
    player2: 'false',
    uid: 'player1uid',
    choice: 'none',
    wins: 0,
    losses: 0,
  })
}

function resetPlayerTwo() {
  player2ref.update({
    status: 'open',
    name: 'player2',
    player1: 'false',
    uid: 'player2uid',
    choice: 'none',
    wins: 0,
    losses: 0,
  })
}


//Starting game
function startGame() {

};

function appendChoices(player) {
  var rock = $('<li class="rock">Rock</li>')
  var paper = $('<li class="paper">Paper</li>')
  var scissors = $('<li class="scissors">Scissors</li>')
  var choicesHeader = $('<div class="choicesHeader">Make your choice: </div>')
  var choices = $('<ul class="choices list-unstyled">')
  choices.append(choicesHeader)
  choices.append(rock)
  choices.append(paper)
  choices.append(scissors)
  $(player).html(choices);
  applyClickHanders();
  // $(opponent).html('waiting');
}

function removeAppendedChoices(player) {
  $(player).empty();
}

function applyClickHanders() {
  $('.choices').on('click', 'li', function() {
    console.log($(this).text())
    console.log(userStatus)
    winner();
  })
}

function handleErrors(errors) {
  console.log(errors);
}

function changeLogInBtn(firebaseUser) {
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

function playerOne() {
  player1ref.on('value', function(snapshot) {
    if (snapshot.val().status == 'open' && userStatus === 'a spectator' && signedIn === true) {
      userStatus = 'Player 1';
      player1ref.update({
        name: user.displayName,
        uid: userUid,
        status: 'closed'
      }).then(function() {
        $('.message-box').append('<div class="player">You are Player 1</div>');
        player2ref.update({
          player1: 'true'
        });
      })
    }
  })
}

function playerTwo() {
  player2ref.on('value', function(snapshot) {
    console.log('playerTwo function runs user status is ' + userStatus)
    if (snapshot.val().status == 'open' && userStatus === 'a spectator' && signedIn === true && player1Status === 'closed') {
      userStatus = 'Player 2';
      player2ref.update({
        name: user.displayName,
        uid: userUid,
        status: 'closed'
      }).then(function() {
        $('.message-box').append('<div class="player">You are Player 2</div>');
        player1ref.update({
          player2: 'true'
        });
      })
    }
  })
}

function compare(choice1, choice2) {
  if (choice1 === choice2) {
    return "The result is a tie!";
  }
  if (choice1 === "Rock") {
    if (choice2 === "Scissors") {
      return "Rock wins";
    } else {
      return "Paper wins";
    }
  }
  if (choice1 === "Paper") {
    if (choice2 === "Rock") {
      return "Paper wins";
    } else {
      return "Scissors wins";
    }
  }
  if (choice1 === "Scissors") {
    if (choice2 === "Rock") {
      return "Rock wins";
    } else {
      return "Scissors wins";
    }
  }
};

function winner() {
  $('.result').html(compare('Scissors', 'Scissors'));
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
        changeLogInBtn(firebaseUser)
          // playerOne();
          // playerTwo();
      });
    }).then(function() {
      playerOne();
    }).then(function() {
      playerTwo();
    })
  }).catch(function() {
    handleErrors()
  })
});

// Click event listener for log out
$('.logout').on('click', function() {
  if (userStatus === 'Player 1') {
    resetPlayerOne();
    player2ref.update({
      player1: 'false'
    })
  } else if (userStatus === 'Player 2') {
    resetPlayerTwo();
    player1ref.update({
      player2: 'false'
    })
  };
  firebase.auth().currentUser.delete();
  userStatus = 'a spectator';
  user = 'spectator'
  signedIn = false;
});










//handlers
firebase.auth().onAuthStateChanged(function(firebaseUser) {
  changeLogInBtn(firebaseUser);
})

player1ref.on('value', function(snapshot) {
  player1Status = snapshot.val().status;
  if (snapshot.val().uid === userUid) {
    appendChoices('.player1');
  } else {
    removeAppendedChoices('.player1');
  }
})

player2ref.on('value', function(snapshot) {
  player2Status = snapshot.val().status;
  if (snapshot.val().uid === userUid) {
    appendChoices('.player2');
  } else {
    removeAppendedChoices('.player2');
  }
})
