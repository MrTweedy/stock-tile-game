import { IEXClient } from 'iex-api';
import fetchPonyfill from 'fetch-ponyfill';

const {fetch} = fetchPonyfill();

const iex = new IEXClient(fetch);

async function fetchStockData(stockName){
  let returnObj = {};
  returnObj.logoUrl = await iex.stockLogo(stockName).then(url => url.url);
  if(!returnObj.logoUrl){
    return false;
  }
  returnObj.stockPrice = await iex.stockPrice(stockName);
  returnObj.chartData = await iex.stockChart(stockName, '1m');
  let companyData = await iex.stockCompany(stockName);
  returnObj.companyName = companyData.companyName;
  returnObj.companyDescription = companyData.description;
  return returnObj;
}

let idsCounter = -1;

function makeAdHocId(){
  idsCounter++
  return `id-${idsCounter}`;
}

export default {
  fetchStockData,
  makeAdHocId,
};
