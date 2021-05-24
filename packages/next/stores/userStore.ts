import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { User } from '@pdeals/models/entities/User';
import { client } from '../lib/api/api-client';
import { LoginRequestDto } from '@pdeals/models/dto/UserDto';

class UserStore {
  @observable
  status = {
    loading: 'idle',
    errorText: '',
  };

  @persist @observable session: string | null = null;
  @observable me: User | null = null;

  @observable allData = null;

  @action setSession(s: string) {
    this.session = s;
  }

  @action async login(email: string, password: string, rememberMe: boolean) {
    const data: LoginRequestDto = {
      username: email,
      password,
    };
    const answer: any = await client().post('/auth/login', data);
    if (answer.session) {
      this.session = answer.session;
      if (rememberMe) {
        localStorage.setItem('token', answer.session);
      } else sessionStorage.setItem('token', answer.session);
      this.me = answer.user;
      this.allData = await client().get('/open/alldata?cache=' + new Date());
    } else {
      throw new Error('Unauthorized');
    }
  }

  @action async loginAs(id: number) {
    const answer: any = await client().get(`/auth/loginas/${id}`);
    if (answer.session) {
      this.session = answer.session;
      localStorage.setItem('token', answer.session);
      this.me = answer.user;
    } else {
      throw new Error('Unauthorized');
    }
  }

  @action async checkMe() {
    if (!this.me) {
      const answer: any = await client().get('/auth/me');
      if (answer.session) {
        this.session = answer.session;
        // localStorage.setItem('token', answer.session);
        this.me = answer.user;
        this.allData = await client().get('/open/alldata?cache=' + new Date());
      } else {
        throw new Error('Unauthorized');
      }
    }
  }
  @action async logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.me = null;
    this.session = null;
  }
}

export default UserStore;
