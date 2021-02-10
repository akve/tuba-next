import React, { useEffect, useState } from 'react';
import { FormGroup, Input } from 'reactstrap';

import { registerRenderer } from './index';
import { DateInput } from '@pdeals/next/elements/DateInput';

const RegisterDate = () => {
  registerRenderer('date', DateInput);
};

export default RegisterDate;
