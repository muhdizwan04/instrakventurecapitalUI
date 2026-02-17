import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Layout, FileText } from 'lucide-react';
import ServicesManager from './ServicesManager';
import ServicesPageManager from './ServicesPageManager';
import ServiceContentManager from './ServiceContentManager';

const TABS = [
    { id: 'list', label: 'Service list', icon: Briefcase, component: ServicesManager, embedded: true },
    { id: 'page-settings', label: 'Page settings', icon: Layout, component: ServicesPageManager, embedded: false },
    { id: 'detail-pages', label: 'Service detail pages', icon: FileText, component: ServiceContentManager, embedded: true }
];

const CombinedServicesManager = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTabId, setActiveTabId] = useState(
        TABS.some(t => t.id === tabParam) ? tabParam : 'list'
    );

    useEffect(() => {
        const valid = TABS.some(t => t.id === tabParam);
        if (tabParam && valid && tabParam !== activeTabId) setActiveTabId(tabParam);
    }, [tabParam]);

    const setTab = (id) => {
        setActiveTabId(id);
        setSearchParams(id === 'list' ? {} : { tab: id }, { replace: true });
    };

    const activeTab = TABS.find(t => t.id === activeTabId);
    const ActiveComponent = activeTab?.component;
    const embedded = activeTab?.embedded ?? false;

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-2">
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTabId === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-white text-[var(--accent-primary)] shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                {ActiveComponent && <ActiveComponent embedded={embedded} />}
            </div>
        </div>
    );
};

export default CombinedServicesManager;
