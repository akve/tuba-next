function unescapeHtml(text: string) {
    if (!text) return '';
    return text.replace(/&amp;/gi, '&');
}

export default unescapeHtml;
