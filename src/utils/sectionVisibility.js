/**
 * Check if a section is visible (not hidden by admin).
 * @param {Object} pageContent - The service page content from admin
 * @param {string} sectionKey - The key of the section to check
 * @returns {boolean} - True if section should be shown
 */
export const isSectionVisible = (pageContent, sectionKey) => {
    if (!pageContent || !pageContent.hiddenSections) return true;
    return !pageContent.hiddenSections.includes(sectionKey);
};
