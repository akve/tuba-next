import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { inject, observer } from 'mobx-react';
import { ICrud, IFormField } from '@pdeals/next/components/Crud/ICrud';
import { useRouter } from 'next/router';
import { Form, FormGroup, Input, Card, CardHeader, Row, Button, Col, CardBody } from 'reactstrap';
import TranslationSwitch from '@pdeals/next/components/Crud/CrudForm/TranslationSwitch';
import { getLanguages } from '@pdeals/next/lib/services/languageService';
import { CreateItem, DeleteItem } from '@pdeals/next/components/common/Actions';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer/index';

interface IProps {
  params: ICrud;
  data: any;
  initialData: Record<string, any>;
  onSubmit: (values: any) => void;
  languages: any[];
  currentLanguage: string;
  loadData: () => void;
  onLanguageChange: (code: string, values: any) => any;
  registerSubmit?: any;
}

function CrudForm(props: IProps) {
  const router = useRouter();
  const formOptions = {
    defaultValues: props.initialData,
  };
  const { register: register1, handleSubmit: handleSubmit1, setValue, watch, reset, errors, ...rest } = useForm(
    formOptions
  );
  const handleSave = (event) => {
    event.preventDefault();
    handleSubmit1(props.onSubmit)();
  };
  useEffect(() => {
    if (props.registerSubmit) {
      props.registerSubmit(handleSave);
    }
    props.params.form.fields.forEach((fld) => {
      if (fld.name.startsWith('data.')) {
        register1(fld.name, {});
      }
    });
  }, []);
  useEffect(() => {
    if (props.params.translatableEntity) reset(props.initialData);
  }, [props.initialData]);

  const onLanguageChange = async (code: string) => {
    console.log('Start it - 1 ', code);
    handleSubmit1((values: any) => props.onLanguageChange(code, values))();
  };
  const renderField = (field: IFormField, index: number) => {
    if (props.data.id && field.notEditable) return null;

    const fieldIsDisabled = props.params.translatableEntity && props.currentLanguage !== 'en' && !field.canBeTranslated;
    const fieldClass = `${field.class || ''} ${fieldIsDisabled ? 'form-group--disabled' : ''}`;
    if (field.type === 'heading') {
      return (
        <h6 key={`heading/${index}`} className="heading-small text-muted mb-4" style={{ width: '100%' }}>
          {field.label}
        </h6>
      );
    }

    const watchedValue = watch(field.name);
    if (field.type === 'custom' && field.component) {
      const { component: Component, ...fieldPprops } = field;
      return (
        <Component
          {...fieldPprops}
          name={fieldPprops.name}
          key={field.name + index}
          innerRef={register1({})}
          setValue={setValue}
          value={watchedValue}
          initialValue={props.initialData[field.name]}
          entityId={props.data.id}
          isEdit={!!props.data.id}
        />
      );
    }

    const Component = getRenderer(field.type);
    return Component ? (
      <Component
        key={field.name + index}
        {...field}
        class={fieldClass}
        innerRef={register1({})}
        setValue={setValue}
        value={watchedValue}
        initialValue={props.initialData[field.name]}
        entityId={props.data.id}
      />
    ) : null;
  };

  const renderForm = (fields: IFormField[]) => {
    return <>{fields.map((field, index) => renderField(field, index))}</>;
  };

  const actions = useMemo(() => {
    const callbacks = {
      refetch: props.loadData,
    };
    const actions = (props.data && (props.data.id ? props.params.editActions : props.params.createActions)) || [];
    return actions.map((Action, index) => (
      <Action key={`${index}`} params={props.params} data={props.data} callbacks={callbacks} />
    ));
  }, [props.data, props.params, props.loadData]);

  const handleGoBack = () => {
    if (props.data.id) {
      router.push(props.params.uiUrlPrefix);
    } else {
      router.back();
    }
  };

  return (
    <Card className="bg-secondary shadow">
      <Form onSubmit={handleSave}>
        <CardHeader className="bg-white border-0">
          <Row className="mb-2">
            <Col xs="3">
              {!(props.params.options && props.params.options.disableBack) && (
                <Button onClick={handleGoBack} color="light" type="button" size="sm">
                  Back
                </Button>
              )}
              <h3 className="mb-0 ml-3 d-inline-block">{props.data && props.data.id ? 'Edit' : 'Create'}</h3>
            </Col>
            <Col className="text-right" xs="9">
              {props.data.id && props.params.options?.isCreatable && (
                <CreateItem params={props.params} data={props.data} callbacks={{}} />
              )}
              {props.data.id && props.params.options?.isDeletable && (
                <DeleteItem
                  params={props.params}
                  data={props.data}
                  callbacks={{
                    refetch: props.loadData,
                    goBack: handleGoBack,
                  }}
                />
              )}
              <Button color="primary" type="submit" size="sm" onClick={handleSave}>
                Save
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="text-right">{actions}</Col>
          </Row>
        </CardHeader>
        <CardBody>
          <div className="pl-lg-4">
            {props.params.translatableEntity && (
              <Row>
                <TranslationSwitch
                  languages={props.languages}
                  currentLanguage={props.currentLanguage}
                  onChange={(code) => onLanguageChange(code)}
                />
              </Row>
            )}

            <Row>{renderForm(props.params.form.fields)}</Row>
          </div>
        </CardBody>
      </Form>
    </Card>
  );
}

export default inject('userStore')(observer(CrudForm));
