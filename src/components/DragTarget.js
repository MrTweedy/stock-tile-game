import React, {Component} from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/droppable';

class DragTarget extends Component {
  constructor(props){
    super(props);
    this.state = {
      randomId: `id-${Math.round(Math.random() * 10000)}`,
    }
  }

  componentDidMount(){
    $(`#${this.state.randomId}`).droppable({
      drop: (e) => this.props.action($(e.originalEvent.target).attr('class').split(' ').reduce((acc, val) => {
            return val.indexOf('tileKey-') === 0 ? val.slice(8) : acc;
        })
      ),
    });
  }
  render(){
    return (
      <div className='destroyTileTarget' id={this.state.randomId}>
        <p>Drop tile here to destroy.</p>
      </div>
    );
  }
}

export default DragTarget;
