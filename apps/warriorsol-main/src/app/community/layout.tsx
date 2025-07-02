import React, { ReactNode } from 'react';
import Navbar from "../../components/shared/navbar";
import footer from "../../components/shared/footer";

interface CommunityLayoutProps {
    children: ReactNode;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children }) => {
    return (
        <div className="community-layout">
            <Navbar />
            <main>{children}</main>
            <footer />
        </div>
    );
};

export default CommunityLayout;