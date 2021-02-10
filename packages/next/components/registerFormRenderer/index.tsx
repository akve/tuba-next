import RegisterBaseInput from './BaseInput';
import RegisterDropDown from './DropDown';
import RegisterCheckbox from './Checkbox';
import RegisterDate from './Date';
import RegisterTextRedactor from './TextRedactor';
import RegisterRange from './Range';
import RegisterLazyDropDown from './LazyDropDown';
import RegisterAttachment from './Attachment';
import RegisterRadio from './Radio';

const registeredRenderer: any = {};

export const registerRenderer = (key: string, component: any) => {
  registeredRenderer[key] = component;
};

export const getRenderer = (key: string): any => {
  return registeredRenderer[key];
};

RegisterBaseInput();
RegisterDropDown();
RegisterCheckbox();
RegisterDate();
RegisterTextRedactor();
RegisterRange();
RegisterLazyDropDown();
RegisterAttachment();
RegisterRadio();
