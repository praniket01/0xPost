"use client";
import {  profileModelId } from "@/output";
import { useCreateIndexFile, useStore } from "@dataverse/hooks";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Input,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { FolderType } from '@dataverse/dataverse-connector';
import { SYSTEM_CALL } from "@dataverse/dataverse-connector";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion"

function CreateUser() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name,setName]=useState('');
  const [description,setDescription]=useState('');
  const [social,setSocial]=useState('');
  const [image, setImage] = useState('');




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
        toast.success("Image Uploaded")
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
   
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0]; 
     console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };


  
  const profileModel = profileModelId;
  
  const { dataverseConnector,pkh,address } = useStore();
  


const createProfile = async () => {
    if (!profileModel) {
      console.error("profileModel undefined");
      return;
    }
   
    const result =await dataverseConnector.runOS({
      method: SYSTEM_CALL.createIndexFile,
      params: {
      modelId: profileModel,
      fileName: "Create profile",
      fileContent:{
        name: name,
        description: description,
        image: image,
        backgroundImage: "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        socialMedia: social,
        subscribed: [],
        saved: [],
        address:address,
      }
      },
    });
    console.log(result);
    toast.success('Profile Created')
    
  };



 


  return (
    <>
      <div className='flex flex-wrap gap-3'>
          <Button onPress={onOpen} color="primary" variant="solid" className='mt-2 ml-6'>Create User</Button>
        <Modal
        backdrop="blur"
          size={"md"}
          isOpen={isOpen}
          onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Create User
                </ModalHeader>
                <ModalBody>
                  <Input
                    isRequired
                    type='text'
                    label='Name'
                    placeholder='Enter your name'
                    value={name}
                    onValueChange={setName}
                  />
                  <Textarea
                    label='Description'
                    placeholder='Enter your description'
                    value={description}
                    onValueChange={setDescription}
                    
                  />
                  <Input
  
                    type='text'
                    label='Twitter'
                    placeholder='Enter your Twitter profile link'
                    value={social}
                    onValueChange={setSocial}
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
                  <Button
                    color='danger'
                    variant='light'
                    onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color='primary'
                    onPress={createProfile}>
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default CreateUser;
