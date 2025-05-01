// fallback path if SERVER_BASE_URL is not defined
export const getDefaultImagePath = (): string => {
    const baseUrl = process.env.SERVER_BASE_URL || "http://localhost:3000";
    return `${baseUrl}/assets/images/placeholder-img-600x600.png`;
}