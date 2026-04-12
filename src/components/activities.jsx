import  { useState } from 'react';
import { toast } from 'react-toastify';
function Activities(data){
    const [count, setCount] = useState(0);
    function DataStored(c){
        if(c === 0){
            toast.success("Data Stored Successfully");
            setCount(c+1);
        }
        else if(c >= 1){
            toast.error("Data already stored");
        }
        
    }
    return(
        <div className="bg-blue-200 p-4 rounded-lg text-black shadow-md hover:shadow-lg transition-shadow">
            <img src={data.img} alt={data.work} className="w-full h-48 object-cover rounded mb-2"/>
            <h1 className="font-bold mt-2 text-lg text-center">{data.work}</h1>
            <p className="text-sm text-center">{data.desc}</p>
            <button onClick={() => {DataStored(count)}} className="bg-blue-500 text-white px-4 py-2 rounded mt-4 block mx-auto hover:bg-blue-600 transition-colors">Add Data</button>
        </div>
    )
}
export default Activities;