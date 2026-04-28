export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  reviews: number;
  hours: number;
  lectures: number;
  level: string;
  price: number;
  originalPrice: number;
  badges: string[];
  image: string;
}

// --- Data ---
export const courses: Course[] = [
  {
    id: 1,
    title: "The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert",
    description:
      "COMPLETELY REDONE! Master SQL, Work With Complex Databases, Build Reports, and More!",
    instructor: "Colt Steele",
    rating: 4.7,
    reviews: 108267,
    hours: 18,
    lectures: 337,
    level: "Beginner",
    price: 589,
    originalPrice: 3549,
    badges: ["Premium", "Bestseller"],
    image: "https://img-c.udemycdn.com/course/240x135/547598_f7ed_3.jpg",
  },
  {
    id: 2,
    title: "Complete C# Unity 2D Game Development (Updated To Unity 6)",
    description:
      "Build 4 playable 2D games in Unity 6 using C#. Learn real coding skills and master game dev fundamentals.",
    instructor: "GameDev.tv Team, Rick Davidson, Ahmed Nassef",
    rating: 4.8,
    reviews: 107973,
    hours: 17.5,
    lectures: 132,
    level: "All Levels",
    price: 699,
    originalPrice: 4229,
    badges: ["Premium", "Highest Rated"],
    image: "https://img-c.udemycdn.com/course/240x135/776760_f176_10.jpg",
  },
  {
    id: 3,
    title: "Modern React with Redux",
    description:
      "Master React and Redux. Apply modern design patterns to build apps with React Router, TailwindCSS, Context, and Hooks!",
    instructor: "Stephen Grider",
    rating: 4.6,
    reviews: 89035,
    hours: 75.5,
    lectures: 693,
    level: "All Levels",
    price: 679,
    originalPrice: 4089,
    badges: ["Premium"],
    image: "https://img-c.udemycdn.com/course/240x135/705264_caa9_13.jpg",
  },
  {
    id: 4,
    title: "Beginning C++ Programming - From Beginner to Beyond",
    description:
      "Obtain Modern C++ Object-Oriented Programming (OOP) and STL skills. C++14 and C++17 covered. C++20 info see below.",
    instructor:
      "Tim Buchalka's Learn Programming Academy, Dr. Frank Mitropoulos",
    rating: 4.6,
    reviews: 80599,
    hours: 46,
    lectures: 305,
    level: "All Levels",
    price: 579,
    originalPrice: 3459,
    badges: ["Premium", "Bestseller"],
    image: "https://img-c.udemycdn.com/course/240x135/1371462_e07e_3.jpg",
  },
  {
    id: 5,
    title: "C# Basics for Beginners: Learn C# Fundamentals by Coding",
    description:
      "Master C# fundamentals in 6 hours - The most popular course with 50,000+ students, packed with tips and exercises!",
    instructor: "Mosh Hamedani",
    rating: 4.6,
    reviews: 79087,
    hours: 5.5,
    lectures: 87,
    level: "Beginner",
    price: 729,
    originalPrice: 4359,
    badges: ["Premium"],
    image: "https://img-c.udemycdn.com/course/240x135/822444_b49a_2.jpg",
  },
  {
    id: 6,
    title: "Docker Mastery: with Kubernetes +Swarm from a Docker Captain",
    description:
      "Build, test, deploy containers with the best mega-course on Docker, Kubernetes, Compose, GitHub Actions CI using DevOps",
    instructor: "Bret Fisher, Docker Captain Program",
    rating: 4.6,
    reviews: 66764,
    hours: 23,
    lectures: 225,
    level: "All Levels",
    price: 699,
    originalPrice: 4229,
    badges: ["Premium", "Bestseller"],
    image: "https://img-c.udemycdn.com/course/240x135/1035000_c1ab_8.jpg",
  },
  {
    id: 7,
    title: "Vue - The Complete Guide (incl. Router & Composition API)",
    description:
      "Vue.js is an awesome JavaScript Framework for building Frontend Applications! VueJS mixes the Best of Angular + React!",
    instructor: "Maximilian Schwarzmüller",
    rating: 4.7,
    reviews: 66550,
    hours: 32,
    lectures: 332,
    level: "All Levels",
    price: 709,
    originalPrice: 4269,
    badges: ["Premium", "Bestseller"],
    image: "https://img-c.udemycdn.com/course/240x135/995016_ebf4_3.jpg",
  },
];
