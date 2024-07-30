"use strict";       // ECMAScript v5 compliant.

// Utility functions
function sleep(ms) {    // source: https://coreui.io/blog/how-to-sleep-in-javascript/
    return new Promise(
        doesnt_matter => {
            return setTimeout(doesnt_matter, ms)
        }
    );
}  

// Static Declarations
const cardBack = ["&#x1F0A0;", "rebeccapurple"];
const cardDeck = [ // [ [ html-unicode, card-color ], value ]
    [["&#x1F0A1;", "black"], 0],   // Ace of Spades
    [["&#x1F0A2;", "black"], 2],   // 2 of Spades
    [["&#x1F0A3;", "black"], 3],   // 3 of Spades
    [["&#x1F0A4;", "black"], 4],   // 4 of Spades
    [["&#x1F0A5;", "black"], 5],   // 5 of Spades
    [["&#x1F0A6;", "black"], 6],   // 6 of Spades
    [["&#x1F0A7;", "black"], 7],   // 7 of Spades
    [["&#x1F0A8;", "black"], 8],   // 8 of Spades
    [["&#x1F0A9;", "black"], 9],   // 9 of Spades
    [["&#x1F0AA;", "black"], 10],  // 10 of Spades
    [["&#x1F0AB;", "black"], 10],  // J of Spades
    [["&#x1F0AD;", "black"], 10],  // Q of Spades
    [["&#x1F0AE;", "black"], 10],  // K of Spades

    [["&#x1F0B1;", "red"], 0],   // Ace of Hearts
    [["&#x1F0B2;", "red"], 2],   // 2 of Hearts
    [["&#x1F0B3;", "red"], 3],   // 3 of Hearts
    [["&#x1F0B4;", "red"], 4],   // 4 of Hearts
    [["&#x1F0B5;", "red"], 5],   // 5 of Hearts
    [["&#x1F0B6;", "red"], 6],   // 6 of Hearts
    [["&#x1F0B7;", "red"], 7],   // 7 of Hearts
    [["&#x1F0B8;", "red"], 8],   // 8 of Hearts
    [["&#x1F0B9;", "red"], 9],   // 9 of Hearts
    [["&#x1F0BA;", "red"], 10],  // 10 of Hearts
    [["&#x1F0BB;", "red"], 10],  // J of Hearts
    [["&#x1F0BD;", "red"], 10],  // Q of Hearts
    [["&#x1F0BE;", "red"], 10],  // K of Hearts

    [["&#x1F0C1;", "red"], 0],   // Ace of Diamonds
    [["&#x1F0C2;", "red"], 2],   // 2 of Diamonds
    [["&#x1F0C3;", "red"], 3],   // 3 of Diamonds
    [["&#x1F0C4;", "red"], 4],   // 4 of Diamonds
    [["&#x1F0C5;", "red"], 5],   // 5 of Diamonds
    [["&#x1F0C6;", "red"], 6],   // 6 of Diamonds
    [["&#x1F0C7;", "red"], 7],   // 7 of Diamonds
    [["&#x1F0C8;", "red"], 8],   // 8 of Diamonds
    [["&#x1F0C9;", "red"], 9],   // 9 of Diamonds
    [["&#x1F0CA;", "red"], 10],  // 10 of Diamonds
    [["&#x1F0CB;", "red"], 10],  // J of Diamonds
    [["&#x1F0CD;", "red"], 10],  // Q of Diamonds
    [["&#x1F0CE;", "red"], 10],  // K of Diamonds

    [["&#x1F0D1;", "black"], 0],   // Ace of Clubs
    [["&#x1F0D2;", "black"], 2],   // 2 of Clubs
    [["&#x1F0D3;", "black"], 3],   // 3 of Clubs
    [["&#x1F0D4;", "black"], 4],   // 4 of Clubs
    [["&#x1F0D5;", "black"], 5],   // 5 of Clubs
    [["&#x1F0D6;", "black"], 6],   // 6 of Clubs
    [["&#x1F0D7;", "black"], 7],   // 7 of Clubs
    [["&#x1F0D8;", "black"], 8],   // 8 of Clubs
    [["&#x1F0D9;", "black"], 9],   // 9 of Clubs
    [["&#x1F0DA;", "black"], 10],  // 10 of Clubs
    [["&#x1F0DB;", "black"], 10],  // J of Clubs
    [["&#x1F0DD;", "black"], 10],  // Q of Clubs
    [["&#x1F0DE;", "black"], 10],  // K of Clubs
]

function styleCards(cardSymbolArray){
    // Wraps card html-code in a span element
    // add css class, and card color
    // returns entire "hand" as string of HTML
    let htmlString = "";
    let cardSymbol;
    let element = document.createElement("span");
    element.className = "playingCard";
    
    for (cardSymbol of cardSymbolArray){
        element.innerHTML = cardSymbol[0];
        element.style.color = cardSymbol[1];

        htmlString = htmlString + " " + element.outerHTML;
    }

    return htmlString;
}

function shuffle(cardsArray) {
    // Take an array of cards and randomly select elements to add to new array.
    // ! Caution - destroys original array.
    // Returns same size array of cards.
    let deckSize = cardsArray.length -1;     // Offset for zero-indexing
    let shuffledDeck = new Array();
    let randomPick;
    
    for (let i = deckSize; i > -1; i--) {
        randomPick = Math.floor(Math.random() * i);  // select random integer between 0 and current deck size

        shuffledDeck.push( cardsArray.splice(randomPick, 1)[0] );
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
        this.hand = [];                 // Maximum two possibilities (because of Aces)
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
        this.cardDisplay.innerHTML = styleCards(this.cards);

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
        // Pass in first card and cardBack. Must always pass an array.
        this.cardDisplay.innerHTML = styleCards( [this.cards[0], cardBack] );

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

const bank = {      // Singleton declaration.
    playerWallet: 500,
    stakedBet: 0,
    walletDisplay: document.getElementById("playerCash"),
    potDisplay: document.getElementById("stakedCash"),
    addButton:  document.getElementById("addCashButton"),
    subButton:  document.getElementById("subCashButton"),
    addBet: function() {
        // Do bet sizes in increments of 10 for simplicity, to avoid floats.
        if (this.playerWallet >= 10){
            this.playerWallet = this.playerWallet -10;
            this.stakedBet = this.stakedBet +10;
            this.updateDisplay();
        }
    },
    subBet: function() {
        if (this.stakedBet >= 10){
            this.stakedBet = this.stakedBet -10;
            this.playerWallet = this.playerWallet +10;
            this.updateDisplay();
        }
    },
    payout: function(multiplier) {
        this.playerWallet = this.playerWallet + (this.stakedBet * multiplier);
        this.stakedBet = 0;
        this.updateDisplay();
    },
    updateDisplay: function() {
        this.walletDisplay.innerHTML = this.playerWallet;
        this.potDisplay.innerHTML = this.stakedBet;
    },
    disableBetting: function() {
        this.addButton.disabled = true;
        this.subButton.disabled = true;
    },
    enableBetting: function() {
        this.addButton.disabled = false;
        this.subButton.disabled = false;
    },
}

// Variable Declarations
const player = new Gambler(document.getElementById("playerCards"), document.getElementById("playerSum"));
const dealer = new Gambler(document.getElementById("dealerCards"), document.getElementById("dealerSum"));

const gameStatus = document.getElementById("gameStatus");
const gameMessage = document.getElementById("gameMessage");
const startButton = document.getElementById("startButton");
const drawButton = document.getElementById("drawButton");
const standButton = document.getElementById("standButton");
drawButton.disabled = true;
standButton.disabled = true;
bank.updateDisplay();

let playDeck;   // reusable, modifiable deck. (We never modify the "cardDeck" definition.)


// Game Play
async function startGame() {
    // (re)Set game variables
    gameStatus.innerHTML = "Let's Go!";
    gameMessage.innerHTML = "";
    startButton.disabled = true;
    bank.disableBetting();

    player.reset_round();
    dealer.reset_round();
    
    // Create a fresh play deck by shuffling a copy of the card deck 3 times.
    playDeck = shuffle(shuffle(shuffle( cardDeck.slice() )));

    // Player Draws first
    let card = getCard();
    player.drawCard(card[0], card[1]);
    player.displayStats();
    await sleep(800);

    gameStatus.innerHTML = "Dealing..";
    
    card = getCard();
    dealer.drawCard(card[0], card[1]);
    dealer.displayStats();
    await sleep(800);
    
    card = getCard();
    player.drawCard(card[0], card[1]);
    player.displayStats();
    await sleep(800);

    card = getCard();
    dealer.drawCard(card[0], card[1]);
    dealer.displayFirstCardOnly();

    gameStatus.innerHTML = "Your Move..";

    // Allow player to make a decision
    drawButton.disabled = false;
    standButton.disabled = false;
    checkGameState();
}

function endGame() {
    gameMessage.innerHTML = "Play another round?";
    startButton.disabled = false;
    drawButton.disabled = true;
    standButton.disabled = true;
    bank.enableBetting();
}

function drawCard() {
    // Player's turn
    let card = getCard();

    player.drawCard(card[0], card[1]);
    player.displayStats();
    checkGameState();
}

async function standTurn() {
    // Dealer's turn
    drawButton.disabled = true;
    standButton.disabled = true;

    // Show dealer's hand
    await sleep(500);
    dealer.displayStats();

    // Dealer must never draw on 17 or above
    while (dealer.highCount < 17) {
        let card = getCard();
        dealer.drawCard(card[0], card[1]);
        await sleep(1000);
        dealer.displayStats();
        checkGameState();
    }

    endGame();
    if (dealer.isAlive && !dealer.hasBlackJack) {
        tallyHands();
    }
}

function checkGameState() {
    if (player.hasBlackJack && dealer.hasBlackJack){
        // DRAW
        dealer.displayStats();      // Dealer must always show cards on Blackjack
        gameStatus.innerHTML = "BlackJack Draw!";
        bank.payout(1);
        endGame();
    }
    else if (player.hasBlackJack){
        // MEGA WINNER
        dealer.displayStats();      // Dealer may show cards on player Blackjack
        gameStatus.innerHTML = "Mega Winner! You got BlackJack!";
        bank.payout(2.5);
        endGame();
    }
    else if (dealer.hasBlackJack){
        // LOSER
        dealer.displayStats();      // Dealer must always show cards on Blackjack
        gameStatus.innerHTML = "Oops, dealer has BlackJack! You Lose.";
        bank.payout(0);
        endGame();
    }
    else if (!player.isAlive){
        // LOSER
        dealer.displayStats();      // Dealer may show cards on player bust
        gameStatus.innerHTML = "You Busted! Better luck next time.";
        bank.payout(0);
        endGame();
    }
    else if (!dealer.isAlive){
        // WINNER
        gameStatus.innerHTML = "Dealer Busted! You Win!";
        bank.payout(2);
        endGame();
    }
}

function tallyHands() {
    if (player.highCount === dealer.highCount){
        // DRAW
        gameStatus.innerHTML = "It's a Draw!";
        bank.payout(1);
    }
    else if (player.highCount > dealer.highCount) {
        // WINNER
        gameStatus.innerHTML = "You win!";
        bank.payout(2);
    }
    else {
        // LOSER
        gameStatus.innerHTML = "You lose..";
        bank.payout(0);
    }
}