/**
 * Backend API 연동 서비스
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ProcessResponse {
  task_id: string;
  status: string;
  message: string;
}

export interface TaskStatus {
  task_id: string;
  status: 'PENDING' | 'DOWNLOADING' | 'SEPARATING' | 'TRANSCRIBING' | 'RENDERING' | 'COMPLETE' | 'ERROR';
  current_step: string;
  progress: number;
  metadata?: {
    duration: string;
    bpm: number;
    difficulty: string;
  };
  error_message?: string;
}

export interface TranscriptionResult {
  task_id: string;
  metadata: {
    title?: string;
    artist?: string;
    duration: string;
    bpm: number;
    difficulty: string;
    youtubeId?: string;
  };
  musicxml: string;
  drum_audio_url: string;
  original_audio_url: string;
}

/**
 * YouTube URL로 처리 시작
 */
export async function startProcessing(youtubeUrl: string): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE_URL}/api/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ youtube_url: youtubeUrl }),
  });

  if (!response.ok) {
    throw new Error('처리 시작 실패');
  }

  return response.json();
}

/**
 * 작업 상태 조회
 */
export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  const response = await fetch(`${API_BASE_URL}/api/status/${taskId}`);

  if (!response.ok) {
    throw new Error('상태 조회 실패');
  }

  return response.json();
}

/**
 * 완료된 작업의 결과 조회
 */
export async function getResult(taskId: string): Promise<TranscriptionResult> {
  const response = await fetch(`${API_BASE_URL}/api/result/${taskId}`);

  if (!response.ok) {
    throw new Error('결과 조회 실패');
  }

  return response.json();
}

/**
 * 드럼 오디오 파일 URL 가져오기
 */
export function getDrumAudioUrl(taskId: string): string {
  return `${API_BASE_URL}/api/audio/${taskId}/drums`;
}

/**
 * 원본 오디오 파일 URL 가져오기
 */
export function getOriginalAudioUrl(taskId: string): string {
  return `${API_BASE_URL}/api/audio/${taskId}/original`;
}

/**
 * MusicXML 파일 다운로드 URL
 */
export function getMusicXMLDownloadUrl(taskId: string): string {
  return `${API_BASE_URL}/api/download/${taskId}/musicxml`;
}

/**
 * MIDI 파일 다운로드 URL
 */
export function getMIDIDownloadUrl(taskId: string): string {
  return `${API_BASE_URL}/api/download/${taskId}/midi`;
}

/**
 * 작업 상태를 주기적으로 폴링
 */
export async function pollTaskStatus(
  taskId: string,
  onUpdate: (status: TaskStatus) => void,
  intervalMs: number = 2000
): Promise<TaskStatus> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const status = await getTaskStatus(taskId);
        onUpdate(status);

        if (status.status === 'COMPLETE') {
          resolve(status);
        } else if (status.status === 'ERROR') {
          reject(new Error(status.error_message || '처리 중 오류 발생'));
        } else {
          setTimeout(poll, intervalMs);
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}
