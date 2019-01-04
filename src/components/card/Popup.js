import React, {PropTypes} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Popup extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    if(!this.props.show) {
      return null;
    }
    return (
      <div className={"modal " + this.props.show}>
        <div className="modal-content">
          <span className="close" onClick={this.props.close}>&times;</span>
          <h1>Congratulations!!!</h1>
          <p>You made {this.props.moves} moves in {this.props.time}</p>
          <p>Rating:  {[...Array(this.props.stars)].map((e, i) => <FontAwesomeIcon icon="star" key={i}/>)}</p>
          <p className="text-center">
            <button className="btn btn-success btn-lg" onClick={this.props.playAgain}>Play again</button>
          </p>
        </div>
      </div>
    );
  }
}

Popup.propTypes = {
  show: PropTypes.string,
  counter: PropTypes.number,
  close: PropTypes.func.isRequired,
  playAgain: PropTypes.func.isRequired,
  stars: PropTypes.number,
  time: PropTypes.string,
  moves: PropTypes.number
};

export default Popup;
