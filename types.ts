export enum ProcessStatus {
  IDLE = 'IDLE',
  DOWNLOADING = 'DOWNLOADING',
  SEPARATING = 'SEPARATING',
  TRANSCRIBING = 'TRANSCRIBING',
  RENDERING = 'RENDERING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  detail?: string;
}

export interface SongMetadata {
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  youtubeId: string;
}

export interface TranscriptionResult {
  metadata: SongMetadata;
  musicXml: string; // The content of the sheet music
  drumAudioUrl: string; // URL to the separated drum stem
  originalAudioUrl: string; // URL to the original track
}
