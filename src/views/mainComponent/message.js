import {Input, List, Button, Flex, Table, Modal} from 'antd';
import {useState} from 'react';
import { addMsg, deleteMsg, sendMsg } from '../../components/messageServer';
const { TextArea } = Input;

const columns = [
    {
      title: '이름',
      dataIndex: 'name',
    },
    {
      title: '전화번호',
      dataIndex: 'phone',
    },

  ];

export default function MessageView({isOnline, userDatas, msgList, requestMsgs, openNotification}){
    const [textArea, setTextArea] = useState("");
    const [deleteloading, setDeleteLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [sendAllLoading, setAllSendLoading] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isAllSendModalOpen, setIsAllSendModalOpen] = useState(false);


    const onChangeTextArea = (e) =>{
        setTextArea(e.target.value)
    }

    const setMsgInputArea = (item) => {
        setTextArea(item)
    }



    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(selectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onSaveMsg = async() =>{
        if(textArea !== ""){
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
        }else{
            openNotification({
                title: '실패',
                desc: "내용을 입력해주세요"
            })
        }

    }


    const onAllSendMsg = async() =>{
        setAllSendLoading(true);
        if(textArea !== ""){
            const result = await sendMsg({
                userList: userDatas,
                msgContent: textArea
            })
            if(result.success){
                openNotification({
                    title: '성공',
                    desc: '메세지를 성공적으로 전송했습니다.'
                })
                requestMsgs()
            }else{
                openNotification({
                    title: '실패',
                    desc: result.msg
                })
            }
        }else{
            openNotification({
                title: '실패',
                desc: "전송대상 고객을 선택, 혹은 메세지 내용을 입력해주세요"
            })
            setIsAllSendModalOpen(false)
        }
        setAllSendLoading(false);
    }

    const onSendMsg = async() =>{
        setSendLoading(true);
        if(selectedRowKeys.length > 0 && textArea !== ""){
            const result = await sendMsg({
                userList: selectedRows,
                msgContent: textArea
            })
            if(result.success){
                openNotification({
                    title: '성공',
                    desc: '메세지를 성공적으로 전송했습니다.'
                })
                requestMsgs()
            }else{
                openNotification({
                    title: '실패',
                    desc: result.msg
                })
            }
        }else{
            openNotification({
                title: '실패',
                desc: "전송대상 고객을 선택, 혹은 메세지 내용을 입력해주세요"
            })
            setIsSendModalOpen(false)
        }
        setSendLoading(false);
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
        <Modal title="메세지 보내기 확인" open={isSendModalOpen} onOk={onSendMsg} onCancel={()=>setIsSendModalOpen(false)}>
            <p>선택한 고객들에게 메세지를 보내시겠습니까?</p>
        </Modal>
        <Modal title="메세지 보내기 확인" open={isAllSendModalOpen} onOk={onAllSendMsg} onCancel={()=>setIsAllSendModalOpen(false)}>
            <p>모든 고객들에게 메세지를 보내시겠습니까?</p>
        </Modal>
        <h1 style={{position: "absolute", marginTop: "40px", left:"300px"}}>메세지</h1>
        <Flex style={{width:"120%", height:"100vh"}} justify='space-around' align='center' gap={20}>
            <div style={{width:"40%"}}>
                <h2 style={{marginBottom: "10px"}}>메세지 내용</h2>
                <TextArea onChange={onChangeTextArea} rows={10} placeholder="메세지 내용을 입력하세요" value={textArea} />
                <div style={{marginTop: "10px"}}>
                { saveLoading ?  <Button color="green"  style={{marginRight:"10px"}} loading></Button> : <Button color="green" variant="solid" style={{marginRight:"10px"}} onClick={onSaveMsg}>저장</Button>}
                {sendLoading ? <Button color="purple"style={{marginRight:"10px"}} loading></Button> : <Button color="purple" style={{marginRight:"10px"}} variant="solid" onClick={()=>setIsSendModalOpen(true)}>보내기</Button>}
                {sendLoading ? <Button color="blue" loading></Button> : <Button color="blue" variant="solid" onClick={()=>setIsAllSendModalOpen(true)}>모두 보내기</Button>}
                </div>

            </div>

            <div>
                <h2 style={{marginBottom: "10px"}}>유저목록</h2>
                <Flex style={{width:"100%"}} vertical>
                    <Flex align="center">
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                        
                    </Flex>
                    <Table pagination={{pageSize: 8}} rowSelection={rowSelection} columns={columns} dataSource={userDatas} />
                </Flex>
            </div>

            <div>
                <h2 style={{marginBottom: "10px"}}>저장된 메세지들</h2>
                <List
                bordered
                pagination={{
                    position: "bottom",
                    pageSize: 8,
                    align: "end"
                }}
                dataSource={msgList}
                renderItem={(item, index) => (
                    <List.Item>
                        <Button style={{ marginRight: "10px"}} onClick={()=>setMsgInputArea(item.content)}>{item.content.length > 8 ? item.content.substring(0, 8) + "..." : item.content}</Button>
                        {deleteloading ? <Button loading></Button> : <Button danger onClick={() => onDeleteMsg(item.key)}>삭제</Button>}
                    </List.Item>
                )}
                />
            </div>

        </Flex>
        </>
    )
}