export default function TileCard({ item }) {
    return (
        <div className="card w-40 bg-base-100 shadow-md m-2">
            <div className="card-body">
                <h2 className="card-title">{item.name}</h2>
                <p>Quantity: {item.quantity}</p>
            </div>
        </div>
    )
}
