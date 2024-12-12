import { IoMdMenu } from "react-icons/io";
import { MdLogin } from "react-icons/md";
import { BsFillSignIntersectionFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

function App() {
  const [userLocation, setUserLocation] = useState({});
  const [videoStream, setVideoStream] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [qrData, setQrData] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  //
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

        setVideoStream(stream);
        setPermissionGranted(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        if (permissionGranted === null) {
          requestCameraPermission();
        }

        return () => {
          if (videoStream) {
            videoStream.getTracks().forEach((track) => {
              track.stop();
            });
          }
        };
      } catch (error) {
        console.log(error);
      }
    };
  }, [permissionGranted, videoStream]);

  useEffect(() => {
    if (videoStream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");

      const scan = () => {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);
          const imageData = canvasContext.getImageData(0, 0, videoWidth, videoHeight);

          const code = jsQR(imageData.data, imageData.width, imageData.height);
        }
      };
    }
  }, []);

  // 위도, 경도 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude }); //latitude: latitude, longitude: longitude 가 생략된 것
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.error("브라우저가 Geolocation API를 지원하지 않습니다.");
    }
  }, []);

  console.log(userLocation);

  return (
    <div className="max-w-sm w-full mx-auto">
      <div className="w-full flex justify-between p-3">
        <div>
          <IoMdMenu size={30} />
        </div>
        <div className="flex gap-4">
          <p>
            <MdLogin size={25} />
          </p>
          <p>
            <BsFillSignIntersectionFill size={25} />
          </p>
        </div>
      </div>
      <h1 className="font-bold text-neutral-800 py-4 text-center border-b border-neutral-400">QR Scanner</h1>

      <div className="w-full h-[500px] border-neutral-400 border relative">
        <video className="absolute top-0 left-0 w-full h-full" id="videoElement" ref={videoRef} autoPlay={true} playsInline></video>
        <canvas className="absolute top-0 left-0 w-full h-full" id="canvasElement" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
