"use client";
import LoadPosts from "@/app/components/Dataverse/LoadPosts";
import { Input, Spacer } from "@nextui-org/react";
import { IoSearchCircleSharp } from "react-icons/io5";

import { useState, useEffect } from "react";
import { useStore } from "@dataverse/hooks";
import { RESOURCE, SYSTEM_CALL } from "@dataverse/dataverse-connector";
import { postModelId } from "@/output";
import Cards from "@/app/components/Cards";

const Search = () => {
  const [fileContents, setFileContents] = useState<Array<any>>([]);
  const { dataverseConnector } = useStore();
  const fetchPosts = async () => {
    try {
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId: postModelId,
        },
      });
      const contents = Object.keys(res).map((key) => res[key].fileContent);
      const reversedContents = contents.reverse();
      setFileContents(reversedContents);
      console.log(reversedContents);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // search logic
  const [searchData, setSearchData] = useState<Array<any>>([]);

  const handleSeach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    let newArrmap = fileContents.map((item) => ({
      title: item.content.title,
      description: item.content.description,
      content: item.content.content,
      createdAt: item.content.createdAt,
      image: item.content.image,
      fileId: item.file.fileId,
    }));

    let newArrfilter = newArrmap.filter(
      (item) =>
        item.title &&
        value &&
        item.title.toLowerCase().includes(value.toLowerCase())
    );

    setSearchData(newArrfilter);
  };

  const handleReturn = () => {
    const inpVal: HTMLInputElement | null = document.getElementById(
      "searchInp"
    ) as HTMLInputElement;
    inpVal.value = "";
    setSearchData([]);
  };

  return (
    <>
      <div className='bg-white rounded-lg p-4 h-full overflow-y-auto'>
        {/* Input */}
        <Input
          type='text'
          id='searchInp'
          placeholder='Search Bar'
          labelPlacement='outside'
          onChange={handleSeach}
          startContent={
            <IoSearchCircleSharp className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
          }
        />

        <Spacer x={10} />

        {/* filtered data */}
        <div
          className='bg-white rounded-md p-4'
          style={
            searchData.length === 0 ? { display: "none" } : { display: "block" }
          }>
          {searchData.map((item, index) => (
            <div key={index}>
              <h1 className='text-white'>{item.text}</h1>
              <Cards
                title={item.title}
                description={item.description}
                content={item.content}
                createdAt={item.createdAt}
                image={item.image}
                fileId={item.fileId}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Search;