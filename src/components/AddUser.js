import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import {useState} from "react";
import {addUser} from "./userServer"

const { Option } = Select;
const { TextArea } = Input;

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

export default function AddUserForm({onClose, open, setOpen, openNotification, getUserInfo}){
    const [addloading, setAddLoading] = useState(false);

    const onFinish = async(values) => {
        setAddLoading(true)
        const userData = {
          receipNum: values.receipNum,
          name: values.name,
          family: values.family ? values.family : [],
          address: values.address,
          phone: values.phone,
          etc: values.etc
        }
        // notifi 를 위해 await로 변경해볼것
        addUser(userData).then((result)=>{
          if(result){
            openNotification({title:"성공",desc:"업로드에 성공했습니다"})
          }
          else{
            openNotification({title:"실패",desc:"업로드에 실패했습니다"})
          }
        }).catch((err)=>{
          openNotification({title:"실패",desc:"통신에 문제가 생겼습니다: "+err})
        }).finally(()=>{
          getUserInfo();
          setOpen(false);
          setAddLoading(false);
        })
        
    };

    return (
        <>
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
              name='receipNum'
              label="접수번호"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item name='address' label="주소" rules={[
                {
                required: true,
                message: '주소를 입력해주세요!',
                },
            ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='name'
              label="이름"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
            name="phone"
            label="전화번호"
            rules={[
                {
                required: true,
                message: '전화번호를 입력해주세요!',
                },
            ]}
            >
                <Input
                    style={{
                    width: '100%',
                    }}
                />
            </Form.Item>


            <Form.List name="family">
                {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                        <Space
                        key={key}
                        style={{
                            display: 'flex',
                            marginBottom: 5,
                        }}
                        align="baseline"
                        >
                        <Form.Item
                            name={[name, "relation"]}
                            label="가족"
                            rules={[
                            {
                                required: true,
                                message: '가족관계를 선택해주세요!',
                            },
                            ]}
                        >
                            <Select placeholder="관계" style={{
                                marginLeft: "40px",
                            }}>
                                <Option value="부">부</Option>
                                <Option value="모">모</Option>
                                <Option value="배우자">배우자</Option>
                                <Option value="자녀">자녀</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            rules={[
                            {
                                required: true,
                                message: '이름을 입력해주세요',
                            },
                            ]}
                        >
                            <Input style={{marginLeft: "40px"}} placeholder="이름" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            가족 추가하기
                        </Button>
                    </Form.Item>
                    </>
                )}
            </Form.List>


            <Form.Item name='etc' label="중요사항">
                <TextArea rows={8} />
            </Form.Item>

            <Form.Item label={null}>
                {addloading ?              
                <Button type="primary" loading htmlType="submit">
                    loading
                </Button>:
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>}

            </Form.Item>
        </Form>

            </Drawer>
        </>
    )
}