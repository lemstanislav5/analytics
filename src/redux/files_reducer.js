/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import { JSDateToExcelDate } from "../utilities/utilities";

const XLSX = require('xlsx');
const READING_FILES = 'READING_FILES';
const READING_DIR = 'READING_DIR';
const FILES_SIZE_TIME = 'FILES_SIZE_TIME';
const DATA_SORT_BY_TIME = 'DATA_SORT_BY_TIME';
const EVENTS = 'EVENTS';
const ADD_NODES = 'ADD_NODES';
const ADD_EDGES = 'ADD_EDGES';


export const initialState = {
  dir: 'не выбран',
  data: [],
  arrData: [],
  analitycsDataFiles: [],
  loadedFiles: [0, 0], 
  filesSizeTime: [],
  dataSortByTime: [],
  events: [],
  nodes: [],
  edges: [],
};


export const actionCreatorDataFiles = (data) => ({ type: READING_FILES, data });
export const actionCreatorDataDir = (dir) => ({ type: READING_DIR, dir });
export const actionFilesSizeTime = (name, size, time) => ({ type: FILES_SIZE_TIME, name, size, time });
export const actionDataSortByTime = (arr) => ({ type: DATA_SORT_BY_TIME, arr });
export const actionCreatorEvents = (string) => ({ type: EVENTS, string });
export const actionCreatorNodes = (arr) => ({ type: ADD_NODES, arr });
export const actionCreatorEdges = (arr) => ({ type: ADD_EDGES, arr });


export const filesArrReducer = (state = initialState, action) => {
  switch (action.type) {
    case READING_FILES: {
      return { ...state, data: action.data.reduce((accumulator, currentValue, index, arrey) => {
        if(currentValue.length > 0) {
          accumulator = [...accumulator, currentValue]
        }
        return accumulator;
      }, [])};
    }
    case READING_DIR: {
      return { ...state, dir: action.dir };
    }
    case DATA_SORT_BY_TIME: {
      return { ...state, dataSortByTime: action.arr };
    }
    case EVENTS: {
      return {
        ...state,
        events: [...state.events, action.string]
      };  
    }
    case ADD_NODES: {
      return { ...state, nodes: action.arr };
    }
    case ADD_EDGES: {
      return { ...state, edges: action.arr };
    }
    default: {
      return state;
    }
  }
};
export const selectDirThunkCreater = (name, path) => {
  return (dispatch) => {
    path = (path === undefined)? 'не установлен' : path;
    const dir = path.replace(name, '');
    dispatch(actionCreatorDataDir(dir));
  };
};

export const getDataFilesThunkCreater = (files) => {
  const readExcel = (file, onloadStartThunk, onloadEndThunk, startTime) => {
    const {name, size} = file;
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsBinaryString(file);
      fr.onloadstart = (e) => onloadStartThunk(e, name, size, startTime);
      fr.onloadend = (e) => onloadEndThunk(e, name, size, startTime);
      fr.onerror = reject;
      fr.onload  = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, {
          blankRows: false, defval: ''
        });
        resolve(data);
      };
    });
  };
  
  return (dispatch) => {
    const onloadStartThunk = (e, name, size, functionStartTime) => {
      const functionEndTime = new Date().getTime();
      dispatch(actionCreatorEvents(readExcel.name + ': Приступил к чтению файла: ' + name + ', размером: ' + size + ' байт, затрачено время: ' + (functionEndTime - functionStartTime) + ' мс.'));
    }
    const onloadEndThunk = (e, name, size, functionStartTime) => {
      const functionEndTime = new Date().getTime();
      dispatch(actionCreatorEvents(readExcel.name + ': Прочитан файл: ' + name + ', размером: ' + size + ' байт, затрачено время: ' + (functionEndTime - functionStartTime) + ' мс.'));
    }
    
    //Приводим прочитанные файлы к формату массива, далее методом reduce возвращаем массив промисов
    var arrPromises =  Object.values(files)
      .reduce((newArr, file) => {
        const functionStartTime = new Date().getTime();
        if(file.name.indexOf('.xlsx') !== -1) {
          newArr.push(readExcel(file, onloadStartThunk, onloadEndThunk, functionStartTime));
        }
        return newArr;
      }, []);

    //Выполняем промисы  
    Promise.all(arrPromises)
      .then(
        data => dispatch(actionCreatorDataFiles(data)),
        reason => alert(reason)
      );
  };
};


/** {
  *     "xxxxxxxxxx": [
  *         {
  *             "contact A": "xxxxxxxxxx",
  *             "contact B": "yyyyyyyyyy",
  *             "time": 44967.458333333336
  *         },
  *     ]
  * }
  */ 
export const getFilterForTimeThunkCreater = 
  (
    startTime, 
    endTime,
    firstNumberСolumn,
    secondNumberСolumn,
    timeСolumn,
    data,
  ) => {
    return dispatch => {
      const functionStartTime = new Date().getTime();
      const sortResult =  data.reduce((accumulatorData, currentValueData) => { 
        const res = currentValueData
            .filter(item => {
              if(
                item[firstNumberСolumn] !== item[secondNumberСolumn] && 	
                item[firstNumberСolumn] !== '' &&  
                item[secondNumberСolumn] !== '' &&
                item[firstNumberСolumn] !== undefined &&  
                item[secondNumberСolumn] !== undefined 
              ){
                if(typeof(item[timeСolumn]) === "string" && item[timeСolumn] !== "") {
                  let timeFile = new Date(item[timeСolumn].substr(3, 2) +"-"+item[timeСolumn].substr(0, 2) +"-"+item[timeСolumn].substr(6, 4)).getTime();
                  let startTimeNumbers = new Date(startTime).getTime();
                  let endTimeNumbers = new Date(endTime).getTime();
                  
                  if(typeof(timeFile) === "number" && startTimeNumbers <= timeFile && endTimeNumbers >= timeFile) return item;
                  
                } else {
                  if(
                    parseInt(JSDateToExcelDate(startTime), 10) <= item[timeСolumn] &&
                    parseInt(JSDateToExcelDate(endTime), 10) >= item[timeСolumn] 
                  ) return item;
  
                }
              }
            })
            .reduce((accumulator, currentValue, index, arrey) => { 
              if(accumulator[currentValue[firstNumberСolumn]] === undefined){
                accumulator[currentValue[firstNumberСolumn]] = arrey.filter(item => {
                  if(item[firstNumberСolumn] === currentValue[firstNumberСolumn]) return item;
                })
              }
              return accumulator;
            }, {});
          if(Object.keys(res).length > 0) accumulatorData = [...accumulatorData, res];
          return accumulatorData;
      }, []);

      const sortByFirstNumber = sortResult.reduce((accumulator, currentValue) => {
        for(const key in currentValue){
          const res = accumulator.find(item => (item[firstNumberСolumn] === key)? item : undefined)
          if(res === undefined){
            accumulator = [...accumulator, {[firstNumberСolumn]: key, [secondNumberСolumn]: currentValue[key], group: key}]
          } else {
            accumulator[accumulator.indexOf(res)] = 
              {[firstNumberСolumn]: key, [secondNumberСolumn]:(res[secondNumberСolumn].length > currentValue[key].length) 
                ? res[secondNumberСolumn] : currentValue[key]};
          }
        }
        return accumulator;
      }, []);
      dispatch(actionDataSortByTime(sortByFirstNumber));
      const functionEndTime = new Date().getTime();
      dispatch(actionCreatorEvents('Выполнена сортировка записей за период, затрачено время: ' + (functionEndTime - functionStartTime) + ' мс.'));
    }
};


export const nodesAndEdgesThunkCreater = 
  (data, mutualСonnections) => {
    //!возможно задвоение числа связей
    console.warn('Сортировка по числу повторений внутри каждого объекта, возможно задвоение числа связей.')
    return dispatch => {
      const functionStartTime = new Date().getTime();
      // Сортировка по числу повторений внутри каждого объекта
      const sortByContacts = data.reduce((acc, val) => {
        const contactB = val['contact B'];
        const internalSorting = contactB.reduce((acc1, val1) => {
            const contactB1 = val1['contact B'];
            // Ищем совпадение в массиве - аккомуляторе, если не находим добавляем, если находим добавляем знаяение count
            const searchInNewArray = acc1.find(item => item['contact B'] === contactB1);
            if(searchInNewArray !== undefined) {
                searchInNewArray['count'] = searchInNewArray['count'] + 1;
            } else {
                acc1 = [...acc1, {'contact A': val1['contact A'], 'contact B': val1['contact B'], count: 1}];
            }
            return acc1;
        }, []);
        acc = [...acc, internalSorting];
        return acc;
      }, []);
      // Определяем массив с именами главных узлов
      //["xxxxxxxxxx", "zzzzzzzzzz", "cccccccccc"]
      const arrMainNodes = data.map(item => item['contact A']);

      // Проверяем является ли item['contact B'] гланым узлом, при положительном ответе устанавливаем флаг ['mainNodes'] = true
      // [
      //     [
      //         {
      //             "contact A": "zzzzzzzzzz",
      //             "contact B": "22222yyyyy",
      //             "count": 1,
      //             "coincidence": true
      //         }
      //     ]
      // ]
      const sortMainNode = sortByContacts.map(arr => {
        return arr.map(item => {
            if(arrMainNodes.indexOf(item['contact B']) !== -1) item['mainNodes'] = true;
            return item;
        })
      });

      // [
      //     [
      //         {
      //             "contact A": "xxxxxxxxxx",
      //             "contact B": "yyyyyxxzzz",
      //             "count": 4,
      //             "coincidence": false
      //         },
      //     ]
      // ]

      // Добавляем в объект поле coincidence при совпадении "contact B" массива в одном издругих массивов
      const sortByСoincidence = sortByContacts.map(el1 => {
        const itemEl = el1.map(el2 => {
            // Контакты 'contact A' - неперебераемый, 'contact B' - перебераемый
            const contactA = el2['contact A'], contactB = el2['contact B'];
            // Создаем массив с [true, false...]
            const sortMap = sortByContacts.map(el3 => {
                return el3.some(item => contactA !== item['contact A'] && item['contact B'] === contactB);
            });
            // Приводим массив sortMap к значению true при наличии одного значения true 
            const coincidence = sortMap.some(item => item);
            el2['coincidence'] = coincidence;
            return el2;
        })
        return itemEl;
      });

      // [
      //     [
      //         {
      //             "contact A": "xxxxxxxxxx",
      //             "contact B": "yyyyyxxxxx",
      //             "count": 2,
      //             "coincidence": true
      //         },
      //     ],
      // ]

      // Сортируем массив по пересечению и связям с главными узлами
      console.warn('ОСТАНОВИЛСЯ ЗДЕСЬ: excludeCoincidenceOrMainNodes')
      const excludeCoincidenceOrMainNodes = sortByСoincidence.map(arr => {
        return arr.reduce((acc, val) => {
            if(mutualСonnections){
              if(val.coincidence === true || val.mainNodes === true ) acc = [...acc, val];
            } else {
              acc = [...acc, val];
            }
            return acc;
        }, []);
      })
      console.log(excludeCoincidenceOrMainNodes)
      // Приводим данные к одному массиву
      const concatArr = excludeCoincidenceOrMainNodes.reduce((acc, val) => (acc.concat(val)), []);

      const nodes = concatArr.reduce((acc, val) => {
        let id = acc.length;
        const serchContactA = acc.some(item => item['label'] === val['contact A']);
        const serchContactB = acc.some(item => item['label'] === val['contact B']);
        if(!serchContactA) acc = [...acc, {id: ++id, label: val['contact A'], group: 'main'}];
        if(!serchContactB) acc = [...acc, {id: ++id, label: val['contact B'], group: val['contact A']}];
        return acc;
      }, [])
      dispatch(actionCreatorNodes(nodes));

      const edges = concatArr.reduce((acc, val) => {
        const from = nodes.find(item => item['label'] === val['contact A']).id;
        const to = nodes.find(item => item['label'] === val['contact B']).id;
        acc = [...acc, {from, to, label: val.count.toString(), font: { align: "horizontal" }} ];
        return acc;
      }, []);
      dispatch(actionCreatorEdges(edges));
      const functionEndTime = new Date().getTime();
      dispatch(actionCreatorEvents('edges и edges созданы, затрачено время: ' + (functionEndTime - functionStartTime) + ' мс.'));
    }
}