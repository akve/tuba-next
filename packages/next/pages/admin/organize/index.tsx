import AdminFullLayout from '@pdeals/next/components/layouts/AdminFullLayout';
import { useRouter } from 'next/router';
import { Modal, Form, FormGroup, Input, Card, CardHeader, Row, Button, Col, CardBody } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { client } from '@pdeals/next/lib/api/api-client';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { sortBy, find, filter } from 'lodash';
import arrayMove from 'array-move';
import * as i18n from '@pdeals/next/utils/i18n';
import EditProductForm from '@pdeals/next/components/EditProductForm/EditProductForm';

// type Props = {};

const SortableItem = SortableElement(({ value, onSelect, active }) => (
  <li tabIndex={0} className={active === value.id ? 'active' : ''}>
    <a
      onClick={(e) => {
        console.log('????????');
        e.preventDefault();
        onSelect(value.id);
      }}
    >
      {i18n.t(value.name)}
    </a>
  </li>
));

const SortableList = SortableContainer(({ items, onSelect, active }) => {
  return (
    <ul className="categories">
      {items.map((value, index) => (
        <SortableItem key={`item-${value.id}`} active={active} onSelect={onSelect} index={index} value={value} />
      ))}
    </ul>
  );
});

const SortableItemProduct = SortableElement(({ value, onSelect, active }) => (
  <li tabIndex={0} className={active === value.id ? 'active' : ''}>
    <a
      onClick={(e) => {
        console.log('????????');
        e.preventDefault();
        onSelect(value.id);
      }}
    >
      {i18n.t(value.name)}
    </a>
  </li>
));

const SortableListProducts = SortableContainer(({ items, onSelect, active }) => {
  return (
    <ul className="categories">
      {items.map((value, index) => (
        <SortableItemProduct key={`item-${value.id}`} active={active} onSelect={onSelect} index={index} value={value} />
      ))}
    </ul>
  );
});

const Organizer: React.FunctionComponent = () => {
  const [allData, setAllData] = useState<any>(null);
  const [category, setCategory] = useState<any>(0);
  const [products, setProducts] = useState<any>(null);
  const [sortedCategories, setSortedCategories] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<number>(0);

  const handleToggleModal = (id) => {
    setIsOpen(isOpen ? 0 : id);
  };

  const loadData = async () => {
    const alldata: any = await client().get('/open/alldata');
    setSortedCategories(sortBy(alldata.categories.rows, (r) => r.sorter));
    const c = find(alldata.categories.rows, (r) => r.code === 'featured').id;
    onSetCategory(c, alldata.products);
    setAllData(alldata);
  };

  const resortProducts = async (params) => {
    const item = products[params.oldIndex];
    const newIndex = params.newIndex;
    let newSorter = parseFloat(item.sorter);
    if (newIndex === 0) {
      newSorter = parseFloat(products[0].sorter) / 2;
    } else if (newIndex === products.length - 1) {
      newSorter = parseFloat(products[products.length - 1].sorter) + 1;
    } else {
      newSorter = (parseFloat(products[newIndex].sorter) + parseFloat(products[newIndex + 1].sorter)) / 2;
    }
    await client().put(`/general/crud/product/${item.id}`, { sorter: newSorter });
    setProducts(arrayMove(products, params.oldIndex, newIndex));
  };

  const resortCategories = async (params) => {
    const item = sortedCategories[params.oldIndex];
    const newIndex = params.newIndex;
    let newSorter = parseFloat(item.sorter);
    console.log('?', item, newIndex, newSorter);
    if (newIndex === 0) {
      newSorter = parseFloat(sortedCategories[0].sorter) / 2;
    } else if (newIndex === sortedCategories.length - 1) {
      newSorter = parseFloat(sortedCategories[sortedCategories.length - 1].sorter) + 1;
    } else {
      newSorter =
        (parseFloat(sortedCategories[newIndex].sorter) + parseFloat(sortedCategories[newIndex + 1].sorter)) / 2;
    }
    await client().put(`/general/crud/category/${item.id}`, { sorter: newSorter });
    setSortedCategories(arrayMove(sortedCategories, params.oldIndex, newIndex));
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSetCategory = (id, theProducts?) => {
    setCategory(id);
    let prods = filter(theProducts || allData.products, (product) => {
      return !!find(product.data.categories, (r) => `${r.category}` === `${id}`);
    });
    prods = sortBy(prods, (r) => r.sorter);
    setProducts(prods);
  };

  if (!allData) return null;

  const onClickProduct = (id) => {
    setIsOpen(id);
  };
  return (
    <AdminFullLayout>
      <Card className="bg-secondary shadow organizer">
        <div className="d-flex">
          <div className="col-4">
            <SortableList
              distance={1}
              lockAxis="y"
              items={sortedCategories}
              onSortEnd={resortCategories}
              active={category}
              onSelect={(id) => onSetCategory(id)}
            />
          </div>
          <div className="col-8">
            <SortableListProducts
              distance={1}
              lockAxis="y"
              items={products}
              onSortEnd={resortProducts}
              onSelect={(id) => onClickProduct(id)}
            />
          </div>
        </div>
      </Card>
      <Modal isOpen={!!isOpen} toggle={handleToggleModal} className="modal-dialog-centered modal-secondary modal-big">
        <Row className="row-grid justify-content-center">
          <EditProductForm
            id={isOpen}
            afterSave={() => {
              console.log('closing');
              setIsOpen(0);
            }}
          />
        </Row>
      </Modal>
    </AdminFullLayout>
  );
};

export default Organizer;
