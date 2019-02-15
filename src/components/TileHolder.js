import React, { Component } from 'react';
import DragTarget from './DragTarget';

class TileHolder extends Component {
  render() {
    return (
      <div className='tileHolder' id={this.props.holderName}>
        <div>
        {this.props.tiles}
        </div>
        <DragTarget action={this.props.destroyTile}/>
      </div>
    );
  }
}

export default TileHolder;
