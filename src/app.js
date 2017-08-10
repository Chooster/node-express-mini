const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

const wordList = readWords();
const finalWord = wordList[Math.floor(Math.random() * wordList.length)];

const guesses = {};

server.post('/guess', (req, res) => {
  const guess = req.body.guess;
  if ((!guess) || (guess.length !== 1)) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a guess of a single letter.' });
    return;
  }
  if (guesses[guess]) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: `\'${guess}\' has already been guessed!` });
    return;
  }
  guesses[guess] = true;
  res.json({ guess });
});

server.get('/', (req, res) => {
  const wordSoFarArray = Array.from(finalWord).map((letter) => {
    if (guesses[letter]) {
      return letter;
    }
    return '-';
  });
  const wordSoFar = wordSoFarArray.join('');
  res.json({ wordSoFar, guesses });
});

// TODO: your code to handle requests

server.listen(3000);
