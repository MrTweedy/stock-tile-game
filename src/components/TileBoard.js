import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/droppable';
import Funcs from '../functions';

class TileBoard extends Component {
  constructor(props){
    super(props);
    const numberOfHotspots = 5;
    let dropSpots = [];
    for(let i = 0; i < numberOfHotspots; i++){
      const adHocId = Funcs.makeAdHocId();
      dropSpots.push(
        <div id={`dropSpot-${adHocId}`} className='dropSpot square fifth-width boardSpace' key={adHocId}>
        </div>
      );
    }
    this.state = { dropSpots }
  }

  componentDidMount(){
    this.state.dropSpots.forEach((dropBox) => {
      $(`#${dropBox.props.id}`).droppable({
        drop: (e, u) => this.props.onboardTile(
          $(u.draggable).attr('class').split(' ').reduce((acc, val) => {
            return val.indexOf('tileKey-') === 0 ? val.slice(8) : acc;
          }),
          `#${e.target.id}`,
        )
      });
    });
  }

  render() {
    return (
      <div className='tileBoard' id={this.state.adHocId}>
        {this.state.dropSpots}
      </div>
    );
  }
}

export default TileBoard;
