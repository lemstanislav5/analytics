/* eslint-disable array-callback-return */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import { actionCreatorSetOption } from '../../redux/options_reducer';
import { getPoints, getNetworkLink } from '../../redux/selectors';
import "./LeftContainer.css";
import { actionCreatorIdSelectNode } from '../../redux/vis_reducer';
import '../../App.css';

const LeftNav = (props) => {
  const { setOption, options, points, network, setIdSelectNode } = props;
  const { startTime, endTime, physics, mutualСonnections } = options;

  const [arrSelect, setArrSelect] = useState([]);

  const handleChange = (event) => setOption(event.target.name, event.target.value);
  const handleCheck = (event) => setOption(event.target.name, event.target.checked);
  const handleSelect = (event) =>  setOption(event.target.name, parseInt(event.target.value));
  const handleSearch  = (event) =>  {
    let str = event.target.value;
    if(str.length > 6) {
      let res = points.filter(item => {
        if(item["label"].indexOf(str) > -1) return item;
      })
      setArrSelect(res);
    } else{
      setArrSelect([])
    }
  }
  const handleClickEl  = (event) =>  {
    let str = event.target.innerHTML;
    let res = points.find(item => {
      if(item["label"].indexOf(str) > -1) return item;
    })
    network.selectNodes([res["id"]]);
    setIdSelectNode(res["id"]);
  }
  return (
    <div className="col-md-3 col-lg-2 d-md-block bg-dark text-light sidebar collapse vh-100 leftContainerStyle">
      <Form>
        <Row className="align-items-center">
          <Col xs="auto" className="my-1">
            <Form.Label className="me-sm-2" htmlFor="inlineFormCustomSelect">
              С даты
            </Form.Label>
            <Form.Control
              size="sm"
              type="date"
              placeholder="0000-00-00"
              name="from"
              defaultValue={startTime}
              onChange={handleChange}
            />
          </Col>
          <Col xs="auto" className="my-1">
            <Form.Label className="me-sm-2" htmlFor="inlineFormCustomSelect">
              До даты
            </Form.Label>
            <Form.Control
              size="sm"
              type="date"
              placeholder="00-00-0000"
              name="to"
              defaultValue={endTime}
              onChange={handleChange}
            />
          </Col>
          <Col xs="auto" className="my-1">
            <Form.Label className="me-sm-2" htmlFor="inlineFormCustomSelect">
              Взаимные связи
            </Form.Label>
            <Form.Check 
              size="sm"
              type="switch"
              name="mutualСonnections"
              onChange={handleCheck}
              checked={mutualСonnections}
            />
          </Col>
          <Col xs="auto" className="my-1">
            <Form.Label className="me-sm-2" htmlFor="inlineFormCustomSelect">
              Физика
            </Form.Label>
            <Form.Check 
              size="sm"
              type="switch"
              name="physics"
              onChange={handleCheck}
              checked={physics}
            />
          </Col>
          <Col xs="auto" className="my-1">
            <Form.Label className="me-sm-2" htmlFor="inlineFormCustomSelect">
              Повтор связи
            </Form.Label>
            <Form.Control 
              className="wh-input"
              as="select"
              name="searchDepth"
              onChange={handleSelect}
            >
              <option key="1" >1</option>
              <option key="2" >2</option>
              <option key="3" >3</option>
              <option key="4" >4</option>
            </Form.Control>
          </Col>
          <Col xs="auto" className="my-1">
            <Form.Label className="me-sm-2 py-0" htmlFor="inlineFormCustomSelect">
              Длина строки
            </Form.Label>
            <Form.Control
              className="wh-input"
              size="sm"
              type="text"
              placeholder="11"
              name="numberOfCharacters"
              onChange={handleChange}
            />
          </Col>
          <Col xs="auto" className="my-1">
            <Form.Label className="me-sm-2 py-0" htmlFor="inlineFormCustomSelect">
              поиск
            </Form.Label>
            <Form.Control
              className="wh-input"
              size="sm"
              type="text"
              placeholder="XYYYQQQFFSS"
              name="search"
              onChange={handleSearch}
            />
          </Col>
          <Col xs="auto" className="my-1 h-20 ">
            <div className="box-scroll">
              <ul className="wh-input list-group">
                {
                  arrSelect.length > 0 
                    ?
                      arrSelect.map((item, i) => {
                        return <li 
                          key={i}
                          className="list-group-item list-group-item-action list-group-item-warning py-0"
                          onClick={handleClickEl}
                        >{item["label"]}</li>
                      })
                    :
                    ""
                }
              </ul>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    options: state.options,
    points: getPoints(state),
    network: getNetworkLink(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOption: (name, value) => dispatch(actionCreatorSetOption(name, value)),
    setIdSelectNode: id =>  dispatch(actionCreatorIdSelectNode(id))
  };
};

LeftNav.propTypes = {
  options: PropTypes.object,
  from: PropTypes.string,
  to: PropTypes.string,
  physics: PropTypes.bool,
  setOption: PropTypes.func,
  points: PropTypes.array,
  network: PropTypes.object,
  setIdSelectNode: PropTypes.func,
};
LeftNav.defaultProps = {
  options: {},
  from: '',
  to: '',
  physics: true,
  setOption: () => {},
  points: [],
  network: {},
  setIdSelectNode: () => {},
};
const LeftContainer = connect(mapStateToProps, mapDispatchToProps)(LeftNav);
export default LeftContainer;
