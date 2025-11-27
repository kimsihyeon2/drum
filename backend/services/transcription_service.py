import os
import numpy as np
import librosa
import warnings
from music21 import stream, note, instrument, clef, meter
from scipy.signal import find_peaks

warnings.filterwarnings("ignore")

async def transcribe_drums(audio_path, output_dir):
    """
    [Adaptive Sensitivity Version]
    감지된 노트 수가 너무 적으면 자동으로 감도를 조절하여 재시도합니다.
    """
    os.makedirs(output_dir, exist_ok=True)
    output_xml_path = os.path.join(output_dir, "transcription.musicxml")
    output_midi_path = os.path.join(output_dir, "transcription.mid")

    print(f"🥁 Transcribing (Adaptive): {audio_path}")

    try:
        # 1. 오디오 로드
        y, sr = librosa.load(audio_path, sr=44100)
        
        # 정규화 (가장 큰 소리를 1.0으로 맞춤)
        y = librosa.util.normalize(y)
        
        # 타악기 성분 분리
        _, y_percussive = librosa.effects.hpss(y)
        
        # 주파수 대역별 에너지 계산 함수
        def get_band_energy(y_input, low, high):
            S = np.abs(librosa.stft(y_input))
            fft_freqs = librosa.fft_frequencies(sr=sr)
            bins = np.where((fft_freqs >= low) & (fft_freqs <= high))[0]
            if len(bins) == 0: return np.zeros(S.shape[1])
            return librosa.util.normalize(np.mean(S[bins, :], axis=0))

        # 2. 대역별 에너지 추출
        env_kick = get_band_energy(y_percussive, 20, 150)
        env_snare = get_band_energy(y_percussive, 200, 2500)
        env_hh = get_band_energy(y_percussive, 5000, 20000)

        # 3. 적응형 피크 검출 (Adaptive Peak Picking)
        def adaptive_pick(env, name, min_notes=20):
            # 처음에는 일반적인 기준(0.15)으로 시도
            thresholds = [0.15, 0.10, 0.05, 0.02] # 점점 예민해짐
            
            for th in thresholds:
                peaks, _ = find_peaks(env, height=th, distance=sr/16)
                if len(peaks) >= min_notes:
                    print(f"  - {name}: Found {len(peaks)} notes (Threshold: {th})")
                    return peaks
            
            # 그래도 없으면 마지막 결과 반환
            print(f"  - {name}: Found {len(peaks)} notes (Warning: Low count)")
            return peaks

        peaks_kick = adaptive_pick(env_kick, "Kick")
        peaks_snare = adaptive_pick(env_snare, "Snare")
        peaks_hh = adaptive_pick(env_hh, "Hi-hat", min_notes=50) # 하이햇은 더 많아야 함

        times_kick = librosa.frames_to_time(peaks_kick, sr=sr)
        times_snare = librosa.frames_to_time(peaks_snare, sr=sr)
        times_hh = librosa.frames_to_time(peaks_hh, sr=sr)

        # 4. 악보 생성
        s = stream.Score()
        p = stream.Part()
        p.id = 'DrumPart'
        p.insert(0, instrument.Percussion())
        p.insert(0, clef.PercussionClef())
        p.insert(0, meter.TimeSignature('4/4'))

        # 5. BPM 추정 및 고정
        try:
            tempo = librosa.feature.rhythm.tempo(y=y_percussive, sr=sr)[0]
        except:
            tempo = librosa.beat.tempo(y=y_percussive, sr=sr)[0]
            
        bpm = int(round(tempo))
        if bpm < 60 or bpm > 180: bpm = 120
        print(f"  - BPM: {bpm}")
        
        quarter_note_duration = 60.0 / bpm

        # 6. 노트 통합 및 퀀타이즈
        all_notes = []
        for t in times_kick: all_notes.append({'time': t, 'type': 'Kick', 'midi': 36})
        for t in times_snare: all_notes.append({'time': t, 'type': 'Snare', 'midi': 38})
        for t in times_hh: all_notes.append({'time': t, 'type': 'Hi-hat', 'midi': 42})
        
        all_notes.sort(key=lambda x: x['time'])

        # 중복 제거 (너무 가까운 노트 삭제)
        filtered_notes = []
        last_time = -1
        for note_data in all_notes:
            if note_data['time'] - last_time > 0.05: # 50ms 이내 중복 무시
                filtered_notes.append(note_data)
                last_time = note_data['time']

        for note_data in filtered_notes:
            ql = note_data['time'] / quarter_note_duration
            quantized_ql = round(ql * 4) / 4.0
            
            n = note.Note()
            n.pitch.midi = note_data['midi']
            n.quarterLength = 0.25
            if note_data['type'] == 'Hi-hat': n.notehead = 'x'
            
            p.insert(quantized_ql, n)

        p.makeMeasures(inPlace=True)
        s.append(p)
        
        s.write('musicxml', fp=output_xml_path)
        s.write('midi', fp=output_midi_path)

        print(f"✅ Custom Drum Transcription 완료: {output_xml_path}")
        return output_midi_path, output_xml_path

    except Exception as e:
        print(f"❌ Custom Transcription 오류: {e}")
        return None, None