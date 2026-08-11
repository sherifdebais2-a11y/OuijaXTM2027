// Helper utilities for handling PDF Previews, Downloads, and YouTube Video Embeds cleanly

export function extractYoutubeId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const ytReg = /(?:v=|\/embed\/|\/v\/|\/shorts\/|youtu\.be\/|\/e\/)([^"&?\/\s]{11})/;
  const ytMatch = trimmed.match(ytReg);
  if (ytMatch && ytMatch[1]) {
    return ytMatch[1];
  }
  return trimmed;
}

export function getCleanYoutubeEmbedUrl(youtubeInput: string): string {
  const ytId = extractYoutubeId(youtubeInput);
  if (/^[a-zA-Z0-9_-]{11}$/.test(ytId)) {
    return `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0&modestbranding=1`;
  }
  if (youtubeInput.startsWith('http')) {
    return youtubeInput;
  }
  return `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`;
}

export const formatYouTubeEmbedUrl = getCleanYoutubeEmbedUrl;

export function getCleanYoutubeWatchUrl(youtubeInput: string): string {
  const ytId = extractYoutubeId(youtubeInput);
  if (/^[a-zA-Z0-9_-]{11}$/.test(ytId)) {
    return `https://www.youtube.com/watch?v=${ytId}`;
  }
  if (youtubeInput.startsWith('http')) {
    return youtubeInput;
  }
  return `https://www.youtube.com/watch?v=${ytId}`;
}

export const getYouTubeWatchUrl = getCleanYoutubeWatchUrl;

export function getPdfEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Handle Google Drive links
  const gDriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`;
  }

  // Handle data URLs or blob URLs directly
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Standard http/https URL - use Google Docs Viewer for cross-origin preview
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // If it's already a preview URL
    if (trimmed.includes('docs.google.com/gview') || trimmed.includes('drive.google.com/file/d/')) {
      return trimmed;
    }
    return `https://docs.google.com/gview?url=${encodeURIComponent(trimmed)}&embedded=true`;
  }

  return trimmed;
}

export function handlePdfDownload(url: string, filename: string = 'document.pdf'): void {
  if (!url) return;
  const trimmed = url.trim();

  // If Google Drive link, convert to export=download
  const gDriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${gDriveMatch[1]}`;
    window.open(downloadUrl, '_blank');
    return;
  }

  // If data URL or Blob URL
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    const a = document.createElement('a');
    a.href = trimmed;
    a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // Standard web URL
  const a = document.createElement('a');
  a.href = trimmed;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Fallback open in new tab if needed
  setTimeout(() => {
    window.open(trimmed, '_blank');
  }, 100);
}
