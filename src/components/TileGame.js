import '../Style.css';
import React, { Component } from 'react';
import TileBoard from './TileBoard';
import TileAdder from './TileAdder';
import TileDestroyer from './TileDestroyer';
import 'jquery-ui/ui/widgets/droppable';
import $ from 'jquery';
import Plot from 'react-plotly.js';

class TileGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      tileCount: 0,
      prepTile: true,
    }
  }

  componentDidMount() {
    $(window).resize(() => {
      this.state.tiles.forEach((e, i) => {
        if(e !== null){
          this.updateTile(i, {});
        }
      });
    });
  }

  addTile = (tile) => {
    let newState = this.state;
    newState.tiles.push(tile);
    newState.prepTile = false;
    this.setState(newState);
  }

  updateTile = (tileKey, props) => {
    const tileIndex = typeof tileKey === 'number' ? tileKey : this.lookupTile(tileKey).tileIndex;
    if(tileIndex !== null){
      let newState = this.state;
      newState.tiles[tileIndex] = React.cloneElement(newState.tiles[tileIndex], props);
      this.setState(newState);
    }
  }

  destroyTile = (tileKey) => {
    const {tileIndex, totalTiles} = this.lookupTile(tileKey);
    if(tileIndex !== null){
      let newState = this.state;
      newState.tiles[tileIndex] = null;
      if(totalTiles < 6){
        newState['prepTile'] = true;
      }
      this.setState(newState);
    }
  }

  onBoardTile = (tileKey, cssParentId = null) => {
    const {tileIndex, totalTiles} = this.lookupTile(tileKey);
    console.log(totalTiles);
    if(tileIndex !== null){
      let newTileProps = {};
      if(this.state.tiles[tileIndex].props.onboarded === false){
        if(totalTiles < 5){
          this.setState({ prepTile: true });
        }
        newTileProps['onboarded'] = true;
      }
      if(cssParentId !== null){
        newTileProps['cssParentId'] = cssParentId;
      }
      this.updateTile(tileKey, newTileProps);
    }
  }

  lookupTile = (tileKey) => {
    let returnObject = {
      tileIndex: null,
      totalTiles: 0
    }
    for(let i = 0; i < this.state.tiles.length; i++){
      if(this.state.tiles[i] !== null){
        returnObject.totalTiles++;
        if(this.state.tiles[i].props.tileKey === tileKey){
          returnObject.tileIndex = i;
        }
      }
    }
    return returnObject;
  }

  randomColor = () => {
    const hexDigits = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']
    let returnString = '#';
    for(let i = 0; i < 6; i++){
      returnString += hexDigits[Math.floor(Math.random() * hexDigits.length)];
    }
    return returnString;
  }

  render(){
    let stockData = [];
    this.state.tiles.forEach((tile) => {
      if(tile !== null && tile.props.onboarded){
        let dataObject = {
          x: [],
          y: [],
          type: 'scatter',
          mode: 'lines+points',
          marker: {color: this.randomColor()},
        };
        tile.props.chartData.forEach((sample) => {
          dataObject.x.push(dataObject.x.length + 1);
          dataObject.y.push(sample.high);
        });
        stockData.push(dataObject);
      }
    });
    return (
      <div id='tileGame'>
        <div className='tileHolder'>
          {this.state.tiles}
        </div>
        <h2 className='tileGameTitle'>
          {this.props.title}
        </h2>
        <TileAdder addTile={this.addTile} updateTile={this.updateTile} prepTile={this.state.prepTile} />
        <TileDestroyer destroyTile={this.destroyTile} style={{zIndex:0}} />
        <TileBoard onboardTile={this.onBoardTile} />
          {stockData.length > 0 ?
            <Plot
            className='stockGraph'
            data={stockData}
            layout={{
              autosize:true,
              margin:{
                l:20,
                r:0,
                t:0,
                b:20,
              }
            }}
            config={{
              displayModeBar: false,
              responsive: true,
            }}
          /> : ''}
      </div>
    );
  }
}

TileGame.defaultProps = {
  title: 'No Title Assigned',
}

export default TileGame;
