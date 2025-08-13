import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import "rsuite/dist/rsuite.css";
import DatePickerField from "./DatePickerField";
import PhotoUpload from "./PhotoUpload";
import VideoUploader from './VideoUpload';
import PriceLabel from './PriceLabel';

// country selector module
function CountrySelector() {
    const [value, setValue] = useState('')
    const options = useMemo(() => countryList().getData(), [])

    const changeHandler = value => {
      setValue(value)
    }

    return <Select placeholder={'Select Country...'} options={options} value={value} onChange={changeHandler} />
}

export default function FormFieldCard({dateVisible, countryVisible}) {
    const [localDate, setLocalDate] = useState("");

    return (
        <div className='mt-3 col-md-6' style={{padding:'0 20px'}}>
            
            <PhotoUpload />
            <VideoUploader />
            <div className="mt-2 w-80 pr-5">
                {countryVisible && CountrySelector()}
            </div>
            <div className="mt-4 w-50 pr-5">
                {dateVisible && (
                    <DatePickerField
                        mode="single"
                        value={localDate}
                        onChange={(iso) => setLocalDate(iso)}
                        placeholder="dd-mm-yyyy"
                        style={{ width: 220 }}
                    />
                )}
            </div>
            <PriceLabel />
        </div>
    )
}