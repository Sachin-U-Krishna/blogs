import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { LoadingButton } from '@mui/lab'
import MyBlogPost from '../components/MyBlogPost';

const MyBlogs = () => {
	const [content, setContent] = useState("")
	const [blogTitle, setBlogTitle] = useState("")
	const [tagId, setTagId] = useState(1)
	const [contentError, setContentError] = useState(null)
	const [loader, setLoader] = useState(false)
	const [blogTitleError, setBlogTitleError] = useState(null)
	const [postBlog, setPostBlog] = useState(-2)

	const [fetchTag, setFetchTag] = useState(false)
	const [tags, setTags] = useState({})
	const getData = async () => {
		const res = await axios.get(import.meta.env.VITE_SERVER + "/get-tags");
		if (res.data.result) {
			setTags(res.data.tags)
			setFetchTag(true)
		}
	}

	const [getBlogs, setGetBlogs] = useState(false)
	const [blogs, setBlogs] = useState({})

	const fetchBlogs = async () => {
		setGetBlogs(false)
		const res = await axios.post(import.meta.env.VITE_SERVER + "/get-my-blogs",{
			auth: localStorage.getItem("auth")
		});
		if (res.data.result) {
			setBlogs(res.data.blogs)
			setGetBlogs(true)
			
		}
	}



	useEffect(() => {
		getData()
		fetchBlogs()
	}, [])


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

	const handleCreateBlog = async (e) => {
		e.preventDefault();

		if (contentError || blogTitleError) {
			return;
		}

		// Loader set
		setLoader(true);

		try {
			const response = await axios.post(import.meta.env.VITE_SERVER + "/create-blog",
				{
					auth: localStorage.getItem("auth"),
					title: blogTitle,
					content,
					tagId,
				}
			);

			if (response.data.result) {
				setBlogTitle("")
				setContent("")
				setTagId(1)
				setPostBlog(1)
				fetchBlogs()
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

	function formatDate(timestamp) {
		const date = new Date(timestamp);

		const options = { day: 'numeric', month: 'numeric', year: 'numeric' };

		const formattedDate = date.toLocaleDateString('en-GB', options);

		return formattedDate;
	}

	const BlogPosts = () => {
		if (getBlogs) {
			return <>
				{blogs.map((blog) => <MyBlogPost key={blog.blog_id} reRender={fetchBlogs} id={blog.blog_id} tag_id={blog.tag_id} username={blog.username} title={blog.title} tag={blog.tag_name} date={formatDate(blog.blog_date)} blogContent={blog.content} />)}
			</>
		}
		return <></>
	}


	return (
		<div className='container'>
			<div className="blog-container w-100 mt-4 mb-4 border p-4">
				{postBlog < 1 && postBlog > -2 ?
					<Alert severity="error" className='mb-2'>{postBlog == 0 ? "Something went wrong" : "Network Error Occured"}</Alert>
					: null
				}
				{postBlog === 1 ?
					<Alert severity="success" className='mb-2'>Blog Published</Alert>
					: null
				}
				<h2 className="blog-title mt-0 mb-3">Create a Blog</h2>
				<div className='w-100 searchbar' style={{ position: 'relative' }}>
					<form onSubmit={(e) => handleCreateBlog(e)}>
						<div className="mb-3">
							<label htmlFor="blog-create-title" className="form-label">Blog Title</label>
							<input type="text" value={blogTitle} onInput={(e) => setBlogTitle(e.target.value)} onBlur={(e) => validateBlogTitle(e)} className="form-control" id="blog-create-title" placeholder="Title" required />
							<small className='text-danger'>{blogTitleError}</small>
						</div>
						<div className="mb-3">
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
			</div>

			<BlogPosts />

		</div>
	)
}

export default MyBlogs