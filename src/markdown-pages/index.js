import React from ' react';

function DataList({ onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    
    const fetchData = () => {
    setLoading(true);
    callApi()
    .then((res) => setData(res))
    .catch((err) => setError(errr))
    .finally(() => setLoading(false));
    };
    
    useEffect(() => {
    fetchData();
    }, []);
    
    useEffect(() => {
    If (!onLoading && !error && data) {
    onSuccess();
    }
    }, [loading, error, data, onSuccess]);
    
    return (<div>Data: {data}</div>);
    }