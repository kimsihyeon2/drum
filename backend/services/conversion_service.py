"""
MIDI to MusicXML 변환 서비스
"""
import os
import logging
from music21 import converter, stream, instrument

logger = logging.getLogger(__name__)


async def midi_to_musicxml(midi_path: str, task_id: str) -> str:
    """
    MIDI 파일을 MusicXML로 변환

    Args:
        midi_path: MIDI 파일 경로
        task_id: 작업 ID

    Returns:
        MusicXML 파일 경로
    """
    try:
        logger.info(f"Converting MIDI to MusicXML: {midi_path}")

        # MIDI 파일 로드
        midi_stream = converter.parse(midi_path)

        # 드럼 파트 설정
        for part in midi_stream.parts:
            part.insert(0, instrument.Percussion())

        # MusicXML 파일 경로
        output_dir = os.path.dirname(midi_path)
        musicxml_path = os.path.join(output_dir, f"{task_id}.musicxml")

        # MusicXML로 저장
        midi_stream.write('musicxml', fp=musicxml_path)

        logger.info(f"MusicXML conversion complete: {musicxml_path}")
        return musicxml_path

    except Exception as e:
        logger.error(f"MusicXML conversion failed: {str(e)}")
        raise Exception(f"MusicXML 변환 실패: {str(e)}")


async def midi_to_pdf(midi_path: str, task_id: str) -> str:
    """
    MIDI 파일을 PDF 악보로 변환 (선택사항)

    Args:
        midi_path: MIDI 파일 경로
        task_id: 작업 ID

    Returns:
        PDF 파일 경로
    """
    try:
        logger.info(f"Converting MIDI to PDF: {midi_path}")

        # MIDI 파일 로드
        midi_stream = converter.parse(midi_path)

        # PDF 파일 경로
        output_dir = os.path.dirname(midi_path)
        pdf_path = os.path.join(output_dir, f"{task_id}.pdf")

        # PDF로 저장 (MuseScore 등이 설치되어 있어야 함)
        midi_stream.write('musicxml.pdf', fp=pdf_path)

        logger.info(f"PDF conversion complete: {pdf_path}")
        return pdf_path

    except Exception as e:
        logger.error(f"PDF conversion failed: {str(e)}")
        # PDF 변환은 선택사항이므로 에러를 로그만 남김
        return ""
