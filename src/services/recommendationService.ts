import { musicService } from './musicService';
import { preferencesService } from './preferencesService';

export interface HomeSection {
  id: string;
  title: string;
  subtitle?: string;
  type: 'songs' | 'artists' | 'genres';
  items: any[];
}

export const recommendationService = {
  async getPersonalizedSections(userId: string): Promise<HomeSection[]> {
    const sections: HomeSection[] = [];

    try {
      // 1. Trending (always first)
      const trending: any[] = (await musicService.getTrending()) || [];
      sections.push({
        id: 'trending',
        title: 'Trending Now',
        subtitle: 'Hot tracks everyone is listening to',
        type: 'songs',
        items: Array.isArray(trending) ? trending.slice(0, 20) : [],
      });

      // 2. New Releases
      const newReleases: any[] = (await musicService.getNewReleases()) || [];
      sections.push({
        id: 'new_releases',
        title: 'New Releases',
        subtitle: 'Fresh music just dropped',
        type: 'songs',
        items: Array.isArray(newReleases) ? newReleases.slice(0, 20) : [],
      });

      // 3. Genres
      sections.push({
        id: 'genres',
        title: 'Browse Genres',
        subtitle: 'Find music by mood or genre',
        type: 'genres',
        items: musicService.getGenres(),
      });

      // 4. Personalized sections based on user preferences
      const topGenres = await preferencesService.getTopGenres(userId, 3);
      const topArtists = await preferencesService.getTopArtists(userId, 3);
      const topLanguages = await preferencesService.getTopLanguages(userId, 2);

      // For each top genre, add a section
      for (const genre of topGenres.slice(0, 2)) {
        try {
          const songs: any[] = (await musicService.getGenreSongs(genre)) || [];
          if (Array.isArray(songs) && songs.length > 0) {
            sections.push({
              id: `genre_${genre}`,
              title: `Top ${genre.charAt(0).toUpperCase() + genre.slice(1)} Picks`,
              subtitle: 'Based on your listening history',
              type: 'songs',
              items: songs.slice(0, 20),
            });
          }
        } catch {}
      }

      // For each top artist, add a section
      for (const artist of topArtists.slice(0, 2)) {
        try {
          const result: any = await musicService.search(artist.name, 'songs');
          const songs = result?.songs || [];
          if (Array.isArray(songs) && songs.length > 0) {
            sections.push({
              id: `artist_${artist.artistId}`,
              title: `More from ${artist.name}`,
              subtitle: 'Because you love this artist',
              type: 'songs',
              items: songs.slice(0, 20),
            });
          }
        } catch {}
      }

      // Language-based section
      if (topLanguages.length > 0) {
        const lang = topLanguages[0];
        try {
          const result: any = await musicService.search(`top ${lang} songs 2024`, 'songs');
          const songs = result?.songs || [];
          if (Array.isArray(songs) && songs.length > 0) {
            sections.push({
              id: `lang_${lang}`,
              title: `Popular ${lang.charAt(0).toUpperCase() + lang.slice(1)} Songs`,
              subtitle: 'Tailored to your language preferences',
              type: 'songs',
              items: songs.slice(0, 20),
            });
          }
        } catch {}
      }

      return sections;
    } catch (err) {
      console.error('Recommendation error:', err);
      return sections;
    }
  },

  async getGuestSections(): Promise<HomeSection[]> {
    const [trendingRaw, newReleasesRaw] = await Promise.all([
      musicService.getTrending(),
      musicService.getNewReleases(),
    ]);
    const trending: any[] = Array.isArray(trendingRaw) ? trendingRaw : [];
    const newReleases: any[] = Array.isArray(newReleasesRaw) ? newReleasesRaw : [];
    return [
      { id: 'trending', title: 'Trending Now', subtitle: 'Hot tracks right now', type: 'songs', items: trending.slice(0, 20) },
      { id: 'new_releases', title: 'New Releases', subtitle: 'Fresh music just dropped', type: 'songs', items: newReleases.slice(0, 20) },
      { id: 'genres', title: 'Browse Genres', type: 'genres', items: musicService.getGenres() },
    ];
  },
};
