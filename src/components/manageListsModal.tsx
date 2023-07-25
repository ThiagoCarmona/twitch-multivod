import { Modal, Select, Button, Popconfirm } from "antd";
import { getLists, removeList } from "../utils/listController";
import { SavedList } from "../types";
import React from "react";

interface manageListsModalProps {
  open: boolean;
  onListSelect: (channels: string[]) => void;
  handleClose: () => void;
}

export const ManageListsModal: React.FC<manageListsModalProps> = ({
  open,
  onListSelect,
  handleClose,
}) => {

  const [lists, setLists] = React.useState<SavedList[]>([]);
  const [selectedList, setSelectedList] = React.useState<SavedList | undefined>();

  React.useEffect(() => {
    const lists = getLists();
    setLists(lists);
  }, []);

  React.useEffect(() => {
    const lists = getLists();
    setLists(lists);
  }, [open]);

  return (
    <Modal
      title="Manage Lists"
      open={open}
      onCancel={handleClose}
      footer={null}
      style={{
        width: '200px'
      }}
    >
      <Select
        style={{ width: '100%' }}
        placeholder="Select a list"
        onChange={(value) => setSelectedList(lists.find(list => list.listName === value))}
        value={selectedList?.listName || undefined}
      >
        {lists.map(list => (
          <Select.Option key={list.listName} value={list.listName}>{list.listName}</Select.Option>
        ))}
      </Select>
      <Button
        style={{ margin: '0.4rem' }}
        onClick={() => {
          onListSelect(selectedList?.channels || [])
          setSelectedList(undefined)
          handleClose()
        }}
        disabled={!selectedList}
      >
        Load
      </Button>
      <Popconfirm
        title="Are you sure you want to delete this list?"
        onConfirm={() => {
          removeList(selectedList?.listName || '')
          setLists(getLists())
          setSelectedList(undefined)
        }
        }
        onCancel={() => { }}
        okText="Yes"
        cancelText="No"
      >
        <Button
          style={{ 
            margin: '0.4rem',
          }}
          danger
          disabled={!selectedList}
        >
          Delete
        </Button>
      </Popconfirm>
    </Modal>
  )
}