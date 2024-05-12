import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { 
  getDataFilesThunkCreater
} from '../../../redux/files';

export const SelectDirectory = () => {
  const dispatch = useDispatch();
  return(
    <Form>  
      <Row className="d-flex align-items-end flex-row"> 
        <Col xs="auto" className="my-1">
          <Form.Control
            size="sm"
            type="file"
            multiple
            directory=""
            webkitdirectory=""
            onChange={(e) => dispatch(getDataFilesThunkCreater(e.target.files))}
          />
        </Col>
      </Row>
    </Form>
  )
}