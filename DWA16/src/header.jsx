import React from "react"

export default function Header() {
    return (
        <header className="header">
            <img 
                src="https://i.pinimg.com/474x/a0/15/05/a01505c6a3daa0e364bf074b0cc690e8.jpg" 
                className="header--image"
            />
            <h2 className="header--title">Meme Generator</h2>
            <h4 className="header--project">React Course - Project 3</h4>
        </header>
    )
}