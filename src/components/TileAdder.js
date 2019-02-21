import React, {Component} from 'react';
import Funcs from '../functions';
import Tile from './Tile';

class TileAdder extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentTimer: null,
      currentTileKey: null,
      stockVal: '',
      adHocId: `adder-id${Funcs.makeAdHocId()}`,
    }
  }

  componentDidMount(){
    this.prepTile();
  }

  componentDidUpdate(){
    if(this.props.prepTile){
      this.prepTile();
    }
  }

  prepTile = () => {
    const tileKey = Funcs.makeAdHocId();
    this.props.addTile( <Tile content='Type a stock symbol' dragDisabled={true} tileKey={tileKey} key={tileKey} cssParentId='#tileSpawn' /> );
    this.setState({
      currentTileKey: tileKey,
      stockVal: '',
    });
  }

  findStock = (e) => {
    const val = e.target.value;
    clearTimeout(this.state.currentTimer);
    this.props.updateTile( this.state.currentTileKey, { loadingState: 'loading' } );
    this.setState({
      stockVal: e.target.value.toUpperCase(),
      currentTimer: setTimeout(() => this.findStock2(val), 1000),
    });
  }

  findStock2 = (val) => {
    Funcs.fetchStockData(val)
      .then((stockData) => {
        let dragDisabled = true;
        let content = (
          <div>
            <p className='tileStockError'><span style={{fontWeight:'bold'}}>{val.toUpperCase()}</span> is not a valid stock symbol.</p>
          </div>
        );
        if(stockData){
          dragDisabled = false;
          content = (
            <div>
              <p className='tileStockTitle'>{stockData.companyName}</p>
              <img src={stockData.logoUrl} alt={`${stockData.companyName} Logo`} className='tileStockLogo' />
              <p className='tileStockPrice'>{stockData.stockPrice}</p>
            </div>
          );
        }
        this.props.updateTile(
          this.state.currentTileKey, {
            loadingState: 'ready',
            content,
            dragDisabled,
            chartData: stockData.chartData,
          }
        );
      })
      .catch(err => console.log(err));
  }

  render(){
    return (
      <div className='tileAdder' id={this.state.adHocId}>
        <input type='text' name='stockSelector' maxLength={5} autoComplete='off' value={this.state.stockVal} onChange={this.findStock}></input>
        <br />
        <div className='tileSpawn square fifth-width' id='tileSpawn'>
          <div>
            <p>Tiles spawn here. Max of 5.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default TileAdder;
