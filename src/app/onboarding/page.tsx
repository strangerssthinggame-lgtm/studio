
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Users, Zap, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import './onboarding.css';

const onboardingData = [
    {
        title: "Connect Through Games",
        subtitle: "Turn conversations into adventures with strangers and friends",
        icon: MessageCircle,
        description: "Break the ice with structured conversation games that make meeting new people fun and natural."
    },
    {
        title: "Choose Your Vibe",
        subtitle: "Friends, Date, or Spicy modes for every mood",
        icon: Users,
        description: "From friendly chats to flirty conversations - pick the energy level that matches your vibe."
    },
    {
        title: "Play Your Way",
        subtitle: "Live sessions or take turns throughout the day",
        icon: Zap,
        description: "Real-time gaming when you're both online, or async play that fits your schedule."
    }
];

export default function OnboardingPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const router = useRouter();

    const nextPage = useCallback(() => {
        if (currentPage < onboardingData.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            router.push('/login');
        }
    }, [currentPage, router]);

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const skipToEnd = () => {
        router.push('/login');
    }

    // Touch swipe handling
    const touchStartX = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const endX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) { // Swiped left
                nextPage();
            } else { // Swiped right
                prevPage();
            }
        }
    };
    
    const currentData = onboardingData[currentPage];
    const Icon = currentData.icon;

    return (
        <div
            className={cn(
                "onboarding-container gradient-bg",
                currentPage === 1 ? 'page-1' : currentPage === 2 ? 'page-2' : ''
            )}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <button className="skip-btn" onClick={skipToEnd}>Skip</button>

            <div className="content">
                <div className="icon-container">
                    <Icon className="w-16 h-16 text-white" />
                </div>

                <h1 className="title">{currentData.title}</h1>
                <p className="subtitle">{currentData.subtitle}</p>
                <p className="description">{currentData.description}</p>
            </div>

            <div className="indicators">
                {onboardingData.map((_, index) => (
                    <div
                        key={index}
                        className={cn('indicator', currentPage === index ? 'active' : 'inactive')}
                    />
                ))}
            </div>

            <div className="navigation">
                <button className="nav-btn" onClick={prevPage} disabled={currentPage === 0}>
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                </button>

                <button className="nav-btn next-btn" onClick={nextPage}>
                    <span>{currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}</span>
                    {currentPage === onboardingData.length - 1 ? (
                        <Check className="w-5 h-5 ml-2" />
                    ) : (
                        <ChevronRight className="w-5 h-5 ml-2" />
                    )}
                </button>
            </div>

            <div className="app-logo">BONDLY</div>
        </div>
    );
}
