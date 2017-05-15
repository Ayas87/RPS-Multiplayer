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
var userName;
var userUid;
var signedIn = false;
var player1Status = 'open';
var player2Status = 'open';

let signIn = function() {
	let promise = new Promise((resolve, reject) => {
		firebase.auth().signInAnonymously()
	});
	return promise;
}

let updateUser = function() {
	new Promise((resolve, reject) => {
	firebase.auth().currentUser.updateProfile({
		displayName: name
	});
	return Promise
	// most likely will need to move this part
	user = firebase.auth().currentUser;
	userUid = firebase.auth().currentUser.uid;
	userName = firebase.auth().currentUser.displayName;
});
}

let playerOne = function(){
	let promise = new Promise((resolve, reject) => {
		player1ref.on('value', function(snapshot) {
			if (snapshot.val().status == 'open' && userStatus === 'a spectator' && signedIn === true) {
				userStatus = 'Player 1';
				player1ref.update({
					name: user.displayName,
					uid: userUid,
					status: 'closed'
				})
			}
		})
	})
return promose
}

let playerTwo = function(){
	let promise = new Promise((resolve, reject) => {
		player2ref.on('value', function(snapshot) {
			if (snapshot.val().status == 'open' && userStatus === 'a spectator' && signedIn === true && player1Status === 'closed') {
				userStatus = 'Player 2';
				player2ref.update({
					name: user.displayName,
					uid: userUid,
					status: 'closed'
				})
			}
		})
	})
return promise;
}


//////////Starting game

// Click event listener for log in -- need to fix this part
$('#play-btn').on('click', function() {
	let name = $('#usr').val();
	signIn.then(updateUser).then(playerOne).then(playerTwo).catch(handleErrors());
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
	LogIn(firebaseUser);
	player1ref.on('child_changed', function(snapshot) {
		if (snapshot.val().uid === userUid) {
			player1Status = snapshot.val().status;
			appendChoices('.player1');

		}
	})

	player2ref.on('child_changed', function(snapshot) {
		if (snapshot.val().uid === userUid) {
			player2Status = snapshot.val().status
			appendChoices('.player2');
		}
	})
})

function LogIn(firebaseUser) {
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

function applyClickHanders(userStatus) {
	$('.choices').on('click', 'li', function() {
		if (userStatus == 'Player 1') {
			database.ref('/player1').update({
				choice: $(this).text()
			})
		} else if (userStatus == 'Player 2') {
			database.ref('/player2').update({
				choice: $(this).text()
			})
		}
	})
}

function handleErrors(errors) {
	console.log(errors);
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

var player1Choice = function() {
	database.ref('player1').on('child_changed', function(snapshot) {
		return snapshot.val().choice;;
	})
}
var player2Choice = function() {
	database.ref('player2').on('child_changed', function(snapshot) {
		return snapshot.val().choice;;
	})
}

function winner() {
	$('.result').html(compare(player1Choice, player2Choice));
}




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
	$('.debug').on('click', function() {
		debug();
	})
	$('.reset').on('click', function() {
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
