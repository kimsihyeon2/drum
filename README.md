<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GrooveExtract AI 🥁

YouTube 음원 링크에서 드럼 악보를 자동으로 생성하는 End-to-End AI 시스템

## 주요 기능

- ✅ **YouTube 다운로드**: yt-dlp로 고품질 오디오 추출
- ✅ **음원 분리**: Demucs (Hybrid Transformer)로 드럼 트랙 분리
- ✅ **AI 트랜스크립션**: basic-pitch로 드럼 악보 자동 생성
- ✅ **MusicXML 변환**: 표준 악보 포맷으로 내보내기
- ✅ **AI 코칭**: Gemini AI로 연주 팁 제공

## 시스템 아키텍처

```
YouTube URL
    ↓
[yt-dlp] 오디오 다운로드
    ↓
[Demucs] 드럼 트랙 분리
    ↓
[basic-pitch] MIDI 트랜스크립션
    ↓
[music21] MusicXML 변환
    ↓
드럼 악보 (MIDI, MusicXML, PDF)
```

## 설치 및 실행

### 1. 사전 요구사항

- **Node.js** (v18 이상)
- **Python** (3.9-3.11 권장)
- **FFmpeg** (오디오 처리용)

#### FFmpeg 설치

```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# https://ffmpeg.org/download.html 에서 다운로드
```

### 2. 프론트엔드 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 편집하여 API 키 입력

# 개발 서버 실행
npm run dev
```

### 3. 백엔드 설정

```bash
# Python 가상환경 생성
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 의존성 설치
pip install -r backend/requirements.txt

# 백엔드 서버 실행
cd backend
python main.py
```

백엔드 서버는 `http://localhost:8000`에서 실행됩니다.

### 4. 전체 시스템 실행

**터미널 1 (백엔드)**:
```bash
cd backend
python main.py
```

**터미널 2 (프론트엔드)**:
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 사용 방법

1. YouTube 음악 URL 입력 (예: `https://youtu.be/dQw4w9WgXcQ`)
2. "Generate" 버튼 클릭
3. 처리 진행 상황 확인 (다운로드 → 분리 → 트랜스크립션 → 렌더링)
4. 완료되면 드럼 악보 확인 및 다운로드

## API 엔드포인트

### POST `/api/process`
YouTube URL로 처리 시작
```json
{
  "youtube_url": "https://youtu.be/..."
}
```

### GET `/api/status/{task_id}`
작업 상태 조회

### GET `/api/result/{task_id}`
완료된 작업 결과 조회

### GET `/api/download/{task_id}/midi`
MIDI 파일 다운로드

### GET `/api/download/{task_id}/musicxml`
MusicXML 파일 다운로드

## 기술 스택

### 프론트엔드
- React 19 + TypeScript
- Vite
- Lucide React (아이콘)
- TailwindCSS (스타일링)

### 백엔드
- FastAPI (Python 웹 프레임워크)
- yt-dlp (YouTube 다운로드)
- Demucs (음원 분리)
- basic-pitch (드럼 트랜스크립션)
- music21 (MIDI/MusicXML 변환)
- librosa (오디오 분석)

## 문제 해결

### Demucs가 느린 경우
- GPU 사용을 권장합니다 (CUDA 설치 필요)
- 더 작은 모델 사용: `htdemucs_ft` 대신 `htdemucs`

### 메모리 부족 에러
- 더 짧은 곡으로 테스트
- 시스템 메모리 8GB 이상 권장

### 트랜스크립션 정확도 향상
- 드럼이 명확한 곡 사용
- 원본 오디오 품질이 높을수록 좋음

## 라이선스

MIT License

## 기여

이슈와 Pull Request를 환영합니다!

## 참고 자료

- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [Demucs](https://github.com/facebookresearch/demucs)
- [basic-pitch](https://github.com/spotify/basic-pitch)
- [music21](https://github.com/cuthbertLab/music21)
