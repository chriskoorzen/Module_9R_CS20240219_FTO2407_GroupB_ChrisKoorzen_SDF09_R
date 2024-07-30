"use strict";       // ECMAScript v5 compliant.

// Static Declarations
const cardBack = "&#x1F0A0;";
const cardDeck = [ // [ unicode, value ]
    ["&#x1F0A1;", 0],   // Ace of Spades
    ["&#x1F0A2;", 2],   // 2 of Spades
    ["&#x1F0A3;", 3],   // 3 of Spades
    ["&#x1F0A4;", 4],   // 4 of Spades
    ["&#x1F0A5;", 5],   // 5 of Spades
    ["&#x1F0A6;", 6],   // 6 of Spades
    ["&#x1F0A7;", 7],   // 7 of Spades
    ["&#x1F0A8;", 8],   // 8 of Spades
    ["&#x1F0A9;", 9],   // 9 of Spades
    ["&#x1F0AA;", 10],  // 10 of Spades
    ["&#x1F0AB;", 10],  // J of Spades
    ["&#x1F0AD;", 10],  // Q of Spades
    ["&#x1F0AE;", 10],  // K of Spades

    ["&#x1F0B1;", 0],   // Ace of Hearts
    ["&#x1F0B2;", 2],   // 2 of Hearts
    ["&#x1F0B3;", 3],   // 3 of Hearts
    ["&#x1F0B4;", 4],   // 4 of Hearts
    ["&#x1F0B5;", 5],   // 5 of Hearts
    ["&#x1F0B6;", 6],   // 6 of Hearts
    ["&#x1F0B7;", 7],   // 7 of Hearts
    ["&#x1F0B8;", 8],   // 8 of Hearts
    ["&#x1F0B9;", 9],   // 9 of Hearts
    ["&#x1F0BA;", 10],  // 10 of Hearts
    ["&#x1F0BB;", 10],  // J of Hearts
    ["&#x1F0BD;", 10],  // Q of Hearts
    ["&#x1F0BE;", 10],  // K of Hearts

    ["&#x1F0C1;", 0],   // Ace of Diamonds
    ["&#x1F0C2;", 2],   // 2 of Diamonds
    ["&#x1F0C3;", 3],   // 3 of Diamonds
    ["&#x1F0C4;", 4],   // 4 of Diamonds
    ["&#x1F0C5;", 5],   // 5 of Diamonds
    ["&#x1F0C6;", 6],   // 6 of Diamonds
    ["&#x1F0C7;", 7],   // 7 of Diamonds
    ["&#x1F0C8;", 8],   // 8 of Diamonds
    ["&#x1F0C9;", 9],   // 9 of Diamonds
    ["&#x1F0CA;", 10],  // 10 of Diamonds
    ["&#x1F0CB;", 10],  // J of Diamonds
    ["&#x1F0CD;", 10],  // Q of Diamonds
    ["&#x1F0CE;", 10],  // K of Diamonds

    ["&#x1F0D1;", 0],   // Ace of Clubs
    ["&#x1F0D2;", 2],   // 2 of Clubs
    ["&#x1F0D3;", 3],   // 3 of Clubs
    ["&#x1F0D4;", 4],   // 4 of Clubs
    ["&#x1F0D5;", 5],   // 5 of Clubs
    ["&#x1F0D6;", 6],   // 6 of Clubs
    ["&#x1F0D7;", 7],   // 7 of Clubs
    ["&#x1F0D8;", 8],   // 8 of Clubs
    ["&#x1F0D9;", 9],   // 9 of Clubs
    ["&#x1F0DA;", 10],  // 10 of Clubs
    ["&#x1F0DB;", 10],  // J of Clubs
    ["&#x1F0DD;", 10],  // Q of Clubs
    ["&#x1F0DE;", 10],  // K of Clubs
]

function shuffle(cards) {
    // Take an array (of implied size 52) and randomly select elements to add to new array.
    let shuffledDeck = new Array();
    let randomPick;
    
    for (let i = 51; i > -1; i--) {
        randomPick = Math.floor(Math.random() * i);

        shuffledDeck.push( cards.splice(randomPick, 1)[0] );
    }

    return shuffledDeck;
}

function getCard() {
    // Take Card from top of the deck
    let card = playDeck.shift();
    return card;
}

class Gambler {
    constructor(elCardDisplay, elSumDisplay){
        this.cards = [];
        this.aces = 0;
        this.sum = 0;
        this.hand = [];                 // Always two possibilities (because of Aces)
        this.highCount = 0
        this.hasBlackJack = false;
        this.isAlive = true;
        this.cardDisplay = elCardDisplay;
        this.sumDisplay = elSumDisplay;
    }

    reset_round() {
        this.cards = [];
        this.aces = 0;
        this.sum = 0;
        this.hand = [];
        this.highCount = 0
        this.hasBlackJack = false;
        this.isAlive = true;
        this.cardDisplay.innerHTML = "-";
        this.sumDisplay.innerHTML = "-";
    }

    displayStats() {
        // Display cards
        this.cardDisplay.innerHTML = this.cards.toString().replaceAll(",", " ");

        // Display Sum
        // Array is either size 1 or size 2
        // and the largest number is second
        if (this.hand.length === 1) {
            this.sumDisplay.textContent = this.hand[0];

        } else {

            this.sumDisplay.textContent = this.hand[0] + " or " + this.hand[1]; 
        }
    }

    displayFirstCardOnly() {
        this.cardDisplay.innerHTML = this.cards[0] + " " + cardBack;

        this.sumDisplay.textContent = "?"
    }

    drawCard(cardSymbol, cardValue) {
        // Add card symbol to hand
        this.cards.push(cardSymbol);

        // Check if Ace is drawn
        if (cardValue === 0) {  
            this.aces = this.aces + 1;
        } else {    // Add card value
            this.sum = this.sum + cardValue;
        }

        // Determine Hand
        this._calcHand();
        // Update Status
        this._statusCheck();
        // Set Highest Hand
        this._setHighCount();
    }

    _calcHand() {
        // Calculate ace combonations
        if (this.aces === 0){ 
            this.hand[0] = this.sum; 
        } else {    // Only one ace can ever count as 11, the rest must be 1
            this.hand[0] = (this.sum + this.aces);
            
            let highTier = (this.sum + 11 + (this.aces - 1));
            if (highTier < 22) { this.hand[1] = highTier; }
            else if (this.hand.length > 1) { this.hand.pop(); } // Remove "dead hand"
        }

    }

    _statusCheck() {
        if (this.hand[0] > 21){ this.isAlive = false; }
        else {
            let count;
            for (count of this.hand){
                if (count === 21){ this.hasBlackJack = true; }
            }
        }
    }

    _setHighCount() {
        if (this.hand.length === 1){ this.highCount = this.hand[0]; }
        else { this.highCount = this.hand[1]; }
    }
}

// Variable Declarations
const player = new Gambler(document.getElementById("playerCards"), document.getElementById("playerSum"));
const dealer = new Gambler(document.getElementById("dealerCards"), document.getElementById("dealerSum"));

const gameMessage = document.getElementById("gameMessage");
const startButton = document.getElementById("startButton");
const drawButton = document.getElementById("drawButton");
const standButton = document.getElementById("standButton");
drawButton.disabled = true;
standButton.disabled = true;

let playDeck;


// Game Play
function startGame() {
    // (re)Set game variables
    gameMessage.innerHTML = "Let's Go!";
    startButton.disabled = true;
    drawButton.disabled = false;
    standButton.disabled = false;

    player.reset_round();
    dealer.reset_round();
    
    // Create a play deck by shuffling a copy of the card deck 3 times.
    playDeck = shuffle(shuffle(shuffle( cardDeck.slice() )));

    // Player Draws first
    let card = getCard();
    player.drawCard(card[0], card[1]);
    
    card = getCard();
    dealer.drawCard(card[0], card[1]);
    
    card = getCard();
    player.drawCard(card[0], card[1]);

    card = getCard();
    dealer.drawCard(card[0], card[1]);

    player.displayStats();
    dealer.displayFirstCardOnly();
    checkGameState();
}

function endGame() {
    gameMessage.innerHTML = "Play another round?";
    startButton.disabled = false;
    drawButton.disabled = true;
    standButton.disabled = true;
}

function drawCard() {
    // Player's turn
    let card = getCard();

    player.drawCard(card[0], card[1]);
    player.displayStats();
    checkGameState();
}

function standTurn() {
    // Dealer's turn
    drawButton.disabled = true;
    standButton.disabled = true;

    // Show dealer's hand
    dealer.displayStats();

    // Dealer must never draw on 17 or above
    while (dealer.highCount < 17) {
        let card = getCard();

        dealer.drawCard(card[0], card[1]);
        dealer.displayStats();
        checkGameState();
    }

    endGame();
    if (dealer.isAlive) {
        tallyHands();
    }
}

function checkGameState() {
    if (player.hasBlackJack && dealer.hasBlackJack){
        // DRAW
        dealer.displayStats();      // Dealer must always show cards on Blackjack
        console.log("DRAW");
        endGame();
    }
    else if (player.hasBlackJack){
        // MEGA WINNER
        dealer.displayStats();      // Dealer may show cards on player Blackjack
        console.log("MEGA WINNER");
        endGame();
    }
    else if (dealer.hasBlackJack){
        // LOSER
        dealer.displayStats();      // Dealer must always show cards on Blackjack
        console.log("LOSER");
        endGame();
    }
    else if (!player.isAlive){
        // LOSER
        dealer.displayStats();      // Dealer may show cards on player bust
        console.log("LOSER");
        endGame();
    }
    else if (!dealer.isAlive){
        // WINNER
        console.log("WINNER");
        endGame();
    }
}

function tallyHands() {
    if (player.highCount === dealer.highCount){
        // DRAW
        console.log("DRAW");
    }
    else if (player.highCount > dealer.highCount) {
        // WINNER
        console.log("WINNER");
    }
    else {
        // LOSER
        console.log("LOSER");
    }
}