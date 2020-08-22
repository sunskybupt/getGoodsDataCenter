import React, { useState } from 'react';
import { Form, Select, Button, InputNumber, message, Radio, DatePicker } from 'antd';
import { Query, User } from 'leancloud-storage'
import moment from 'moment'
import { FormInstance } from 'antd/lib/form';
const { Option } = Select;

const formItemLayout = {
    style: {
      width: '100%',
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelCol: { span: 4, push: 0 },
    wrapperCol: { span: 20 },
  };
const AV = require('leancloud-storage');
AV.init({
    appId: "W2t2q2HFHW3umQdTMzzH1zsC",
    appKey: "nAmss0sg8XRIybLWagcKtQNq",
    serverURL: "https://api.coozhangmu.cn"
});


class AddActivct extends React.Component {
    formRef = React.createRef(); 
    state = {
        goodsList: [],
        imgSrc: '',
        allGoods: []
    }

    componentDidMount() {
        
        const query = new AV.Query('goodsProducts');
        query.find().then((res) => {
            const goodsList = res.map((item) => {
                return {
                    key: item.id,
                    value: item._serverData.title
                }
            })
            this.setState({
                goodsList,
                allGoods: res
            })
        });
    }

    


    render() {
        const { goodsList, imgSrc } = this.state;
      return (
        <Form ref={this.formRef} onFinish={this.handleUpdate.bind(this)} >
            <Form.Item {...formItemLayout} label="活动商品">
                <Select style={{ width: '500px' }} onChange={this.changeGoodsProductID.bind(this)}>
                    {
                        goodsList.map((item) => (
                            <Option key={item.key} value={item.key}>{item.value}</Option>
                        ))
                    }
                </Select>
                <img style={{width: '200px', height: '200px'}} src={imgSrc} alt=""/>
            </Form.Item>
            <Form.Item {...formItemLayout} label="折扣" name="discount">
                <InputNumber />
            </Form.Item>
            <Form.Item {...formItemLayout} label="商品活动数量" name="number">
                <InputNumber />
            </Form.Item>
            <Form.Item {...formItemLayout} label="活动日期" name="participateDate">
                <DatePicker />
            </Form.Item>
            
            <Form.Item {...formItemLayout}>
                <Button htmlType="submit" type="primary">
                    Submit
                </Button>
            </Form.Item>

        </Form>
      );
    }


    changeGoodsProductID(e) {
        this.state.allGoods.map((item) => {
            if (item.id == e) {
                this.setState({
                    imgSrc: item._serverData.rectCoverageImage,
                    goodsProductID: e
                })
            }
        })
    }
 
    handleUpdate(values) {
        const Todo = AV.Object.extend('getTreasureParticipator');
        // 构建对象
        const todo = new Todo();
        todo.set('goodsProductID', this.state.goodsProductID);
        todo.set('number', values.number);
        todo.set('discount', values.discount);
        todo.set('participateDate', Number(moment(values.participateDate).format('YYYYMMDD')));

        // 将对象保存到云端
        todo.save().then((res) => {
            // 成功保存之后，执行其他逻辑
            message.success('保存成功')
            // this.formRef.current.resetFields()
            setTimeout(() => {
                window.location.reload() 
            }, 800) 

        }, (error) => {
        // 异常处理
            message.error('保存失败')
        });
    }
  }
  

export default AddActivct
