/**
 * Fetches book covers from Open Library API
 * @param title - Book title
 * @param author - Optional book author
 * @returns Array of cover image URLs (up to 3)
 */
export async function fetchBookCovers(
  title: string,
  author?: string
): Promise<string[]> {
  try {
    // Build search query
    const searchQuery = author ? `${title} ${author}` : title;
    const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=3`;

    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error("Open Library API error:", response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      return [];
    }

    // Extract cover URLs from results
    const coverUrls: string[] = [];
    
    for (const doc of data.docs.slice(0, 3)) {
      // Try cover_i first (cover ID)
      if (doc.cover_i) {
        coverUrls.push(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`);
      }
      // Fallback to ISBN if available
      else if (doc.isbn && doc.isbn.length > 0) {
        coverUrls.push(`https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`);
      }
    }

    return coverUrls;
  } catch (error) {
    console.error("Failed to fetch book covers:", error);
    return [];
  }
}

