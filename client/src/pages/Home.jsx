import React, { useEffect, useState } from 'react'
import BlogPost from '../components/BlogPost'
import { Icon } from '@iconify/react';
import axios from 'axios';

const Home = () => {
    const [getBlogs, setGetBlogs] = useState(false)
    const [blogs, setBlogs] = useState({})
    const [blogs2, setBlogs2] = useState({})
    const [tagId, setTagId] = useState(false)
    const [sortOrder, setSortOrder] = useState("1")
    const [searchKey, setSearchKey] = useState("")


    const fetchBlogs = async () => {
        const res = await axios.get(import.meta.env.VITE_SERVER + "/get-blogs");
        if (res.data.result) {
            setBlogs(res.data.blogs)
            setBlogs2(res.data.blogs)
            setGetBlogs(true)
        }
    }

    const [fetchTag, setFetchTag] = useState(false)
    const [tags, setTags] = useState({})
    const getData = async () => {
        const res = await axios.get(import.meta.env.VITE_SERVER + "/get-tags");
        if (res.data.result) {
            setTags(res.data.tags)
            setFetchTag(true)
        }
    }

    useEffect(() => {
        fetchBlogs()
        getData()
    }, [])

    const Tags = () => {
        if (!fetchTag)
            return (<></>)
        else {
            return (
                <>
                    <option value="false">All</option>
                    {tags.map((e) => <option value={e.tag_name} key={e.tag_id}>{e.tag_name}</option>)}
                </>

            )
        }

    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);

        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };

        const formattedDate = date.toLocaleDateString('en-GB', options);

        return formattedDate;
    }

    const BlogPosts = () => {
        if (getBlogs) {
            return <>
                {blogs.map((blog, index) => <BlogPost key={index} username={blog.username} title={blog.title} tag={blog.tag_name} date={formatDate(blog.blog_date)} content={blog.content} />)}
            </>
        }
        return <></>
    }

    const handleSearch = (searchTerm) => {
        if (searchTerm == false) {
            setBlogs(blogs2)
            return;
        }
        setBlogs(blogs2)

        const searchTermLower = searchTerm.toString().toLowerCase();
        setSearchKey(searchTermLower)

        let filteredBlogs = blogs.filter(blog => {
            const blogTitleLower = blog.title.toLowerCase();
            if (!tagId)
                return blogTitleLower.includes(searchTermLower);
            else {
                const tagIdLower = tagId.toString().toLowerCase();
                return (
                    blogTitleLower.includes(searchTermLower) &&
                    (blog.tag_name && blog.tag_name.toLowerCase() === tagIdLower)
                );

            }
        });
        filteredBlogs = filteredBlogs.sort((a, b) => {
            const dateA = new Date(a.blog_date);
            const dateB = new Date(b.blog_date);


            if (sortOrder == "1") {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
        setBlogs(filteredBlogs);
    };

    const handleOrder = (e) => {
        setSortOrder(e)

        let filteredBlogs = blogs.sort((a, b) => {
            const dateA = new Date(a.blog_date);
            const dateB = new Date(b.blog_date);

            if (sortOrder == "1") {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
        setBlogs(filteredBlogs);
    }

    const handleTag = async (e) => {
        setTagId(e)
        let filteredBlogs;
        if (e != false) {
            filteredBlogs = blogs2.filter(blog => {
                const tagIdLower = e.toString().toLowerCase();
                const blogTitleLower = blog.title.toLowerCase();
                if (!searchKey || searchKey == "") {
                    return (
                        blog.tag_name.toLowerCase() == tagIdLower
                    )
                }
                else
                    return (
                        blogTitleLower.includes(searchKey) &&
                        (blog.tag_name && blog.tag_name.toLowerCase() === tagIdLower)
                    );

            });
            setBlogs(filteredBlogs)
        }
        else {
            filteredBlogs = blogs2.filter(blog => {
                const blogTitleLower = blog.title.toLowerCase();
                if (!searchKey || searchKey == "")
                    return (blog)
                return (
                    blogTitleLower.includes(searchKey)
                );

            });
            setBlogs(filteredBlogs)
        }


        filteredBlogs = filteredBlogs.sort((a, b) => {
            const dateA = new Date(a.blog_date);
            const dateB = new Date(b.blog_date);

            if (sortOrder == "1") {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
        setBlogs(filteredBlogs);
    }


    return (
        <div className='container'>
            <div className="blog-container w-100 mt-4 mb-4 border p-4">
                <h2 className="blog-title mt-0">Search</h2>
                <div className='w-100 searchbar' style={{ position: 'relative' }}>
                    <input className='w-100 search' type="search" name="search" id="search" onInput={(e) => handleSearch(e.target.value)} placeholder='Search for a Blog Title' style={{ zIndex: 0 }} />
                    <button className="search-btn btn btn-outline-search" style={{ position: 'absolute', right: 0, zIndex: 2 }}><Icon icon="il:search" /></button>
                </div>
                <div className='row'>
                    <div className="col-6">
                        <select className="form-select" aria-label="Select any tag" id="blog-create-tag" value={tagId} required onChange={(e) => handleTag(e.target.value)} >
                            <option disabled>Select a tag from the options</option>
                            {!fetchTag ? null :
                                <Tags />
                            }
                        </select>
                    </div>
                    <div className="col-6">
                        <select className="form-select" aria-label="Select any tag" id="blog-create-tag" value={sortOrder} required onChange={(e) => handleOrder(e.target.value)} >
                            <option disabled>Select a tag from the options</option>
                            <option value="1">Latest</option>)
                            <option value="0">Ascending</option>)
                        </select>
                    </div>
                </div>
            </div>
            <BlogPosts />
        </div>
    )
}

export default Home