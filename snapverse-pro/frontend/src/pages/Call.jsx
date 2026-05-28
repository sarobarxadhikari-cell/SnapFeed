import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Call({ user }) {
  const { userId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [calling, setCalling] = useState(false);
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const navigate = useNavigate();

  const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  useEffect(() => {
    socket.on("incoming-call", async ({ signal, from }) => {
      if (from === userId) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localRef.current) localRef.current.srcObject = stream;

        const pc = new RTCPeerConnection(config);
        pcRef.current = pc;
        stream.getTracks().forEach(t => pc.addTrack(t, stream));

        pc.ontrack = (e) => {
          setRemoteStream(e.streams[0]);
          if (remoteRef.current) remoteRef.current.srcObject = e.streams[0];
        };

        await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(signal)));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("accept-call", { to: userId, signal: JSON.stringify(pc.localDescription) });
        setInCall(true);
      }
    });

    socket.on("call-accepted", async ({ signal }) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(signal)));
        setInCall(true);
        setCalling(false);
      }
    });

    socket.on("call-ended", () => {
      endCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-ended");
    };
  }, [userId]);

  const startCall = async () => {
    setCalling(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localRef.current) localRef.current.srcObject = stream;

      const pc = new RTCPeerConnection(config);
      pcRef.current = pc;
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      pc.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
        if (remoteRef.current) remoteRef.current.srcObject = e.streams[0];
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call-user", { to: userId, signal: JSON.stringify(offer), from: user.id });
    } catch (err) {
      console.error("Call error:", err);
      setCalling(false);
    }
  };

  const endCall = () => {
    socket.emit("end-call", { to: userId });
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setInCall(false);
    setCalling(false);
    navigate("/");
  };

  return (
    <div className="call-page">
      <div className="call-topbar">
        <button className="back-btn" onClick={endCall}>← End Call</button>
        <h3>{inCall ? "In Call" : calling ? "Calling..." : "Video Call"}</h3>
        <div></div>
      </div>

      <div className="call-container">
        {remoteStream && (
          <video ref={remoteRef} autoPlay playsInline className="remote-video" />
        )}
        {!remoteStream && (
          <div className="call-placeholder">
            <div className="call-avatar">{userId?.charAt(0)}</div>
            <p>{inCall ? "Connecting..." : calling ? "Ringing..." : "Start a call"}</p>
          </div>
        )}
        <video ref={localRef} autoPlay playsInline muted className="local-video" />
      </div>

      <div className="call-controls">
        {!inCall && !calling && (
          <button className="call-start-btn" onClick={startCall}>📞 Start Call</button>
        )}
        {(inCall || calling) && (
          <button className="call-end-btn" onClick={endCall}>🔴 End Call</button>
        )}
      </div>
    </div>
  );
}
