import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { useStore } from '@dataverse/hooks';
import { Trash2 } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';

const DeletePost = ({fileId}) => {
    const {dataverseConnector}= useStore()
    const handleDeleteBtn = async () => {
        try {
          await dataverseConnector.runOS({
            method: SYSTEM_CALL.removeFiles,
            params: {
              fileIds: [fileId],
            },
          });
          toast.success("Post Deleted")
        } catch (error) {
          toast.error(error);
          console.error(error);
        }
      };
    
  return (
    <Trash2 color="#ff1414" onClick={handleDeleteBtn} className='cursor-pointer' />
  )
}

export default DeletePost