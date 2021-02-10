import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import { ICrud, IFormField } from '@pdeals/next/components/Crud/ICrud';
import { useRouter } from 'next/router';
import {
  Nav,
  NavItem,
  NavLink,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  Row,
  Button,
  Col,
  CardBody,
} from 'reactstrap';

interface IProps {
  currentLanguage: string;
  languages: any[];
  onChange: any;
}

function TranslationSwitch(props: IProps) {
  const router = useRouter();

  return (
    <Nav tabs style={{ width: '100%' }}>
      {props.languages.map((language: any) => (
        <NavItem key={language.code}>
          <NavLink
            className={props.currentLanguage === language.code ? 'active' : ''}
            onClick={() => props.onChange(language.code)}
          >
            {language.name}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
}

export default TranslationSwitch;
