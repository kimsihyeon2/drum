# GrooveExtract AI 설치 가이드

## 빠른 시작 (Quick Start)

### 1단계: 저장소 클론 및 프론트엔드 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local

# .env.local 파일 편집 (선택사항 - Gemini API 키 입력)
# API_KEY=your_gemini_api_key_here
# VITE_API_URL=http://localhost:8000
```

### 2단계: FFmpeg 설치

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg
```

#### macOS
```bash
brew install ffmpeg
```

#### Windows
[FFmpeg 공식 사이트](https://ffmpeg.org/download.html)에서 다운로드

### 3단계: Python 백엔드 설정

```bash
# Python 가상환경 생성
python3 -m venv venv

# 가상환경 활성화
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate  # Windows

# 백엔드 의존성 설치
pip install -r backend/requirements.txt
```

**참고**:
- Python 3.9-3.11 권장 (3.12는 일부 패키지 호환성 문제 있을 수 있음)
- GPU가 있다면 TensorFlow GPU 버전 설치 권장

### 4단계: 실행

두 개의 터미널 창을 열어주세요:

**터미널 1 - 백엔드 서버**:
```bash
cd backend
python main.py
```

백엔드가 `http://localhost:8000`에서 실행됩니다.

**터미널 2 - 프론트엔드**:
```bash
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

### 5단계: 테스트

브라우저에서 `http://localhost:5173`을 열고:
1. YouTube 드럼 연주 영상 URL 입력 (예: `https://youtu.be/dQw4w9WgXcQ`)
2. "Generate" 버튼 클릭
3. 처리 완료까지 기다리기 (보통 2-5분 소요)

## 문제 해결

### 문제: "ModuleNotFoundError: No module named 'demucs'"
**해결**:
```bash
pip install demucs
```

### 문제: "FFmpeg not found"
**해결**: FFmpeg를 설치하고 PATH에 추가되었는지 확인

### 문제: 메모리 부족 에러
**해결**:
- 더 짧은 곡 (3분 이하) 사용
- 시스템 RAM 8GB 이상 권장

### 문제: Demucs 처리가 너무 느림
**해결**:
- GPU 사용 (CUDA 설치)
- 또는 작은 모델 사용 (코드에서 `htdemucs` 대신 `htdemucs_ft` 사용)

### 문제: "CORS error" 발생
**해결**:
- 백엔드가 실행 중인지 확인
- `.env.local`의 `VITE_API_URL`이 올바른지 확인

## 시스템 요구사항

### 최소 요구사항
- CPU: 4코어 이상
- RAM: 8GB 이상
- 디스크: 10GB 이상 여유 공간

### 권장 요구사항
- CPU: 8코어 이상
- RAM: 16GB 이상
- GPU: NVIDIA GPU (CUDA 지원)
- 디스크: 20GB 이상 여유 공간

## 추가 설정

### GPU 가속 활성화 (선택사항)

NVIDIA GPU가 있다면:

```bash
# CUDA 지원 TensorFlow 설치
pip install tensorflow[and-cuda]

# PyTorch CUDA 설치
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Gemini API 키 설정 (AI 코칭 기능)

1. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 API 키 발급
2. `.env.local` 파일에 추가:
```
API_KEY=your_actual_api_key_here
```

**참고**: Gemini API 키 없이도 드럼 악보 생성은 정상 작동합니다. AI 코칭 팁만 표시되지 않습니다.

## 개발 모드

### 백엔드 개발
```bash
cd backend
# 자동 리로드 모드로 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 프론트엔드 개발
```bash
npm run dev
```

## 프로덕션 배포

### 백엔드 배포
```bash
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 프론트엔드 빌드
```bash
npm run build
# dist 폴더를 정적 파일 서버에 배포
```

## 라이선스

MIT License

## 지원

문제가 발생하면 GitHub Issues에 보고해주세요.
