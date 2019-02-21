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
      adderMessage: null,
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
    const {tileIndex, totalTiles, hasNew} = this.lookupTile(tileKey);
    if(tileIndex !== null){
      let newState = this.state;
      newState.tiles.splice(tileIndex, 1, null);
      if(totalTiles < 6 && hasNew === false){
        newState['prepTile'] = true;
        newState['adderMessage'] = null;
      }
      this.setState(newState);
    }
  }

  onBoardTile = (tileKey, cssParentId = null) => {
    const {tileIndex, totalTiles} = this.lookupTile(tileKey);
    if(tileIndex !== null){
      let newTileProps = { isNew: false };
      if(this.state.tiles[tileIndex].props.onboarded === false){
        if(totalTiles < 5){
          this.setState({
            prepTile: true,
            adderMessage: null,
          });
        } else {
          this.setState({
            prepTile: 'reset',
            adderMessage: '5 tile max reached',
          });
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
      totalTiles: 0,
      hasNew: false,
    }
    for(let i = 0; i < this.state.tiles.length; i++){
      if(this.state.tiles[i] !== null){
        returnObject.totalTiles++;
        if(this.state.tiles[i].props.isNew === true){
          returnObject.hasNew = true;
        }
        if(this.state.tiles[i].props.tileKey === tileKey){
          returnObject.tileIndex = i;
        }
      }
    }
    return returnObject;
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
          name: tile.props.stockSymbol,
          marker: {color: tile.props.tileColor},
        };
        tile.props.chartData.forEach((sample) => {
          dataObject.x.push(sample.date);
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
        <div id='titleHolder'>
          <h1 className='tileGameTitle'>{this.props.title}</h1>
          <h3 className='tileGameSubTitle'>{this.props.subTitle}</h3>
        </div>
        <div id='tileController' style={{width:'100%', position:'relative'}}>
          <TileDestroyer destroyTile={this.destroyTile} style={{zIndex:0}} />
          <TileAdder addTile={this.addTile} updateTile={this.updateTile} prepTile={this.state.prepTile} adderMessage={this.state.adderMessage} />
        </div>
        <TileBoard onboardTile={this.onBoardTile} />
          {stockData.length > 0 ?
            <Plot
            className='stockGraph'
            data={stockData}
            layout={{
              autosize:true,
              showlegend:true,
              margin:{
                l:30,
                r:10,
                t:10,
                b:30,
              },
              xaxis:{
                title:{
                  text:'Date',
                }
              },
              yaxis:{
                title:{
                  text:'Price',
                }
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
  subTitle: '',
}

export default TileGame;
