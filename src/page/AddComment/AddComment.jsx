import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Select, DatePicker } from 'antd';
import { Query, User } from 'leancloud-storage'
import moment from 'moment'
const { Option } = Select;
const { TextArea } = Input;
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
    fileList: []
   }

    componentDidMount() {
        
        const query = new AV.Query('getTreasurePeople');
        query.find().then((res) => {
            const peopleList = []
            const userList = res.map((item) => {
                const resData = item._serverData
                peopleList.push(resData)
                // `${resData.activityID},${resData.nickName},${resData.userID},${resData.avatarUrl}`
                return {
                    key: resData.userID,
                    value: resData.nickName
                }
            })
            this.setState({
                peopleList, 
                userList
            })
        });
    }

    


    render() {
        const uploadButton = (
            <div>
              {/* {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />} */}
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { userList, fileList } = this.state;
      return (
     
        <Form onFinish={this.handleUpdate.bind(this)}>
            <Form.Item {...formItemLayout} label="用户" name="userID">
                <Select style={{ width: 120 }}>
                    {
                        userList.map((item) => (
                            <Option key={item.key} value={item.key}>{item.value}</Option>
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
        const {fileList, peopleList} = this.state
        const Todo = AV.Object.extend('getTreasureShowOff');
        // 构建对象
        // ${resData.activityID},${resData.nickName},${resData.userID},${resData.avatarUrl}
        let productId = ''
        let nickName = ''
        let avatarUrl = ''
        peopleList.map((item) => {

            if (item.userID == values.userID) {
                productId = item.activityID
                nickName = item.nickName
                avatarUrl = item.avatarUrl
            }
        })
        const todo = new Todo();
        todo.set('userID', values.userID);
        todo.set('date', Number(moment(values.date).format('YYYYMMDD')));
        todo.set('message', values.message);
        todo.set('commentImageList', fileList.map((item) => (item.url)));
        todo.set('productID', productId);
        todo.set('nickName', nickName);
        avatarUrl && todo.set('avatarUrl', avatarUrl);

        // 将对象保存到云端
        todo.save().then((res) => {
            // 成功保存之后，执行其他逻辑
            message.success('保存成功')
            window.location.reload() 
        }, (error) => {
            // 异常处理
            message.error('保存失败')
        });
    }
  }
  

export default AddComment
