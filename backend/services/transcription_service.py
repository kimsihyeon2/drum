"""
드럼 트랜스크립션 서비스 (basic-pitch 사용)
"""
import os
import logging
from typing import Tuple, Dict, Any
import librosa
from basic_pitch.inference import predict_and_save
from basic_pitch import ICASSP_2022_MODEL_PATH

logger = logging.getLogger(__name__)

TEMP_DIR = "backend/temp/transcriptions"


async def transcribe_drums(drum_audio_path: str, task_id: str) -> Tuple[str, Dict[str, Any]]:
    """
    드럼 오디오를 MIDI로 트랜스크립션

    Args:
        drum_audio_path: 드럼 오디오 파일 경로
        task_id: 작업 ID

    Returns:
        (MIDI 파일 경로, 메타데이터)
    """
    os.makedirs(TEMP_DIR, exist_ok=True)

    output_dir = os.path.join(TEMP_DIR, task_id)
    os.makedirs(output_dir, exist_ok=True)

    try:
        logger.info(f"Starting transcription for: {drum_audio_path}")

        # basic-pitch로 MIDI 생성
        predict_and_save(
            [drum_audio_path],
            output_dir,
            save_midi=True,
            sonify_midi=False,
            save_model_outputs=False,
            save_notes=False,
        )

        # MIDI 파일 경로 찾기
        midi_filename = os.path.splitext(os.path.basename(drum_audio_path))[0] + "_basic_pitch.mid"
        midi_path = os.path.join(output_dir, midi_filename)

        if not os.path.exists(midi_path):
            raise Exception("MIDI 파일 생성에 실패했습니다.")

        # 메타데이터 분석
        metadata = await analyze_audio_metadata(drum_audio_path)

        logger.info(f"Transcription complete: {midi_path}")
        return midi_path, metadata

    except Exception as e:
        logger.error(f"Transcription failed: {str(e)}")
        raise Exception(f"트랜스크립션 실패: {str(e)}")


async def analyze_audio_metadata(audio_path: str) -> Dict[str, Any]:
    """
    오디오 파일 분석 (BPM, 길이 등)

    Args:
        audio_path: 오디오 파일 경로

    Returns:
        메타데이터 딕셔너리
    """
    try:
        # librosa로 오디오 로드
        y, sr = librosa.load(audio_path, sr=None)

        # 길이 계산
        duration_seconds = librosa.get_duration(y=y, sr=sr)
        duration_str = f"{int(duration_seconds // 60)}:{int(duration_seconds % 60):02d}"

        # BPM 추정
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = int(tempo)

        # 난이도 추정 (간단한 휴리스틱)
        # onset 수로 난이도 추정
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        onsets = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)
        onset_density = len(onsets) / duration_seconds

        if onset_density > 8:
            difficulty = "Expert"
        elif onset_density > 5:
            difficulty = "Advanced"
        elif onset_density > 3:
            difficulty = "Intermediate"
        else:
            difficulty = "Beginner"

        return {
            "duration": duration_str,
            "bpm": bpm,
            "difficulty": difficulty,
        }

    except Exception as e:
        logger.error(f"Metadata analysis failed: {str(e)}")
        return {
            "duration": "0:00",
            "bpm": 120,
            "difficulty": "Intermediate",
        }
