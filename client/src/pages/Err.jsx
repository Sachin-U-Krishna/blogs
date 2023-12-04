import React from 'react'
import "./err.css"

export default function Err() {
    return (
        <div className='error'>
            <main>
                <section>
                    <span>404</span> <p>The requested path could not be found</p>
                </section>
            </main>
        </div>
    )
}
