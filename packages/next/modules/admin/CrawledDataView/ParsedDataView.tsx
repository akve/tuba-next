import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import AdminFullLayout from '@pdeals/next/components/layouts/AdminFullLayout';
// import Link from 'next/link';
import { client } from '@pdeals/next/lib/api/api-client';
import { Row, Col, Table, Card, CardHeader } from 'reactstrap';
import { useRouter } from 'next/router';
import { readString } from 'react-papaparse';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
interface IProps {
  crawlId: number;
  mode: string;
  // userStore: UserStore;
}

function ParsedDataView(props: IProps) {
  const [list, setList] = useState<any>(null);
  const loadData = async () => {
    //try {
    const d = await client().get(`/crawlers/data/parsed/${props.crawlId}?mode=${props.mode}`);
    setList(d);
    //} catch (e) {}
  };
  useEffect(() => {
    loadData();
  }, []);

  if (!list) return null;

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          {list.fields.map((fld: any) => (
            <th>{fld}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {list.data.map((row: any, rowIndex) => (
          <tr key={rowIndex}>
            {list.fields.map((fld: any, fldIndex) => (
              <td key={fldIndex}>{row[fld]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default inject('userStore')(observer(ParsedDataView));
