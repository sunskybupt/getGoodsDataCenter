import React from 'react';
import { Input, Button, Table, Popconfirm  } from 'antd';



const AV = require('leancloud-storage');
AV.init({
    appId: "W2t2q2HFHW3umQdTMzzH1zsC",
    appKey: "nAmss0sg8XRIybLWagcKtQNq",
    serverURL: "https://api.coozhangmu.cn"
});

class GoodsList extends React.Component {
    
    state={
        dataSource: []
    }
    componentDidMount() {
        this.getGoodsList()
    }
    getGoodsList() {
        const query = new AV.Query('goodsProducts');
        query.find().then((res) => {
            const goodsList = res.map((item) => ({
                    ...item, ...item._serverData
            }))
            this.setState({
                dataSource: goodsList
            }, () => {
                console.log(this.state.dataSource)
            })
        });
    }

   
  
    
    render() {
        const { dataSource } = this.state

        const columns = [
            {
              title: '商品名',
              dataIndex: 'title',
              key: 'title',
              width: 200,
            },
            {
              title: '商品原价',
              dataIndex: 'price',
              key: 'price',
              width: 150,
            },
            {
              title: '商品关键词1',
              dataIndex: 'keywordOne',
              key: 'keywordOne',
              width: 150,
            },{
                title: '商品关键词2',
                dataIndex: 'keywordTwo',
                key: 'keywordTwo',
                width: 150,
              },{
                title: '商品大类',
                dataIndex: 'type',
                key: 'type',
                width: 150,
              },{
                title: '方形头图',
                dataIndex: 'rectCoverageImage',
                key: 'rectCoverageImage',
                width: 200,
                render: (text) => {
                    return <img style={{width:'150px', height: '150px'}} src={text} alt=""/>
                }
              },{
                title: '操作',
                dataIndex: 'play',
                width: 200,
                key: 'play',
                render:(text, record) => {
                    return <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={this.handleDelete.bind(this, record.id)}>
                        <a href="#">Delete</a>
                    </Popconfirm>
                }
              },
          ];
      return (
        <div>
            <Table rowKey={(record, i) => i + ''} bordered dataSource={dataSource} columns={columns} />;
            
        </div>
      );
    }

    handleDelete(id) {
        console.log(id)
    }
  }
  

export default GoodsList;
