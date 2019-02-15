import React, { Component } from 'react';
import Tile from './Tile';
import TileHolder from './TileHolder';
import BasicButton from './BasicButton';
import TileAdder from './TileAdder';

class TileGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: []
    }
  }

  addTile = () => {
    let newState = this.state;
    newState.tiles.push(
      <Tile content={`Tile ${newState.tiles.length + 1}`}
      tileKey={newState.tiles.length + 1}
      holderName={`#${this.props.holderName}`}
      />);
    this.setState(newState);
  }

  destroyTile = (tileKey) => {
    let newState = this.state;
    newState.tiles[tileKey - 1] = null;
    console.log(newState.tiles);
    this.setState(newState);
  }

  render(){
    return (
      <div id='tileGame'>
        <h2 className='tileGameTitle'>
          {this.props.gameTitle}
        </h2>
        <TileHolder tiles={this.state.tiles} holderName={this.props.holderName} destroyTile={this.destroyTile} />
        <BasicButton label='Add Tile' CSSclass='tileGameButton' onClick={this.addTile} />
        <TileAdder />
      </div>
    );
  }
}

TileGame.defaultProps = {
  holderName: 'Jason',
  gameTitle: 'Testing Title',
}

export default TileGame;
