
import { AssemblyAI } from 'assemblyai';
import dotenv from 'dotenv';
dotenv.config();

console.log('[Voice Service] API Key loaded:', process.env.ASSEMBLYAI_API_KEY ? 'YES (length: ' + process.env.ASSEMBLYAI_API_KEY.length + ')' : 'NO - MISSING!');

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY
});

/**
 * Transcribes an audio file from a public or accessible URL.
 * 
 * @param {string} audioUrl - The URL of the audio file to transcribe
 * @returns {Promise<string>} - The transcribed text
 */
export async function transcribeAudio(audioUrl) {
    try {
        console.log(`[Voice Service] Starting transcription for URL: ${audioUrl}`);

        const transcript = await client.transcripts.transcribe({
            audio: audioUrl
        });

        console.log(`[Voice Service] Transcript status: ${transcript.status}`);

        if (transcript.status === 'error') {
            console.error('[Voice Service] Transcription failed:', transcript.error);
            throw new Error(transcript.error);
        }

        console.log(`[Voice Service] Transcription success: "${transcript.text}"`);
        return transcript.text;
    } catch (error) {
        console.error('[Voice Service] Error details:', error.message);
        console.error('[Voice Service] Full error:', error);
        return null;
    }
}
