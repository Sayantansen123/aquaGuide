import React, { useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CallModalProps {
    isOpen: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onEndCall: () => void;
    isIncoming?: boolean;
    callerName?: string;
    onAnswer?: () => void;
    onReject?: () => void;
    toggleVideo: () => void;
    toggleAudio: () => void;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
    connectionState?: string;
}

const CallModal: React.FC<CallModalProps> = ({
    isOpen,
    localStream,
    remoteStream,
    onEndCall,
    isIncoming = false,
    callerName,
    onAnswer,
    onReject,
    toggleVideo,
    toggleAudio,
    isVideoEnabled,
    isAudioEnabled,
    connectionState
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    if (isIncoming) {
        return (
            <Dialog open={isOpen} onOpenChange={() => { }}>
                <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex flex-col items-center justify-center space-y-6 py-8">
                        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                            <Phone className="h-12 w-12 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">{callerName}</h3>
                            <p className="text-muted-foreground">Incoming Call...</p>
                        </div>
                        <div className="flex gap-6 w-full justify-center">
                            <Button
                                variant="destructive"
                                size="lg"
                                className="rounded-full h-14 w-14"
                                onClick={onReject}
                            >
                                <PhoneOff className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="default" // "ocean" might not be standard, using default or success color usually
                                size="lg"
                                className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600"
                                onClick={onAnswer}
                            >
                                <Phone className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            {/* Full screen overlay style for active call */}
            <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden bg-black border-none">
                <div className="relative w-full h-full flex flex-col">
                    {/* Remote Video (Main View) */}
                    <div className="flex-1 relative bg-muted/10 flex items-center justify-center overflow-hidden">
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                                onLoadedMetadata={() => remoteVideoRef.current?.play().catch(e => console.error("Error auto-playing remote video:", e))}
                            />
                        ) : (
                            <div className="flex flex-col items-center text-white/50 space-y-4">
                                <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                                    <span className="text-2xl font-bold">{callerName?.charAt(0)}</span>
                                </div>
                                <p>Connecting...</p>
                                {connectionState && <p className="text-xs text-white/30 font-mono">State: {connectionState}</p>}
                            </div>
                        )}

                        {/* Overlay Status (if connected but no video yet, or other states) */}
                        {remoteStream && connectionState !== 'connected' && (
                            <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-white/70 text-xs">
                                Status: {connectionState}
                            </div>
                        )}

                        {/* Local Video (PiP) */}
                        <div className="absolute top-4 right-4 w-48 aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/20 shadow-xl transition-all hover:scale-105">
                            {localStream ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
                                    Camera Off
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="h-20 bg-background/10 backdrop-blur-md absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6">
                        <Button
                            variant={isVideoEnabled ? "outline" : "destructive"}
                            size="icon"
                            className="rounded-full h-12 w-12 border-none bg-white/10 hover:bg-white/20 text-white"
                            onClick={toggleVideo}
                        >
                            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </Button>

                        <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-full h-16 w-16"
                            onClick={onEndCall}
                        >
                            <PhoneOff className="h-8 w-8" />
                        </Button>

                        <Button
                            variant={isAudioEnabled ? "outline" : "destructive"}
                            size="icon"
                            className="rounded-full h-12 w-12 border-none bg-white/10 hover:bg-white/20 text-white"
                            onClick={toggleAudio}
                        >
                            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CallModal;
