import { useEffect, useRef } from 'react';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer';
import { inject, observer } from 'mobx-react';
const LazyDropDownComponent = getRenderer('lazydropdown');
import { find } from 'lodash';

const AlternativeColorAdd = (props) => {
  const addByFabric = (f) => {
    f = parseInt(f);
    const toAdd: any = [];
    const fabric = find(props.userStore.allData.fabrics, (r) => r.id === f);

    props.userStore.allData.colors.forEach((c: any) => {
      if (c.fabric === f) {
        toAdd.push({ color: c.id, name: `${fabric ? fabric.name : '--'} > ${c.name}` });
      }
    });
    props.bulkAdd(toAdd);
  };

  return (
    <div className="" style={{ width: '350px' }}>
      Добавить все из ткани..
      <LazyDropDownComponent
        initialValue={''}
        placeholder={'Выбрать'}
        setValue={(name, v) => addByFabric(v)}
        options={{
          resource: {
            url: '/lookups/fabrics',
            value: 'id',
            label: 'name',
          },
        }}
      />
    </div>
  );
};

const Wrapped = inject('userStore')(observer(AlternativeColorAdd));

const full = (props) => {
  return <Wrapped {...props} />;
};
export default full;
