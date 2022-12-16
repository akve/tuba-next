import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Form, FormGroup, Input, Card, CardHeader, Row, Button, Col, CardBody } from 'reactstrap';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer/index';
import OrderStore from '@pdeals/next/stores/orderStore';
import { useState } from 'react';
import CartSmallPreview from '@pdeals/next/components/Cart/CartSmallPreview';
import UiStore from '@pdeals/next/stores/uiStore';
import RegisterLazyDropDown from '@pdeals/next/components/registerFormRenderer/LazyDropDown';

interface IProps {
  orderStore?: OrderStore;
  uiStore?: UiStore;
}

const CartForm = (props: IProps) => {
  const orderStore = props.orderStore!;
  const { cart } = orderStore;
  const [sending, setSending] = useState(false);
  const [skipPay, setSkipPay] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const formOptions = {
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      delivery: '',
      city: '',
      comments: '',
      delivery_type: 'np',
      delivery_np: '',
      delivery_warehouse: '',
    },
  };

  const { register: register1, handleSubmit: handleSubmit1, setValue, watch, reset, ...rest } = useForm(formOptions);

  const addFBPixel = (id) => {
    window.dataLayer = window.dataLayer || [];

    const items = [];
    console.log('P', cart.products);
    cart.products.forEach(p => {
      items.push({
        'item_name': `${i18n.t(p.name)}`,       // Name or ID is required.
        'item_id': `${p.code}`,				  // id під яким товар лежить у базі
        'price': `${p.pricediscount || p.price}`,
        'item_brand': 'Tuba Duba',
        'item_category': i18n.t('Сукня'),
        'index': 1,
        'quantity': `${p.amount}`
      });
    });

    window.dataLayer.push({
      'event': 'purchase',
      'ecommerce': {
        'transaction_id': `${id}`,
        'value': total,						  // Тотал по замовленню
        'currency': 'UAH',
        items
      }
    });
  }

  const onSubmit = async (values: any, skip) => {
    if (!values.phone || !values.phone.trim()) {
      setError(i18n.t('[R:Введите телефон][U:Введіть телефон]'));
      return;
    }
    if (values.delivery_type === 'np' && !values.delivery_warehouse) {
      setError(i18n.t('[R:Выберите отделение НП][U:Оберіть відділення НП]'));
      return;
    }
    values.delivery = values.delivery_warehouse;
    console.log(values);
    setSending(true);
    try {
      const response: any = await orderStore.send({
        data: values,
        lang: i18n.currentLang(),
        cart: cart,
      });

      if (response && response.id) {
        addFBPixel(response.id);
        if (skip) {
          orderStore.clear();
          router.push(`/checkout/thanks`);
        } else {
          const redirect: any = await orderStore.getPaymentRedirect(response.id);
          if (redirect?.response?.checkout_url) {
            router.push(redirect?.response?.checkout_url);
          }
        }
      } else {
        throw new Error('Please contact administrator :(');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };
  const handleSave = (skip, event?) => {
    if (event) {
      event.preventDefault();
    }
    setSkipPay(skip);
    handleSubmit1((v) => onSubmit(v, skip))();
  };

  const Input = getRenderer('text');
  const Radio = getRenderer('radio');
  const deliveryType = watch('delivery_type');
  const Dropdown = getRenderer('asyncdropdown');

  const total = cart.products.reduce((sum, product) => sum + product.price * product.amount, 0);

  const getNPAreaOptions = () => {
    return {
      resource: {
        url: '/delivery/cities',
        value: 'value',
        label: 'label',
      },
      alsoSetLabelTo: 'city',
    };
  };
  const city = watch('delivery_np');

  const getNPWHOptions = () => {
    return {
      resource: {
        url: `/delivery/warehouses/${city}`,
        value: 'value',
        label: 'label',
      },
    };
  };

  const goBack = () => {
    router.push('/checkout');
  };



  return (
    <Card className="w-100">
      <CardBody>
        <CartSmallPreview allData={props.uiStore!.allData} />
        <h2 style={{ marginLeft: '20px', marginTop: '10px' }}>{i18n.t('[U:Доставка][R:Доставка]')}</h2>
        <Form onSubmit={() => {}} className="d-flex flex-wrap">
          <Input
            label={i18n.t(`[R:Имя][U:Ім'я] *`)}
            innerRef={register1({ required: true })}
            name="firstName"
            class="col-12 col-lg-6"
          />
          <Input
            label={i18n.t(`[R:Фамилия][U:Прізвище] *`)}
            innerRef={register1({ required: true })}
            name="lastName"
            class="col-12 col-lg-6"
          />
          <Input
            label={i18n.t(`[R:E-mail][U:E-mail] *`)}
            innerRef={register1({ required: true })}
            name="email"
            class="col-12 col-lg-6"
          />
          <Input
            label={i18n.t(`[R:Телефон][U:Телефон] *`)}
            innerRef={register1({ required: true })}
            name="phone"
            class="col-12 col-lg-6"
          />
          <h4 className="w-100" style={{ marginLeft: '20px' }}>
            {i18n.t('Доставка')}
          </h4>
          <div className="d-flex w-50">
            <Radio
              name="delivery_type"
              label={i18n.t(`[R:Новая почта][U:Нова Пошта]`)}
              innerRef={register1({ required: true })}
              class="col-6"
              value="np"
            ></Radio>
            <Radio
              name="delivery_type"
              label={i18n.t(`[R:Что-то другое(в комментарии)][U:Щось інше (в комментарі)]`)}
              innerRef={register1({ required: true })}
              class="col-6"
              value="other"
            ></Radio>
          </div>
          {deliveryType === 'np' && (
            <div className="w-100" style={{ marginLeft: '15px', marginBottom: '15px' }}>
              <Input label={i18n.t(`[R:city][U:city]`)} innerRef={register1()} name="city" class="d-none" />
              <Dropdown
                label={i18n.t('[R:Город][U:Місто]')}
                name={`delivery_np`}
                innerRef={register1({})}
                options={getNPAreaOptions()}
                class="input-group-sm mb-0"
                setValue={(n, v) => {
                  setValue(n, v);
                }}
              />
              <Dropdown
                label={i18n.t('[R:Отделение][U:Вiддiлення]')}
                name={`delivery_warehouse`}
                innerRef={register1({})}
                options={getNPWHOptions()}
                class="input-group-sm mb-0"
                setValue={(n, v) => setValue('delivery_warehouse', v)}
              />
            </div>
          )}
          <Input
            label={i18n.t(`[R:Комментарии][U:Коментар]`)}
            innerRef={register1({ required: false })}
            name="comments"
            class="col-12"
          />
          {!!error && <div className="text-red">{error}</div>}
          <div className="col-12">
            <Button
              color="primary"
              type="button"
              size="lg"
              className={`order-button ${sending ? '' : ''}`}
              disabled={!!sending}
              onClick={() => handleSave(false)}
            >
              {sending
                ? i18n.t('[R:Шлем заказ...][U:Надсилаємо замовлення...]')
                : i18n.t('[R:Оформить заказ][U:Оформити замовлення і сплатити]')}
            </Button>
            <Button
              color="secondary"
              type="button"
              size="lg"
              className={`order-button`}
              disabled={!!sending}
              onClick={goBack}
            >
              {i18n.t('[R:Отредактировать заказ][U:Відредагувати замовлення]')}
            </Button>
          </div>
          <div className="col-12 mt-2">
            <Button
              size="sm"
              color="primary"
              className={`order-button ${sending ? '' : ''}`}
              disabled={!!sending}
              onClick={() => handleSave(true)}
            >
              {sending
                ? i18n.t('[R:Шлем заказ...][U:Надсилаємо замовлення...]')
                : i18n.t('[R:Хочу сплатити після спілкування з менеджером][U:Хочу сплатити після спілкування з менеджером]')}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};
export default inject('orderStore', 'uiStore')(observer(CartForm));
