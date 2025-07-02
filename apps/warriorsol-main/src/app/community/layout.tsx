import React, { ReactNode } from 'react';
import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";

interface CommunityLayoutProps {
    children: ReactNode;
}

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