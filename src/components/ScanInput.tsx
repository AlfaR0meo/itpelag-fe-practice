import { useState, useRef } from 'react';
import Result from './Result';

import {
    ReadResult,
    readBarcodesFromImageFile,
    type ReaderOptions,
} from "zxing-wasm/reader";

const readerOptions: ReaderOptions = {
    tryHarder: true,
    formats: ["QRCode"],
    maxNumberOfSymbols: 1,
};

export default function ScanInput() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanResult, setScanResult] = useState<ReadResult[]>();
    // const [qrCodeResult, setQrCodeResult] = useState('');
    const [error, setError] = useState<string>('');

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
            videoRef.current.srcObject = videoStream;
            videoRef.current.play();
        }
        catch (error: any) {
            setError(String(error));
        }
    }

    return (
        <div>
            <button onClick={startScan} className='qr-btn qr-btn--scan' type='button'><span>Сканировать</span></button>

            <div className="video-wrapper">
                <video ref={videoRef}></video>
            </div>
            {/* {qrCodeResult && <p>Результат сканирования: {qrCodeResult}</p>} */}
            {error && <div className="result result--error">{error}</div>}

            {scanResult && (scanResult?.length === 0 ?
                <Result status={'error'} /> :
                <Result status={'success'} innerText={scanResult[0]?.text} />
            )}
        </div>
    );
}
