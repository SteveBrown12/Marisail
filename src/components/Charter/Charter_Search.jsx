import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import Loader from "../Loader";
import ResetBar from "../ResetBar";
import { varToDb, varToScreen } from "./Charter_Search_Info";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import RangeInput from "../RangeInput";
import CharterCard from "../CharterCard";

export default function CharterSearch() {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState([]);
  const [selectedRadios, setSelectedRadios] = useState({});
  const [fetching, setFetching] = useState(true);

  const [guestAccommodation, setGuestAccommodation] = useState({
    guestCapacity: [],
    bedroomConfiguration: [],
    crewAccommodations: [],
    accessibilityInformation: [],
    cleaningAndMaintenanceProcedures: [],
    vesselDecorAndSetupRequests: [],
  });

  const [locationDetails, setLocationDetails] = useState({
    summerCruisingAreas: [],
    boardingPort: [],
    winterCruisingAreas: [],
    disembarkationPort: [],
  });

  const [guestRequirements, setGuestRequirements] = useState({
    skipperIncluded: [],
    crewIncluded: [],
    crewUniformPreferences: [],
    localCuisinePreferences: [],
    cateringRequired: [],
    carParkingAvailable: [],
    specialRequirementsRequests: [],
  });

  const [charterAgreementTermsConditions, setCharterAgreementTermsConditions] =
    useState({
      smokingPolicy: [],
      petFriendlyPolicy: [],
      localRegulationsRestrictions: [],
      charterAgreementTermsConditions: [],
      environmentalPolicies: [],
      waterConservationMeasures: [],
      wasteManagementProtocols: [],
      alcoholPolicy: [],
      photographyVideographyPolicies: [],
    });

  const [guestSafety, setguestSafety] = useState({
    weatherContingencyPlans: [],
    emergencyProcedures: [],
    medicalFacilitiesOnboard: [],
    weatherForecastServices: [],
    securityMeasures: [],
    guestOrientationSafetyBriefing: [],
    insuranceForGuestsPersonalBelongings: [],
    insuranceCoverageDetails: [],
  });

  const [costs, setCosts] = useState({
    summerRatePerNight: [],
    winterRatePerNight: [],
    winterRatePerWeek: [],
    summerRatePerWeek: [],
    securityDepositAmount: [],
    totalPrice: [],
    refundableDeposit: [],
    fuelIncluded: [],
    lateCheckInCheckOutFees: [],
    vat: [],
  });

  const [availableDates, setAvailableDates] = useState({
    minimumNightsPolicy: [],
    datesAvailable: [],
  });

  const [dates, setDates] = useState({
    startDate: [],
    endDate: [],
  });

  const [notDefined, setNotDefined] = useState({
    priceLabel: [],
    priceDrop: [],
  });

  const filters = {
    // identification,
    guestAccommodation,
    locationDetails,
    guestRequirements,
    charterAgreementTermsConditions,
    guestSafety,
    costs,
    availableDates,
    dates,
    notDefined,
  };

  const setStateFunctions = {
    // identification: setIdentification,
    guestAccommodation: setGuestAccommodation,
    locationDetails: setLocationDetails,
    guestRequirements: setGuestRequirements,
    charterAgreementTermsConditions: setCharterAgreementTermsConditions,
    guestSafety: setguestSafety,
    costs: setCosts,
    availableDates: setAvailableDates,
    dates: setDates,
    notDefined: setNotDefined,
  };

  const handleRadioChange = (key2, value) => {
    setSelectedRadios((prev) => ({ ...prev, [key2]: value }));
  };
  const removeTag = (tag) => {
    setAllSelectedOptions((prev) => {
      const newOptions = { ...prev };
      delete newOptions[tag];
      return newOptions;
    });
  };

  const resetTags = () => {
    setAllSelectedOptions({});
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const URL = apiUrl + "/search_charter/";

  const fetchDropdownData = async (tableKey, columnKey, search, offSet) => {
    if (varToScreen[columnKey]?.type === "range" || tableKey === "notDefined")
      return;
    try {
      if (!varToScreen[columnKey]) {
        console.error(`Missing varToScreen mapping for ${columnKey}`);
        return;
      }
      console.log("/berths Put");
      setFetching(true);
      const response = await fetch(`${apiUrl + "/search_berth/"}charters`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteDetailsTable: tableKey,
          siteDetailsColumn: columnKey,
          searchString: search,
          offSet: offSet,
          appliedFilters: allSelectedOptions,
        }),
      });
      setFetching(false);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.ok || !data?.siteDetails?.data) {
        console.error("Invalid response format:", data);
        return;
      }

      var cleanData = data.siteDetails.data
        .filter(Boolean)
        .map((value) => value);
      const setStateFunction = setStateFunctions[tableKey];
      if (setStateFunction) {
        setStateFunction((prev) => ({
          ...prev,
          [columnKey]:
            offSet !== 0 ? [...prev[columnKey], ...cleanData] : cleanData,
        }));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchTrailerData = async () => {
      try {
        const response = await fetch(`${URL}charterData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });

        const data = await response.json();
        // console.log(data);
        setTrailers(data.res[0]);
        // console.log("trailers", trailers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);

        console.log("done");
      }
    };

    fetchTrailerData();
  }, [allSelectedOptions, page, URL]);

  return (
    <Container>
      <Row>
        <ResetBar
          selectedTags={allSelectedOptions}
          removeTag={removeTag}
          resetTags={resetTags}
        />
      </Row>
      <Row>
        <Col md={3}>
          <Row>
            <h4 className="py-3">Search For Charter</h4>
          </Row>
          <Row>
            {Object.keys(filters).map((key) => {
              return (
                <fieldset key={key} className="mb-4">
                  <legend className="fieldset-legend">
                    <h6
                      style={{
                        padding: "15px 0px",

                        width: "100%",
                        display: "flex", // Use flex display
                        flexDirection: "row", // Arrange elements in a row
                        justifyContent: "space-between", // Space elements evenly
                        alignItems: "center", // Align vertically
                      }}
                    >
                      <span>{varToScreen[key]?.displayText}</span>
                    </h6>
                  </legend>
                  {Object.keys(filters[key]).map((key2) => {
                    const uniqueKey = `${key}-${key2}`; // Unique key for each filter
                    return (
                      <Row key={uniqueKey} className="row-margin">
                        <Col md={12}>
                          <Form.Group>
                            {varToScreen[key2]?.type !== "range" ? (
                              <DropdownWithCheckBoxes
                                onOpen={(search, offSet) =>
                                  fetchDropdownData(
                                    key,
                                    key2,
                                    search,
                                    offSet,
                                    allSelectedOptions
                                  )
                                }
                                varToDb={varToDb}
                                heading={key2}
                                title={varToScreen[key2]?.displayText}
                                options={filters[key][key2] || []}
                                selectedOptions={allSelectedOptions}
                                setSelectedOptions={setAllSelectedOptions}
                                fetching={fetching}
                              />
                            ) : (
                              <RangeInput
                                key2={key2.replace(/\s+/g, " ").trim()}
                                title={varToScreen[key2]?.displayText}
                                fromValue={fromValue}
                                toValue={toValue}
                                setFromValue={setFromValue}
                                radioOptions={varToScreen[key2]?.radioOptions}
                                setToValue={setToValue}
                                selectedRadio={
                                  selectedRadios[key2] ||
                                  varToScreen[key2]?.radioOptions[0]?.value
                                }
                                onRadioChange={(value) =>
                                  handleRadioChange(key2, value)
                                }
                                isOpen={!!openStates[key2]}
                                toggleAccordion={() => toggleAccordion(key2)}
                              />
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    );
                  })}
                </fieldset>
              );
            })}
          </Row>
        </Col>
        <Col md={9}>
          <Row>
            <Col md={12}>
              <h1
                style={{
                  fontSize: "28.8px",
                  fontWeight: "200",
                  padding: "20px",
                }}
              >
                Charters For Sale
              </h1>
            </Col>
          </Row>
          {loading ? (
            // <p>Loading...</p>
            <Loader />
          ) : (
            <Row>
              {trailers.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                trailers.map((trailer) => {
                  return (
                    <Col key={trailer} md={4}>
                      {/* <h1>{trailer.m}</h1> */}
                      <CharterCard {...trailer} />
                    </Col>
                  );
                })
              )}
            </Row>
          )}
          {/* {!loading ? <Pagination totalPages={pagination.totalPages} /> : <></>} */}

          <Row style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
              >
                Previous
              </button>
              {/* Page {page} of {pagination.totalPages} */}
              <span>Page {page + 1}</span>
              {/* <button
                key={page}
                className="active"
                // onClick={() => updatePage(page)}
              >
                {page}
              </button> */}
              <button
                onClick={() => handlePageChange(page + 1)}
                // disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
