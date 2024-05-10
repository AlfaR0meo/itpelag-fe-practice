type Status = 'success' | 'error';

interface ResultProps {
    status: Status,
    innerText?: string
}

export default function Result({ status, innerText = '' }: ResultProps) {

    const urlifyAndJsonify = (text: string): string => {
        try {
            text = JSON.stringify(JSON.parse(text), null, 4);
            console.log(4);
        } catch { }

        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

        return text.replace(urlRegex, (url) => {
            return `<a href='${url}' target='_blank' rel='noopener noreferrer'>${url}</a>`;
        });
    }

    if (status === 'success') {
        return (
            <div className='result result--success'><pre><span dangerouslySetInnerHTML={{ __html: urlifyAndJsonify(innerText) }}></span></pre></div>
        );
    }
    if (status === 'error') {
        return (
            <div className='result result--error'>Не удалось считать информацию c изображения. Возможно, это не QR-код.</div>
        );
    }
}