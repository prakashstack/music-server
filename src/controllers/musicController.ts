import { Request, Response } from 'express';
import axios from 'axios';
import { musicService } from '../services/musicService';
import * as audius from '../integrations/audius/client';
import { sendSuccess, sendError } from '../utils/response';

const getExactPreviewUrl = async (song: any): Promise<string | null> => {
  const artist = song?.artists?.primary?.[0]?.name || '';
  const query = `${song?.name || ''} ${artist}`.trim();
  if (!query) return null;

  try {
    const { data } = await axios.get('https://api.deezer.com/search', {
      params: { q: query, limit: 10 },
      timeout: 5000,
    });
    const match = data?.data?.find((item: any) =>
      item?.preview &&
      item?.title?.toLowerCase() === song.name.toLowerCase() &&
      item?.artist?.name?.toLowerCase().includes(artist.split(',')[0].trim().toLowerCase())
    );
    return match?.preview || null;
  } catch {
    return null;
  }
};

const normaliseText = (value: unknown) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const getAlternateSongUrls = async (song: any): Promise<string[]> => {
  const artist = song?.artists?.primary?.[0]?.name?.split(',')[0]?.trim() || '';
  try {
    const result = await audius.searchTracks(`${song.name} ${artist}`, 1, 20);
    const match = result.data?.results?.find((candidate: any) =>
      normaliseText(candidate.name) === normaliseText(song.name) &&
      normaliseText(candidate.artists?.primary?.[0]?.name).includes(normaliseText(artist)) &&
      candidate.id !== song.id
    );
    return match?.downloadUrl?.map((item: { url: string }) => item.url).filter(Boolean) || [];
  } catch {
    return [];
  }
};

export const musicController = {
  getTrending: async (req: Request, res: Response) => {
    try {
      const songs = await musicService.getTrending();
      return sendSuccess(res, songs);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  search: async (req: Request, res: Response) => {
    try {
      const query = (req.query.q || req.query.query) as string;
      const type = (req.query.type as string) || 'all';
      const page = parseInt(req.query.page as string) || 1;
      if (!query?.trim()) return sendError(res, 'Query is required', 400);
      const results = await musicService.search(query.trim(), type, page);
      return sendSuccess(res, results);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getSong: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const song = await musicService.getSong(id);
      return sendSuccess(res, song);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  streamSong: async (req: Request, res: Response) => {
    try {
      const song = await musicService.getSong(req.params.id as string, true);
      const streamUrls = song?.downloadUrl?.map((item: { url: string }) => item.url).filter(Boolean) || [];
      let lastError: unknown;
      for (const streamUrl of streamUrls) {
        try {
          const upstream = await axios.get(streamUrl, {
            responseType: 'stream',
            headers: {
              ...(req.headers.range ? { Range: req.headers.range } : {}),
              'User-Agent': 'Mozilla/5.0',
            },
            validateStatus: (status) => status >= 200 && status < 400,
          });

          res.status(upstream.status);
          for (const header of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
            const value = upstream.headers[header];
            if (value) res.setHeader(header, value);
          }
          upstream.data.on('error', () => res.destroy());
          upstream.data.pipe(res);
          return;
        } catch (err) {
          lastError = err;
        }
      }
      const alternateUrls = await getAlternateSongUrls(song);
      for (const streamUrl of alternateUrls) {
        try {
          const upstream = await axios.get(streamUrl, {
            responseType: 'stream',
            headers: {
              ...(req.headers.range ? { Range: req.headers.range } : {}),
              'User-Agent': 'Mozilla/5.0',
            },
            validateStatus: (status) => status >= 200 && status < 400,
          });
          res.status(upstream.status);
          for (const header of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
            const value = upstream.headers[header];
            if (value) res.setHeader(header, value);
          }
          upstream.data.on('error', () => res.destroy());
          upstream.data.pipe(res);
          return;
        } catch (err) {
          lastError = err;
        }
      }
      const exactPreviewUrl = await getExactPreviewUrl(song);
      if (exactPreviewUrl) return res.redirect(302, exactPreviewUrl);
      if (lastError || streamUrls.length === 0) {
        return res.status(404).json({ success: false, message: 'Audio stream not found for this song' });
      }
      return res.status(404).json({ success: false, message: 'Audio stream not found for this song' });
    } catch (err: any) {
      if (!res.headersSent) return res.status(502).json({ success: false, message: 'Audio stream unavailable' });
      res.destroy(err);
    }
  },

  getAlbum: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const album = await musicService.getAlbum(id);
      return sendSuccess(res, album);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getArtist: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const artist = await musicService.getArtist(id);
      return sendSuccess(res, artist);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getGenres: async (req: Request, res: Response) => {
    return sendSuccess(res, musicService.getGenres());
  },

  getGenreSongs: async (req: Request, res: Response) => {
    try {
      const genre = req.params.genre as string;
      const songs = await musicService.getGenreSongs(genre);
      return sendSuccess(res, songs);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getLyrics: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const lyrics = await musicService.getLyrics(id);
      return sendSuccess(res, lyrics);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getNewReleases: async (req: Request, res: Response) => {
    try {
      const songs = await musicService.getNewReleases();
      return sendSuccess(res, songs);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },
};
