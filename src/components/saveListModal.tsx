import { Modal, Input } from "antd";
import { saveList } from "../utils/listController";
import React from "react";

interface SaveListModalProps {
  open: boolean;
  channelList: string[];
  handleClose: () => void;
}

export const SaveListModal: React.FC<SaveListModalProps> = ({
  open,
  channelList,
  handleClose
}) => {

  const [listName, setListName] = React.useState<string>("");

  const handleSave = () => {
    saveList(listName, channelList);
    setListName("");
    handleClose();
  };


  return (
    <Modal
      title="Save List"
      open={open}
      onCancel={handleClose}
      onOk={handleSave}
    >
      <Input
        placeholder="List Name"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
    </Modal>

  )
};