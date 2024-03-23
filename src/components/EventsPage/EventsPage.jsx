import Accordion from 'react-bootstrap/Accordion';
import {useSelector} from 'react-redux';

function EventsPage() {
  const {events} = useSelector(store => store.files);
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="1">
        <Accordion.Header>События</Accordion.Header>
        <Accordion.Body>
          {
            events.map((item, i) => {
              return <p key={i}>{i +'. '+ item}</p>
            })
          }
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default EventsPage;