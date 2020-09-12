import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Select, DatePicker } from 'antd';
import { Query, User } from 'leancloud-storage'
import moment from 'moment'
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker
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
class AddComment extends React.Component {
    formRef = React.createRef(); 
  state = {
    peopleList: [],
    uid: 0,
    fileList: [],
    goodsImg: '',
    goodsProductID: '',
    allActGoodsList: [],
    isPeapleArr: [],
   }

    componentDidMount() {
        // this.getActivct()       
    }
    getActivct(date, dateString) {
        this.setState({
            allActGoodsList: []
        })
        const starTime = moment(dateString[0]).format('YYYY-MM-DD HH:mm:ss');
        const endTime = moment(moment(dateString[1]).endOf('day')).format('YYYY-MM-DD HH:mm:ss')
        const startDateQuery = new AV.Query('getTreasureParticipator');
        startDateQuery.greaterThanOrEqualTo('createdAt', new Date(starTime));

        const endDateQuery = new AV.Query('getTreasureParticipator');
        endDateQuery.lessThan('createdAt', new Date(endTime));

        const query = AV.Query.and(startDateQuery, endDateQuery)
        query.find().then((res) => {
            const activityList = res.map((item) => {
                return {
                   acId: item.id,
                   goodsProductID: item._serverData.goodsProductID

                }
            })
            
            activityList.map((item) => {
                const query = new AV.Query('goodsProducts');
                query.equalTo('objectId', item.goodsProductID);
                query.find().then((res) => {
                    this.setState({
                        allActGoodsList: [ ...this.state.allActGoodsList, {
                            acId: item.acId,
                            goodsId: res[0].id,
                            goodsProductID: item.goodsProductID,
                            name: res[0]._serverData.title,
                            url:  res[0]._serverData.rectCoverageImage,
                        }]
                    })
                })
            })
        })
    }



    changeUserID(e) {
      
        this.setState({
            id: e
        })
    }
changegoods(e) {
    const {allActGoodsList, isPeapleArr} = this.state
    this.state.allActGoodsList.map((i) => {
          
        if (i.acId == e) {
            this.setState({
                goodsImg: i.url,
                goodsProductID: i.goodsProductID
            })
        }
    })

    const query = new AV.Query('getTreasurePeople');
    query.equalTo('activityID', e);
    query.equalTo('getOrNot', true);
    query.find().then((res) => {
        const arr = []
        const peopleList = res.map((item) => {
            const resData = item._serverData
            arr.push(resData.userID)
           return { id: item.id , ...resData}
        })
        this.setState({
            peopleList
        })
        let findGoods = allActGoodsList.find((item) => item.acId == e)
        let colorArr = []
        arr.map((item) => {
            const query1 = new AV.Query('getTreasureShowOff');
            query1.equalTo('goodsProductID', findGoods.goodsId);
            query1.equalTo('userID', item);
            query1.find().then((res) => {
                colorArr.push(res.length > 0 ? true : false)
                this.setState({
                    isPeapleArr: [...this.state.isPeapleArr, res.length > 0 ? true : false]
                }, () =>{
                })
            })
        })
        
        
    })
    
}
    


    render() {
        const uploadButton = (
            <div>
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { peopleList, fileList, goodsImg, allActGoodsList, isPeapleArr } = this.state;
      return (
     
        <Form onFinish={this.handleUpdate.bind(this)}>
            <Form.Item {...formItemLayout} label="按时间范围筛选活动" name="aaa">
                <RangePicker onChange={this.getActivct.bind(this)} />
            </Form.Item>
            <Form.Item {...formItemLayout} label="活动">
                <Select style={{ width: 500 }} onChange={this.changegoods.bind(this)}>
                    {
                        allActGoodsList.map((item) => (
                            <Option key={item.acId} value={item.acId}>{item.name}</Option>
                        ))
                    }
                </Select>
                <span><img style={{width: '200px', height: '200px'}} src={goodsImg} alt=""/></span>
            </Form.Item>
            <Form.Item {...formItemLayout} label="用户">
                <Select style={{ width: 500 }} onChange={this.changeUserID.bind(this)}>
                    {
                        peopleList.map((item, i) => (
                            <Option key={item.id} value={item.id}><span style={{background: isPeapleArr[i] ? 'red' : '#fff'}}>{item.nickName}</span></Option>
                        ))
                    }
                </Select>
                
            </Form.Item>
            <Form.Item {...formItemLayout} label="评价时间点" name="date">
                <DatePicker />
            </Form.Item>
            <Form.Item {...formItemLayout} label="用户评价" name="message">
                <TextArea />
            </Form.Item>

            <Form.Item {...formItemLayout} label="用户评价晒单图片" name="ImageList">
                <div className="clearfix">
                    <Upload
                    action={this.handleUplodList.bind(this)}
                    listType="picture-card"
                    fileList={fileList}
                    >
                        {fileList.length >= 20 ? null : uploadButton}
                    </Upload>
                </div>
            </Form.Item>
            <Form.Item {...formItemLayout}>
            <Button htmlType="submit" type="primary">
                Submit
            </Button>
        </Form.Item>

        </Form>
      );
    }


    handleUplodList(file) {
        const {fileList, uid} = this.state
        const newFile = new AV.File(file.type, file);
        newFile.save({ keepFileName: true }).then((res) => {
            fileList.push({
                uid,
                name: file.type,
                url: res.attributes.url
            })
            this.setState({
                uid: uid + 1,
                fileList
            })
          }, (error) => {
            // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
          });
    }

    handleUpdate(values) {
        const {fileList, peopleList, goodsProductID, id} = this.state
        const Todo = AV.Object.extend('getTreasureShowOff');
        // 构建对象
        // ${resData.activityID},${resData.nickName},${resData.userID},${resData.avatarUrl}
        let userID = ''
        let nickName = ''
        let avatarUrl = ''
        peopleList.map((item) => {
            if (item.id == id) {
                nickName = item.nickName
                avatarUrl = item.avatarUrl
                userID = item.userID
            }
        })
     
        const todo = new Todo();
        todo.set('userID', userID);
        todo.set('date', Number(moment(values.date).format('YYYYMMDD')));
        todo.set('message', values.message);
        todo.set('commentImageList', fileList.map((item) => (item.url)));
        todo.set('goodsProductID', goodsProductID);
        todo.set('nickName', nickName);
        avatarUrl && todo.set('avatarUrl', avatarUrl);

        // 将对象保存到云端
        todo.save().then((res) => {
            // 成功保存之后，执行其他逻辑
            message.success('保存成功')
            setTimeout(() => {
                window.location.reload() 
            }, 800)
        }, (error) => {
            // 异常处理
            message.error('保存失败')
        });
    }
  }
  

export default AddComment
