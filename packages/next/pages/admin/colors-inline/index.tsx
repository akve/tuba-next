import AdminFullLayout from '@pdeals/next/components/layouts/AdminFullLayout';
import { useRouter } from 'next/router';
import { Modal, Form, FormGroup, Input, Card, CardHeader, Row, Button, Col, CardBody } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { client } from '@pdeals/next/lib/api/api-client';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { sortBy, find, filter } from 'lodash';
import arrayMove from 'array-move';
import * as i18n from '@pdeals/next/utils/i18n';
import EditColorForm from '@pdeals/next/components/EditColorForm/EditColorForm';
import { EditableTable } from '@pdeals/next/components/EditableTable/EditableTable';

const ColorsInline: React.FunctionComponent = () => {
  const [allData, setAllData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFabric, setSelectedFabric] = useState<string>('0');

  const handleToggleModal = (id?) => {
    setIsOpen(!isOpen);
  };

  const loadData = async (fabric?) => {
    const alldata: any = await client().get('/open/alldata');
    alldata.colors = filter(alldata.colors, (r) => {
      if (fabric && fabric == '-1') return !r.fabric;
      return fabric && parseInt(fabric) ? `${r.fabric}` === `${fabric}` : true;
    });
    alldata.colors = sortBy(alldata.colors, (r) => (r.fabric || 0) * 10000 + r.id);
    setAllData(alldata);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!allData) return null;

  const fabricOptions = allData.fabrics;
  const onSave = async (v, item) => {
    await client().put(`/general/crud/color/${item.id}`, { [item.name]: item.value });
  };
  const onStartAdd = () => {
    handleToggleModal();
  };
  const onChangeFabric = (e) => {
    setSelectedFabric(e.target.value);
    loadData(e.target.value);
  };

  return (
    <AdminFullLayout>
      <Card className="bg-secondary shadow organizer">
        <div>
          Показать только..
          <select value={selectedFabric} onChange={onChangeFabric}>
            <option value={0}>Все</option>
            <option value={-1}>--</option>
            {fabricOptions.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex">
          <EditableTable
            class="wide-table"
            data={allData.colors}
            key={allData.colors.length}
            columns={[
              { name: 'fabric', field: { type: 'select', options: fabricOptions }, label: 'Ткань' },
              { name: 'name', label: 'Имя' },
              { name: 'image', label: 'Картинка' },
            ]}
            onChange={(v, i) => onSave(v, i)}
            additionalOptions={{ hideDelete: true, overrideAdd: onStartAdd }}
          />
        </div>
      </Card>
      <Modal isOpen={isOpen} toggle={handleToggleModal} className="modal-dialog-centered modal-secondary modal-big">
        <Row className="row-grid justify-content-center">
          <EditColorForm
            id={0}
            afterSave={() => {
              console.log('closing');
              setIsOpen(false);
              loadData();
            }}
          />
        </Row>
      </Modal>
    </AdminFullLayout>
  );
};

export default ColorsInline;
