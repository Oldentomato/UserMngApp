import { Button, Flex, Table, Input, notification, Popover, List } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import {useState} from "react";
import {deleteUser} from "../../components/userServer"
import AddUserForm from '../../components/AddUser';

const { Search } = Input;

export default function ClientView({isOnline, userDatas, getUserInfo}){
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userList, setUserList] = useState(userDatas);
  const [searchString, setSearchString] = useState("");
  const [password, setPassword] = useState("");
  const [deleteloading, setDeleteLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [api, contextHolder] = notification.useNotification();


    const columns = [
      {
        title: '이름',
        dataIndex: 'name',
      },
      {
        title: '가족',
        dataIndex: 'family',
        render: (_, record) => {
          return (
            <>
            {
              record.family.length >= 1 ? 
              <List
              bordered
              dataSource={record.family}
              renderItem={(item, index) => (
                  <List.Item>
                      <p>{item.relation}</p>
                      <p>{item.name}</p>
                  </List.Item>
              )}
              /> : 
              <> </>
            }

            </>
          );
        },
      },
      {
        title: '주소',
        dataIndex: 'address',
      },
      {
        title: '전화번호',
        dataIndex: 'phone',
      },
      {
        title: '중요사항',
        dataIndex: 'etc',
        render: (_, record) => {
          return (
            <>
              <Popover content={
                <div style={{
                  width: "500px", /* 원하는 너비 */
                  wordBreak: "break-all", //width가 넘어가면 자동으로 줄넘김되는 옵션
                  maxHeight: "200px",
                  fontSize: "20px",
                  whiteSpace: "pre-line", // \n이 적용되도록 하는 옵션
                  overflowY: "auto"}}>
                  <p>{record.etc}</p>
                </div>
                } title="중요사항" trigger="click">
                <Button>자세히보기</Button>
              </Popover>
            </>
          );
        },
      },
  ];

  const filterUser = () => {
    const filteredData = userList.filter(item => item.name === searchString);
    setUserList(filteredData); // 새로운 배열로 치환
  };


  const searchOnChange = (e) =>{
    setSearchString(e.target.value)
  }

  const searchReset = () =>{
    setSearchString("")
    setUserList(userDatas)
  }



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

  const onDelete = async(e) =>{
    e.preventDefault();
    setDeleteLoading(true);
    deleteUser(selectedRowKeys).then((result)=>{
      if(result){
        openNotification({title:"성공",desc:"삭제에 성공했습니다"})
      }
      else{
        openNotification({title:"실패",desc:"삭제에 실패했습니다"})
      }
    }).catch((err)=>{
      openNotification({title:"실패",desc:"통신에 문제가 생겼습니다"})
    }).finally(()=>{
      getUserInfo();
      setDeleteLoading(false);
    })
  }




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
                    {(isOnline && hasSelected) && (deleteloading ? <Button danger loading onClick={onDelete}>Delete</Button> : <Button danger onClick={onDelete}>Delete</Button>)}
                    {isOnline && 
                    <>
                      <Button type="primary" onClick={showDrawer}>Add</Button>
                      <Button type="primary" onClick={downloadData}>Download</Button>
                      <Input prefix={<LockOutlined />} onChange={onPassChange} type="password" placeholder="Password" />
                    </>}
                    
                </Flex>
                <Flex align="center" gap="middle">
                <h3 style={{width:"10%"}}>고객 검색</h3><Search placeholder="고객명" value={searchString} onSearch={filterUser} onChange={searchOnChange} /><Button onClick={searchReset}>Reset</Button>
                </Flex>
                
                <Table pagination={{pageSize: 6}} rowSelection={rowSelection} columns={columns} dataSource={userList} />
            </Flex>
            
            <AddUserForm onClose={onClose} open={open} setOpen={setOpen} openNotification={openNotification} getUserInfo={() => getUserInfo()}/>

            </div>
        </div>

    )
}