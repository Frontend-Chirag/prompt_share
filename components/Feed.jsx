"use client";

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';


// component funtion 
const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
       {data.map((post) => (
        <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
       ))}
    </div>
  )
}


const Feed = () => {

  const [ posts ,setPosts ] = useState([]);


  // Search States
  const [searchText, setSearchText] = useState('');
  const [searchTimeOut, setSearchTimeOut ] = useState(null);
  const [searchResults , setSearchResults ] = useState([]);



  useEffect(() => {  
  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();

    setPosts(data);
  }
    fetchPosts();
  }, []);

  // filter Prompt from search
  const FilterPrompt = (searchtext) => {
    const regex = new RegExp(searchtext, "i");  // 'i' flag for case-insenstive search
    return posts.filter((item) =>  regex.test(item.creator.username) || 
                                   regex.test(item.tag) ||
                                   regex.test(item.prompt)
  )}

  const handleSearchChange = (e) => {
     clearTimeout(searchTimeOut);
     setSearchText(e.target.value);

    //  debounce Method
    setSearchTimeOut(
      setTimeout(() => {
        const searchResult = FilterPrompt(e.target.value);
        setSearchResults(searchResult);
      },500)
    )
}

const handleTagClick= (tagname) => {
   setSearchText(tagname);

   const searchResult = FilterPrompt(tagname);
   setSearchResults(searchResult);
}

  return (
    <section className='feed'> 
     <form className='relative w-full flex-center'>
      <input
         type='text'
         placeholder='Search fro a tag or a username'
         value={searchText}
         onChange={handleSearchChange}
         required
         className='search_input peer'
      />
     </form>
     {/* All Prompts */}
     
     { searchText ? ( 
        <PromptCardList 
        data ={searchResults} 
        handleTagClick={handleTagClick}/> 
        ) : (
        <PromptCardList 
        data={posts}  
        handleTagClick={handleTagClick}/>
        )
    }

    
    </section>
  )
}

export default Feed