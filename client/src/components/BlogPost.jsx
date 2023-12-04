import React from 'react'
import { Icon } from '@iconify/react';

const BlogPost = ({ username, title, tag, date, content }) => {
    return (
        <div className="blog-container w-100 mt-4 mb-4 border p-4">
            <p className='mb-0 d-flex align-items-center' style={{ color: '#FF7800' }}><Icon icon="ph:user" className='border' style={{ borderRadius: '50%' }} color="#a1a1a1" width="20" />&nbsp;{username}</p>
            <h2 className="blog-title mt-0">{title}</h2>
            <div className="blog-info d-flex d-inline text-muted">
                <div className="blog-tags border-end pe-3">{tag}</div>
                <div className="blog-date ps-3 d-flex align-items-center"><Icon icon="uil:calender" color="#d3d3d3" width="18"  />&nbsp;{date}</div>
            </div>
            <div className="blog-content text-justify mt-3">
                {content}
            </div>
        </div>
    )
}

export default BlogPost