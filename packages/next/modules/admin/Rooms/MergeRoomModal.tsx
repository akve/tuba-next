import React, { useEffect, useState } from 'react';
import {
    Input,
    Button,
    Modal,
    Row,
    Col,
} from 'reactstrap';
import { getRooms, mergeRooms } from '@pdeals/next/lib/services/roomsService';
import { addNotification } from '@pdeals/next/utils/notifications';

interface IProps {
    from: number;
    fromName: string;
    onClose: () => void;
}
export const MergeRoomModal = (props: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [rooms, setRooms] = useState<any>(null);
  const [selected, setSelected] = useState('');

  const onMerge = async () => {
      await mergeRooms(props.from, parseInt(selected));
      addNotification('success', '', 'Merged');
      props.onClose();
  }

  const handleToggleModal = () => {
      setIsOpen((prevIsOpen) => !prevIsOpen);
      props.onClose();
  }
  const loadData = async () => {
      const roomsDb = await getRooms();
      setRooms(roomsDb.map(r => {return {label: r.name, value: r.id}}));
  }
  useEffect(() => { loadData()}, []);

  return (
    <>
      <Modal isOpen={isOpen} toggle={handleToggleModal} className="modal-dialog-centered modal-secondary">
        <Row className="row-grid justify-content-center">
          <Col className="text-center" style={{marginLeft: '20px', marginRight:'20px', marginBottom:'20px'}}>
            <h1>Merge room</h1>
              <h3>{props.fromName} => </h3>
              <Input type="select" value={selected} onChange={(e)=> setSelected(e.target.value)}>
                  <option value=''>Select...</option>
                  {!!rooms && rooms!.map((r) => (
                      <option value={r.value}>{r.label}</option>
                  ))}
              </Input>
              <br/>
              <div>
                  <Button color="default" type="button" onClick={onMerge}>Merge</Button>
              </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
