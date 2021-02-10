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
  // userStore: UserStore;
}

function RawDataView(props: IProps) {
  const [list, setList] = useState<any>(null);
  const loadData = async () => {
    //try {
    const d = await client().get(`/crawlers/data/${props.crawlId}`);
    setList(d);
    //} catch (e) {}
  };
  useEffect(() => {
    loadData();
  }, []);

  if (!list) return null;

  const parseList = () => {
    const csv = readString(list.data.raw.trim(), { delimiter: ';', header: true });
    console.log(csv);
    const siteRoomsDefinitions = list.site && list.site.data && list.site.data.rooms ? list.site.data.rooms : [];
    csv.data.forEach((row: any) => {
      if (siteRoomsDefinitions.find((r: any) => r.room === row.Skin)) {
        row.foundRoom = true;
      }
    });
    return csv;
  };
  const parsed: any = parseList();

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          {parsed.meta.fields.map((fld: any) => (
            <th>{fld}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {parsed.data.map((row: any, rowIndex) => (
          <tr key={rowIndex} style={row.foundRoom ? { backgroundColor: '#d0ffd0' } : {}}>
            {parsed.meta.fields.map((fld: any, fldIndex) => (
              <td key={fldIndex}>{row[fld]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default inject('userStore')(observer(RawDataView));
