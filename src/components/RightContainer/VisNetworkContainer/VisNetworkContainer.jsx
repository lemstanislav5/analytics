import VisNetwork from './VisNetwork';




export const VisNetworkContainer = ()=>{
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
  return(
    <>
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
      <Row>
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
      </Row>
    </>
  )
}