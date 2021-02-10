import React, { useEffect, useState, useRef } from 'react';
import Slider from "nouislider";

import { FormGroup, Row, Col, Input } from 'reactstrap';

import { registerRenderer } from './index';

const Range = ({ class: className, min = 0, max = 500, setValue, name, innerRef, ...rest }) => {
  const [sliderData, setSliderData] = useState(["200.00", "400.00"]);
  const slider = useRef<any>();

  useEffect(() => {
    if (slider.current) {
      Slider.create(slider.current, {
        start: [min, max],
        connect: [false, true, false],
        step: 0.01,
        range: { min, max },
      }).on(
        'update',
        function(values) {
          setSliderData(values);
        }
      );
    }
  }, []);

  useEffect(() => {
    setValue(name, `${sliderData[0]}-${sliderData[1]}`);
  }, [sliderData]);

  return (
    <FormGroup className={className}>
      <Input innerRef={innerRef} name={name} style={{ display: 'none' }} />
      <div className="mt-5">
        <div ref={slider} />
        <Row>
          <Col xs="6">
            <span className="range-slider-value value-low">
              {sliderData[0]}
            </span>
          </Col>
          <Col className="text-right" xs="6">
            <span className="range-slider-value value-high">
              {sliderData[1]}
            </span>
          </Col>
        </Row>
      </div>
    </FormGroup>
  );
};

const RegisterRange = () => {
  registerRenderer('range', Range);
};

export default RegisterRange;
