// This represents a dummy MusicXML file for a basic rock drum beat.
// In a real app, this string comes from the Python backend (Omnizart/Magenta export).
export const MOCK_DRUM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>Generated Drum Transcription</work-title>
  </work>
  <part-list>
    <score-part id="P1">
      <part-name>Drum Set</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>4</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>percussion</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <unpitched>
          <display-step>F</display-step>
          <display-octave>4</display-octave>
        </unpitched>
        <duration>2</duration>
        <instrument id="P1-I1"/>
        <voice>1</voice>
        <type>eighth</type>
        <stem>up</stem>
        <notehead>x</notehead>
      </note>
      <note>
        <unpitched>
          <display-step>C</display-step>
          <display-octave>5</display-octave>
        </unpitched>
        <duration>2</duration>
        <instrument id="P1-I1"/>
        <voice>2</voice>
        <type>eighth</type>
        <stem>down</stem>
      </note>
       <note>
        <unpitched>
          <display-step>F</display-step>
          <display-octave>4</display-octave>
        </unpitched>
        <duration>2</duration>
        <instrument id="P1-I1"/>
        <voice>1</voice>
        <type>eighth</type>
        <stem>up</stem>
        <notehead>x</notehead>
      </note>
      <note>
        <rest/>
        <duration>2</duration>
        <voice>2</voice>
        <type>eighth</type>
      </note>
    </measure>
     <measure number="2">
      <note>
        <unpitched>
          <display-step>F</display-step>
          <display-octave>4</display-octave>
        </unpitched>
        <duration>4</duration>
        <instrument id="P1-I1"/>
        <voice>1</voice>
        <type>quarter</type>
        <stem>up</stem>
        <notehead>x</notehead>
      </note>
      <note>
        <unpitched>
          <display-step>C</display-step>
          <display-octave>5</display-octave>
        </unpitched>
        <duration>4</duration>
        <instrument id="P1-I1"/>
        <voice>2</voice>
        <type>quarter</type>
        <stem>down</stem>
      </note>
    </measure>
  </part>
</score-partwise>`;

export const PROCESSING_STEPS_TEMPLATE = [
  { id: 'download', label: 'Fetching Audio', detail: 'Running yt-dlp high-quality extraction...' },
  { id: 'separate', label: 'Demucs Separation', detail: 'Running HTDemucs (Hybrid Transformer) model...' },
  { id: 'transcribe', label: 'AI Transcription', detail: 'Analyzing onsets with Omnizart/Magenta...' },
  { id: 'render', label: 'Generating Score', detail: 'Converting MIDI to MusicXML...' },
];
