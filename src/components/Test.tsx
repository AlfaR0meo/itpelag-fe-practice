import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library';

export default function QRCodeScanner() {
    const videoRef = useRef(null);
    const [qrCodeResult, setQrCodeResult] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const codeReader = new BrowserQRCodeReader();

        const startScan = async () => {
            try {
                // Проверка поддержки getUserMedia
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    setError('Ваш браузер не поддерживает доступ к камере');
                    return;
                }

                // Получение доступа к камере и начало сканирования
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                videoRef.current.srcObject = videoStream;
                videoRef.current.play();

                codeReader.decodeFromVideoElement(videoRef.current, (result, error, controls) => {
                    if (result) {
                        // Процесс обработки результата сканирования
                        console.log(result);
                        setQrCodeResult(result.getText());
                        controls.stop();
                    }
                    if (error) {
                        console.error(error);
                        setError('Ошибка при сканировании QR-кода');
                    }
                });
            } catch (err) {
                console.error(err);
                setError('Ошибка при доступе к камере');
            }
        };

        startScan();

        // Очистка при размонтировании компонента
        return () => {
            codeReader.reset();
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} style={{ width: '100%' }}></video>
            {qrCodeResult && <p>Результат сканирования: {qrCodeResult}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};