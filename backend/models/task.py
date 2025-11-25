"""
작업(Task) 데이터 모델
"""
from enum import Enum
from typing import Optional, Dict, Any
from dataclasses import dataclass, field


class TaskStatus(str, Enum):
    """작업 상태"""
    PENDING = "PENDING"
    DOWNLOADING = "DOWNLOADING"
    SEPARATING = "SEPARATING"
    TRANSCRIBING = "TRANSCRIBING"
    RENDERING = "RENDERING"
    COMPLETE = "COMPLETE"
    ERROR = "ERROR"


@dataclass
class Task:
    """작업 정보"""
    task_id: str
    youtube_url: str
    status: TaskStatus
    current_step: str
    progress: int = 0

    # 파일 경로
    audio_path: Optional[str] = None
    drum_audio_path: Optional[str] = None
    midi_path: Optional[str] = None
    musicxml_path: Optional[str] = None

    # 메타데이터
    metadata: Optional[Dict[str, Any]] = field(default_factory=dict)

    # 오류 정보
    error_message: Optional[str] = None
