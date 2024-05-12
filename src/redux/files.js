/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import { JSDateToExcelDate } from "../utilities/utilities";

const XLSX = require('xlsx');

const READING_FILES = 'READING_FILES';
const FILES_SIZE = 'FILES_SIZE';
const SIZE_OF_READ_FILES = 'SIZE_OF_READ_FILES';

export const initialState = { data: [], filesSize: null };

export const actionCreatorDataFiles = data => ({ type: READING_FILES, data });
export const actionCreatorFilesSize = size => ({ type: FILES_SIZE, size });


export const files = (state = initialState, action) => {
  switch (action.type) {
    case READING_FILES: {
      return {...state, data: action.data.reduce((accumulator, currentValue) => {
        if(currentValue.length > 0) accumulator = [...accumulator, currentValue];
        return accumulator;
      }, [])};
    }
    case FILES_SIZE: return { ...state, filesSize: action.size };
    default: {
      return state;
    }
  }
};


export const getDataFilesThunkCreater = files => {
  // Посчитаем общий размер файлов
  const countingFileSizes = Object.values(files).reduce((acc, val) => acc + val.size, 0);
  
  return dispatch => {
    dispatch(actionCreatorFilesSize(countingFileSizes));
    console.log(1111)
  }



  const readExcel = (file, onloadStartThunk, onloadEndThunk, startTime) => {
    const {name, size} = file;
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(file);
      // fr.onloadstart = e => onloadStartThunk(e, name, size, startTime);
      // fr.onloadend = e => onloadEndThunk(e, name, size, startTime);
      fr.onerror = reject;
      fr.onload  = e => {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' }); 
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname]; 
        const data = XLSX.utils.sheet_to_json(ws, {blankRows: false, defval: ''});
        resolve(data);
      };
    });
  };
  
  return (dispatch) => {
    // const onloadStartThunk = (e, name, size, functionStartTime) => {
    //   const functionEndTime = new Date().getTime();
    //   dispatch(actionCreatorEvents(readExcel.name + ': Приступил к чтению файла: ' + name + ', размером: ' + size + ' байт, затрачено время: ' + (functionEndTime - functionStartTime) + ' мс.'));
    // }
    // const onloadEndThunk = (e, name, size, functionStartTime) => {
    //   const functionEndTime = new Date().getTime();
    //   dispatch(actionCreatorEvents(readExcel.name + ': Прочитан файл: ' + name + ', размером: ' + size + ' байт, затрачено время: ' + (functionEndTime - functionStartTime) + ' мс.'));
    // }
    
    //Приводим прочитанные файлы к формату массива, далее методом reduce возвращаем массив промисов
    var arrPromises = Object.values(files)
      .reduce((newArr, file) => {
        const functionStartTime = new Date().getTime();
        if(file.name.indexOf('.xlsx') !== -1) {
          // newArr.push(readExcel(file, onloadStartThunk, onloadEndThunk, functionStartTime));
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
