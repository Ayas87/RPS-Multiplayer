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
var auth = firebase.auth();
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

// Click event listener for log in
$('#play-btn').on('click', function() {
    auth.signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/operation-not-allowed') {
            alert('You must enable Anonymous auth in the Firebase Console.');
        } else {
            console.error(error);
        }
    });
});

// Click event listener for log out
$('.logout').on('click', function() {
    auth.signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
});

//Auth listener
auth.onAuthStateChanged(function(firebaseUser) {
    // console.log(firebaseUser.uid);
    if (firebaseUser) {
        $('.logout').removeClass('hide');
        var name = $('#usr').val()
        auth.currentUser.updateProfile({
            displayName: name
        })
        startGame();
    } else {
        auth.currentUser.signOut();
        $('.logout').addClass('hide');
    }
});

//Player 1 value listener
database.ref('/player1').on('value', function(snapshot) {
    if (snapshot.val() === null && player2 === false) {
        console.log('no player 1 found');
        database.ref('/player1').set({
            name: auth.currentUser.displayName,
            id: auth.currentUser.uid,
            wins: wins,
            losses: losses
        })
        player1 = true;
        console.log('You are Player 1 ' + player1)
    }
})

database.ref('/player2').on('value', function(snapshot) {
    if (snapshot.val() === null && player1 === true) {
        console.log('no player 1 found or player 2 found');
        database.ref('/player2').set({
            name: auth.currentUser.displayName,
            id: auth.currentUser.uid,
            wins: wins,
            losses: losses
        })
        player2 = true;
        console.log('You are Player 2')
    }
})
