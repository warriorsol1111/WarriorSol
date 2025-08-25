import React, { ReactNode } from 'react';
import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";

interface CommunityLayoutProps {
    children: ReactNode;
}

export const metadata = {
    title: "About | WarriorSol",
    description: "Learn more about WarriorSol, our mission, and how we support families in need. Join our community and discover how you can make a difference.",
};

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children }) => {
    return (
        <div className="community-layout">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};

export default CommunityLayout;