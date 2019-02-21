import React, {Component} from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/droppable';
import Funcs from '../functions';

class TileDestroyer extends Component {
  constructor(props){
    super(props);
    this.state = {
      adHocId: Funcs.makeAdHocId(),
    }
  }

  componentDidMount(){
    $(`#${this.state.adHocId}`).droppable({
      drop: (e, u) => this.props.destroyTile(
        $(u.draggable).attr('class').split(' ').reduce((acc, val) => {
          return val.indexOf('tileKey-') === 0 ? val.slice(8) : acc;
        })
      ),
    });
  }

  render(){
    return (
      <div className='tileDestroyer dropSpot square fourth-width scale-text' id={this.state.adHocId}>
        <div>
          <p>Drop tiles here to delete them.</p>
        </div>
      </div>
    );
  }
}

export default TileDestroyer;
