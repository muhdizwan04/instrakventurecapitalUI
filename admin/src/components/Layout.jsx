import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    User,
    Briefcase,
    Users,
    Calendar,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Handshake,
    Layout as LayoutIcon,
    Settings,
    Navigation,
    DollarSign,
    FileText,
    Newspaper,
    Building2,
    ExternalLink
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../hooks/useContent';

// Simple sidebar item
const SidebarItem = ({ icon: Icon, label, path }) => {
    const location = useLocation();
    const active = location.pathname === path;

    return (
        <Link
            to={path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group w-full box-border whitespace-nowrap overflow-hidden ${active
                ? 'bg-[#1A365D] shadow-md'
                : 'hover:bg-gray-100'
                }`}
        >
            <Icon size={18} className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-[#1A365D]'}`} />
            <span className={`font-medium text-sm ${active ? 'text-white' : 'text-gray-600 group-hover:text-[#1A365D]'}`}>
                {label}
            </span>
        </Link>
    );
};

// Section divider
const SectionDivider = ({ label }) => (
    <div className="pt-4 pb-2 px-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
    </div>
);

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fetch navigation settings to match order
    const { content: navData } = useContent('navigation', { items: [] });
    const navItems = navData?.items || [];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Mapping of navigation links to admin sidebar items
    const linkToAdminItem = {
        '/': { icon: Home, label: "Home Page", path: "/home", section: 'Pages' },
        '/mission-vision-values': { icon: User, label: "About Us", path: "/about", section: 'Pages' },

        '/investors': { icon: DollarSign, label: "Investors", path: "/investors", section: 'Pages' },
        '/services': { icon: Briefcase, label: "Services", path: "/services", section: 'Services' },
        '/latest-news-2': { icon: Newspaper, label: "News & Events", path: "/news", section: 'Content' },
        '/project-listings': { icon: Building2, label: "Project Listing", path: "/projects", section: 'Pages' },
    };

    // Other items that might not be in the nav but we want to show
    const fixedAdminItems = {
        '/service-pages': { icon: FileText, label: "Service Pages", path: "/service-pages", section: 'Services' },
        '/careers': { icon: Calendar, label: "Careers", path: "/career", section: 'Content' },
        '/inquiries': { icon: MessageSquare, label: "Inquiries", path: "/inquiries", section: 'Content' },
        '/users': { icon: Users, label: "Registered Users", path: "/users", section: 'Content' },
    };

    // Group items by section
    const getItemsBySection = (sectionName) => {
        const items = [];

        // Add items that match navigation order
        navItems.forEach(navItem => {
            const adminItem = linkToAdminItem[navItem.link];
            if (adminItem && adminItem.section === sectionName) {
                items.push(adminItem);
            }
            // Check children for dropdowns
            navItem.children?.forEach(child => {
                const childAdminItem = linkToAdminItem[child.link];
                if (childAdminItem && childAdminItem.section === sectionName && !items.find(i => i.path === childAdminItem.path)) {
                    items.push(childAdminItem);
                }
            });
        });

        // Add fixed items for this section that weren't added via nav
        Object.values(fixedAdminItems).forEach(fixedItem => {
            if (fixedItem.section === sectionName && !items.find(i => i.path === fixedItem.path)) {
                items.push(fixedItem);
            }
        });

        // If navItems is empty (not loaded yet), fallback to default order for that section
        if (navItems.length === 0) {
            return Object.values(linkToAdminItem)
                .concat(Object.values(fixedAdminItems))
                .filter(item => item.section === sectionName);
        }

        return items;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            <Toaster position="top-right" />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 w-60 shrink-0 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0 overflow-y-auto`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-gray-100">
                    <h1 className="text-lg font-bold text-[#1A365D]">Instrak Admin</h1>
                </div>

                {/* Navigation */}
                <nav className="p-2 space-y-0.5">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" />

                    <SectionDivider label="Settings" />
                    <SidebarItem icon={Settings} label="Global Settings" path="/global-settings" />
                    <SidebarItem icon={Navigation} label="Navigation Menu" path="/navigation" />
                    <SidebarItem icon={LayoutIcon} label="Footer" path="/footer" />

                    <SectionDivider label="Pages" />
                    {getItemsBySection('Pages').map(item => (
                        <SidebarItem key={item.path} icon={item.icon} label={item.label} path={item.path} />
                    ))}

                    <SectionDivider label="Services" />
                    {getItemsBySection('Services').map(item => (
                        <SidebarItem key={item.path} icon={item.icon} label={item.label} path={item.path} />
                    ))}

                    <SectionDivider label="Content" />
                    {getItemsBySection('Content').map(item => (
                        <SidebarItem key={item.path} icon={item.icon} label={item.label} path={item.path} />
                    ))}

                    {/* Logout */}
                    <div className="pt-6 mt-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-14 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <a
                            href="http://localhost:5173"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-medium text-[#1A365D] hover:text-blue-700"
                        >
                            <ExternalLink size={16} /> View Site
                        </a>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 flex-1 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
