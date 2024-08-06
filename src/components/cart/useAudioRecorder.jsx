import { useState, useRef, useEffect } from 'react';

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startRecording = async () => {
        if (!streamRef.current) {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
            mediaRecorderRef.current = new MediaRecorder(streamRef.current);
            mediaRecorderRef.current.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
        }
        if (!isRecording) {
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);
        }
    };

    const pauseRecording = () => {
        if (isRecording && !isPaused) {
            mediaRecorderRef.current.stop();
            clearInterval(timerRef.current);
            setIsPaused(true);
            setIsRecording(false);

            // Handle onstop event for creating audio URL
            mediaRecorderRef.current.onstop = () => {
                if (audioChunksRef.current.length > 0) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioURL(audioUrl);
                }
            };
        }
    };

    const stopRecording = () => {
        if (isRecording || isPaused) {
            mediaRecorderRef.current.stop();
            clearInterval(timerRef.current);
            setIsRecording(false);
            setIsPaused(false);

            // Handle onstop event for creating audio URL
            mediaRecorderRef.current.onstop = () => {
                if (audioChunksRef.current.length > 0) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioURL(audioUrl);
                    audioChunksRef.current = []; // Reset chunks after stopping
                }
            };
        }
    };

    return {
        isRecording,
        isPaused,
        audioURL,
        recordingTime,
        startRecording,
        pauseRecording,
        stopRecording,
        mediaRecorder: mediaRecorderRef.current,
    };
};

export default useAudioRecorder;
