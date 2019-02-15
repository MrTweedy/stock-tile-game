import React, {Component} from 'react';
import Funcs from '../functions';
import Tile from './Tile';

class TileAdder extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentTimer: null,
      readyTile: <Tile content='Type a stock symbol' startDisabled={true} />,
    }
  }

  findStock = (e) => {
    const val = e.target.value;
    clearTimeout(this.state.currentTimer);
    this.setState({
      currentTimer: setTimeout(() => this.findStock2(val), 1000),
    });
  }

  findStock2 = (val) => {
    if(val)
    this.setState({
      readyTile: <Tile loadingState='loading' />,
    });
    Funcs.fetchStockData(val)
      .then((stockData) => {
        let tileInterior = (
          <div>
            <p className='tileStockError'><span style={{fontWeight:'bold'}}>{val.toUpperCase()}</span> is not a valid stock symbol.</p>
          </div>
        );
        if(stockData){
          tileInterior = (
            <div>
              <p className='tileStockTitle'>{stockData.companyName}</p>
              <img src={stockData.logoUrl} alt={`${stockData.companyName} Logo`} className='tileStockLogo' />
              <p className='tileStockPrice'>{stockData.stockPrice}</p>
            </div>
          );
        }
        this.setState({
          readyTile: <Tile loadingState='ready' content={tileInterior} />,
        });
      })
      .catch(err => console.log(err));
  }

  render(){
    return (
      <form className='stockSelectorWrapper'>
        <label htmlFor='stockSelector'>Type a stock symbol: </label>
        <input type='text' name='stockSelector' maxlength={5} onChange={this.findStock}></input>
        {this.state.readyTile}
      </form>
    );
  }
}

export default TileAdder;
