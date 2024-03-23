/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { connect } from 'react-redux';
import '../../App.css';
import {
  selectDirThunkCreater,
  getDataFilesThunkCreater,
} from '../../redux/files_arr_reducer';
import { actionCreatorSetOption } from '../../redux/options_reducer';
import {
  actionCreatorPoints,
  actionCreatorArrows,
  actionCreatorNetworkLink,
  actionCreatorIdSelectNode,
} from '../../redux/vis_reducer';
import {
  getWidthHeightConvas,
  getPoints,
  getArrows,
  pointsСreator,
  arrowsСreator,
  getIdSelectNode,
  getNetworkLink,
  getProgressFileRead,
  getLoadedFiles,
} from '../../redux/selectors';
import VisNetwork from './VisNetwork';
import { saveImg } from '../../utilities/utilities';

const RightNav = (props) => {
  const {
    getDataFiles,
    selectDir,
    files,
    options,
    setPoints,
    setArrows,
    points,
    arrows,
    selectColumns,
    pointsSelector,
    arrowsSelector,
    setNetworkLink,
    idSelectNode,
    setIdSelectNode,
    network,
    progress,
    loadedFiles,
  } = props;
  const { dir, data } = files;
  console.log(data)
  const [state, setState] = useState({
    operationsBetweenCardsFlag: false,
    receiptsFromPaymentSystemsFlag: false,
    generalAnalysisOfReceiptsFlag: false,
    inputFlag: true,
    newLable: undefined
  });
  useEffect(() => {
    if (points.length === 0 && arrows.length === 0) {
      setPoints(pointsSelector);
      setArrows(arrowsSelector);
    }
  
  }, [setPoints, setArrows, data, files.data.length, state, points, arrowsSelector, pointsSelector, arrows.length, points.length]);
  
  const deletePoint = () => {
    network.deleteSelected(idSelectNode[0])
  };
  const addNewPoint = (e) => {
    const id = Object.values(network.body.nodes).reduce((accumulator, currentValue, index, array) => {
      if(accumulator < currentValue.id) accumulator = currentValue.id;
      return accumulator;
    }, 0);
    network.body.data.nodes.add({id: id + 1, label: state.newLable});
    setState({ ...state, newLable: "" });
  }
  const addNewArrows = (e) => {
    network.body.data.edges.add([{from: idSelectNode[0], to: idSelectNode[1], arrows: { to: { scaleFactor: 0 }}}])
  }
  const changeNewLable = (event) => {
    setState({
      ...state,
      operationsBetweenCardsFlag: true,
      newLable: event.target.value
    });
  }
  
  
  const selectDirectiri = (event) => {
    const { name, path } = event.target.files[0];
    selectDir(name, path);
    getDataFiles(event.target.files);
  };
  const operationsBetweenCards = () => {
    if (points.length > 0)
      setState({
        ...state,
        operationsBetweenCardsFlag: true,
        receiptsFromPaymentSystemsFlag: false,
        generalAnalysisOfReceiptsFlag: false,
      });
  };
  const resetData = () => {
    window.location.reload();
  };
  const handleChange = (event) => {
    selectColumns(event.target.name, event.target.value);
  };
  
  return (
    <div className="overflow-auto col-md-10 col-lg-10 d-md-block sidebar collapse vh-100 rightContainerStyle">
      <div className='row text-light bg-dark p-2'>
        Выберете каталог с файлами xlcx
      </div>
      <Form>  
        <Row className="d-flex align-items-end flex-row "> 
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
        {
        (data.length > 0 ) 
          ? 
            <Form>
            <Row className="d-flex align-items-end flex-row "> 
              <Col xs="auto" className="me-sm-2 col-md-4">
                <Form.Label className="me-sm-2 text-primary" htmlFor="inlineFormCustomSelect">
                  Колонка первого телефона
                </Form.Label>
                <Form.Control 
                  as="select"
                  name="firstNumber"
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
                  Колонка второго телефона
                </Form.Label>
                <Form.Control 
                  as="select"
                  name="secondNumber"
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
                  Колонка времени
                </Form.Label>
                <Form.Control 
                  as="select"
                  name="time"
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
                  onClick={operationsBetweenCards}
                  disabled={(points.length > 0 && arrows.length > 0)? false: true}
                >
                  Схема звоноков
                </Button>
              </Col>
              <Col xs="auto" className="my-1">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={resetData}
                  disabled={(points.length > 0 && arrows.length > 0)? false: true}
                >
                  Очистить
                </Button>
              </Col>
              <Col xs="auto" className="my-1">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={deletePoint}
                  disabled={(points.length > 0 && arrows.length > 0)? false: true}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </Button>
              </Col>
              <Col xs="auto" className="my-1">
                <Form.Control
                  className="wh-input"
                  size="sm"
                  type="text"
                  placeholder="79150001122"
                  value={state.newLable}
                  name="newPoint"
                  onChange={changeNewLable}
                  disabled={(points.length > 0 && arrows.length > 0)? false: true}
                />
              </Col>
              <Col xs="auto" className="my-1">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={addNewPoint}
                  disabled={(points.length > 0 && arrows.length > 0)? false: true}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                  </svg>
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
                  disabled={(points.length > 0 && arrows.length > 0)? false: true}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                  </svg>
                </Button>
              </Col> 
              <Col xs="auto" className="my-1">
              <Button
                size="sm"
                variant="success"
                disabled={(network.canvas !== undefined)? false: true}
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
              <ProgressBar now={progress} label={`${progress}%`}/>
            </Col>
            <Col xs="auto" className="me-sm-6 col-md-6">
               <span>прочитан {loadedFiles[0]} файл из {loadedFiles[1]}</span>
            </Col>
          </Row>
        }
        
      <div className="overflow-auto d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        {state.operationsBetweenCardsFlag ? (
          <VisNetwork 
            edges={arrows} 
            nodes={points} 
            physics={options.physics} 
            setNetworkLink={setNetworkLink} 
            setIdSelectNode={setIdSelectNode}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    files: state.files,
    options: state.options,
    pointsSelector: pointsСreator(state),
    arrowsSelector: arrowsСreator(state),
    widthHeightConvas: getWidthHeightConvas(state),
    points: getPoints(state),
    arrows: getArrows(state),
    idSelectNode: getIdSelectNode(state),
    network: getNetworkLink(state),
    progress: getProgressFileRead(state),
    loadedFiles: getLoadedFiles(state),

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectDir: (name, path) => dispatch(selectDirThunkCreater(name, path)),
    getDataFiles: (dir) => dispatch(getDataFilesThunkCreater(dir)),
    selectColumns: (name, value) => dispatch(actionCreatorSetOption(name, value)),
    setPoints: (data) => dispatch(actionCreatorPoints(data)),
    setArrows: (data) => dispatch(actionCreatorArrows(data)),
    setNetworkLink: (network) => dispatch(actionCreatorNetworkLink(network)),
    setIdSelectNode: id =>  dispatch(actionCreatorIdSelectNode(id)),
  };
};

RightNav.propTypes = {
  files: PropTypes.object,
  selectDir: PropTypes.func,
  getDataFiles: PropTypes.func,
  options: PropTypes.object,
  widthHeightConvas: PropTypes.number,
  setPoints: PropTypes.func,
  setArrows: PropTypes.func,
  points: PropTypes.array,
  arrows: PropTypes.array,
  pointsSelector: PropTypes.array,
  arrowsSelector: PropTypes.array,
  setNetworkLink: PropTypes.func,
  idSelectNode: PropTypes.array,
  setIdSelectNode: PropTypes.func,
  network: PropTypes.object,
  progress: PropTypes.number,
  loadedFiles: PropTypes.array,
};
RightNav.defaultProps = {
  files: {},
  selectDir: () => {},
  getDataFiles: () => {},
  options: {},
  widthHeightConvas: 0,
  setPoints: () => {},
  setArrows: () => {},
  points: [],
  arrows: [],
  pointsSelector: [],
  arrowsSelector: [],
  setNetworkLink: () => {},
  idSelectNode: [],
  setIdSelectNode: () => {},
  network: {},
  progress: 0,
  loadedFiles: [],
};
const RightContainer = connect(mapStateToProps, mapDispatchToProps)(RightNav);
export default RightContainer;