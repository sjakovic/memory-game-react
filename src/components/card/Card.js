import React, {PropTypes} from 'react';

class Card extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <li data-index={this.props.index} className={this.props.className} type={this.props.imageSrc} onClick={this.props.displayCard}>
        <img src={this.props.imageSrc}/>
      </li>
    );
  }
}

Card.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  displayCard: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default Card;
