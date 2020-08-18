import React from 'react';
import './Home.css';
import { Layout, Menu } from 'antd';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import Add from '../Add/Add'
import GoodsList from '../GoodsList/GoodsList'


const { Header, Sider, Content } = Layout;



class Home extends React.Component {
  
    render() {
      return (
          <Router>
        <Layout style={{height: "100%"}}>
          <Sider trigger={null} collapsible >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="/home" icon={<UserOutlined />}>
                <Link to="/">添加</Link>
              </Menu.Item>
              <Menu.Item key="/goodsList" icon={<UserOutlined />}>
                <Link to="/goodsList">商品列表</Link>
              </Menu.Item>
            </Menu>
          </Sider>


          <Layout className="site-layout">

            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                height: '100%',
              }}
            >
               <Route exact path="/" component={Add} />
               <Route path="/goodsList" component={GoodsList} />
            </Content>
          </Layout>
        </Layout>
        </Router>
      );
    }
  }
  

export default Home;
