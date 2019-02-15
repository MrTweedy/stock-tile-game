import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import ReactLoading from 'react-loading';

class Tile extends Component {

  componentDidMount(){
    $(`.tileKey-${this.props.tileKey}`).draggable({
      stack: `${this.props.holderName} div`,
      containment: this.props.holderName,
    });
    if(this.props.startDisabled){
      this.toggleDrag('off');
    }
  }

  toggleDrag = (onOff = null) => {
    if(!onOff){
      if( $(`.tileKey-${this.props.tileKey}`).draggable('option', 'disabled') ){
        $(`.tileKey-${this.props.tileKey}`).draggable('enable');
      } else {
        $(`.tileKey-${this.props.tileKey}`).draggable('disable');
      }
    } else if(onOff === 'on') {
      $(`.tileKey-${this.props.tileKey}`).draggable('enable');
    } else if(onOff === 'off') {
      $(`.tileKey-${this.props.tileKey}`).draggable('disable');
    }
  }

  render(){

    let innerContent = (() => {
      switch (this.props.loadingState) {
        case 'loading':
          return (
            <div>
              <div style={{textAlign:'center',width:'50%',margin:'auto'}}>
                <ReactLoading type='bars' color='#999' />
              </div>
              <p style={{textAlign:'center'}}>Loading stock data</p>
            </div>
          );
          break;
        case 'error':
          return (
            <div>
              <p style={{textAlign:'center'}}>Error loading data</p>
            </div>
          );
          break;
        case 'ready':
          return this.props.content;
          break;
        default:
          return this.props.content;
      }
    })()

    return (
      <div className={`tile grabbable tileKey-${this.props.tileKey}`}>
        <div className='tileOuter whiteGlossGradient'>
          <div className='tileInner'>
            {innerContent}
          </div>
        </div>
      </div>
    );
  }
}

Tile.defaultProps = {
  startDisabled: false,
}

export default Tile;
