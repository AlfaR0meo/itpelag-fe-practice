import FileInput from './FileInput';
import ScanInput from './ScanInput';
import './../assets/scss/index.scss';
import './App.scss';

export default function App() {
    return (
        <div className="page-wrapper">
            <h1>
                ITpelag FE задание на практику.<br></br>
                Веб-приложение для считывания информации с QR-кода
            </h1>
            <ScanInput />
            <FileInput />
        </div>
    );
}
