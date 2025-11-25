"""
YouTube 다운로드 서비스 (yt-dlp 사용)
"""
import os
import logging
from typing import Tuple
import yt_dlp

logger = logging.getLogger(__name__)

TEMP_DIR = "backend/temp/downloads"


async def download_youtube_audio(youtube_url: str, task_id: str) -> str:
    """
    YouTube 영상에서 오디오만 다운로드

    Args:
        youtube_url: YouTube URL
        task_id: 작업 ID

    Returns:
        다운로드된 오디오 파일 경로
    """
    os.makedirs(TEMP_DIR, exist_ok=True)

    output_path = os.path.join(TEMP_DIR, f"{task_id}.wav")

    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'wav',
        }],
        'outtmpl': os.path.join(TEMP_DIR, f"{task_id}.%(ext)s"),
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            logger.info(f"Downloading audio from: {youtube_url}")
            info = ydl.extract_info(youtube_url, download=True)

            # 비디오 정보 추출
            title = info.get('title', 'Unknown')
            artist = info.get('uploader', 'Unknown')
            duration = info.get('duration', 0)

            logger.info(f"Downloaded: {title} by {artist}")

            return output_path

    except Exception as e:
        logger.error(f"YouTube download failed: {str(e)}")
        raise Exception(f"YouTube 다운로드 실패: {str(e)}")


def get_video_info(youtube_url: str) -> dict:
    """
    YouTube 비디오 정보 추출 (다운로드 없이)

    Args:
        youtube_url: YouTube URL

    Returns:
        비디오 메타데이터
    """
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=False)

            return {
                'title': info.get('title', 'Unknown'),
                'artist': info.get('uploader', 'Unknown'),
                'duration': info.get('duration', 0),
                'youtube_id': info.get('id', ''),
            }

    except Exception as e:
        logger.error(f"Failed to extract video info: {str(e)}")
        return {
            'title': 'Unknown',
            'artist': 'Unknown',
            'duration': 0,
            'youtube_id': '',
        }
