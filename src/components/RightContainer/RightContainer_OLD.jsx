/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState, useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EventsPage from '../EventsPage/EventsPage';
import '../../App.css';
import { SvgImages } from '../images/SvgImages';
import { 
  selectDirThunkCreater, 
  getDataFilesThunkCreater, 
  actionCreatorEvents, 
  getFilterForTimeThunkCreater,
  nodesAndEdgesThunkCreater,
} from '../../redux/files_reducer';
import { actionCreatorSetOption } from '../../redux/options_reducer';
import { actionCreatorNetworkLink, actionCreatorIdSelectNode } from '../../redux/vis_reducer';
import VisNetwork from './VisNetwork';
import { saveImg } from '../../utilities/utilities';
export const RightContainer = () => {
  const dispatch = useDispatch();
  const {networkLink} = useSelector(store => store.vis);
  const {loadedFiles} = useSelector(store => store.files);
  const {dir, data, dataSortByTime, nodes, edges} = useSelector(store => store.files);
  const {startTime, endTime, firstNumberСolumn, secondNumberСolumn, timeСolumn, physics, searchDepth, numberOfCharacters,  mutualСonnections} = useSelector(state => state.options);
  const {idSelectNode} = useSelector(store => store.vis);
  const selectColumns = (name, value) => dispatch(actionCreatorSetOption(name, value));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const addEvent = useCallback((str) => dispatch(actionCreatorEvents(str)));
  const setNetworkLink = (networkLink) => dispatch(actionCreatorNetworkLink(networkLink));
  const setIdSelectNode = id =>  dispatch(actionCreatorIdSelectNode(id));
  const selectDir = (name, path) => dispatch(selectDirThunkCreater(name, path));
  const getDataFiles = (dir) => dispatch(getDataFilesThunkCreater(dir));

  useEffect(() => {
    if (dataSortByTime.length !== 0) {
      dispatch(nodesAndEdgesThunkCreater(dataSortByTime, mutualСonnections));
    }
  }, [dataSortByTime, dispatch, firstNumberСolumn, secondNumberСolumn, mutualСonnections]);

  useEffect(() => {
    if (data.length !== 0 && startTime !== undefined && endTime !== undefined && startTime !== undefined && firstNumberСolumn !== undefined && secondNumberСolumn !== undefined && timeСolumn  !== undefined && dataSortByTime.length === 0) {
      addEvent('Все параметры выбраны');
      dispatch(getFilterForTimeThunkCreater(startTime, endTime, firstNumberСolumn, secondNumberСolumn, timeСolumn, data));
      //!nodesAndEdgesThunkCreaters
    }
  }, [startTime, endTime, firstNumberСolumn, secondNumberСolumn, timeСolumn, data, addEvent, dispatch, dataSortByTime]);

  const [state, setState] = useState({
    newLable: undefined
  });

  const [buildDiagram, setBuildDiagram] =  useState(false);
  
  //!network----------------------------------------------------------------------------------
  const deletePoint = () => {
    networkLink.deleteSelected(idSelectNode[0])
  };
  const addNewPoint = (e) => {
    const id = Object.values(networkLink.body.nodes).reduce((accumulator, currentValue) => {
      if(accumulator < currentValue.id) accumulator = currentValue.id;
      return accumulator;
    }, 0);
    networkLink.body.data.nodes.add({id: id + 1, label: state.newLable});
    setState({ ...state, newLable: "" });
  }
  const addNewArrows = (e) => {
    networkLink.body.data.edges.add([{from: idSelectNode[0], to: idSelectNode[1], arrows: { to: { scaleFactor: 0 }}}])
  }
  const changeNewLable = (event) => {
    setState({
      ...state,
      operationsBetweenCardsFlag: true,
      newLable: event.target.value
    });
  }
//!network----------------------------------------------------------------------------------
  //Выбор кталога
  const selectDirectiri = (event) => {
    addEvent('Каталог выбран');
    const data = Object.values(event.target.files)
      .map((file) => {
        if(file.name.indexOf('.xlsx') !== -1) {
          const {name, size} = file;
          return {name, size};
        }
      });
    console.log(data)
    let { name, path } = event.target.files[0];
    selectDir(name, path);
    getDataFiles(event.target.files);
  };

  const resetData = () =>  window.location.reload();
  const handleChange = (event) => selectColumns(event.target.name, event.target.value);
  
  return (
    <div className="overflow-auto col-md-10 col-lg-10 d-md-block sidebar collapse vh-100 rightContainerStyle">
      <div className='row text-light bg-dark p-2'>
        Выберете каталог с файлами xlcx
      </div>
      <Form>  
        <Row className="d-flex align-items-end flex-row"> 
          <Col xs="auto" className="my-1">
            <Form.Control
              size="sm"
              type="file"
              multiple
              directory=""
              webkitdirectory=""
              onChange={selectDirectiri}
            />
          </Col>
          <Col xs="auto" className="my-1">
            <span className="form-control form-control-sm">
              {`каталог: ${dir}`}
            </span>
          </Col>
        </Row>
      </Form>
      <EventsPage/>
        {
        (data.length > 0 ) 
          ? 
            <Form>
            <Row className="d-flex align-items-end flex-row "> 
              <Col xs="auto" className="me-sm-2 col-md-4">
                <Form.Label className="me-sm-2 text-primary" htmlFor="inlineFormCustomSelect">
                  Контакт А
                </Form.Label>
                <Form.Control 
                  as="select"
                  name="firstNumberСolumn"
                  onChange={handleChange}
                >
                  <option key="#" ></option>
                  {
                    Object.keys(data[0][0]).map(
                      (item, i) => <option key={i} value={item}>{item}</option>
                    )
                  }
                </Form.Control>
              </Col>

              <Col xs="auto" className="me-sm-2 col-md-4">
                <Form.Label className="me-sm-2 text-primary " htmlFor="inlineFormCustomSelect">
                  Контакт В
                </Form.Label>
                <Form.Control 
                  as="select"
                  name="secondNumberСolumn"
                  onChange={handleChange}
                >
                  <option key="#" ></option>
                  {
                    Object.keys(data[0][0]).map(
                      (item, i) => <option key={i} value={item}>{item}</option>
                    )
                  }
                </Form.Control>
              </Col>
              <Col xs="auto" className="me-sm-2 col-md-3">
                <Form.Label className="me-sm-2 text-primary" htmlFor="inlineFormCustomSelect">
                  Время
                </Form.Label>
                <Form.Control 
                  as="select"
                  name="timeСolumn"
                  onChange={handleChange}
                >
                  <option key="#" ></option>
                  {
                    Object.keys(data[0][0]).map(
                      (item, i) => <option key={i} value={item}>{item}</option>
                    )
                  }
                </Form.Control>
              </Col>
            </Row> 
            <Row className="d-flex align-items-end flex-row mt-1">
              <Col xs="auto" className="my-1">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setBuildDiagram(true)}
                  disabled={(nodes.length > 0 && edges.length > 0)? false: true}
                >
                  Построить схему
                </Button>
              </Col>
              <Col xs="auto" className="my-1">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={resetData}
                  disabled={(nodes.length > 0 && edges.length > 0)? false: true}
                >
                  Очистить
                </Button>
              </Col>
              <Col xs="auto" className="my-1">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={deletePoint}
                  disabled={(nodes.length > 0 && edges.length > 0)? false: true}
                >
                  <SvgImages svg='del'/>
                </Button>
              </Col>
              <Col xs="auto" className="my-1">
                <Form.Control
                  className="wh-input"
                  size="sm"
                  type="text"
                  placeholder="XYYYQQQFFSS"
                  value={state.newLable}
                  name="newPoint"
                  onChange={changeNewLable}
                  disabled={(nodes.length > 0 && edges.length > 0)? false: true}
                />
              </Col>
              <Col xs="auto" className="my-1">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={addNewPoint}
                  disabled={(nodes.length > 0 && edges.length > 0)? false: true}
                >
                  <SvgImages svg='add'/>
                </Button>
              </Col>
              <Col xs="auto" className="my-1">
                <span className="form-control form-control-sm">
                  {`
                    от : ${idSelectNode[0] === undefined? "---" : idSelectNode[0]}
                    к  : ${idSelectNode[1] === undefined? "---" : idSelectNode[1]}  
                  `}
                </span>
              </Col> 
              <Col xs="auto" className="my-1">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={addNewArrows}
                  disabled={(nodes.length > 0 && edges.length > 0)? false: true}
                >
                  <SvgImages svg='arrows'/>
                </Button>
              </Col> 
              <Col xs="auto" className="my-1">
              <Button
                size="sm"
                variant="success"
                disabled={(networkLink.canvas !== undefined)? false: true}
                onClick={saveImg}
                // disabled={(points.length > 0 && arrows.length > 0)? false: true}
              >
                Сохранить
              </Button>
            </Col>
            </Row>
          </Form>
          :
          <Row className="d-flex align-items-end flex-row "> 
            <Col xs="auto" className="me-sm-6 col-md-6">
               <span>прочитан {loadedFiles[0]} файл из {loadedFiles[1]}</span>
            </Col>
          </Row>
        }
        
      <div className="overflow-auto d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
         {buildDiagram && 
            <VisNetwork 
                edges={edges} 
                nodes={nodes} 
                physics={physics} 
                setNetworkLink={setNetworkLink} 
                setIdSelectNode={setIdSelectNode}
              />
          }
      </div>
    </div>
  );
};