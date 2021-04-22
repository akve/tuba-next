import { useEffect, useRef } from 'react';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer';
import { inject, observer } from 'mobx-react';
const LazyDropDownComponent = getRenderer('lazydropdown');

const AlternativeColorAdd = (props) => {
  const addByFabric = (f) => {
    f = parseInt(f);
    const toAdd = [];
    props.userStore.allData.colors.forEach((c) => {
      if (c.fabric === f) toAdd.push({ color: c.id, name: c.name });
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
