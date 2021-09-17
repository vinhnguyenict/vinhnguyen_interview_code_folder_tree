import React, {
    forwardRef,
    useImperativeHandle,
    useState,
    DispatchWithoutAction,
} from 'react'
import { Form, Input, Select, Divider, Button } from 'antd'
import { FolderOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons'
import { VISIBLE_TYPES, USERS_OPTIONS, SPECIFIC_USERS } from '../../constants'

export interface DataNode {
    title: string
    visible: string
    value: string
    key: string
    users: Array<string>,
    children?: Array<DataNode>
}

export interface TreeAddHandles {
    add(): void
}

export interface TreeAddProps {
    forceUpdate: DispatchWithoutAction
    onAddNewNode: (value: DataNode) => void
}

export interface FormFolderProps {
    index: number
    folder: DataNode
    removeItem: (index: number) => void
    onAddNewSuccess: (value: DataNode, index: number) => void
}

const FormFolder = (props: FormFolderProps) => {
    const { folder, index, removeItem, onAddNewSuccess } = props
    const [form] = Form.useForm()
    const [visible, setVisible] = useState<string | undefined>()

    const onFinish = (values: any) => {
        onAddNewSuccess({ ...folder, ...values }, index)
    }

    const handleCancel = () => {
        removeItem(index)
    }

    const onChangeVisible = (value: string) => {
        setVisible(value);
        form.setFieldsValue({ users: [] });
    }

    return (
        <React.Fragment>
            <div style={{ display: 'flex', margin: 10 }}>
                <span style={{ marginRight: 20 }}>
                    <FolderOutlined />
                </span>
                <Form
                    form={form}
                    name="control-hooks"
                    className="folder-form"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your folder name!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter new folder name" />
                    </Form.Item>
                    <Form.Item
                        name="visible"
                        rules={[
                            {
                                required: true,
                                message: 'Please select your visible folder!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a option visible"
                            options={VISIBLE_TYPES}
                            onChange={onChangeVisible}
                        />
                    </Form.Item>

                    {/* Just display when chose special users */}
                    {visible && visible === SPECIFIC_USERS && (
                        <Form.Item
                            name="users"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select users!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select users..."
                                allowClear
                                mode="multiple"
                                options={USERS_OPTIONS}
                            />
                        </Form.Item>
                    )}

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button
                            danger
                            htmlType="button"
                            style={{ marginRight: 5 }}
                            onClick={handleCancel}
                        >
                            <DeleteOutlined />
                        </Button>

                        <Button type="primary" htmlType="submit">
                            <SaveOutlined />
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Divider />
        </React.Fragment>
    )
}

const TreeAdd = forwardRef<TreeAddHandles, TreeAddProps>((props, ref) => {
    const { forceUpdate, onAddNewNode } = props
    const [addList, setAddList] = useState<DataNode[]>([])

    useImperativeHandle(ref, () => ({
        add() {
            const key = Math.random().toString()
            const folder: DataNode = {
                title: '',
                visible: '',
                value: key,
                key,
                users: [],
                children: [],
            }
            const list = [folder, ...addList]
            setAddList(list)
        },
    }))

    const removeItem = (index: number) => {
        const list = addList
        list.splice(index, 1)
        setAddList(list)
        forceUpdate()
    }

    const onAddNewSuccess = (value: DataNode, index: number) => {
        onAddNewNode(value)
        removeItem(index)
    }

    return (
        <div>
            {(addList || []).map((data, index) => {
                return (
                    <FormFolder
                        key={data.value}
                        index={index}
                        folder={data}
                        removeItem={removeItem}
                        onAddNewSuccess={onAddNewSuccess}
                    />
                )
            })}
        </div>
    )
})

export default TreeAdd
