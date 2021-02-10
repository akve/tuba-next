import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import UserStore from '../../../stores/userStore';
import { useRouter } from 'next/router';
import XLSX from 'xlsx';
import { FileDrop } from '@pdeals/next/elements/FileUpload/FileDrop';
import FileUpload from '@pdeals/next/elements/FileUpload/FileUpload';
import { Form, FormGroup, Label, Input, Table, Card, CardHeader, Row, Col, CardBody } from 'reactstrap';
import { addNotification } from '@pdeals/next/utils/notifications';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
interface IProps {
  onProceed: any;
}

function ImportStep1(props: IProps) {
  const [data, setData] = useState<any>(null);
  const handleFile = (file: File) => {
    /* Boilerplate to set up FileReader */
    try {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
        try {
          /* Parse data */
          if (!e.target || !e.target.result) throw new Error('No file');
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */

          const data = XLSX.utils.sheet_to_json(ws, { header: 0 });
          const cols = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
          /* Update state */
          const preview: any = [];
          data.forEach((row, index) => {
            if (index < 5) preview.push(row);
          });
          setData({ data, cols, preview });
        } catch (e) {
          addNotification('error', '', `Error with your file: ${e.message}`);
        }
        //console.log({ data: data, cols, preview }); //cols: make_cols(ws['!ref'])
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    } catch (e) {
      addNotification('error', '', `Error with your file: ${e.message}`);
    }
  };

  const onUpload = (files: any) => {
    handleFile(files[0]);
  };

  return (
    <Card className="bg-secondary shadow">
      <Form>
        <CardHeader className="bg-white border-0">
          <Row className="align-items-center">
            <Col xs="8">
              <h3 className="mb-0">Step 1: Upload</h3>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <FileUpload onUpload={onUpload} />
          {!!data && (
            <div>
              <h3>Data preview</h3>
              <h4>Total rows: {data.data.length}</h4>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {data.cols.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.preview.map((row, index) => (
                    <tr key={`${index}`}>
                      {Object.keys(row).map((col, index) => (
                        <td key={`${index}`}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div style={{ textAlign: 'center' }}>
                <a
                  className="btn btn-primary"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => props.onProceed(data, data.cols)}
                >
                  <i className="fa fa-arrow-right" /> Next
                </a>
              </div>
            </div>
          )}
        </CardBody>
      </Form>
    </Card>
  );
}

export default ImportStep1;
