import Card from './card';

export default function CardFlow() {
    return (
        <div>
            {Array.from({ length: 20 }, (_, i) => i).map((n) => (
                <Card key={n} num={n} />
            ))}
        </div>
    )
}