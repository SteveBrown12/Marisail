import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import "rsuite/dist/rsuite.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhotoUpload from "./PhotoUpload";
import VideoUploader from './VideoUpload';
import PriceLabel from './PriceLabel';

// date picker module
function DatePickerModule() {
    
    const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
  );
}

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

    return (
        <div className='mt-3 col-md-6' style={{padding:'0 20px'}}>
            
            <PhotoUpload />
            <VideoUploader />
            <div className="mt-2 w-80 pr-5">
                {countryVisible && CountrySelector()}
            </div>
            <div className="mt-4 w-50 pr-5">
                {dateVisible && DatePickerModule()}
            </div>
            <PriceLabel />
        </div>
    )
}