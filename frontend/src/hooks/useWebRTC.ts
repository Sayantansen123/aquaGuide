import { useEffect, useRef, useState, useCallback } from "react";
import { privateSocket } from "../socket/privateInstance"; // Import your socket instance

interface UseWebRTCProps {
    userId: string | null;
    onCallEnded?: () => void;
}

export const useWebRTC = ({ userId, onCallEnded }: UseWebRTCProps) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [incomingCall, setIncomingCall] = useState<{
        from: string;
        name: string;
        signal: any;
        isVideo: boolean;
    } | null>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [connectionState, setConnectionState] = useState<string>("new");

    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const remoteUserId = useRef<string | null>(null);

    // STUN servers configuration
    const rtcConfig = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
        ],
    };

    const endCall = useCallback((notifyRemote: boolean = true) => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
        setIsCallActive(false);
        setIncomingCall(null);
        setConnectionState("new");

        if (peerConnection.current) {
            // Only emit end-call if we have a connected peer and want to notify
            if (notifyRemote && remoteUserId.current) {
                privateSocket.emit("end-call", { to: remoteUserId.current });
            }
            peerConnection.current.close();
            peerConnection.current = null;
        }
        remoteUserId.current = null;
        if (onCallEnded) onCallEnded();
    }, [localStream, onCallEnded]); // Added localStream and onCallEnded to dependencies

    const createPeerConnection = useCallback((targetUserId: string) => {
        if (peerConnection.current) return peerConnection.current;

        const pc = new RTCPeerConnection(rtcConfig);
        remoteUserId.current = targetUserId;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                privateSocket.emit("ice-candidate", {
                    candidate: event.candidate,
                    to: targetUserId,
                });
            }
        };

        pc.ontrack = (event) => {
            console.log("Remote stream received");
            console.log(`Streams: ${event.streams.length}`);
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            } else {
                // Fallback if no streams array
                const newStream = new MediaStream();
                newStream.addTrack(event.track);
                setRemoteStream(newStream);
            }
        };

        pc.onconnectionstatechange = () => {
            console.log("Connection State:", pc.connectionState);
            setConnectionState(pc.connectionState);
            if (
                pc.connectionState === "failed" ||
                pc.connectionState === "closed"
            ) {
                endCall(false);
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log("ICE Connection State:", pc.iceConnectionState);
            // Use ICE state as a proxy for connection state if connection state is 'new' or 'connecting'
            // setConnectionState(pc.iceConnectionState); 
        };

        peerConnection.current = pc;
        return pc;
    }, [rtcConfig, endCall]); // Added rtcConfig and endCall to dependencies

    const startCall = async (userToCall: string, video: boolean = true) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: video,
                audio: true,
            });
            setLocalStream(stream);
            setIsVideoEnabled(video);
            setIsCallActive(true);

            const pc = createPeerConnection(userToCall);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            const offer = await pc.createOffer();

            await pc.setLocalDescription(offer);

            privateSocket.emit("call-user", {
                userToCall,
                signalData: offer,
                from: userId,
                name: localStorage.getItem("name") || "User", // Ideally pass from props or context
                isVideo: video
            });
        } catch (err) {
            console.error("Error starting call:", err);
            setIsCallActive(false);
        }
    };

    const answerCall = async () => {
        if (!incomingCall) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: incomingCall.isVideo,
                audio: true,
            });
            setLocalStream(stream);
            setIsVideoEnabled(incomingCall.isVideo);
            setIsCallActive(true);

            const pc = createPeerConnection(incomingCall.from);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.signal));
            await processIceQueue();
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            privateSocket.emit("answer-call", {
                signal: answer,
                to: incomingCall.from,
            });

            setIncomingCall(null);
        } catch (err) {
            console.error("Error answering call:", err);
            setIncomingCall(null);
            setIsCallActive(false);
        }
    };

    const rejectCall = () => {
        if (incomingCall) {
            privateSocket.emit("end-call", { to: incomingCall.from });
        }
        setIncomingCall(null);
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    }

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    }

    const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

    const processIceQueue = async () => {
        if (!peerConnection.current || !peerConnection.current.remoteDescription) return;

        console.log(`Processing ${iceCandidatesQueue.current.length} queued ICE candidates`);
        while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            if (candidate) {
                try {
                    await peerConnection.current.addIceCandidate(candidate);
                    console.log("Added queued ICE candidate successfully");
                } catch (e) {
                    console.error("Error adding queued ice candidate", e);
                }
            }
        }
    };

    const handleCallAnswered = async (data: any) => {
        if (peerConnection.current) {
            try {
                console.log("Setting remote description (answer)");
                await peerConnection.current.setRemoteDescription(
                    new RTCSessionDescription(data.signal)
                );
                console.log("Remote description set successfully");
                // Process any queued candidates now that we have a remote description
                await processIceQueue();
            } catch (e) {
                console.error("Error setting remote description", e);
            }
        }
    };

    const handleIceCandidate = async (data: any) => {
        const candidate = new RTCIceCandidate(data.candidate);

        if (peerConnection.current && peerConnection.current.remoteDescription) {
            try {
                await peerConnection.current.addIceCandidate(candidate);
                console.log("Added ICE candidate successfully");
            } catch (e) {
                console.error("Error adding ice candidate", e);
            }
        } else {
            console.log("Queueing ICE candidate (no remote description yet)");
            iceCandidatesQueue.current.push(candidate);
        }
    };

    const handleCallEnded = useCallback(() => {
        console.log("Call ended by remote");
        endCall(false); // Don't notify back to avoid loop
    }, [endCall]);

    useEffect(() => {
        if (!userId) return;

        const handleCallReceived = (data: any) => {
            console.log("Incoming call:", data);
            setIncomingCall(data);
        };

        privateSocket.on("call-received", handleCallReceived);
        privateSocket.on("call-answered", handleCallAnswered);
        privateSocket.on("ice-candidate-received", handleIceCandidate);
        privateSocket.on("call-ended", handleCallEnded);

        return () => {
            privateSocket.off("call-received", handleCallReceived);
            privateSocket.off("call-answered", handleCallAnswered);
            privateSocket.off("ice-candidate-received", handleIceCandidate);
            privateSocket.off("call-ended", handleCallEnded);
        };
    }, [userId, handleCallEnded]); // Added handleCallEnded to dependencies

    return {
        localStream,
        remoteStream,
        isCallActive,
        incomingCall,
        startCall,
        answerCall,
        rejectCall,
        endCall,
        toggleVideo,
        toggleAudio,
        isVideoEnabled,
        isAudioEnabled,
        connectionState
    };
};
