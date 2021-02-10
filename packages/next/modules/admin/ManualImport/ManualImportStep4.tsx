import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Table, Card, CardHeader, Row, Col, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import dateFormat from 'date-fns/format';
import { ILookup } from '@pdeals/models/lookups/ILookup';
import { IMapping, KNOWN_COLS_LABELS, PREDEFINED_COLS } from '@pdeals/models/dto/ManualImportDto';
import { addNotification } from '@pdeals/next/utils/notifications';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
interface IProps {
  data: any;
  config: any;
  onProceed: any;
  mapping: IMapping;
}

function ImportStep4(props: IProps) {
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    await props.onProceed();
    addNotification('success', '', `Import finished`);
    setLoading(false);
  };

  return (
    <Card className="bg-secondary shadow">
      <Form>
        <CardHeader className="bg-white border-0">
          <Row className="align-items-center">
            <Col xs="8">
              <h3 className="mb-0">Step 4: Confirm</h3>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <div className="pl-lg-12">
            <p>Seems like we're good to go.</p>
            <p>
              You are about to upload ~ <b>{props.data.data.length}</b> records
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <a
              className={`btn btn-primary ${loading && 'disabled'}`}
              style={{ marginLeft: 'auto' }}
              onClick={() => handleSave()}
            >
              <i className="fa fa-arrow-right" /> Import
            </a>
          </div>
        </CardBody>
      </Form>
    </Card>
  );
}

export default ImportStep4;
