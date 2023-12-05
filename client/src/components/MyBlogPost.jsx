import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { LoadingButton } from '@mui/lab'
import Alert from '@mui/material/Alert';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const MyBlogPost = ({ username, title, tag, tag_id, date, blogContent, id, reRender }) => {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState(0);
    const [content, setContent] = useState(blogContent)
    const [blogTitle, setBlogTitle] = useState(title)
    const [tagId, setTagId] = useState(tag_id)
    const [contentError, setContentError] = useState(null)
    const [loader, setLoader] = useState(false)
    const [blogTitleError, setBlogTitleError] = useState(null)
    const [postBlog, setPostBlog] = useState(-2)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
        getData()
    }, [])

    const deleteBlog = async () => {
        const res = await axios.post(import.meta.env.VITE_SERVER + "/delete-my-blog", {
            id: id,
            auth: localStorage.getItem("auth")
        });
        if (res.data.result) {
            reRender()
            setOpen(false)
        }
    }

    const openModalBox = (type) => {
        setModalType(type)
        handleOpen()
    }

    const validateContent = (e) => {
        let content = e.target.value;

        content = content.trim();

        const wordCount = content.split(/\s+/).length;

        if (wordCount > 300) {
            content = content.split(/\s+/).slice(0, 300).join(' ');
            setContent(content);
        }
        else {
            content = content.split(/\s+/).join(' ');
            setContent(content);
        }

        var msg = "";
        if (wordCount < 2) {
            msg += "Minimum 2 words";
        }

        setContentError(msg);

        if (wordCount >= 2) {
            setContentError(null);
            return;
        }
    }

    const validateBlogTitle = (e) => {
        let title = e.target.value;

        title = title.replace(/\s+/g, ' ');

        title = title.trim();

        var msg = "";

        if (title.length < 2) {
            msg += "Minimum 2 characters";
        }

        if (title.length > 200) {
            msg += " Maximum 200 characters";
            title = title.slice(0, 200);
        }

        setBlogTitle(title);
        setBlogTitleError(msg);

        if (title.length >= 2 && title.length <= 200) {
            setBlogTitleError(null);
            return;
        }
    }

    const Tags = () => {
        if (!fetchTag)
            return (<></>)
        else {
            return (
                <>
                    {tags.map((e) => <option value={e.tag_id} key={e.tag_id}>{e.tag_name}</option>)}
                </>

            )
        }

    }

    const handleEditBlog = async (e) => {
        e.preventDefault();

        if (contentError || blogTitleError) {
            return;
        }

        // Loader set
        setLoader(true);

        try {
            const response = await axios.post(import.meta.env.VITE_SERVER + "/edit-blog",
                {
                    auth: localStorage.getItem("auth"),
                    title: blogTitle,
                    content,
                    tagId,
                }
            );

            console.log(response.data.result)

            if (response.data.result) {
                setBlogTitle("")
                setContent("")
                setTagId(1)
                setPostBlog(1)
                setTimeout(() => { setOpen(false); reRender() }, 2000)                
            } else {
                console.error("Blog creation failed:", response.data.message);
                setPostBlog(0)
            }
            setTimeout(() => setPostBlog(-2), 4000)
        } catch (error) {
            console.error("Network error:", error.message);
            setPostBlog(-1)
        } finally {
            setLoader(false);
        }

    };

    return (
        <div className="blog-container w-100 mt-4 mb-4 border p-4">
            <p className='mb-0 d-flex align-items-center' style={{ color: '#FF7800' }}><Icon icon="ph:user" className='border' style={{ borderRadius: '50%' }} color="#a1a1a1" width="20" />&nbsp;{username}</p>
            <h2 className="blog-title mt-0">{title}</h2>
            <div className="blog-info d-flex d-inline text-muted">
                <div className="blog-tags border-end pe-3">{tag}</div>
                <div className="blog-date ps-3 d-flex align-items-center"><Icon icon="uil:calender" color="#d3d3d3" width="18" />&nbsp;{date}</div>
            </div>
            <div className="blog-content text-justify mt-3">
                {blogContent}
            </div>
            <button className="btn btn-warning edit-btn" onClick={() => openModalBox(0)}><Icon icon="mdi:pencil" color='white' /></button>
            <button className="btn btn-danger delete-btn" onClick={() => openModalBox(1)}><Icon icon="gridicons:trash" /></button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="manage-blog-modal"
                aria-describedby="manage-blog-state"
            >
                <Box sx={style}>
                    <Typography id="manage-blog-modal" className={modalType ? 'text-danger' : "text-warning"} variant="h6" component="h2">
                        {modalType ? "Delete a blog" : "Edit this blog"}
                    </Typography>
                    {modalType ?
                        <>
                            <Typography id="manage-blog-state" sx={{ mt: 2 }}>
                                Are you sure you want to delete the blog with the title: <b>{title}</b>
                            </Typography>
                            <button className="btn btn-danger mt-4 w-100" onClick={deleteBlog} >Delete</button>
                        </>
                        :
                        <>
                            {postBlog < 1 && postBlog > -2 ?
                                <Alert severity="error" className='mb-2'>{postBlog == 0 ? "Something went wrong" : "Network Error Occured"}</Alert>
                                : null
                            }
                            {postBlog === 1 ?
                                <Alert severity="success" className='mb-2'>Blog Published</Alert>
                                : null
                            }
                            <div className='w-100 searchbar' style={{ position: 'relative' }}>
                                <form onSubmit={(e) => handleEditBlog(e)}>
                                    <div className="mb-3">
                                        <label htmlFor="blog-create-title" className="form-label">Blog Title</label>
                                        <input type="text" value={blogTitle} onInput={(e) => setBlogTitle(e.target.value)} onBlur={(e) => validateBlogTitle(e)} className="form-control" id="blog-create-title" placeholder="Title" required />
                                        <small className='text-danger'>{blogTitleError}</small>
                                    </div>
                                    <div className="mb-3" >
                                        <label htmlFor="blog-create-tag" className="form-label">Select a Tag</label>

                                        <select className="form-select" aria-label="Select any tag" id="blog-create-tag" value={tagId} required onChange={(e) => setTagId(e.target.value)} >
                                            <option disabled>Select a tag from the options</option>
                                            {!fetchTag ? null :
                                                <Tags />
                                            }
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="blog-create-content" className="form-label">Enter content</label>
                                        <textarea className="form-control" value={content} onInput={(e) => setContent(e.target.value)} onBlur={(e) => validateContent(e)} id="blog-create-content" rows="2" placeholder='Content' required></textarea>
                                        <small className='text-danger'>{contentError}</small>
                                    </div>
                                    <div className="mb-3 mt-4">
                                        <LoadingButton
                                            variant="contained"
                                            id="submit-btn"
                                            type='submit'
                                            size='large'
                                            loading={loader}
                                        >
                                            Post
                                        </LoadingButton>
                                    </div>
                                </form>
                            </div>
                        </>
                    }
                </Box>
            </Modal>
        </div>

    )
}

export default MyBlogPost