import React, { useEffect, useState } from 'react';
import { Input, Button, Modal, Row, Col } from 'reactstrap';
import { mergeOrphaned } from '@pdeals/next/lib/services/roomsService';
import { getUsers } from '@pdeals/next/lib/services/userService';
import { addNotification } from '@pdeals/next/utils/notifications';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer/index';
import { DateInput } from '@pdeals/next/elements/DateInput';

interface IProps {
  from: number;
  fromName: string;
  onClose: () => void;
}
export const MergeOrphanedUserModal = (props: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [rooms, setRooms] = useState<any>(null);
  const [selected, setSelected] = useState('');
  const [percent, setPercent] = useState(20);
  const [updateFromDate, setUpdateFromDate] = useState(new Date(new Date().getTime() - 86400 * 1000).toISOString());

  const onMerge = async () => {
    await mergeOrphaned(props.from, parseInt(selected), percent, updateFromDate);
    addNotification('success', '', 'Merged');
    props.onClose();
  };

  const handleToggleModal = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    props.onClose();
  };
  const loadData = async () => {
    const roomsDb = await getUsers();
    setRooms(
      roomsDb.map((r) => {
        return { label: `${r.firstName} ${r.lastName}`, value: r.id };
      })
    );
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleSelect = (name, value) => {
    setSelected(value);
  };

  const DropDownComponent = getRenderer('lazydropdown');
  return (
    <>
      <Modal isOpen={isOpen} toggle={handleToggleModal} className="modal-dialog-centered modal-secondary">
        <Row className="row-grid justify-content-center">
          <Col className="text-center" style={{ marginLeft: '20px', marginRight: '20px', marginBottom: '20px' }}>
            <h1>Assign orphaned alias</h1>
            <h3>{props.fromName} =&gt; </h3>
            <DropDownComponent
              class=""
              label="User"
              name="user"
              setValue={handleSelect}
              innerRef={null}
              options={{
                resource: {
                  url: '/lookups/users',
                  value: 'id',
                  label: 'name',
                },
              }}
            />
            <br />
            <label className="form-control-label">Player Deal %</label>
            <Input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} />
            <br />
            <label className="form-control-label">Update data starting from date</label>
            <DateInput initialValue={updateFromDate} setValue={(v) => setUpdateFromDate(v)} />
            <div>
              <Button color="default" type="button" onClick={onMerge}>
                Merge
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
