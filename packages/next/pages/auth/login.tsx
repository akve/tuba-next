import { useState } from 'react';
import classnames from 'classnames';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { inject, observer } from 'mobx-react';

import Auth from '@pdeals/next/components/layouts/Auth';
import AuthHeader from '@pdeals/next/components/Headers/AuthHeader';

const Login = (props) => {
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (values) => {
    try {
      setError('');
      await props.userStore.login(values.email, values.password, rememberMe);
      console.log('ROLE', props.userStore.me.role);
      if (props.userStore.me.role === 'admin') {
        router.push('/admin/products');
      } else {
        router.push('/user');
      }
    } catch (e) {
      setError('Incorrect');
    }
  };

  const handleChangeRememberMe = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <>
      <AuthHeader title="Welcome!" />
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Sign in with credentials</small>
                </div>
                <Form role="form" onSubmit={handleSubmit(handleLogin)}>
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: focusedEmail,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        name="email"
                        autoComplete="new-email"
                        onFocus={() => setFocusedEmail(true)}
                        onBlur={() => setFocusedEmail(false)}
                        innerRef={register({ required: true })}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedPassword,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        onFocus={() => setFocusedPassword(true)}
                        onBlur={() => setFocusedPassword(false)}
                        innerRef={register({ required: true })}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                      onChange={handleChangeRememberMe}
                      checked={rememberMe}
                    />
                    {/*<label className="custom-control-label" htmlFor=" customCheckLogin">
                      <span className="text-muted">Remember me</span>
                    </label>*/}
                  </div>
                  <div className="text-center">
                    <Button className="my-4" color="info" type="submit">
                      Sign in
                    </Button>
                    <br />
                    <Link href="/auth/register">
                      <Button className="my-4" color="info" type="button">
                        Register
                      </Button>
                    </Link>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

Login.layout = Auth;

export default inject('userStore')(observer(Login));
