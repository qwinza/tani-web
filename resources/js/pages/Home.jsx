/**
 * Home Page Component
 * - Main landing page that combines all sections
 * - Imports and renders all components in order
 */
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import MapSection from '../components/MapSection';
import Features from '../components/Features';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Fixed Navbar */}
            <Navbar />

            {/* Main Content */}
            <main>
                {/* Hero - Full screen landing section */}
                <Hero />

                {/* About - Platform description */}
                <About />

                {/* Map - Farmer distribution */}
                <MapSection />

                {/* Features - Platform capabilities */}
                <Features />

                {/* Contact - Get in touch form */}
                <Contact />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
