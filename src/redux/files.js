/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import { JSDateToExcelDate } from "../utilities/utilities";

const XLSX = require('xlsx');

const READING_FILES = 'READING_FILES';
const FILES_SIZE = 'FILES_SIZE';
const SIZE_OF_READ_FILES = 'SIZE_OF_READ_FILES';
const FILES_EVENTS = 'FILES_EVENTS';

export const initialState = { 
  readingFiles: [],      // Прочитанные из файлов данные
  filesSize: 0,       // Размер всех файлов каталога (для прогрессбара)
  sizeOfReadFiles: 0, // Размер прочитанных файлов (для прогрессбара)
  filesEvents: [],    // Массив событий обработки файлов
};

export const actionCreatorDataFiles = readingFiles => ({ type: READING_FILES, readingFiles });
export const actionCreatorFilesSize = filesSize => ({ type: FILES_SIZE, filesSize });
export const actionCreatorSizeOfReadFiles = sizeOfReadFiles => ({ type: SIZE_OF_READ_FILES, sizeOfReadFiles });
export const actionCreatorFilesEvents = event => ({ type: FILES_SIZE, event });

export const files = (state = initialState, action) => {
  switch (action.type) {
    case READING_FILES: {
      return {...state, readingFiles: action.data.reduce((accumulator, currentValue) => {
        if(currentValue.length > 0) accumulator = [...accumulator, currentValue];
        return accumulator;
      }, [])};
    }
    case FILES_SIZE: return { ...state, filesSize: action.filesSize }
    case SIZE_OF_READ_FILES: return { ...state, sizeOfReadFiles: action.sizeOfReadFiles }
    case FILES_EVENTS: return { ...state, filesEvents: [...state.filesEvents, action.event]}
    default: {
      return state;
    }
  }
};


export const getDataFilesThunkCreater = files => {
  // Посчитаем общий размер файлов
  const countingFileSizes = Object.values(files).reduce((acc, val) => acc + val.size, 0);
  // Функция чтения XLSX файлов
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
  return dispatch => {
    // Добавляем в стейт размер прочитанных файлов
    dispatch(actionCreatorFilesSize(countingFileSizes));
    console.log(1111)
  }




  
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
