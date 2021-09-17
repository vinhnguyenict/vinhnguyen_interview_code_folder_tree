import React, { forwardRef, useImperativeHandle, useState, DispatchWithoutAction } from "react";
import { Form, Input, Select, Divider, Button } from "antd";
import {
  FolderOutlined,
  SaveOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { VISIBLE_TYPES } from "../../constants";


export interface DataNode {
  title: string;
  visible: string,
  value: string;
  key: string;
  children?: Array<DataNode>
}

export interface TreeAddHandles {
  add(): void;
}

export interface TreeAddProps {
  forceUpdate: DispatchWithoutAction;
  onAddNewNode: (value: DataNode) => void;
}

export interface FormFolderProps {
  index: number,
  folder: DataNode,
  removeItem: (index: number) => void;
  onAddNewSuccess: (value: DataNode, index: number) => void;
}

const FormFolder = (props: FormFolderProps) => {
  const { folder, index, removeItem, onAddNewSuccess } = props;
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Success:', values);
    onAddNewSuccess({ ...folder, ...values }, index);
  };

  const handleCancel = () => {
    removeItem(index)
  }

  return (
    <React.Fragment>
      <div style={{ display: "flex", margin: 10 }}>
        <span style={{ marginRight: 20 }}>
          <FolderOutlined />
        </span>
        <Form
          form={form} name="control-hooks"
          className="folder-form"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Please input your folder name!' }]}
          >
            <Input placeholder="New folder" />
          </Form.Item>
          <Form.Item name="visible" rules={[{ required: true, message: 'Please select your visible folder!' }]}>
            <Select
              placeholder="Select a option visible"
              allowClear
              options={VISIBLE_TYPES}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button danger htmlType="button" style={{ marginRight: 5 }} onClick={handleCancel}>
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
  const { forceUpdate, onAddNewNode } = props;
  const [addList, setAddList] = useState<DataNode[]>([]);

  useImperativeHandle(ref, () => ({
    add() {
      const key = Math.random().toString()
      const folder: DataNode = {
        title: '',
        visible: '',
        value: key,
        key,
        children: []
      }
      const list = [folder, ...addList];
      setAddList(list);
    },
  }));

  const removeItem = (index: number) => {
    const list = addList;
    list.splice(index, 1);
    setAddList(list);
    forceUpdate();
  }

  const onAddNewSuccess = (value: DataNode, index: number) => {
    onAddNewNode(value);
    removeItem(index);
  }

  return <div>
    {
      (addList || []).map((data, index) => {
        return <FormFolder key={data.value} index={index} folder={data} removeItem={removeItem} onAddNewSuccess={onAddNewSuccess} />
      })
    }
  </div>;
});

export default TreeAdd;
