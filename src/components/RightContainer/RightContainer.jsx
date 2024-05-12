/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState, useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SelectDirectory} from './SelectDirectory/SelectDirectory';


export const RightContainer = () => {
  const dispatch = useDispatch();
  // const selectDirectiri = (event) => {
  //   let { name, path } = event.target.files[0];
  //   selectDir(name, path);
  //   getDataFiles(event.target.files);
  // };
  return (
    <div className="overflow-auto col-md-10 col-lg-10 d-md-block sidebar collapse vh-100 rightContainerStyle">
      <div className='row text-light bg-dark p-2'>
        Выберете каталог с файлами xlcx
      </div>
      <SelectDirectory/>
    </div>
  );
};