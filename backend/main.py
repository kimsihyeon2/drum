"""
GrooveExtract AI - Backend API Server
YouTube 드럼 악보 자동 생성 시스템
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
import uuid
import logging

from services.youtube_service import download_youtube_audio
from services.separation_service import separate_drums
from services.transcription_service import transcribe_drums
from services.conversion_service import midi_to_musicxml
from models.task import Task, TaskStatus

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GrooveExtract AI API",
    description="YouTube 음원에서 드럼 악보를 자동으로 생성하는 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 구체적인 origin 지정 필요
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 작업 상태 저장소 (프로덕션에서는 Redis 등 사용)
tasks = {}


class ProcessRequest(BaseModel):
    youtube_url: str


class TaskResponse(BaseModel):
    task_id: str
    status: str
    message: str


@app.get("/")
async def root():
    """API 상태 확인"""
    return {
        "name": "GrooveExtract AI API",
        "version": "1.0.0",
        "status": "running"
    }


@app.post("/api/process", response_model=TaskResponse)
async def start_processing(
    request: ProcessRequest,
    background_tasks: BackgroundTasks
):
    """
    YouTube URL을 받아 드럼 악보 생성 프로세스 시작
    """
    task_id = str(uuid.uuid4())

    # 초기 작업 상태 생성
    task = Task(
        task_id=task_id,
        youtube_url=request.youtube_url,
        status=TaskStatus.PENDING,
        current_step="초기화 중",
        progress=0
    )
    tasks[task_id] = task

    # 백그라운드에서 처리 시작
    background_tasks.add_task(process_pipeline, task_id)

    return TaskResponse(
        task_id=task_id,
        status=TaskStatus.PENDING,
        message="처리가 시작되었습니다."
    )


async def process_pipeline(task_id: str):
    """
    전체 파이프라인 실행:
    1. YouTube 다운로드 (yt-dlp)
    2. 음원 분리 (Demucs)
    3. 드럼 트랜스크립션 (basic-pitch or librosa)
    4. MIDI → MusicXML 변환
    """
    task = tasks[task_id]

    try:
        # 1. YouTube 다운로드
        task.status = TaskStatus.DOWNLOADING
        task.current_step = "YouTube 오디오 다운로드 중"
        task.progress = 10
        logger.info(f"[{task_id}] Starting YouTube download")

        audio_path = await download_youtube_audio(task.youtube_url, task_id)
        task.audio_path = audio_path
        task.progress = 25

        # 2. 음원 분리 (Demucs)
        task.status = TaskStatus.SEPARATING
        task.current_step = "Demucs로 드럼 트랙 분리 중"
        task.progress = 30
        logger.info(f"[{task_id}] Starting drum separation")

        drum_audio_path = await separate_drums(audio_path, task_id)
        task.drum_audio_path = drum_audio_path
        task.progress = 55

        # 3. 드럼 트랜스크립션
        task.status = TaskStatus.TRANSCRIBING
        task.current_step = "AI 드럼 트랜스크립션 중"
        task.progress = 60
        logger.info(f"[{task_id}] Starting transcription")

        midi_path, metadata = await transcribe_drums(drum_audio_path, task_id)
        task.midi_path = midi_path
        task.metadata = metadata
        task.progress = 85

        # 4. MIDI → MusicXML 변환
        task.status = TaskStatus.RENDERING
        task.current_step = "MusicXML 악보 생성 중"
        task.progress = 90
        logger.info(f"[{task_id}] Converting to MusicXML")

        musicxml_path = await midi_to_musicxml(midi_path, task_id)
        task.musicxml_path = musicxml_path
        task.progress = 100

        # 완료
        task.status = TaskStatus.COMPLETE
        task.current_step = "완료"
        logger.info(f"[{task_id}] Processing complete")

    except Exception as e:
        logger.error(f"[{task_id}] Error: {str(e)}")
        task.status = TaskStatus.ERROR
        task.current_step = f"오류 발생: {str(e)}"
        task.error_message = str(e)


@app.get("/api/status/{task_id}")
async def get_task_status(task_id: str):
    """작업 상태 조회"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="작업을 찾을 수 없습니다.")

    task = tasks[task_id]
    return {
        "task_id": task.task_id,
        "status": task.status,
        "current_step": task.current_step,
        "progress": task.progress,
        "metadata": task.metadata,
        "error_message": task.error_message
    }


@app.get("/api/result/{task_id}")
async def get_result(task_id: str):
    """완료된 작업의 결과 조회"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="작업을 찾을 수 없습니다.")

    task = tasks[task_id]

    if task.status != TaskStatus.COMPLETE:
        raise HTTPException(
            status_code=400,
            detail="작업이 아직 완료되지 않았습니다."
        )

    # MusicXML 파일 내용 읽기
    with open(task.musicxml_path, 'r', encoding='utf-8') as f:
        musicxml_content = f.read()

    return {
        "task_id": task.task_id,
        "metadata": task.metadata,
        "musicxml": musicxml_content,
        "drum_audio_url": f"/api/audio/{task_id}/drums",
        "original_audio_url": f"/api/audio/{task_id}/original"
    }


@app.get("/api/audio/{task_id}/drums")
async def get_drum_audio(task_id: str):
    """분리된 드럼 오디오 파일 다운로드"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="작업을 찾을 수 없습니다.")

    task = tasks[task_id]

    if not task.drum_audio_path or not os.path.exists(task.drum_audio_path):
        raise HTTPException(status_code=404, detail="드럼 오디오 파일을 찾을 수 없습니다.")

    return FileResponse(
        task.drum_audio_path,
        media_type="audio/wav",
        filename=f"drums_{task_id}.wav"
    )


@app.get("/api/audio/{task_id}/original")
async def get_original_audio(task_id: str):
    """원본 오디오 파일 다운로드"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="작업을 찾을 수 없습니다.")

    task = tasks[task_id]

    if not task.audio_path or not os.path.exists(task.audio_path):
        raise HTTPException(status_code=404, detail="오디오 파일을 찾을 수 없습니다.")

    return FileResponse(
        task.audio_path,
        media_type="audio/wav",
        filename=f"original_{task_id}.wav"
    )


@app.get("/api/download/{task_id}/musicxml")
async def download_musicxml(task_id: str):
    """MusicXML 파일 다운로드"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="작업을 찾을 수 없습니다.")

    task = tasks[task_id]

    if not task.musicxml_path or not os.path.exists(task.musicxml_path):
        raise HTTPException(status_code=404, detail="MusicXML 파일을 찾을 수 없습니다.")

    return FileResponse(
        task.musicxml_path,
        media_type="application/xml",
        filename=f"drums_{task_id}.musicxml"
    )


@app.get("/api/download/{task_id}/midi")
async def download_midi(task_id: str):
    """MIDI 파일 다운로드"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="작업을 찾을 수 없습니다.")

    task = tasks[task_id]

    if not task.midi_path or not os.path.exists(task.midi_path):
        raise HTTPException(status_code=404, detail="MIDI 파일을 찾을 수 없습니다.")

    return FileResponse(
        task.midi_path,
        media_type="audio/midi",
        filename=f"drums_{task_id}.mid"
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
