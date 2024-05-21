import ytdl from "ytdl-core";
import fs from "fs";
import { formatFileSize, formatDuration } from "../constant/constant.js";

export const downloadVideo = async (req, res) => {
  const videoURL = req.query.videoURL;
  const formatCode = req.query.formatCode;

  try {
    if (!videoURL || !formatCode) {
      throw new Error("Video URL or format code not provided");
    }
    const info = await ytdl.getInfo(videoURL);
    const format = info.formats.find((f) => f.itag.toString() === formatCode);

    if (!format) {
      throw new Error("Selected format not found");
    }

    // Sanitize title and container
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, ""); // Remove special characters
    const container = format.container.replace(/[^\w\s]/gi, ""); // Remove special characters

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${title}.${container}"`
    );
    ytdl(videoURL, { format: format }).pipe(res);
  } catch (error) {
    console.error("Error downloading video: ", error);
    res.send(500).json({ error: `Failed to download vidoe ${error}` });
  }
};

export const getvideoDetails = async (req, res) => {
  const videoURL = req.query.URL;

  try {
    const info = await ytdl.getInfo(videoURL);

    const removeQueryParams = (url) => url.split("?")[0];

    const formatWithSize = info.formats.map((format) => ({
      itag: format.itag,
      quality: format.qualityLabel,
      container: format.container,
      size: format.contentLength
        ? formatFileSize(parseInt(format.contentLength, 10))
        : "Unknown",
      hasAudio: format.hasAudio,
      hasVideo: format.hasVideo,
    }));

    const thumbnailsWithoutQueryParams = info.videoDetails.thumbnails.map(
      (thumbnail) => ({
        ...thumbnail,
        url: removeQueryParams(thumbnail.url),
      })
    );

    const videoDetails = {
      title: info.videoDetails.title,
      thumbnails: thumbnailsWithoutQueryParams,
      formats: formatWithSize,
      duration: info.videoDetails.lengthSeconds
        ? formatDuration(parseInt(info.videoDetails.lengthSeconds, 10))
        : "",
    };

    res.status(200).json(videoDetails);
  } catch (error) {
    console.error("Error fetching video Details: ", error);
    res.status(500).json({ error: `Failed to fetch video details: ${error} ` });
  }
};
