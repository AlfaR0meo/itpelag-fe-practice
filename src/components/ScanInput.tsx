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
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scanResult, setScanResult] = useState<ReadResult[]>();
    const [error, setError] = useState<string>('');
    const [test, setTest] = useState<number>(0);

    function detectQRCodeFromVideo() {
        setInterval(async () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            setTest(t => t + 1); //работает

            if (canvas && video) {
                const w = video.videoWidth;
                const h = video.videoHeight;

                canvas.width = w;
                canvas.height = h;

                const canvasCtx = canvas.getContext('2d', {
                    willReadFrequently: true
                });

                while (canvasCtx && video) {
                    canvasCtx.drawImage(video, 0, 0, w, h);
                    setScanResult(await readBarcodesFromImageData(canvasCtx.getImageData(0, 0, w, h), readerOptions));
                }
            }
        }, 1000);
    }

    async function startScan() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError('Ваш браузер не поддерживает доступ к камере');
                console.error('Ваш браузер не поддерживает доступ к камере');
                return;
            }

            const videoStream = await navigator.mediaDevices.getUserMedia({
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
            });

            if (videoRef.current !== null) {
                videoRef.current.srcObject = videoStream;
                videoRef.current.play();
            } else return;

            detectQRCodeFromVideo();
        }
        catch (error: any) {
            setError(String(error));
        }
    }

    return (
        <div className='scan-input'>
            <button onClick={startScan} className='qr-btn qr-btn--scan' type='button'><span>Сканировать</span></button>

            <div className="video-wrapper">
                <span className='top-left'></span>
                <span className='top-right'></span>
                <span className='bottom-left'></span>
                <span className='bottom-right'></span>

                <video ref={videoRef}></video>
                <canvas hidden></canvas>
            </div>

            {error && <div className="result result--error">{error}</div>}

            {test && <div>{test}</div>}

            {scanResult && (scanResult?.length === 0 ?
                <Result status={'error'} /> :
                <Result status={'success'} innerText={scanResult[0]?.text} />
            )}
        </div>
    );
}
