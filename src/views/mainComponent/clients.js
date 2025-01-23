import { Button, Flex, Table, Drawer, Form, Input, InputNumber, notification, Select } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import {useState} from "react";
import {addUser} from "../../components/userServer"

const { Option } = Select;

const columns = [
    {
      title: '이름',
      dataIndex: 'name',
    },
    {
      title: '나이',
      dataIndex: 'age',
    },
    {
      title: '주소',
      dataIndex: 'address',
    },
  ];



  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
};



export default function ClientView({isOnline, userDatas, getUserInfo}){
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [api, contextHolder] = notification.useNotification();

  const openNotification = (data) => {
      api.info({
        message: data.title,
        description:data.desc
      });
    };

  const onPassChange = (e) => {
    setPassword(e.target.value)
  }

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const downloadData = async () =>{
      if(password !== ""){
        const result = await window.electronAPI.setUsbData({password:password, userList:userDatas})
        if(result.success){
          openNotification({title:"성공",desc:"다운로드에 성공했습니다."})
        }
      }else{
        openNotification({title:"실패",desc:"비밀번호를 입력해주세요"})
      }

  }

  const onDelete = async() =>{

  }


    const onFinish = async(values) => {
      setLoading(true)
      const userData = {
        name: values.user.name,
        age: values.user.age,
        gender: values.gender,
        address: values.address,
        phone: values.phone
      }
      addUser(userData).then((result)=>{
        if(result){
          openNotification({title:"성공",desc:"업로드에 성공했습니다"})
        }
        else{
          openNotification({title:"실패",desc:"업로드에 실패했습니다"})
        }
      }).catch((err)=>{
        openNotification({title:"실패",desc:"통신에 문제가 생겼습니다"})
      }).finally(()=>{
        getUserInfo();
        setOpen(false);
        setLoading(false);
      })
      
      };




    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;


    return(
        <div className="clientView">
            <h1 className='clientLogo'>회원 목록</h1>
            {contextHolder}
            <div className='clientContainer'>
            <Flex gap="middle" vertical>
                <Flex align="center" gap="middle">
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                    {(isOnline && hasSelected) && <Button danger onClick={onDelete}>Delete</Button>}
                    {isOnline && 
                    <>
                      <Button type="primary" onClick={showDrawer}>Add</Button>
                      <Button type="primary" onClick={downloadData}>Download</Button>
                      <Input prefix={<LockOutlined />} onChange={onPassChange} type="password" placeholder="Password" />
                    </>}
                    
                </Flex>
                <Table rowSelection={rowSelection} columns={columns} dataSource={userDatas} />
            </Flex>

            <Drawer
                title="고객 정보 추가"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                body: {
                    paddingBottom: 80,
                },
                }}
                >
            <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
            validateMessages={validateMessages}
          >
            <Form.Item
              name={['user', 'name']}
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={['user', 'age']}
              label="Age"
              rules={[
                {
                  type: 'number',
                  min: 0,
                  max: 99,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            
            <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
                {
                required: true,
                message: 'Please input your phone number!',
                },
            ]}
            >
            <Input
                style={{
                width: '100%',
                }}
            />
            </Form.Item>

            <Form.Item
                name="gender"
                label="Gender"
                rules={[
                {
                    required: true,
                    message: 'Please select gender!',
                },
                ]}
            >
                <Select placeholder="select your gender">
                <Option value="male">남성</Option>
                <Option value="female">여성</Option>
                </Select>
            </Form.Item>

            <Form.Item name='address' label="address">
              <Input />
            </Form.Item>
            <Form.Item label={null}>
              {loading ?              
              <Button type="primary" loading htmlType="submit">
                loading
              </Button>:
                <Button type="primary" htmlType="submit">
                  Submit
              </Button>}

            </Form.Item>
          </Form>

                </Drawer>
            </div>
        </div>

    )
}