import './style.css'
let localStream // me
let removeStream // the connected user
let peerConnection

// stun servers
const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
}

const createWebRTCOffer = async () => {
  peerConnection = new RTCPeerConnection(servers)
  
  removeStream = new MediaStream()
  document.getElementById('user-two').srcObject = removeStream;
  
  // add every one to peerConnection
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream)
  })

  peerConnection.ontrack = (e) => {
    e.streams[0].getTracks().forEach(track => {
      removeStream.addTrack(track)
    })
  }

  peerConnection.onicecandidate = async (e) => {
    if(e.candidate) {
      console.log('new ice candidate', e.candidate);
    }
  }


  let offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
}

const init = async () => {
  // get permission for camera, video and audio
  localStream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
    },
    audio: true,
  })

  document.getElementById('user-one').srcObject = localStream;
  createWebRTCOffer()
}

init()