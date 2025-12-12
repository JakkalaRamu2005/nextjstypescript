import { NextResponse } from 'next/server';
import { Resource } from '@/types/resource';

// Using the same Spreadsheet ID, assuming 'Resources' might be the first tab (gid=0) or similar.
// Update 'gid' if the specific tab ID is known.
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1JbqFSwtCEmg51txSvDM4UpJ-4fsY8kqhO9YSG8OUgxE/export?format=csv&gid=0";

export async function GET() {
    try {
        const response = await fetch(SHEET_URL);

        let modules: Resource[] = [];

        if (response.ok) {
            const text = await response.text();
            // Basic check to see if we got HTML (error page) instead of CSV
            if (!text.trim().startsWith("<!DOCTYPE")) {
                modules = parseCSV(text);
            }
        }

        // If fetch failed or returned empty/HTML, use fallback data from user prompt
        if (modules.length === 0) {
            console.warn("Using fallback data for Resources.");
            modules = FALLBACK_RESOURCES;
        }

        return NextResponse.json({ resources: modules });
    } catch (error) {
        console.error("Error fetching resources:", error);
        // Fallback on error too
        return NextResponse.json({ resources: FALLBACK_RESOURCES });
    }
}

function parseCSV(text: string): Resource[] {
    const lines = text.split(/\r?\n/);
    const data: Resource[] = [];

    // Skip header row (i=1)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const fields = parseCSVLine(line);

        // Ensure we have enough fields (at least 9 based on the structure)
        if (fields.length >= 9) {
            // Clean up 'WhatYouLearn': replace " - " with " • " if needed
            let learnString = fields[6];
            if (learnString && learnString.includes(" - ")) {
                learnString = learnString.replace(/ - /g, " • ");
            }

            // Map fields: ResourceName, Type, Platform, Description, URL, Difficulty, WhatYouLearn, DateAdded, Recommended
            data.push({
                ResourceName: fields[0],
                Type: fields[1],
                Platform: fields[2],
                Description: fields[3],
                URL: fields[4],
                Difficulty: fields[5] as "Beginner" | "Intermediate" | "Advanced", // naive cast
                WhatYouLearn: learnString,
                DateAdded: fields[7],
                Recommended: fields[8] as "Y" | "N"
            });
        }
    }
    return data;
}

// Simple state machine CSV parser
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (insideQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    currentField += '"';
                    i++;
                } else {
                    insideQuotes = false;
                }
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                insideQuotes = true;
            } else if (char === ',') {
                result.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    result.push(currentField.trim());
    return result;
}

const FALLBACK_RESOURCES: Resource[] = [
    {
        ResourceName: "ChatGPT Free",
        Type: "AI Tool",
        Platform: "OpenAI",
        Description: "Free conversational AI for writing, coding, and learning",
        URL: "https://chat.openai.com",
        Difficulty: "Beginner",
        WhatYouLearn: "Natural conversations • Writing assistance • Code help • Problem solving",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Claude AI Free",
        Type: "AI Tool",
        Platform: "Anthropic",
        Description: "Advanced AI assistant with long context windows",
        URL: "https://claude.ai",
        Difficulty: "Beginner",
        WhatYouLearn: "Long document analysis • Safe AI responses • Code writing • Research help",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Google Gemini",
        Type: "AI Tool",
        Platform: "Google",
        Description: "Multimodal AI integrated with Google services",
        URL: "https://gemini.google.com",
        Difficulty: "Beginner",
        WhatYouLearn: "Image understanding • Google Workspace integration • Multimodal tasks • Research",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Perplexity AI",
        Type: "AI Tool",
        Platform: "Perplexity",
        Description: "AI search engine with sources and citations",
        URL: "https://www.perplexity.ai",
        Difficulty: "Beginner",
        WhatYouLearn: "Research with sources • Real-time information • Citation tracking • Academic search",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Microsoft Copilot",
        Type: "AI Tool",
        Platform: "Microsoft",
        Description: "Free AI assistant with Bing integration",
        URL: "https://copilot.microsoft.com",
        Difficulty: "Beginner",
        WhatYouLearn: "Web search • Image creation • Writing help • Task automation",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Hugging Face Spaces",
        Type: "Practice Platform",
        Platform: "Hugging Face",
        Description: "Free access to thousands of AI models",
        URL: "https://huggingface.co/spaces",
        Difficulty: "Beginner",
        WhatYouLearn: "Explore AI models • Hands-on testing • Model comparison • Demo apps",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Google AI Studio",
        Type: "Practice Platform",
        Platform: "Google",
        Description: "Free platform to experiment with Gemini models",
        URL: "https://aistudio.google.com",
        Difficulty: "Intermediate",
        WhatYouLearn: "Prompt engineering • API testing • Model fine-tuning • App prototyping",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Replicate",
        Type: "Practice Platform",
        Platform: "Replicate",
        Description: "Run open-source AI models in the cloud",
        URL: "https://replicate.com",
        Difficulty: "Intermediate",
        WhatYouLearn: "Image generation • Model testing • API integration • Open-source AI",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Kaggle",
        Type: "Practice Platform",
        Platform: "Google",
        Description: "Data science competitions and free datasets",
        URL: "https://www.kaggle.com",
        Difficulty: "Intermediate",
        WhatYouLearn: "Machine learning practice • Datasets • Competitions • Notebooks",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Google Colab",
        Type: "Practice Platform",
        Platform: "Google",
        Description: "Free Jupyter notebooks with GPU access",
        URL: "https://colab.research.google.com",
        Difficulty: "Intermediate",
        WhatYouLearn: "Python coding • Machine learning • Free GPU • Collaborative notebooks",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "DeepLearning.AI Courses",
        Type: "Free Course",
        Platform: "Coursera",
        Description: "Andrew Ng's comprehensive AI courses",
        URL: "https://www.deeplearning.ai",
        Difficulty: "Beginner",
        WhatYouLearn: "Machine learning basics • Neural networks • Deep learning • AI applications",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Fast.ai Practical Deep Learning",
        Type: "Free Course",
        Platform: "Fast.ai",
        Description: "Practical deep learning for coders",
        URL: "https://course.fast.ai",
        Difficulty: "Intermediate",
        WhatYouLearn: "PyTorch • Computer vision • NLP • Production AI",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Harvard CS50 AI",
        Type: "Free Course",
        Platform: "Harvard",
        Description: "Introduction to AI with Python",
        URL: "https://cs50.harvard.edu/ai",
        Difficulty: "Beginner",
        WhatYouLearn: "AI fundamentals • Python programming • Search algorithms • Machine learning",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "MIT Introduction to Deep Learning",
        Type: "Free Course",
        Platform: "MIT",
        Description: "Comprehensive deep learning course",
        URL: "http://introtodeeplearning.com",
        Difficulty: "Advanced",
        WhatYouLearn: "Neural networks • TensorFlow • Computer vision • Generative AI",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Google Machine Learning Crash Course",
        Type: "Free Course",
        Platform: "Google",
        Description: "Quick introduction to ML with TensorFlow",
        URL: "https://developers.google.com/machine-learning/crash-course",
        Difficulty: "Beginner",
        WhatYouLearn: "ML fundamentals • TensorFlow basics • Real-world examples • Practice exercises",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Microsoft AI School",
        Type: "Free Course",
        Platform: "Microsoft",
        Description: "Comprehensive AI learning paths",
        URL: "https://learn.microsoft.com/en-us/ai",
        Difficulty: "Beginner",
        WhatYouLearn: "Azure AI • AI concepts • Practical applications • Certifications",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Learn Prompting",
        Type: "Free Course",
        Platform: "Learn Prompting",
        Description: "Complete guide to prompt engineering",
        URL: "https://learnprompting.org",
        Difficulty: "Beginner",
        WhatYouLearn: "Prompt techniques • Best practices • Advanced strategies • Real examples",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Prompt Engineering Guide",
        Type: "eBook",
        Platform: "GitHub",
        Description: "Comprehensive prompt engineering resource",
        URL: "https://www.promptingguide.ai",
        Difficulty: "Beginner",
        WhatYouLearn: "Prompt patterns • Techniques • Examples • Research papers",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "OpenAI Cookbook",
        Type: "eBook",
        Platform: "GitHub",
        Description: "Practical guides for using OpenAI API",
        URL: "https://cookbook.openai.com",
        Difficulty: "Intermediate",
        WhatYouLearn: "API usage • Best practices • Code examples • Use cases",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "The AI Index Report",
        Type: "eBook",
        Platform: "Stanford",
        Description: "Annual AI trends and research report",
        URL: "https://aiindex.stanford.edu",
        Difficulty: "Beginner",
        WhatYouLearn: "AI trends • Research insights • Industry analysis • Future predictions",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "Ben's Bites",
        Type: "AI Newsletter",
        Platform: "Newsletter",
        Description: "Daily AI news and tool updates",
        URL: "https://bensbites.beehiiv.com",
        Difficulty: "Beginner",
        WhatYouLearn: "Latest AI news • New tools • Industry updates • Quick reads",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    },
    {
        ResourceName: "TLDR AI",
        Type: "AI Newsletter",
        Platform: "Newsletter",
        Description: "AI news digest delivered daily",
        URL: "https://tldr.tech/ai",
        Difficulty: "Beginner",
        WhatYouLearn: "Curated AI news • Tool reviews • Research highlights • Tech updates",
        DateAdded: "2024-01-01",
        Recommended: "Y"
    }
];
