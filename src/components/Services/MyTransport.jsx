import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";

import { makeString, convertUnitsInFormData } from "../../services/common_functions";
import DatePickerComponent from "../DatePickerComponent";
import InputComponentDual from "../InputComponentDual";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MyTransport() {
    // Retrieve the user object from localStorage
    const storedUser = localStorage.getItem("user");
    const formData = localStorage.getItem("TransportData");
    // let user;
    let advertiseTransportData;
    // Parse the JSON string back into an object
    if (storedUser && formData) {
        advertiseTransportData = JSON.parse(formData);
    }
    const navigate = useNavigate(); 
    const [error, setError] = useState({});
    const hasFetched = useRef(false);
    const [transport, setTransport] = useState("");
    const [openKey, setOpenKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allSelectedOptions, setAllSelectedOptions] = useState({});
    console.log("001 testing data--",advertiseTransportData?.jobDescription?.marisailTransportId?.value);
    
    
   
  
   
    

   

    

    const sections = {
       
    };

    const setStateFunctions = {
       
    };
    const handleDualInputChange = (title, fieldKey, inputValue, radioValue) => {
        setAllSelectedOptions((prevState) => ({
            ...prevState,
            [title]: {
                ...prevState[title],
                [fieldKey]: { value: inputValue, unit: radioValue },
            },
        }));
    };    
    const handleOptionSelect = (category, field, selectedOption) => {
        setAllSelectedOptions((prevState) => {
            const updatedOptions = {
                ...prevState,
                [category]: {
                    ...prevState[category],
                    [field]: { value: selectedOption, unit: null },
                },
            };
            return updatedOptions;
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            convertUnitsInFormData(allSelectedOptions);
            // if (checkRequired()) {
            // If no errors, proceed with form submission logic
            console.log("001 Form is valid, submitting...", allSelectedOptions);
            localStorage.setItem("TransportData", JSON.stringify(allSelectedOptions));
            navigate("/view-transport");
            // console.log("001 Form data saved to localStorage:", allFormData);
            // } else {
            //     console.warn(error);
            // }
        } catch (error) {
            console.error(error);
        }
    };

    const setPageData = useCallback((key, newData) => {
        const setStateFunction = setStateFunctions[key];
        if (setStateFunction) {
            setStateFunction((prevState) => ({
                ...prevState,
                ...newData,
            }));
        } else {
            console.error(`No setState function found for key: ` + JSON.stringify(key));
        }
    }, [setStateFunctions]);

    const cacheKey = "transportFilterData";
    const URL = apiUrl +"/advert_transport/";

    const fetchDistinctData = useCallback(async () => {
        try {
            setLoading(true);
            const promises = Object.keys(sections).map(async (key) => {
                const response = await fetch(`${URL}transport`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sections[key]),
                });
                const data = await response.json();
                return { key, data: data.res };
            });
            const results = await Promise.all(promises);
            results.forEach(({ key, data }) => {
                setPageData(key, data);
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            console.log("done");
        }
    }, [sections, URL, setPageData]);

    useEffect(() => {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            setPageData(JSON.parse(cachedData));
        } else {
            if (!hasFetched.current) {
                fetchDistinctData();
                hasFetched.current = true;
            }
        }
    }, [setPageData, fetchDistinctData]);

    const handleInputChange = (title, fieldKey, newValue) => {
        setTransport((oldValue) => ({
            ...oldValue,
            [title]: {
                ...oldValue[title],
                [fieldKey]: newValue,
            },
        }));
    };

    const errorDisplay = (fieldName) => {
        return (
            <div style={{ color: "red", paddingLeft: 10 }}>
                {fieldName} field is required
            </div>
        );
    };

    return (
        <Container className="mb-5">
            {loading ? (
                <Loader />
            ) : (
                <Form onSubmit={handleSubmit}>
                   
                    <SubmitButton
                        text="Submit"
                        name="advert_transport_submit"
                        onClick={handleSubmit}
                    />
                </Form>
            )}
        </Container>
    );
}
