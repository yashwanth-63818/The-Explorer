import { aboutData } from "./aboutData";

/**
 * Service to fetch About Page content.
 * In a real-world scenario, this could fetch from a CMS, database, or external API.
 */
export async function getAboutPageData() {
    try {
        // Simulate a brief delay to demonstrate loading states if needed
        // await new Promise(resolve => setTimeout(resolve, 500));

        if (!aboutData) {
            throw new Error("About content not found");
        }

        return aboutData;
    } catch (error) {
        console.error("[AboutService] Error fetching about data:", error);
        return null;
    }
}
