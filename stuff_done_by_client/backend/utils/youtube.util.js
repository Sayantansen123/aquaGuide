// utils/youtubeApi.js
import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export function extractVideoId(youtubeUrl) {
  if (!youtubeUrl) return null;
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = youtubeUrl.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function getChannelDetails(channelId) {
  if (!channelId || !YOUTUBE_API_KEY) return null;
  const url = "https://www.googleapis.com/youtube/v3/channels";
  const params = { part: "snippet,statistics", id: channelId, key: YOUTUBE_API_KEY };

  try {
    const { data } = await axios.get(url, { params });
    const item = data.items?.[0];
    if (!item) return null;
    return {
      title: item.snippet?.title || "",
      description: item.snippet?.description || "",
      avatarUrl: item.snippet?.thumbnails?.default?.url || "",
      subscriberCount: parseInt(item.statistics?.subscriberCount || 0),
      videoCount: parseInt(item.statistics?.videoCount || 0),
      viewCount: parseInt(item.statistics?.viewCount || 0),
    };
  } catch (err) {
    console.error("YouTube API channel error:", err.message);
    return null;
  }
}

export async function getVideoDetails(videoId) {
  if (!videoId || !YOUTUBE_API_KEY) return null;

  const url = "https://www.googleapis.com/youtube/v3/videos";
  const params = { part: "snippet,statistics,contentDetails", id: videoId, key: YOUTUBE_API_KEY };

  try {
    const { data } = await axios.get(url, { params });
    const item = data.items?.[0];
    if (!item) return null;

    const snippet = item.snippet || {};
    const stats = item.statistics || {};
    const content = item.contentDetails || {};

    const videoDetails = {
      title: snippet.title || "",
      description: snippet.description || "",
      channelId: snippet.channelId || "",
      channelTitle: snippet.channelTitle || "",
      publishedAt: snippet.publishedAt || "",
      viewCount: parseInt(stats.viewCount || 0),
      likeCount: parseInt(stats.likeCount || 0),
      duration: content.duration || "",
      thumbnails: snippet.thumbnails || {},
    };

    const channel = await getChannelDetails(videoDetails.channelId);
    if (channel) videoDetails.channelAvatarUrl = channel.avatarUrl;

    return videoDetails;
  } catch (err) {
    console.error("YouTube API video error:", err.message);
    return null;
  }
}

export function formatDuration(durationStr) {
  if (!durationStr) return "0:00";
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const [, h, m, s] = match.map((v) => (v ? parseInt(v) : 0));
  return h ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` : `${m}:${s.toString().padStart(2, "0")}`;
}
