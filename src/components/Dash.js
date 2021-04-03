import React, {useEffect, useState} from 'react'
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";

export const API_URL = 'https://api.artcoin.network/prices'
export const coinList = ['art', 'aNEAR', 'aBTC', 'aGOLD', 'aSPY', 'aEUR']

const Dash = () => {
    const [day, setDay] = useState({art: null, aNEAR: null, aBTC: null, aGOLD: null, aSPY: null, aEUR: null})

    const getPriceList = async () => {
        let dailyPriceList = {art: null, aNEAR: null, aBTC: null, aGOLD: null, aSPY: null, aEUR: null}

        for(const p in dailyPriceList){
            let res3 = await fetch(`${API_URL}/${p}/1D`, {
                headers : { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                 }
          
              })
            res3 = await res3.json()
            dailyPriceList[p] = res3
        }

        setDay(dailyPriceList)
    }

    useEffect(() => {
      async function fetchData() {
        await getPriceList()
      }
      fetchData()
    }, [])

    const getPrice = (array) => {
        return array.map((arr) => arr.price.toFixed(2))
    }

    const getDate = (array) => {
        return array.map((arr) => arr.time.slice(11,19))
    }

    const getOption = (title, data, date) => {
        return {
          title: {
            text: title,
            textStyle: {
                fontWeight: 'lighter',
                fontSize: 14
            }
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: date,
            },
          ],
          yAxis: [
            {
              type: "value",
              splitLine: {
                lineStyle: {
                  color: "white",
                },
              },
              axisLabel : {
                formatter: function (value) {
                    return value > 1000 ? value/1000 + 'k' : value
                }
              }
            },
          ],
          series: [
            {
              name: "Price: ",
              type: "line",
              lineStyle: {
                color: "#9c87f7",
                width: 1,
              },
              symbol: 'none',
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(207, 196, 255)",
                  },
                  {
                    offset: 1,
                    color: "rgba(236, 232, 255, 0.1)",
                  },
                ]),
              },
              data: data,
            },
          ],
        };
    };

    const Charts = ({index}) => {
        if (day[index]) {
            return (<ReactEcharts
              option={getOption( index + ' / aUSD', getPrice(day[index]), getDate(day[index]))}
              style={{width: '100%', height: '200px'}}
        />)
        }
        return null
    }

    return <div>
        <h3 style={{padding: '5px 5%'}}> aUSD is the first decentralized native stable coin on NEAR. You can trade virtual assets like BTC, Gold, EUR and S&P500 Index on ARTIFICIAL EXCHANGE, a DeFi asset exchange built on NEAR</h3>
        <div className="dash-charts">
            {coinList.map((coin) => <div className="box"><Charts index={coin} /></div>)}
        </div>
    </div>
}

export default Dash

