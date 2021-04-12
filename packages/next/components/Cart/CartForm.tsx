import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Form, FormGroup, Input, Card, CardHeader, Row, Button, Col, CardBody } from 'reactstrap';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer/index';
import OrderStore from '@pdeals/next/stores/orderStore';
import { useState } from 'react';

interface IProps {
  orderStore?: OrderStore;
}

const CartForm = (props: IProps) => {
  const orderStore = props.orderStore!;
  const { cart } = orderStore;
  const [sending, setSending] = useState(false);
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
    },
  };
  const { register: register1, handleSubmit: handleSubmit1, setValue, watch, reset, ...rest } = useForm(formOptions);
  const onSubmit = async (values: any) => {
    setSending(true);
    try {
      const response = await orderStore.send({
        data: values,
        lang: i18n.currentLang(),
        cart: cart,
      });
      if (response.status === 'ok') {
        router.push('/checkout/thanks');
      } else {
        throw new Error('Please contact administrator :(');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };
  const handleSave = (event) => {
    event.preventDefault();
    handleSubmit1(onSubmit)();
  };

  const Input = getRenderer('text');

  return (
    <Card className="w-100">
      <CardBody>
        <Form onSubmit={handleSave} className="d-flex flex-wrap">
          <Input
            label={i18n.t(`[R:Имя][U:Ім'я]`)}
            innerRef={register1({ required: true })}
            name="firstName"
            class="col-12 col-lg-6"
          />
          <Input
            label={i18n.t(`[R:Фамилия][U:Прізвище]`)}
            innerRef={register1({ required: true })}
            name="lastName"
            class="col-12 col-lg-6"
          />
          <Input
            label={i18n.t(`[R:E-mail][U:E-mail]`)}
            innerRef={register1({ required: true })}
            name="email"
            class="col-12 col-lg-6"
          />
          <Input
            label={i18n.t(`[R:Телефон][U:Телефон]`)}
            innerRef={register1({ required: true })}
            name="phone"
            class="col-12 col-lg-6"
          />
          <Input
            label={i18n.t(`[R:Город][U:Місто]`)}
            innerRef={register1({ required: true })}
            name="city"
            class="col-12 col-lg-6"
          />
          <Input
            label={i18n.t(`[R:Доставка][U:Доставка]`)}
            innerRef={register1({ required: true })}
            name="delivery"
            class="col-12 col-lg-6"
          />
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
              type="submit"
              size="lg"
              className={`order-button ${sending ? '' : ''}`}
              disabled={!!sending}
            >
              {sending
                ? i18n.t('[R:Шлем заказ...][U:Надсилаємо замовлення...]')
                : i18n.t('[R:Оформить заказ][U:Оформити замовлення]')}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};
export default inject('orderStore')(observer(CartForm));
