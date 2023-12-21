
import React, { useCallback, useState } from 'react'
import {useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Tooltip} from "@nextui-org/react";
import { PenSquare } from 'lucide-react';
import {Input} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";
import axios from "axios";
import { useStore } from '@dataverse/hooks';
import { SYSTEM_CALL } from '@dataverse/dataverse-connector';
import { postModelId } from '@/output';

import toast from 'react-hot-toast';

const Post = () => {
    const {isOpen,onOpen,onOpenChange}=useDisclosure();
    const [title,setTitle] = useState(``);
    const [description,setDescription] = useState(``);
    const [content,setContent] = useState(``);
    const {dataverseConnector}=useStore();
    const [image, setImage] = useState(``);

    const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `0ef00f53d73c612c0148`,
            pinata_secret_api_key: `7f7a40525ca96f000fdf4956e6e65bdffe35365f73f06a5c36665343c52be173`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        setImage(ImgHash);
        toast.success("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }

  };
  const retrieveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
     console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };



 

  const createPost= async()=>
  {
    const res=await dataverseConnector.runOS({
      method: SYSTEM_CALL.createIndexFile,
      params: {
        modelId:postModelId,
        fileName: "file.json",
        fileContent: {
          modelVersion: "0.0.1",
          title: title,
          description: description,
          image: image,
          content: content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments:[],
      },
    }
    })
    toast.success("Post Created")
  }

  return (
    <>
    <Tooltip showArrow={true} content="Create a post">
          <Button
          className='h-[50px] w-[50px] bg-blue-500 rounded-full fixed bottom-10 z-10 right-10 hover:bg-blue-400 shadow-lg cursor-pointer' variant='solid' onPress={onOpen}
          >
        
        <PenSquare />
          </Button>
      </Tooltip>
    
    
    <Modal backdrop='blur' size='xl' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create Post</ModalHeader>
            <ModalBody>
              <Input type="text" label="Title" value={title} onValueChange={setTitle} />
              <Input type="text" label="Description" value={description} onValueChange={setDescription} />
              <Textarea
                label="Content"
                placeholder="Enter your Content"
                value={content}
                onValueChange={setContent}
              />
              <form className="flex gap-2 flex-col" onSubmit={handleSubmit}>
                <label htmlFor="file-upload" className="choose">
                  Choose Image
                </label>
                <input
                  
                  type="file"
                  id="file-upload"
                  name="data"
                  onChange={retrieveFile}
                />
               
                <Button type="submit" color='primary' variant='solid' disabled={!file}>
                  Upload File
                </Button>
                </form>

            </ModalBody>
            <ModalFooter>
            <Button color='primary' variant='solid' onClick={createPost}>Create</Button>
              
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    </>
  )
}
export default Post;
