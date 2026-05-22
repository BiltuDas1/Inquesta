import React from "react";
import { useNavigate } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

// --- 1. GraphQL Query ---
const GET_HERO_SECTION = gql`
  query getHeroSection {
    getHeroSection {
      data {
        description
        heading
        heroImageUrl
        statusBadge
      }
    }
  }
`;

// --- 2. TypeScript Interfaces ---
interface HeroData {
  description: string;
  heading: string;
  heroImageUrl: string;
  statusBadge: string;
}

interface GetHeroSectionResponse {
  getHeroSection: {
    data: HeroData;
  };
}

// --- 3. Component ---
export function HeroSection() {
  const navigate = useNavigate();

  // Fetch the data
  const { data, loading } = useQuery<GetHeroSectionResponse>(GET_HERO_SECTION);

  const heroData = data?.getHeroSection?.data;

  const rawHeading = heroData?.heading || "Learn.\nBuild.\nInnovate.";
  const description =
    heroData?.description ||
    "Hands-on STEM Courses for K-12 students across India. From PictoBlox to Arduino.";
  const statusBadge =
    heroData?.statusBadge || "REGISTRATION IS CURRENTLY GOING ON";
  const heroImageUrl =
    heroData?.heroImageUrl ||
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800";

  // Split heading into parts (supports both \n from DB or standard spaces)
  const delimiter = rawHeading.includes("\n") ? "\n" : " ";
  const headingParts = rawHeading
    .split(delimiter)
    .filter((part) => part.trim() !== "");

  return (
    <section className="relative min-h-[550px] md:min-h-[650px] flex items-center overflow-hidden px-8 pt-24">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content Area */}
        <div className="space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-surface-container-low/50 border border-outline-variant px-4 py-2 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium tracking-widest uppercase text-on-surface-variant">
              {statusBadge}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1]">
            {headingParts.map((part, index) => {
              const isLast = index === headingParts.length - 1;

              // If it's the last word/line, apply the gradient
              if (isLast) {
                return (
                  <span key={index} className="text-gradient">
                    {part}
                  </span>
                );
              }

              // Otherwise, render normal text with a <br /> tag
              return (
                <React.Fragment key={index}>
                  {part} <br />
                </React.Fragment>
              );
            })}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
            {description}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-full font-bold text-lg glow-hover transition-all flex items-center justify-center group active:scale-95"
            >
              Start Learning
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="border border-outline-variant text-on-surface px-8 py-4 rounded-full font-bold text-lg hover:bg-surface-container transition-all"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="hidden lg:block relative">
          <div
            className={`glass-card rounded-[2rem] p-4 border border-outline-variant shadow-2xl relative overflow-hidden group transition-opacity duration-500 ${loading ? "opacity-50 blur-sm" : "opacity-100"}`}
          >
            <img
              alt="Hero Section Visual"
              className="w-full h-[500px] object-cover rounded-[1.5rem] opacity-80 group-hover:opacity-100 transition-opacity"
              src={heroImageUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
