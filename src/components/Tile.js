import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/position';
import ReactLoading from 'react-loading';

class Tile extends Component {

  componentDidMount(){
    $(`.tileKey-${this.props.tileKey}`).draggable({
      stack: 'body div',
      revert:'invalid',
    });
    this.props.dragDisabled ? this.toggleDrag('off') : this.toggleDrag('on');
    if(this.props.cssParentId !== null) this.snapSelf(this.props.cssParentId);
  }

  componentDidUpdate(){
    if(this.props.cssParentId !== null){
      this.snapSelf(this.props.cssParentId);
    }
  }

  componentWillUnmount(){
    $(`.tileKey-${this.props.tileKey}`).draggable('destroy');
  }

  snapSelf = (cssParentId) => {
    setTimeout(() =>
      $(`.tileKey-${this.props.tileKey}`).position({
        of: cssParentId
      }),
    10)
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
    this.props.dragDisabled ? this.toggleDrag('off') : this.toggleDrag('on');
    let innerContent = (() => {
      let returnContent;
      switch (this.props.loadingState) {
        case 'loading':
          returnContent = (
            <div>
              <div className='tileLoadingContainer'>
                <ReactLoading type='bars' color='#999' />
              </div>
              <p style={{textAlign:'center'}}>Loading stock data</p>
            </div>
          );
          break;
        case 'error':
          returnContent = (
            <div>
              <p style={{textAlign:'center'}}>Error loading data</p>
            </div>
          );
          break;
        case 'ready':
          returnContent = this.props.content;
          break;
        default:
          returnContent = this.props.content;
      }
      return returnContent;
    })();

    return (
      <div className={`tile square grabbable fifth-width scale-text tileKey-${this.props.tileKey}`}>
        <div className='tileOuter whiteGlossGradient' style={{boxShadow:`inset 0px 0px 10px ${this.props.tileColor}`}}>
          <div className='tileInner'>
            {innerContent}
          </div>
        </div>
      </div>
    );
  }
}

Tile.defaultProps = {
  dragDisabled: false,
  onboarded: false,
  cssParentId: null,
  tileColor:'#fff'
}

export default Tile;
