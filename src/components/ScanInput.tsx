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
    const [info, setInfo] = useState<string>('');
    const [info2, setInfo2] = useState<string>('');

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
                setInterval(async () => {
                    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                    let canvasElementImageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);

                    try {
                        setScanResult(await readBarcodesFromImageData(canvasElementImageData, readerOptions));
                        // setInfo('Нормас, работает');
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

    function stopScan() {
        // setInfo2(String(navigator.mediaDevices.getUserMedia()));
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }

    return (
        <div className='scan-input'>
            <button onClick={startScan} className='qr-btn qr-btn--scan' type='button'><span>Сканировать</span></button>
            <button onClick={stopScan} className='qr-btn qr-btn--scan' type='button'><span>Стоп</span></button>

            {error && <div className="result result--error">{error}</div>}
            {info && <div className="result result--info">{info}</div>}
            {info2 && <div className="result result--info">{info2}</div>}

            <div className="video-wrapper">
                <span className='top-left'></span>
                <span className='top-right'></span>
                <span className='bottom-left'></span>
                <span className='bottom-right'></span>

                <video ref={videoRef}></video>
                <canvas ref={canvasRef}></canvas>
            </div>

            {scanResult && (scanResult?.length === 0 ?
                <Result status={'error'} /> :
                <Result status={'success'} innerText={scanResult[0]?.text} />
            )}
        </div>
    );
}
