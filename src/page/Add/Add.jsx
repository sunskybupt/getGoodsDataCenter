import React from 'react';
import './Add.css';
import { Layout, Tabs } from 'antd';
import { Query, User } from 'leancloud-storage'
import AddGoods from '../AddGoods/AddGoods'
import AddActivct from '../AddActivct/AddActivct'
import AddComment from '../AddComment/AddComment'


const { TabPane } = Tabs;
class Add extends React.Component {
  
    callback(key) {
        // console.log(key);
    }
    render() {
      return (
        <div>
            <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                <TabPane tab="上传商品" key="1">
                    <AddGoods />
                </TabPane>
                <TabPane tab="上传活动" key="2">
                    <AddActivct />
                </TabPane>
                <TabPane tab="上传评论" key="3">
                    <AddComment />
                </TabPane>
            </Tabs>

        </div>
      );
    }
  }
  

export default Add;
