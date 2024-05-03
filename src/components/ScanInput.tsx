export default function ScanInput() {
    function handleClick() {
        console.log(1);
    }

    return (
        <button onClick={handleClick} className='qr-btn qr-btn--scan' type='button'><span>Сканировать</span></button>
    );
}
