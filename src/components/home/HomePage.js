import React, {PropTypes} from 'react';
import Popup from '../card/Popup';
import Card from '../card/Card';
/** Images **/
import audi from '../../images/Audi.png';// eslint-disable-line
import bmw from '../../images/BMW.png';// eslint-disable-line
import ferrari from '../../images/Ferrari.png';// eslint-disable-line
import jaguar from '../../images/Jaguar.png';// eslint-disable-line
import lamborghini from '../../images/Lamborghini.png';// eslint-disable-line
import mercedes from '../../images/Mercedes-Benz.png';// eslint-disable-line
import porsche from '../../images/Porsche.png';// eslint-disable-line
import volkswagen from '../../images/Volkswagen.png';// eslint-disable-line
/** Font Awesome **/
import {library} from '@fortawesome/fontawesome-svg-core';
import {faStar, faReply, faSync} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

library.add(faStar, faReply, faSync);

/**
 * Start page
 */
class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      /** Count the user moves **/
      counter: 0,
      /** List of images used in app **/
      cards: [],
      /** List of maximum 2 opened card **/
      openedCards: [],
      /** Identifier for opening/hiding popup. It hold value of css class for showing popup. **/
      showPopup: '',
      /** Time counter **/
      timer: {
        totalSeconds: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      /** Timer interval **/
      timerInterval: null,
      /** Defined number of stars showed as rating **/
      stars: 5,
      /** List of imported cards (images) displayed on deck **/
      importCards: null
    };

    this.displayCard = this.displayCard.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.playAgain = this.playAgain.bind(this);
  }

  componentDidMount() {
    this.importCards();
    this.startCounter();
  }

  componentWillUnmount() {
    clearInterval(this.state.timerInterval);
  }

  /**
   * Randomly shuffle an array
   * https://stackoverflow.com/a/2450976/1293256
   * @param  {Array} array The array to shuffle
   * @return {Array}      The first item in the shuffled array
   */
  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   * Update state of counter and stars for rating
   * @return {undefined}
   */
  updateCounter() {
    let currentCount = this.state.counter;

    this.setState({counter: ++currentCount});

    switch (currentCount) {
      case 9:
        this.setState({stars: 4});
        break;
      case 15:
        this.setState({stars: 3});
        break;
      case 20:
        this.setState({stars: 2});
        break;
      case 25:
        this.setState({stars: 1});
        break;
      case 30:
        this.setState({stars: 0});
        break;
    }
  }

  /**
   * Display card when user clicked
   * @param {MouseEvent} event
   * @return {undefined}
   */
  displayCard(event) {
    let index = event.target.getAttribute('data-index');

    // Show card in deck
    let cards = this.state.cards;
    cards[index] = Object.assign({}, {imageSrc: event.target.type, className: this.resolveClassName('show')});
    this.setState({cards});

    // Set card to be open
    let openedCards = this.state.openedCards;
    openedCards.push(cards[index]);
    this.setState({openedCards});

    if (openedCards.length === 2) {

      this.updateCounter();

      if (openedCards[0].imageSrc === openedCards[1].imageSrc) {
        // Matched
        openedCards.map(function (item) {
          item.className = this.resolveClassName('matched');
        }.bind(this));

        this.setState({cards, openedCards: []});

        this.gameover();
      } else {
        // Unmatched
        openedCards.map(function (item) {
          item.className = this.resolveClassName('unmatched');
        }.bind(this));

        this.disableCards();

        setTimeout(function () {
          openedCards.map(function (item) {
            item.className = this.resolveClassName();
          }.bind(this));
          this.enableCards();
          this.setState({cards, openedCards: []});
          this.gameover();
        }.bind(this), 1000);
      }
    }
  }

  /**
   * Resolve class name for card
   * @param {String} type
   * @return {String}
   */
  resolveClassName(type) {
    let types = {
      matched: 'card match disabled',
      unmatched: 'card show open unmatched',
      show: 'card open show disabled',
      card: 'card'
    };

    type || (type = 'card');

    return types[type];
  }

  /**
   * Disables all cards.
   * Used to prevent user clicking on card when 2 cards are opened.
   * @return {undefined}
   */
  disableCards() {
    let cards = this.state.cards;
    cards.map(function (card) {
      if (card.className.indexOf('disabled') === -1) {
        card.className += ' disabled';
      }
    });
    this.setState({cards});
  }

  /**
   * Enables all cards on deck.
   * @return {undefined}
   */
  enableCards() {
    let cards = this.state.cards;

    cards.map(function (card) {
      if (card.className.indexOf('match') === -1) {
        card.className = card.className.replace(' disabled', '');
      }
    });

    this.setState({cards});
  }

  /**
   * Reset game
   * @return {undefined}
   */
  resetGame() {
    let timer = {
      totalSeconds: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
    this.setState({cards: [], counter: 0, stars: 5, timer});
    this.importCards();
    this.stopCounter();
    this.startCounter();
  }

  /**
   * Imports cards when starting game
   * @return {undefined}
   */
  importCards() {
    let importCards = [audi, bmw, ferrari, jaguar, lamborghini, mercedes, porsche, volkswagen].reduce(
      function (res, current) {
        return res.concat([current, current]);
      },
      []
    );
    this.shuffle(importCards).forEach(function (imageSrc) {
      this.setState(prevState => ({
        cards: [...prevState.cards, {imageSrc: imageSrc, className: 'card'}]
      }));
    }.bind(this));

    this.setState({importCards});
  }

  /**
   * Check if the game is over
   * @return {undefined}
   */
  gameover() {
    let count = 0;
    this.state.cards.forEach(function (card) {
      if (this.hasClass('match', card.className)) {
        count++;
      }
    }.bind(this));

    if (count === this.state.importCards.length) {
      this.stopCounter();
      this.showPopup();
    }
  }

  /**
   * Check if item class name has class
   * @param {String} className
   * @param {String} itemClassName
   * @return {boolean}
   */
  hasClass(className, itemClassName) {
    return (itemClassName.indexOf(className) > -1);
  }

  /**
   * Displays a popup
   * @return {undefined}
   */
  showPopup() {
    this.setState({showPopup: 'show'});
  }

  /**
   * Close popup
   * @return {undefined}
   */
  closePopup() {
    this.setState({showPopup: ''});
  }

  /**
   * Reset game features and starts game again
   * @return {undefined}
   */
  playAgain() {
    this.setState({showPopup: ''});
    this.resetGame();
  }

  /**
   * Fill string with 0 value on left side
   * @param {String} value
   * @return {string}
   */
  pad(value) {
    let valueString = value + "";
    return (valueString.length < 2) ? "0" + valueString : valueString;
  }

  /**
   * Starts counter for moves
   * @return {undefined}
   */
  startCounter() {
    let timerInterval = setInterval(function () {
      let timer = Object.assign({}, this.state.timer);
      timer.totalSeconds++;
      timer.hours = parseInt(timer.totalSeconds / 3600) % 24;
      timer.minutes = parseInt(timer.totalSeconds / 60) % 60;
      timer.seconds = timer.totalSeconds % 60;
      this.setState({timer});
    }.bind(this), 1000);

    this.setState({timerInterval});
  }

  /**
   * Stops counter
   * @return {undefined}
   */
  stopCounter() {
    clearInterval(this.state.timerInterval);
  }

  /**
   * Displays time on deck
   * @return {string}
   */
  showTime() {
    let timeArr = [
      this.pad(this.state.timer.hours),
      this.pad(this.state.timer.minutes),
      this.pad(this.state.timer.seconds)
    ];
    return timeArr.join(':');
  }

  render() {
    return (
      <div>
        <section className="score-panel text-center">
          <ul className="stars pull-left">
            {[...Array(this.state.stars)].map((e, i) => <FontAwesomeIcon icon="star" key={i}/>)}
          </ul>

          <span className="moves">{this.state.counter}</span> Move(s)

          <div className="timer">{this.showTime()}</div>

          <div className="restart">
            <FontAwesomeIcon icon="sync" onClick={this.resetGame.bind(this)}/>
          </div>
        </section>

        <ul className="deck">
          {this
            .state
            .cards
            .map((card, index) => {
              return (
                <Card
                  index={index}
                  className={card.className}
                  imageSrc={card.imageSrc}
                  displayCard={this.displayCard}
                  key={index}/>
              );
            })
          }
        </ul>
        <Popup
          show={this.state.showPopup}
          close={this.closePopup}
          playAgain={this.playAgain}
          moves={this.state.counter}
          stars={this.state.stars}
          time={this.showTime()}
        />
      </div>
    );
  }
}


export default HomePage;
