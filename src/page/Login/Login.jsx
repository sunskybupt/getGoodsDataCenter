import React from 'react';
import { Input, Button } from 'antd';
import { HashRouter as Router, Link, Route } from 'react-router-dom';


import Add from '../Add/Add'



class Login extends React.Component {
    state={
        value: ''
    }
  
    onChange(e) {
        console.log(e.target.value)
        this.setState({
            value: e.target.value
        })
    }
    render() {
        const { value } = this.state
      return (
        <div>
            131231231231
            <Input placeholder="输入密码" onChange={this.onChange.bind(this)} />
            <Link to={value === '111' ? '/home' : '/'}><Button>ok</Button></Link>
            
        </div>
      );
    }
  }
  

export default Login;
