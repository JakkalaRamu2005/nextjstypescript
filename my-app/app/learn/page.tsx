
"use client";
import { useState, useEffect } from "react";
import "./learn.css";

interface LearningModule {
    PathName: string;
    ModuleNumber: string;
    ModuleName: string;
    Description: string;
    Resources: string[];
    EstimatedHours: string;
    Difficulty: string;
}

export default function LearnPage() {
    const [allModules, setAllModules] = useState<LearningModule[]>([]);
    const [displayedModules, setDisplayedModules] = useState<Record<string, LearningModule[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter States
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");

    // Video Modal State
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/learning-modules");
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();

                // Flatten the grouped data back to array for easier filtering
                const flatModules: LearningModule[] = [];
                Object.values(data.modules).forEach((group: any) => {
                    flatModules.push(...group);
                });

                setAllModules(flatModules);
                setDisplayedModules(data.modules);
            } catch (err) {
                setError("Failed to load learning modules. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = allModules;

        // Search Filter
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            filtered = filtered.filter(module =>
                module.ModuleName.toLowerCase().includes(lowerSearch) ||
                module.Description.toLowerCase().includes(lowerSearch)
            );
        }

        // Category Filter
        if (selectedCategory !== "All") {
            filtered = filtered.filter(module => module.PathName === selectedCategory);
        }

        // Difficulty Filter
        if (selectedDifficulty !== "All") {
            filtered = filtered.filter(module => module.Difficulty === selectedDifficulty);
        }

        // Re-group by PathName
        const grouped: Record<string, LearningModule[]> = {};
        filtered.forEach(module => {
            if (!grouped[module.PathName]) {
                grouped[module.PathName] = [];
            }
            grouped[module.PathName].push(module);
        });

        setDisplayedModules(grouped);

    }, [searchText, selectedCategory, selectedDifficulty, allModules]);

    const handleResourceClick = (e: React.MouseEvent, link: string) => {
        const videoId = extractVideoID(link);
        if (videoId) {
            e.preventDefault();
            setSelectedVideo(videoId);
        }
    };

    // Get unique categories and difficulties for dropdowns
    const categories = ["All", ...Array.from(new Set(allModules.map(m => m.PathName)))];
    const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

    if (loading) {
        return (
            <div className="learn-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your curriculum...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="learn-container">
                <div className="loading-error">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const totalModulesFound = Object.values(displayedModules).reduce((acc, curr) => acc + curr.length, 0);

    return (
        <div className="learn-container">
            {selectedVideo && (
                <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
                    <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedVideo(null)}>&times;</button>
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                            title="YouTube video player"
                            className="video-frame"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <header className="learn-header">
                <h1 className="learn-title">AI Learning Curriculum</h1>
                <p className="learn-subtitle">
                    Comprehensive, step-by-step learning paths curated to take you from beginner to expert.
                    Updated weekly from our community resources.
                </p>
            </header>

            {/* Filter Section */}
            <div className="filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search modules..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="category-filter">
                    <label className="filter-label">Path:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="category-filter">
                    <label className="filter-label">Difficulty:</label>
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="category-select"
                    >
                        {difficulties.map((diff) => (
                            <option key={diff} value={diff}>{diff}</option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="results-count">{totalModulesFound} modules found</p>

            {totalModulesFound === 0 ? (
                <div className="no-results">
                    <p>No modules found matching your criteria.</p>
                </div>
            ) : (
                Object.entries(displayedModules).map(([pathName, pathModules]) => (
                    <section key={pathName} id={toSlug(pathName)} className="path-section">
                        <div className="path-header">
                            <h2 className="path-name">{pathName}</h2>
                            <span className="modules-count">
                                {pathModules.length} Modules
                            </span>
                        </div>

                        <div className="modules-grid">
                            {pathModules.map((module, index) => (
                                <div key={index} className="module-card">
                                    <div className="module-meta">
                                        <span className="module-number">Module {module.ModuleNumber}</span>
                                        <span className={`module-difficulty ${module.Difficulty}`}>{module.Difficulty}</span>
                                    </div>

                                    <h3 className="module-name">{module.ModuleName}</h3>
                                    <p className="module-description">{module.Description}</p>

                                    <div className="module-hours-row">
                                        <svg className="clock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {module.EstimatedHours} Hours
                                    </div>

                                    <div className="module-resources">
                                        <h4 className="resources-title">Resources</h4>
                                        <div className="resource-list">
                                            {module.Resources.map((link, idx) => (
                                                <a
                                                    key={idx}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="resource-link"
                                                    onClick={(e) => handleResourceClick(e, link)}
                                                >
                                                    <span className="resource-icon">🔗</span>
                                                    {GetDomainName(link)}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))
            )}
        </div>
    );
}

function toSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function extractVideoID(url: string) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : null;
}

function GetDomainName(url: string) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        if (domain.includes('youtube') || domain.includes('youtu.be')) return 'Watch Tutorial';
        return domain;
    } catch {
        return 'View Resource';
    }
}
