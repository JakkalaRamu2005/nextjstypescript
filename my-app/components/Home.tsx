"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./style/home.css"

export default function Home() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [totalTools, setTotalTools] = useState(0);
    const [savedToolsCount, setSavedToolsCount] = useState(0);

    useEffect(() => {
        fetchUserData();
        fetchToolsCount();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/profile", {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setUserName(data.name);
                setSavedToolsCount(data.savedTools?.length || 0);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchToolsCount = async () => {
        try {
            const res = await fetch("/api/tools");
            const data = await res.json();
            setTotalTools(data.total || 0);
        } catch (error) {
            console.error("Error fetching tools count:", error);
        }
    };

    return (
        <div>
            
            <div className="home-container">
                <div className="welcome-section">
                    <h1 className="welcome-title">Welcome back, {userName || "User"}! 👋</h1>
                    <p className="welcome-subtitle">Discover the latest AI tools updated weekly</p>
                </div>

                <div className="stats-section">
                    <div className="stat-card">
                        <div className="stat-icon">🤖</div>
                        <div className="stat-info">
                            <h3 className="stat-number">{totalTools}</h3>
                            <p className="stat-label">Total AI Tools</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-info">
                            <h3 className="stat-number">{savedToolsCount}</h3>
                            <p className="stat-label">Saved Tools</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                            <h3 className="stat-number">Weekly</h3>
                            <p className="stat-label">New Updates</p>
                        </div>
                    </div>
                </div>

                <div className="content-section">
                    <h2 className="section-title">What we offer:</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon">🚀</span>
                            <h3>Latest AI Tools</h3>
                            <p>Discover new AI tools updated every week</p>
                        </div>

                        <div className="feature-card">
                            <span className="feature-icon">📂</span>
                            <h3>Categorized</h3>
                            <p>Tools organized by category for easy browsing</p>
                        </div>

                        <div className="feature-card">
                            <span className="feature-icon">💰</span>
                            <h3>Free & Paid</h3>
                            <p>Both free and premium options available</p>
                        </div>

                        <div className="feature-card">
                            <span className="feature-icon">🔗</span>
                            <h3>Direct Links</h3>
                            <p>Quick access to try tools instantly</p>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button onClick={() => router.push("/tools")} className="browse-btn">
                            Browse AI Tools →
                        </button>
                        <button onClick={() => router.push("/profile")} className="profile-btn">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
