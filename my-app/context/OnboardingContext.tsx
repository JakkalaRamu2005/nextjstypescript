"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserPreferences {
    goal: string;     // e.g. "Coding", "Writing"
    level: string;    // e.g. "Beginner", "Advanced"
    time: string;     // e.g. "< 2 hours", "5+ hours"
}

interface OnboardingContextType {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    preferences: UserPreferences | null;
    savePreferences: (prefs: UserPreferences) => void;
    isPersonalizedMode: boolean;
    setPersonalizedMode: (active: boolean) => void;
    resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [showModal, setShowModal] = useState(false);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [isPersonalizedMode, setIsPersonalizedMode] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedPrefs = localStorage.getItem("ai_onboarding_prefs");
        if (savedPrefs) {
            setPreferences(JSON.parse(savedPrefs));
            // Automatically enable personalized mode if preferences exist
            setIsPersonalizedMode(true);
        } else {
            // If no prefs, show modal (you might want to delay this or check a "seen" flag)
            // For now, let's only show if specifically triggered or if we decide to force it.
            // Let's force it for new users (no 'ai_onboarding_seen' flag).
            const hasSeen = localStorage.getItem("ai_onboarding_seen");
            if (!hasSeen) {
                // Wait a bit before showing to let page load
                const timer = setTimeout(() => setShowModal(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const savePreferences = (prefs: UserPreferences) => {
        setPreferences(prefs);
        setIsPersonalizedMode(true);
        setShowModal(false);
        localStorage.setItem("ai_onboarding_prefs", JSON.stringify(prefs));
        localStorage.setItem("ai_onboarding_seen", "true");
    };

    const resetOnboarding = () => {
        setPreferences(null);
        setIsPersonalizedMode(false);
        setShowModal(true);
    };

    return (
        <OnboardingContext.Provider value={{
            showModal,
            setShowModal,
            preferences,
            savePreferences,
            isPersonalizedMode,
            setPersonalizedMode: setIsPersonalizedMode,
            resetOnboarding
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
}
