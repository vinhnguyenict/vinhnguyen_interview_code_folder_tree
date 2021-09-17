import React, { useState, useRef, useReducer } from "react";
import { TreeSelect, Typography, Tree, Input, Button } from 'antd';

import {
  FolderOutlined
} from '@ant-design/icons';
import TreeAdd, { TreeAddHandles, DataNode } from "../TreeAdd";

const { TreeNode } = Tree;
const { Search } = Input;
const { Text } = Typography;

interface PropsNode {
  data: DataNode;
}

const TreeNodeFolder = (props: PropsNode) => {
  const { data } = props
  return <div>
    <div style={{ display: "flex" }}>
      <span style={{ marginRight: 10 }}>
        <FolderOutlined />
      </span>
      <div>
        <div>
          <Text style={{ display: "block" }}>{data.title}</Text>
          <Text style={{ fontSize: "80%" }}>{data.visible}</Text>
        </div>
      </div>

    </div>
  </div>
}

const TreeFolder = () => {
  const refAdd = useRef<TreeAddHandles>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [nodeSelected, setNodeSelected] = useState<string | undefined>(undefined);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  const handleAddNewFolder = () => {
    if (refAdd && refAdd.current) {
      refAdd.current.add();
      forceUpdate();
    }
  }

  const onChangeNode = (selectedKeys: React.Key[], info: any) => {
    setNodeSelected(info.node.key);
    setOpen(false);
  }


  const onAddNewNode = (value: DataNode) => {
    const newTreeData = [value, ...treeData];
    setTreeData(newTreeData);
  }

  const onDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: any, key: any, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: any;
      let i: any;
      loop(data, dropKey, (item: any, index: any, arr: any) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTreeData(data);
  };


  const treeDataSearch = React.useMemo(() => {

    if (!searchValue) {
      return treeData
    }
    return (treeData || []).filter((treeNode: DataNode) => {
      const { title, children } = treeNode;
      if (title.indexOf(searchValue) !== -1) {
        return true;
      }

      if (children?.length) {
        return !!children.find(child => child.title.indexOf(searchValue) !== -1)
      }


      return false;
    })
  }, [treeData, searchValue]);

  return <React.Fragment>
    <TreeSelect
      style={{ width: '100%' }}
      value={nodeSelected}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      open={open}
      placeholder="Select folder"
      treeDefaultExpandAll
      treeData={treeData}
      onFocus={()=> setOpen(true)}
      dropdownRender={(props) => {
        return (
          <div>
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Search style={{ flex: 'auto' }} placeholder="Search" value={searchValue} onChange={({ target }) => setSearchValue(target.value)} />
              <Button style={{ marginLeft: 5 }} onClick={handleAddNewFolder}>Add New Folder</Button>
            </div>
            <TreeAdd ref={refAdd} forceUpdate={forceUpdate} onAddNewNode={onAddNewNode} />
            <Tree
              className="draggable-tree"
              draggable
              blockNode
              onSelect={onChangeNode}
              onDrop={onDrop}
            >
              {
                (treeDataSearch || []).map((treeNode, index) => {
                  return <TreeNode key={treeNode.key} title={<TreeNodeFolder data={treeNode} />}>
                    {
                      (treeNode.children || []).map((childNode, idx) => {
                        return <TreeNode key={childNode.key} title={<TreeNodeFolder data={childNode} />} />
                      })
                    }
                  </TreeNode>
                })
              }
            </Tree>
          </div>
        )
      }}
    >
    </TreeSelect>

    <div style={{display: "flex", justifyContent: "end", width: "100%", marginTop: 20}}>
      <Button style={{marginRight: 10}}>CANCEL</Button>
      <Button type="primary">SAVE</Button>
    </div>
  </React.Fragment>
}

export default TreeFolder;