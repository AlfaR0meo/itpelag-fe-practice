import { useState, useEffect, useRef } from 'react';

export default function ScanInput() {
    const videoRef = useRef(null);
    // const [qrCodeResult, setQrCodeResult] = useState('');
    const [error, setError] = useState('');

    async function startScan() {
        try {
            // Проверка поддержки getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError('Ваш браузер не поддерживает доступ к камере');
                console.error('Ваш браузер не поддерживает доступ к камере');
                return;
            }

            const videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoRef.current.srcObject = videoStream;
            videoRef.current.play();

        } catch (err) {
            console.error(err);
            setError('Ошибка при доступе к камере');
        }
    }

    return (
        <div>
            <button onClick={startScan} className='qr-btn qr-btn--scan' type='button'><span>Сканировать</span></button>
            <video ref={videoRef}></video>
            {/* {qrCodeResult && <p>Результат сканирования: {qrCodeResult}</p>} */}
            {error && <p className="error">{error}</p>}
        </div>
    );
}
