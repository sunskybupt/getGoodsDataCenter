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
    userList: [],
    uid: 0,
    fileList: [],
    goodsName: '',
    goodsImg: '',
    goodsProductID: ''
   }

    componentDidMount() {
        
       
    }

    getUser(date, dateString) {
        // console.log(date, dateString)

        const startDateQuery = new AV.Query('getTreasurePeople');
        startDateQuery.greaterThanOrEqualTo('createdAt', new Date(dateString[0]));

        const endDateQuery = new AV.Query('getTreasurePeople');
        endDateQuery.lessThan('createdAt', new Date(dateString[1]));

        const query = AV.Query.and(startDateQuery, endDateQuery)
        query.equalTo('canHold', true);
        query.find().then((res) => {
            // students 是包含满足条件的 Student 对象的数组
            const peopleList = []
            const userList = res.map((item) => {
                const resData = item._serverData
                peopleList.push({ id: item.id , ...resData})
                // `${resData.activityID},${resData.nickName},${resData.userID},${resData.avatarUrl}`
                return {
                    userID: resData.userID,
                    value: resData.nickName,
                    activityID: resData.activityID, 
                }
            })
            this.setState({
                peopleList, 
                userList
            })

          });

    }

    changeUserID(e) {
        const obj = this.state.peopleList.find((i) => (i.id == e))
        console.log(obj)
        const query = new AV.Query('getTreasureParticipator');
        query.equalTo('objectId', obj.activityID);
        query.find().then((res) => {
            let goodsProductID = res[0]._serverData.goodsProductID
            const goods = new AV.Query('goodsProducts');
            goods.equalTo('objectId', goodsProductID);
            goods.find().then((res) => {
                this.setState({
                    goodsName: res[0]._serverData.title,
                    goodsImg: res[0]._serverData.rectCoverageImage,
                    goodsProductID,
                    id: e
                })
            });
        });
        
    }

    


    render() {
        const uploadButton = (
            <div>
              {/* {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />} */}
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { peopleList, fileList, goodsName, goodsImg } = this.state;
      return (
     
        <Form onFinish={this.handleUpdate.bind(this)}>
            <Form.Item {...formItemLayout} label="按时间范围筛选用户" name="aaa">
                <RangePicker onChange={this.getUser.bind(this)} showTime />
            </Form.Item>
            <Form.Item {...formItemLayout} label="用户">
                <Select style={{ width: 120 }} onChange={this.changeUserID.bind(this)}>
                    {
                        peopleList.map((item) => (
                            <Option key={item.id} value={item.id}>{item.nickName}</Option>
                        ))
                    }
                </Select>
                <span>{goodsName}<img style={{width: '200px', height: '200px'}} src={goodsImg} alt=""/></span>
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
                console.log(item)
                nickName = item.nickName
                avatarUrl = item.avatarUrl
                userID = item.userID
            }
        })
        // const obj = peopleList.find((i) => (i.activityID == activityID))
     
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
