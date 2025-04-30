'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Camera, Check, Video, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
  onVideoCapture?: (videoBlob: Blob) => void;
  trigger?: React.ReactNode;
}

type CaptureMode = 'photo' | 'video';

export function WebcamCapture({ onCapture, onVideoCapture, trigger }: WebcamCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<CaptureMode>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  const startRecording = useCallback(() => {
    if (!webcamRef.current?.stream) return;

    const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm;codecs=vp9',
    });
    mediaRecorderRef.current = mediaRecorder;
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm;codecs=vp9' });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedVideo(videoUrl);
      setRecordedChunks(chunks);
    };

    mediaRecorder.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const submitVideo = useCallback(() => {
    if (recordedChunks.length > 0 && onVideoCapture) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      onVideoCapture(blob);
      setIsOpen(false);
      setRecordedVideo(null);
      setRecordedChunks([]);
    }
  }, [recordedChunks, onVideoCapture]);

  const discardVideo = useCallback(() => {
    setRecordedVideo(null);
    setRecordedChunks([]);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      setIsOpen(false);
    }
  }, [onCapture]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Capture Media</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
            {recordedVideo ? (
              <video
                src={recordedVideo}
                controls
                className="h-full w-full object-contain"
                autoPlay
              />
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            {mode === 'photo' ? (
              <Button onClick={capturePhoto}>Take Photo</Button>
            ) : recordedVideo ? (
              <>
                <Button variant="outline" onClick={discardVideo}>
                  <X className="mr-2 h-4 w-4" />
                  Discard
                </Button>
                <Button onClick={submitVideo}>
                  <Check className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              </>
            ) : isRecording ? (
              <Button onClick={stopRecording} variant="destructive">
                Stop Recording
              </Button>
            ) : (
              <Button onClick={startRecording}>Start Recording</Button>
            )}
          </div>

          <div className="flex justify-center gap-2">
            <Button
              variant={mode === 'photo' ? 'default' : 'outline'}
              onClick={() => setMode('photo')}
            >
              <Camera className="mr-2 h-4 w-4" />
              Photo
            </Button>
            <Button
              variant={mode === 'video' ? 'default' : 'outline'}
              onClick={() => setMode('video')}
            >
              <Video className="mr-2 h-4 w-4" />
              Video
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
