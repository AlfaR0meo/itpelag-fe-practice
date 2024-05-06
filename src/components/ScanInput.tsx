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
    const picturesRef = useRef<HTMLDivElement>(null);
    const [scanResult, setScanResult] = useState<ReadResult[]>();
    const [error, setError] = useState<string>('');
    const [test, setTest] = useState<number>(0);
    const [info, setInfo] = useState<number>(0);

    function detectQRCodeFromVideo() {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const picturesElement = picturesRef.current;

        if (canvasElement && videoElement && picturesElement) {
            canvasElement.width = videoElement.offsetWidth;
            canvasElement.height = videoElement.offsetHeight;

            const ctx = canvasElement.getContext('2d', {
                willReadFrequently: true
            });

            if (ctx) {
                setInterval(async () => {
                    ctx.drawImage(videoElement, 0, 0);
                    let imgData = canvasElement.toDataURL('image/png');
                    let imgElement = document.createElement('img');
                    imgElement.src = imgData;
                    imgElement.alt = 'Scan picture';
                    picturesElement.insertAdjacentElement('beforeend', imgElement);

                    setInfo(Math.round(Math.random() * 100));
                }, 1000);
            }

            // setTest(t => t + 1);
            // ctx.drawImage(videoElement, 0, 0);
            // setScanResult(await readBarcodesFromImageData(canvasCtx.getImageData(0, 0, w, h), readerOptions));
        }
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
                <canvas ref={canvasRef}></canvas>
            </div>

            {error && <div className="result result--error">{error}</div>}
            <div className="result result--info">{info}</div>
            {/* <div>Тест инкремент переменной: {test}</div> */}
            <div ref={picturesRef} className="pictures"></div>

            {scanResult && (scanResult?.length === 0 ?
                <Result status={'error'} /> :
                <Result status={'success'} innerText={scanResult[0]?.text} />
            )}
        </div>
    );
}
