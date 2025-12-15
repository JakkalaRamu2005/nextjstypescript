"use client";

import { useState } from "react";
import { useOnboarding, UserPreferences } from "../context/OnboardingContext";
import "./style/onboarding-modal.css";

const STEPS = [
    {
        id: "goal",
        question: "What is your main goal with AI?",
        options: [
            { label: "Learn Coding & Dev", value: "Coding" },
            { label: "Content Creation & Writing", value: "Writing" },
            { label: "Art & Design", value: "Art" },
            { label: "Productivity & Work", value: "Productivity" }
        ]
    },
    {
        id: "level",
        question: "How would you describe your technical skills?",
        options: [
            { label: "Non-Technical / Beginner", value: "Beginner" },
            { label: "Familiar with Tech", value: "Intermediate" },
            { label: "Developer / Pro", value: "Advanced" }
        ]
    },
    {
        id: "time",
        question: "How much time can you dedicate per week?",
        options: [
            { label: "Just exploring (< 2 hrs)", value: "Low" },
            { label: "Dedicated learner (2-5 hrs)", value: "Medium" },
            { label: "Serious upskilling (5+ hrs)", value: "High" }
        ]
    }
];

export default function OnboardingModal() {
    const { showModal, setShowModal, savePreferences } = useOnboarding();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<UserPreferences>>({});

    if (!showModal) return null;

    const handleOptionSelect = (value: string) => {
        const stepId = STEPS[currentStep].id;
        const newAnswers = { ...answers, [stepId]: value };
        setAnswers(newAnswers);

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Finished
            savePreferences(newAnswers as UserPreferences);
        }
    };

    const currentQuestion = STEPS[currentStep];

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-modal">
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    ></div>
                </div>

                <div className="modal-content">
                    <h2>Step {currentStep + 1} of {STEPS.length}</h2>
                    <h3 className="question-text">{currentQuestion.question}</h3>

                    <div className="options-grid">
                        {currentQuestion.options.map((opt) => (
                            <button
                                key={opt.value}
                                className="option-btn"
                                onClick={() => handleOptionSelect(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
