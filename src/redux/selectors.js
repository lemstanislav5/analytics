/* eslint-disable array-callback-return */
/* eslint-disable no-const-assign */
// import { string } from "prop-types";
// import { findRenderedDOMComponentWithClass } from "react-dom/cjs/react-dom-test-utils.development";
import { createSelector } from "reselect";
import { JSDateToExcelDate } from "../utilities/utilities";

export const getFilesData = (state) => {
  return state.files.data.reduce((accumulator, currentValue) => {
    if(currentValue.length > 0) {
      accumulator = [...accumulator, currentValue]
    }
    return accumulator;
  }, []);
};
export const getOptionsFrom = (state) => {
  return state.options.from;
};
export const getOptionsSearchDepth = (state) => {
  return state.options.searchDepth;
};

export const getOptionsTo = (state) => {
  return state.options.to;
};
export const getOptionsRadius = (state) => {
  return state.options.radius;
};
export const getNumberOfCharacters = (state) => {
  return parseInt(state.options.numberOfCharacters);
};
export const getWidthHeightConvas = (state)=> {
  return parseInt(getOptionsRadius(state), 10) * 2.7;
}
export const getOptionsFirstNumber = (state) => {
  return state.options.firstNumber;
};
export const getOptionsSecondNumber = (state) => {
  return state.options.secondNumber;
};
export const getOptionsTime = (state)=> {
  return state.options.time;
}

export const getFilterForTime = createSelector(
  getFilesData, 
  getOptionsFrom, 
  getOptionsTo,
  getOptionsFirstNumber, 
  getOptionsSecondNumber, 
  getOptionsTime,
  (
    filesData, 
    from, 
    to,
    firstNumber,
    secondNumber,
    times,
  ) => {
  if(firstNumber !== undefined && secondNumber !== undefined && times !== undefined){
    return filesData.reduce((accumulatorData, currentValueData) => { 
      const res = currentValueData
          .filter(item => {
            if(
              item[firstNumber]  !== item[secondNumber] && 	
              item[firstNumber]  !== '' &&  
              item[secondNumber] !== '' &&
              item[firstNumber]  !== undefined &&  
              item[secondNumber] !== undefined 
            ){
              if(typeof(item[times]) === "string" && item[times] !== "") {
                let timeFile    = new Date(item[times].substr(3, 2) +"-"+item[times].substr(0, 2) +"-"+item[times].substr(6, 4)).getTime();
                let fromTime = new Date(from).getTime();
                let toTime = new Date(to).getTime();
               
                if(
                  typeof(timeFile) === "number" &&
                  fromTime <= timeFile &&
                  toTime >= timeFile 
                ) return item;
                
              } else {
                if(
                  parseInt(JSDateToExcelDate(from), 10) <= item[times] &&
                  parseInt(JSDateToExcelDate(to), 10) >= item[times] 
                ) return item;

              }
            }
          })
          .reduce((accumulator, currentValue, index, arrey) => { 
            if(accumulator[currentValue[firstNumber]] === undefined){
              accumulator[currentValue[firstNumber]] = arrey.filter(item => {
                if(item[firstNumber] === currentValue[firstNumber]) return item;
              })
            }
            return accumulator;
          }, {});
        if(Object.keys(res).length > 0) accumulatorData = [...accumulatorData, res];
        return accumulatorData;
    }, [])
  }
});

export const sortBySender = createSelector(
  getFilterForTime,  
  getOptionsFirstNumber, 
  getOptionsSecondNumber,
  getOptionsSearchDepth,
  (
    data,
    firstNumber,
    secondNumber,
    searchDepth,
  ) => {
  if(data !== undefined && firstNumber !== undefined && secondNumber !== undefined){
    return data.reduce((accumulator, currentValue, index, arrey) => {
      for(const key in currentValue){
        const res = accumulator.find(item => (item[firstNumber] === key)? item : undefined)
        if(res === undefined){
          //! group: key
          accumulator = [...accumulator, {[firstNumber]: key, [secondNumber]: currentValue[key], group: key}]
        } else {
          //! res: currentValue[firstNumber]
          accumulator[accumulator.indexOf(res)] = 
            {[firstNumber]: key, [secondNumber]:(res[secondNumber].length > currentValue[key].length) 
              ? res[secondNumber] : currentValue[key], group: res[firstNumber]};
        }
      }
      return accumulator;
    }, [])
    /**
   * Далее сортируем по сумме платежей
   */
  .reduce((accumulator, currentValue, index, arrey) => {
    const callsSum = currentValue[secondNumber].reduce((accNumbers, currNumbers, iNumbers, arrNumbers)  => {
      const key = currNumbers[secondNumber];
      if(accNumbers[key] === undefined) {
        const callsLength = arrNumbers
            .filter((el) => {
                  if(el[secondNumber] ===  currNumbers[secondNumber]) return el;
                }).length;
        if(callsLength >= searchDepth) accNumbers[currNumbers[secondNumber]] = callsLength;
      }
      return accNumbers;
    }, {});
    //! group: currentValue[firstNumber]
    accumulator = [...accumulator, {...currentValue, callsSum }];
    return accumulator;
  }, [])  
  }
});

export const arreySendersRecipientsSumPayments = createSelector(
  sortBySender, 
  getOptionsFirstNumber, 
  getOptionsSecondNumber,
  (
    data, 
    firstNumber,
    secondNumber,
  ) => {
  if(data === undefined) return [];
  return data.reduce((accumulator, currentValue, index, array) => {
    for(const key in currentValue["callsSum"]){
      const res = accumulator.find(item => (item[firstNumber] === key)? item : undefined);
      if(res === undefined){
        accumulator = [...accumulator, {[firstNumber] : key, [secondNumber]: [], callsSum: {}, group: currentValue[firstNumber]}];
      } 
    }
  
    return accumulator;
  }, data) 
})

export const arreyPointsId = createSelector(
  arreySendersRecipientsSumPayments, getOptionsFirstNumber, getNumberOfCharacters, (points, firstNumber, lengthNumber) => {
  const res = points
    .map((currentValue, index, array) => {
      currentValue["id"] = index;
      return currentValue;//! ПЕРВЫЙ ВАРИАНТ ДОБАВИТЬ ГРУППУ
    })
    .filter(item => {
      if(item[firstNumber].length >= lengthNumber) return item;
    });
  return res;

})
//Получаем узлы в зависмомости от типа данных. В состав объектов устанавливаем свойство type: "point" или type: "arrow"
// export const getNodesTupePoint = createSelector(arreySendersRecipientsSumPayments, (data) => {}

export const pointsСreator = createSelector(
  arreyPointsId, 
  getOptionsFirstNumber,
  getNumberOfCharacters, 
  (points, firstNumber) => {
    return points
      .map((currentValue, index) => (
        { id: currentValue["id"], label: currentValue[firstNumber], 
        title: "node "+index+" tootip text", group: currentValue["group"]
      })) 
});

export const arrowsСreator = createSelector(
  arreyPointsId, 
  getOptionsFirstNumber,
  (
    points,
    firstNumber,
  ) => {
  if(points === undefined || points.length === 0) return [];
  return points
    .reduce((accumulator, currentValue, index, array) => {
      const idFrom = currentValue["id"];
      for(const key in currentValue["callsSum"]){
        const idTo = array.find(el => {
          if(el[firstNumber] === key) {
            return [el,currentValue["callsSum"][key]]
          };
        })
        const chek = accumulator.find(el => {
          if(idTo !== undefined && el.from === idFrom && el.to === idTo["id"]){
            return el;
          } else if(idTo !== undefined && el.to === idFrom && el.from === idTo["id"]){
            return el;
          } else{
            return undefined;
          }
        });
        if(idTo !== undefined && chek === undefined)
          accumulator = [...accumulator, {from: idFrom, to: idTo["id"], label: currentValue["callsSum"][key].toString(), arrows: { to: { scaleFactor: 0 }}}];//, arrows: { to: { scaleFactor: 0 }}
      }
      return accumulator;
    }, [])
})

export const getPoints = (state) => {
  return state.vis.points;
};
export const getArrows = (state) => {
  return state.vis.arrows;
};
export const getNetworkLink = (state) => {
  return state.vis.networkLink;
};

export const getIdSelectNode = (state) => {
  return state.vis.idSelectNode;
};
export const getLoadedFiles = (state) => {
  return state.files.loadedFiles;
};
