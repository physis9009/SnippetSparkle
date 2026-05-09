import Card from './card';

export default function CardFlow() {
    return (
        <div  className="flex flex-wrap gap-2">
            {Array.from({ length: 20 }, (_, i) => i).map((n) => (
                <Card key={n} num={n} />
            ))}
        </div>
    )
}