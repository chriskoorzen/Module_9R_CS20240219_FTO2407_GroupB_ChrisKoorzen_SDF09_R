"use strict";       // ECMAScript v5 compliant.

// Static Declarations

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

// Variable Declarations
let playDeck;
let handOfCards = new Array();
let sum = 0;
let hasBlackJack = false;
let isAlive = true;
let hasAces = 0;

let cardDisplay = document.getElementById("cardDisplay");
let gameMessage = document.getElementById("gameMessage");
let sumDisplay = document.getElementById("sumDisplay");


// Function Declarations

function shuffle (cards) {
    // Take an array (of implied size 52) and randomly select elements to add to new array.
    let shuffledDeck = new Array();
    let randomPick;
    
    for (let i = 51; i > -1; i--) {
        randomPick = Math.floor(Math.random() * i);

        shuffledDeck.push( cards.splice(randomPick, 1)[0] );
    }

    return shuffledDeck;
}

function displayAce (number) {
    let threshold = number + 11;

    if (threshold > 21) {
        return (number + 1).toString();
    } else {
        return (number + 1).toString() + " or " + (number + 11).toString();
    }
}

function aceCombos (current, aces) { // Just output all the possibilities
    let combos = []
    
    if (aces === 0){ 
        combos.push(current); 
    } else {    // Only one ace can ever count as 11, the rest must be 1
        combos.push(current + aces);
        combos.push(current + 11 + ( aces -1 ));
    }

    return combos;
}

function statusCheck (handTotal) {
    
    if (handTotal < 21) {
        gameMessage.innerHTML = "Do you want to draw a new card?";

    } else if (handTotal === 21) {
        gameMessage.innerHTML = "Wohoo! You've got Blackjack!";
        hasBlackJack = true;

    } else {
        gameMessage.innerHTML = "You're out of the game!";
        isAlive = false;

    }

}

// Game Play Logic

function drawCard () {
    let card, result;

    // Take from top of play deck
    card  = playDeck.shift();

    // Add card symbol to hand
    handOfCards.push(card[0]);
    
    // Display Cards
    cardDisplay.innerHTML = handOfCards.toString().replaceAll(",", " ");
    
    
    // Check if Ace is drawn
    if (card[1] === 0) {
        console.log("Found Ace");
        hasAces = hasAces + 1;
    }

    // Add card value
    sum = sum + card[1];
    // Account for Aces
    result = aceCombos (sum, hasAces);

    // We know the Array is only ever at largest size 2
    // and the largest number is second
    if (result.length === 1) {
        statusCheck(result[0]);
        sumDisplay.textContent = result[0];

    } else {
        if (result[1] > 21) { 
            statusCheck(result[0]);
            sumDisplay.textContent = result[0]; 

        } else { 
            statusCheck(result[1]);
            sumDisplay.textContent = result[0] + " or " + result[1]; 
        }
    }

}

function startGame () {
    // (re)Set game variables
    handOfCards = new Array();
    sum = 0;
    hasBlackJack = false;
    isAlive = true;
    hasAces = 0;
    cardDisplay.innerHTML = "-";
    gameMessage.innerHTML = "Let's Go!";
    sumDisplay.innerHTML = "-";
    
    // Create a play deck by shuffling a copy of the card deck 3 times.
    playDeck = shuffle(shuffle(shuffle( cardDeck.slice() )));

    // Draw and display top 2 cards
    // drawCard ();
    // drawCard ();
}




