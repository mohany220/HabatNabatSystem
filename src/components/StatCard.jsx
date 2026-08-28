function StatCard({ title, value, color }) {
    return (
        <div
            style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,.1)",
                borderTop: `5px solid ${color}`,
            }}
        >
            <h3>{title}</h3>

            <h1
                style={{
                    color: color,
                    marginTop: "10px",
                }}
            >
                {value}
            </h1>
        </div>
    );
}

export default StatCard;