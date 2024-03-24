import Accordion from 'react-bootstrap/Accordion';
import {useSelector} from 'react-redux';
import style from './EvantsPage.module.css'

function EventsPage() {
  const {events} = useSelector(store => store.files);
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="1">
        <Accordion.Header>События</Accordion.Header>
        <Accordion.Body className={style.item}>
          {
            events.map((item, i) => <p key={i}>{++i +'. '+ item}</p>)
          }
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default EventsPage;