import { Component } from 'react';
import Router from 'next/router';

export default class Index extends Component {
    componentDidMount = () => {
        Router.push('/admin/products');
    };

    render() {
        return <div />;
    }
}
