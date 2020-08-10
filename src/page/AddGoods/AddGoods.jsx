import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, InputNumber } from 'antd';
import { Query, User } from 'leancloud-storage'


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
class AddGoods extends React.Component {
  state = {
    imageUrl: '',
    uid: 0,
    fileList: []
   }

    componentDidMount() {
        
    }

    


    render() {
        const uploadButton = (
            <div>
              {/* {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />} */}
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { imageUrl, fileList } = this.state;
      return (
     
        <Form onFinish={this.handleUpdate.bind(this)}>
            <Form.Item {...formItemLayout} label="商品名" name="title">
                <Input />
            </Form.Item>
            <Form.Item {...formItemLayout} label="商品关键词1" name="keywordOne">
                <Input />
            </Form.Item>
            <Form.Item {...formItemLayout} label="商品关键词2" name="keywordTwo">
                <Input />
            </Form.Item>
            <Form.Item {...formItemLayout} label="价格" name="price">
                <InputNumber />
            </Form.Item>
            <Form.Item {...formItemLayout} label="商品大类" name="type">
                <Input />
            </Form.Item>
            <Form.Item {...formItemLayout} label="方形头图" name="rectCoverageImage">
            <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={this.handleUplod.bind(this)}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </Form.Item>
            <Form.Item {...formItemLayout} label="商品图片列表" name="ImageList">
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

    handleUplod(file) {
        const newFile = new AV.File(file.type, file);
        newFile.save({ keepFileName: true }).then((res) => {
            this.setState({
                imageUrl: res.attributes.url
            })
          }, (error) => {
            // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
            console.log('保存失败，可能是文件无法被读取，或者上传过程中出现问题')
          });
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
        const {fileList, imageUrl} = this.state
        const Todo = AV.Object.extend('goodsProducts');
        // 构建对象
        const todo = new Todo();
        todo.set('title', values.title);
        todo.set('keywordOne', values.keywordOne);
        todo.set('keywordTwo', values.keywordTwo);
        todo.set('type', values.type);
        todo.set('price', values.price);
        todo.set('rectCoverageImage', imageUrl);
        todo.set('ImageList', fileList.map((item) => (item.url)));

        // 将对象保存到云端
        todo.save().then((res) => {
        // 成功保存之后，执行其他逻辑
        message.success('保存成功')
        setTimeout(() => {
            window.location.reload() 
        }, 800)
        }, (error) => {
        // 异常处理
        });
    }
  }
  

export default AddGoods
