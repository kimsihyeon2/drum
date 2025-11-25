"""
음원 분리 서비스 (Demucs 사용)
"""
import os
import logging
import subprocess
import shutil

logger = logging.getLogger(__name__)

TEMP_DIR = "backend/temp/separated"


async def separate_drums(audio_path: str, task_id: str) -> str:
    """
    Demucs를 사용하여 드럼 트랙 분리

    Args:
        audio_path: 입력 오디오 파일 경로
        task_id: 작업 ID

    Returns:
        분리된 드럼 트랙 파일 경로
    """
    os.makedirs(TEMP_DIR, exist_ok=True)

    output_dir = os.path.join(TEMP_DIR, task_id)

    try:
        # Demucs 실행
        # htdemucs: Hybrid Transformer Demucs (최신 모델)
        logger.info(f"Starting Demucs separation for: {audio_path}")

        cmd = [
            "python", "-m", "demucs",
            "--two-stems=drums",  # 드럼만 분리
            "-n", "htdemucs",  # htdemucs 모델 사용
            "-o", TEMP_DIR,
            "--filename", f"{task_id}/{{stem}}.{{ext}}",
            audio_path
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600  # 10분 타임아웃
        )

        if result.returncode != 0:
            logger.error(f"Demucs failed: {result.stderr}")
            raise Exception(f"Demucs 음원 분리 실패: {result.stderr}")

        # 분리된 드럼 파일 경로
        drum_path = os.path.join(TEMP_DIR, task_id, "drums.wav")

        if not os.path.exists(drum_path):
            # htdemucs 폴더 구조 확인
            htdemucs_path = os.path.join(TEMP_DIR, "htdemucs", task_id, "drums.wav")
            if os.path.exists(htdemucs_path):
                drum_path = htdemucs_path
            else:
                raise Exception("분리된 드럼 파일을 찾을 수 없습니다.")

        logger.info(f"Drum separation complete: {drum_path}")
        return drum_path

    except subprocess.TimeoutExpired:
        logger.error("Demucs timeout")
        raise Exception("음원 분리 시간이 초과되었습니다.")
    except Exception as e:
        logger.error(f"Separation failed: {str(e)}")
        raise Exception(f"음원 분리 실패: {str(e)}")


def cleanup_separation_files(task_id: str):
    """
    분리 작업 임시 파일 정리

    Args:
        task_id: 작업 ID
    """
    output_dir = os.path.join(TEMP_DIR, task_id)
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
        logger.info(f"Cleaned up separation files for task: {task_id}")
