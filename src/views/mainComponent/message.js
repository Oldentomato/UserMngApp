import {Input, List, Button, Flex, Table} from 'antd';
import {useState} from 'react';
import { addMsg, deleteMsg } from '../../components/messageServer';
const { TextArea } = Input;

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

export default function MessageView({isOnline, userDatas, msgList, requestMsgs, openNotification}){
    const [textArea, setTextArea] = useState("");
    const [deleteloading, setDeleteLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);


    const onChangeTextArea = (e) =>{
        setTextArea(e.target.value)
    }

    const setMsgInputArea = (item) => {
        setTextArea(item)
    }



    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onSaveMsg = async() =>{
        setSaveLoading(true)
        const result = await addMsg(textArea)
        if(result.success){
            openNotification({
                title: '성공',
                desc: '메세지를 저장했습니다.'
            })
            requestMsgs()
        }else{
            openNotification({
                title: '실패',
                desc: result.msg
            })
        }
        setSaveLoading(false)
    }

    const onDeleteMsg = async(key) =>{
        setDeleteLoading(true)
        const result = await deleteMsg(key)
        if(result.success){
            openNotification({
                title: '성공',
                desc: '메세지를 삭제했습니다.'
            })
            requestMsgs()
        }else{
            openNotification({
                title: '실패',
                desc: result.msg
            })
        }
        setDeleteLoading(false)
    }

    const hasSelected = selectedRowKeys.length > 0;


    return(
        <>
        <Flex style={{width:"120%", height:"100vh"}} justify='space-around' align='center' gap={30}>
            <div>
                <h2>메세지</h2>
                <TextArea onChange={onChangeTextArea} rows={8} placeholder="메세지 내용을 입력하세요" value={textArea} />
                { saveLoading ?  <Button loading></Button> : <Button onClick={onSaveMsg}>저장</Button>}
                {<Button>보내기</Button>}
            </div>

            <div>
                <h2>유저목록</h2>
                <Flex style={{width:"140%"}} vertical>
                    <Flex align="center" gap="middle">
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                        
                    </Flex>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={userDatas} />
                </Flex>
            </div>

            <div>
                <h2>저장된 메세지들</h2>
                <List
                bordered
                pagination={{
                    position: "bottom",
                    align: "end"
                }}
                dataSource={msgList}
                renderItem={(item, index) => (
                    <List.Item>
                        <Button onClick={()=>setMsgInputArea(item.content)}>{item.content}</Button>
                        {deleteloading ? <Button loading></Button> : <Button danger onClick={() => onDeleteMsg(item.key)}>삭제</Button>}
                    </List.Item>
                )}
                />
            </div>

        </Flex>
        </>
    )
}