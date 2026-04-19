import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getModuleData } from '../../utils/storageUtils';

function Activities({ work, desc, img }) {
    const navigate = useNavigate();
    const [isDataStored] = useState(!!getModuleData(work));

    const handleAddData = () => {
        navigate('/' + work);
    };

    return(
        <div 
            onClick={handleAddData}
            className="group flex flex-col  bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 cursor-pointer"
        >
            <div className="relative overflow-hidden rounded-lg bg-gray-50 aspect-[4/3] mb-4">
                <img
                    src={img}
                    alt={work}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{work}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{desc}</p>
                
                <div className="mt-auto w-full">
                    <button
                        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            isDataStored
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {isDataStored ? 'Update Data' : 'Add Data'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Activities;