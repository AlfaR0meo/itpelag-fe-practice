import { useState, useRef } from 'react';
import Result from './Result';

import {
    ReadResult,
    readBarcodesFromImageData,
    type ReaderOptions,
} from "zxing-wasm/reader";

const readerOptions: ReaderOptions = {
    tryHarder: true,
    formats: ["QRCode"],
    maxNumberOfSymbols: 1,
};

export default function ScanInput() {
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scanResult, setScanResult] = useState<ReadResult[]>();
    const [error, setError] = useState<string>('');

    function detectQRCodeFromVideo(stream: MediaStream) {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;

        if (canvasElement && videoElement) {
            canvasElement.width = videoElement.offsetWidth;
            canvasElement.height = videoElement.offsetHeight;

            const ctx = canvasElement.getContext('2d', {
                willReadFrequently: true
            });

            if (ctx) {
                const scanIntervalId = setInterval(async () => {
                    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                    let canvasElementImageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);

                    try {
                        let result = await readBarcodesFromImageData(canvasElementImageData, readerOptions);

                        if (result && result?.length !== 0) {
                            setScanResult(result); // 1

                            clearInterval(scanIntervalId); //2

                            stream.getTracks().forEach((track) => {
                                track.stop(); //3
                            });

                            videoElement.srcObject = null; //4

                            if (videoWrapperRef.current) {
                                videoWrapperRef.current.classList.add('hidden'); //5
                            }
                        }
                    } catch (error: any) {
                        setError(String(error));
                    }
                }, 1000);
            }
        }
    }

    async function startScan() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError('Ваш браузер не поддерживает доступ к камере');
                return;
            }

            if (videoWrapperRef.current) {
                videoWrapperRef.current.classList.remove('hidden');
            }

            const userMediaConstraints = {
                video: {
                    frameRate: 30,
                    facingMode: 'environment',
                    width: {
                        min: 320,
                        max: 1280,
                        ideal: 1280
                    },
                    height: {
                        min: 320,
                        max: 1280,
                        ideal: 1280
                    }
                },
                audio: false
            }

            const videoStream = await navigator.mediaDevices.getUserMedia(userMediaConstraints);

            if (videoRef.current && videoStream) {
                videoRef.current.srcObject = videoStream;
                videoRef.current.play();
                detectQRCodeFromVideo(videoStream);
            } else return;

        } catch (error: any) {
            setError(String(error));
        }
    }

    return (
        <div className='scan-input'>
            <button onClick={startScan} className='qr-btn qr-btn--scan' type='button'><span>Сканировать</span></button>

            {error && <div className="result result--error">{error}</div>}

            <div className="video-wrapper hidden" ref={videoWrapperRef}>
                <span className='top-left'></span>
                <span className='top-right'></span>
                <span className='bottom-left'></span>
                <span className='bottom-right'></span>

                <video ref={videoRef}></video>
                <canvas ref={canvasRef}></canvas>
            </div>

            {scanResult && <Result status={'success'} innerText={scanResult[0]?.text} />}
        </div>
    );
}
