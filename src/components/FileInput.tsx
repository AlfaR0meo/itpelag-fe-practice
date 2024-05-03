import { useState } from 'react';
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

export default function FileInput() {
    const [file, setFile] = useState<string>();
    const [fileName, setFileName] = useState<string>();
    const [result, setResult] = useState<ReadResult[]>();

    async function handleChange(event: any) {
        if (event.target.files[0]) {
            const imageFile = event.target.files[0];
            setFile(URL.createObjectURL(imageFile));
            setFileName(imageFile.name)

            setResult(await readBarcodesFromImageFile(imageFile, readerOptions));
        }
    }

    return (
        <>
            <label className='qr-btn qr-btn--file' htmlFor="fileInput"><span>Выбрать файл</span></label>
            <input className='visually-hidden' id='fileInput' type='file' accept='image/jpeg,image/png' onChange={handleChange}></input>

            {fileName && <div className='selected-file-name'>Выбранный файл: <span>{fileName}</span></div>}
            {file && <img className='uploaded-image' src={file} alt="Uploaded File" />}
            {result && (result?.length === 0 ?
                <Result status={'error'} /> :
                <Result status={'success'} innerText={result[0]?.text} />
            )}
        </>
    );
}