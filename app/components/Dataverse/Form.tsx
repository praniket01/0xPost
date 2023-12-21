import React, { useEffect } from 'react'
import {
    useApp,
    useCollectFile,
    useCreateIndexFile,
    useLoadDatatoken,
    useFeedsByAddress,
    useMonetizeFile,
    useStore,
  } from "@dataverse/hooks";

  import { useCallback,useState } from "react";
import { appId, postModelId } from '@/output';

const Form = () => {
    const [currentFileId, setCurrentFileId] = useState<string>();
    const postModel = postModelId;
    const postVersion = "0.0.1";
    const { dataverseConnector } = useStore();
    console.log({ dataverseConnector });


    const [title,setTitle] = useState(``);
    const [description,setDescription] = useState(``);
    const [post , setPost] = useState(``);
    const [image, setImage] = useState(``);

    

    const { createIndexFile } = useCreateIndexFile({
        onSuccess: result => {
          console.log("[createFile]create file success:", result);
          setCurrentFileId(result.fileContent.file.fileId);
        },
      });
    const createPost = useCallback(async () => {
        if (!postModel) {
          console.error("postModel undefined");
          return;
        }
    
        await createIndexFile({
          modelId: postModelId,
          fileName: "create file test",
          fileContent: {
            modelVersion: postVersion,
            title : title,
            description : description,
            post : post,
            text: "hello",
            images: [
              "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
            ],
            videos: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }, [postModel, createIndexFile]);

  return (
    <div>
       <div className='bg-slate-100 h-[500px] pt-10 w-full pl-5 pr-5 rounded-lg'>
        <input id="title" className='rounded-lg h-[50px] w-full pl-5 pr-5 mb-5 'placeholder='Enter Title Here...' type='text' onChange={(e)=>{setTitle(e.target.value) ; console.log(title)}}></input>
        
        <input id="description" className='rounded-lg h-[50px] w-full pl-5 pr-5 mt-5 mb-5'placeholder='Enter your Description Here...' type='text' onChange={(e)=>{setDescription(e.target.value) ; console.log(title)}}></input>
        <textarea id="message" name="mes+7\sage" className='rounded-lg h-[100px] w-full pl-5 pr-5 mt-5 mb-5'placeholder='Start Writing your Post...' onChange={(e)=>{setPost(e.target.value) ; console.log(post)}}></textarea>
       <label className='text-lg font-serif text mx-5'> Post your sweet memory</label> <input type="file" id="imageInput" name="image" accept="image/*" onChange={(e)=>{setImage(e.target.value) ; console.log(image)}}></input>
        <button type="submit" value="Create post" className='justify-end cursor-pointer w-40 h-10 bg-blue-500 hover:bg-blue-300 rounded-lg' onClick={createPost}></button>
    </div>

        
      

    </div>
  )
}

export default Form