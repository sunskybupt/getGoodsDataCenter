import React from 'react';
import './App.css';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import Add from '../Add/Add'


const { Header, Sider, Content } = Layout;



class App extends React.Component {
  
    render() {
      return (
        <Layout style={{height: "100%"}}>
          <Sider trigger={null} collapsible >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1" icon={<UserOutlined />}>
                nav 1
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
              <Add />
            </Content>
          </Layout>
        </Layout>
      );
    }
  }
  

export default App;
