import React from 'react';
import Row from 'react-bootstrap/Row';

const TableAnalytics = (props) => {

  const {  } = props;
 

  return (
    <>
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
          <Form.Label className="me-sm-2 text-primary" htmlFor="inlineFormCustomSelect">
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
    </>
  );
};

export default TableAnalytics;
