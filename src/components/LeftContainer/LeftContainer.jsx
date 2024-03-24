/* eslint-disable array-callback-return */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { actionCreatorSetOption } from '../../redux/options_reducer';
import "./LeftContainer.css";
import { actionCreatorIdSelectNode } from '../../redux/vis_reducer';

export const LeftContainer = () => {
  const { nodes, networkLink } = useSelector(store => store.vis);
  const { startTime, endTime, physics, mutualСonnections } = useSelector(store => store.options); 
  const dispatch = useDispatch();
  const setOption = (name, value) => dispatch(actionCreatorSetOption(name, value));
  const setIdSelectNode = id =>  dispatch(actionCreatorIdSelectNode(id));

  const [arrSelect, setArrSelect] = useState([]);

  const handleChange = (event) => setOption(event.target.name, event.target.value);
  const handleCheck = (event) => setOption(event.target.name, event.target.checked);
  const handleSelect = (event) =>  setOption(event.target.name, parseInt(event.target.value));
  const handleSearch  = (event) =>  {
    let str = event.target.value;
    if(str.length > 6) {
      let res = nodes.filter(item => {
        if(item["label"].indexOf(str) > -1) return item;
      })
      setArrSelect(res);
    } else{
      setArrSelect([])
    }
  }
  const handleClickEl  = (event) =>  {
    let str = event.target.innerHTML;
    let res = nodes.find(item => {
      if(item["label"].indexOf(str) > -1) return item;
    })
    networkLink.selectNodes([res["id"]]);
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
