import { useEffect, useState, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';
import { CrudApi } from '@pdeals/next/lib/api/crud-api';
import { BlockSpinner } from '@pdeals/next/elements/BlockSpinner';
import CrudForm from '@pdeals/next/components/Crud/CrudForm/CrudForm';
import { useNotification } from '@pdeals/next/lib/hooks';
import { getLanguages } from '@pdeals/next/lib/services/languageService';
import TranslationSwitch from './TranslationSwitch';
import { useRouter } from 'next/router';
import { get } from 'lodash';

interface IProps {
  params: ICrud;
  id?: number;
}

const DEFAULT_LANG = 'en';

function CrudFormWrapper(props: IProps) {
  //  let registeredSubmitFunction: any = null;
  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [languages, setLanguages] = useState<any>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>(DEFAULT_LANG);
  const { notify } = useNotification();
  const router = useRouter();

  const transformEntityToForm = (entity: any, language?: string): Record<string, any> => {
    const values = {};
    props.params.form.fields.forEach((field) => {
      if (!language || language === DEFAULT_LANG || !field.canBeTranslated) {
        values[field.name] = entity[field.name] || null;
      } else {
        const langValues = get(entity, `data.langs.${language}`, {});
        values[field.name] = langValues[field.name] || null;
      }
    });
    return values;
  };

  const loadData = useCallback(async () => {
    if (props.params.translatableEntity) {
      const langs = await getLanguages();
      setLanguages(langs);
    }
    if (props.id) {
      const d = await CrudApi(props.params).getObject(props.id);
      setFormData(transformEntityToForm(d));
      setData(d);
    } else {
      setFormData({});
      setData({});
    }
  }, [props.params.apiUrlPrefix, props.id]);

  const filterOnlyLanguage = (values: any): any => {
    const filtered: any = {};
    props.params.form.fields.forEach((field) => {
      if (field.canBeTranslated) {
        filtered[field.name] = values[field.name] || null;
      }
    });
    return filtered;
  };

  const handleSubmit = async (values: any, forLanguage?: string) => {
    let notificationMessage = '';
    const savingLanguage = forLanguage || currentLanguage;
    try {
      const api = CrudApi(props.params);
      if (props.id) {
        let d = null;
        if (props.params.translatableEntity && savingLanguage !== DEFAULT_LANG) {
          const newData = { ...data };
          if (!newData.data.langs) newData.data.langs = {};
          newData.data.langs[savingLanguage] = filterOnlyLanguage(values);
          await api.save(props.id, { data: newData.data });
        } else {
          if (props.params.options && props.params.options.formPreSaveFunction) {
            values = await props.params.options.formPreSaveFunction(props.id, values);
          }
          api.save(props.id, values);
        }
        if (!props.params.translatableEntity) {
          loadData();
        }
        notificationMessage = 'Item has been changed!';
        notify('success', 'Success', notificationMessage);
      } else {
        if (props.params.options && props.params.options.formPreSaveFunction) {
          values = await props.params.options.formPreSaveFunction(0, values);
        }
        const e: any = await api.create(values);
        notificationMessage = 'Item has been created!';
        notify('success', 'Success', notificationMessage);
        router.push(`${props.params.uiUrlPrefix}/${e.id}/edit`);
      }
    } catch (error) {
      notify('danger', error.name, error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const reload = async (code: string) => {
    const d = await CrudApi(props.params).getObject(props.id);
    setFormData(transformEntityToForm(d, code));
  };

  const onLanguageChange = async (code: string, values: any) => {
    console.log('Should save and switch to', code, values);
    await handleSubmit(values);
    setCurrentLanguage(code);
    await reload(code);
  };

  if (!data || !formData) return <BlockSpinner />;
  return (
    <CrudForm
      loadData={loadData}
      params={props.params}
      data={data}
      initialData={formData}
      onSubmit={handleSubmit}
      languages={languages}
      currentLanguage={currentLanguage}
      onLanguageChange={onLanguageChange}
    />
  );
}

export default inject('userStore')(observer(CrudFormWrapper));
