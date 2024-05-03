interface ResultProps {
    status: boolean,
    innerText?: string
}

export default function Result({ status, innerText }: ResultProps) {

    const urlify = (text: string): string => {
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

        return text.replace(urlRegex, (url) => {
            return `<a href='${url}' target='_blank' rel='noopener noreferrer'>${url}</a>`;
        });
    }

    if (!status) {
        return (
            <div className='result result--error'>Не удалось считать информацию c изображения. Возможно, это не QR-код.</div>
        );
    } else {
        return (
            <div className='result result--success'>Результат: <span dangerouslySetInnerHTML={{ __html: urlify(innerText) ?? '' }}></span></div>
        );
    }
}