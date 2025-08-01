/**
 * Formats a database date string to HTML date input format (YYYY-MM-DD)
 * @param {string|null|undefined} dateString - Date string from database
 * @returns {string} - Formatted date string for HTML date input or empty string
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    try {
        return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
        console.warn('Invalid date format:', dateString);
        return '';
    }
};

/**
 * Formats a date for display purposes
 * @param {string|null|undefined} dateString - Date string from database
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted date string for display
 */
export const formatDateForDisplay = (dateString, locale = 'en-US') => {
    if (!dateString) return 'N/A';

    try {
        return new Date(dateString).toLocaleDateString(locale);
    } catch (error) {
        console.warn('Invalid date format:', dateString);
        return 'Invalid Date';
    }
};

/**
 * Gets the current date in HTML date input format
 * @returns {string} - Current date in YYYY-MM-DD format
 */
export const getCurrentDateForInput = () => {
    return new Date().toISOString().split('T')[0];
};
