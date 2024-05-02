import FileInput from './FileInput';
import './../assets/scss/index.scss';
import './App.scss';

export default function App() {
    return (
        <div className="page-wrapper">
            <h1>
                ITpelag FE задание на практику.<br></br>
                Веб-приложение для сканирования QR-кодов
            </h1>
            <FileInput />
        </div>
    );
}
