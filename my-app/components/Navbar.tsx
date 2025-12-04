"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./style/navbar.css"

export default function Navbar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            if (res.ok) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <h2>AI Tools Hub</h2>
                </div>

                <button className="menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
                    <a href="/" className="nav-link">Home</a>
                    <a href="/tools" className="nav-link">AI Tools</a>
                    <a href="/profile" className="nav-link">Profile</a>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>
        </nav>
    );
}
