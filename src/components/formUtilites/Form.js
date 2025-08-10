import React, { useState } from "react";
import "./style/main.css";

function JobDescription({ props, setProps, errors = {} }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  const errorInputStyle = { borderColor: "#dc3545" };
  const errorTextStyle = { color: "#dc3545", fontSize: 12, marginTop: 4 };

  return (
    <div>
      <h2>Job Description</h2>
      <form className="form">
        <div className="set">
          <label>Transport Item ID:</label>
          <input
            type="text"
            name="transportItemID"
            onChange={handleChange("transportItemID")}
            value={props.transportItemID}
          />
        </div>

        <div className="set">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            onChange={handleChange("category")}
            value={props.category}
            aria-invalid={!!errors.category}
            style={errors.category ? errorInputStyle : undefined}
          />
          {errors.category && <div style={errorTextStyle}>{errors.category}</div>}
        </div>

        <div className="set">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            onChange={handleChange("title")}
            value={props.title}
            aria-invalid={!!errors.title}
            style={errors.title ? errorInputStyle : undefined}
          />
          {errors.title && <div style={errorTextStyle}>{errors.title}</div>}
        </div>

        <div className="set">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            onChange={handleChange("description")}
            value={props.description}
            aria-invalid={!!errors.description}
            style={errors.description ? errorInputStyle : undefined}
          />
          {errors.description && (
            <div style={errorTextStyle}>{errors.description}</div>
          )}
        </div>

        <div className="set">
          <label>Posted Date:</label>
          <input
            type="text"
            name="postedDate"
            onChange={handleChange("postedDate")}
            value={props.postedDate}
          />
        </div>

        <div className="set">
          <label>Deadline Date:</label>
          <input
            type="text"
            name="deadlineDate"
            onChange={handleChange("deadlineDate")}
            value={props.deadlineDate}
          />
        </div>

        <div className="set">
          <label>Time Scale:</label>
          <input
            type="text"
            name="timeScale"
            onChange={handleChange("timeScale")}
            value={props.timeScale}
          />
        </div>

        <div className="set">
          <label>Preferred Date:</label>
          <input
            type="text"
            name="preferredDate"
            onChange={handleChange("preferredDate")}
            value={props.preferredDate}
          />
        </div>

        <div className="set">
          <label>Haulier To Departure Distance:</label>
          <input
            type="text"
            name="haulierToDepartureDistance"
            onChange={handleChange("haulierToDepartureDistance")}
            value={props.haulierToDepartureDistance}
          />
        </div>

        <div className="set">
          <label>Departure To Destination Distance:</label>
          <input
            type="text"
            name="departureToDestinationDistance"
            onChange={handleChange("departureToDestinationDistance")}
            value={props.departureToDestinationDistance}
          />
        </div>

        <div className="set">
          <label>Return Journey:</label>
          <input
            type="text"
            name="returnJourney"
            onChange={handleChange("returnJourney")}
            value={props.returnJourney}
          />
        </div>

        <div className="set">
          <label>Round Trip Distance:</label>
          <input
            type="text"
            name="roundTripDistance"
            onChange={handleChange("roundTripDistance")}
            value={props.roundTripDistance}
          />
        </div>

        <div className="set">
          <label>International:</label>
          <input
            type="text"
            name="international"
            onChange={handleChange("international")}
            value={props.international}
          />
        </div>

        <div className="set">
          <label>Ferry Required:</label>
          <input
            type="text"
            name="ferryRequired"
            onChange={handleChange("ferryRequired")}
            value={props.ferryRequired}
          />
        </div>

        <div className="set">
          <label>Special Handling Requirements:</label>
          <input
            type="text"
            name="specialHandlingRequirements"
            onChange={handleChange("specialHandlingRequirements")}
            value={props.specialHandlingRequirements}
          />
        </div>

        <div className="set">
          <label>Departure Loading Equipment Needed:</label>
          <input
            type="text"
            name="departureLoadingEquipmentNeeded"
            onChange={handleChange("departureLoadingEquipmentNeeded")}
            value={props.departureLoadingEquipmentNeeded}
          />
        </div>

        <div className="set">
          <label>Destination Unloading Equipment Needed:</label>
          <input
            type="text"
            name="destinationUnloadingEquipmentNeeded"
            onChange={handleChange("destinationUnloadingEquipmentNeeded")}
            value={props.destinationUnloadingEquipmentNeeded}
          />
        </div>

        <div className="set">
          <label>Freight Class:</label>
          <input
            type="text"
            name="freightClass"
            onChange={handleChange("freightClass")}
            value={props.freightClass}
          />
        </div>

        <div className="set">
          <label>Overweight Permit Needed:</label>
          <input
            type="text"
            name="overweightPermitNeeded"
            onChange={handleChange("overweightPermitNeeded")}
            value={props.overweightPermitNeeded}
          />
        </div>

        <div className="set">
          <label>Oversize Permit Needed:</label>
          <input
            type="text"
            name="oversizePermitNeeded"
            onChange={handleChange("oversizePermitNeeded")}
            value={props.oversizePermitNeeded}
          />
        </div>

        <div className="set">
          <label>Number Quotes:</label>
          <input
            type="text"
            name="numberQuotes"
            onChange={handleChange("numberQuotes")}
            value={props.numberQuotes}
          />
        </div>

        <div className="set">
          <label>Map:</label>
          <input
            type="text"
            name="map"
            onChange={handleChange("map")}
            value={props.map}
          />
        </div>

        <div className="set">
          <label>Job Done:</label>
          <input
            type="text"
            name="jobDone"
            onChange={handleChange("jobDone")}
            value={props.jobDone}
          />
        </div>

        <div className="set">
          <label>Job Done Date:</label>
          <input
            type="text"
            name="jobDoneDate"
            onChange={handleChange("jobDoneDate")}
            value={props.jobDoneDate}
          />
        </div>
      </form>
    </div>
  );
}

function VesselDetails({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  return (
    <div>
      <h2>Vessel Details</h2>
      <form className="form">
        <div className="set">
          <label>Item Number:</label>
          <input type="text" name="itemNumber" onChange={handleChange("itemNumber")} value={props.itemNumber} />
        </div>

        <div className="set">
          <label>Total Number Of Items:</label>
          <input type="text" name="totalNumberOfItems" onChange={handleChange("totalNumberOfItems")} value={props.totalNumberOfItems} />
        </div>

        <div className="set">
          <label>Photos:</label>
          <input type="text" name="photos" onChange={handleChange("photos")} value={props.photos} />
        </div>

        <div className="set">
          <label>Previous Insurance Claims:</label>
          <input type="text" name="previousInsuranceClaims" onChange={handleChange("previousInsuranceClaims")} value={props.previousInsuranceClaims} />
        </div>

        <div className="set">
          <label>Existing Damage:</label>
          <input type="text" name="existingDamage" onChange={handleChange("existingDamage")} value={props.existingDamage} />
        </div>

        <div className="set">
          <label>Damage Description:</label>
          <input type="text" name="damageDescription" onChange={handleChange("damageDescription")} value={props.damageDescription} />
        </div>

        <div className="set">
          <label>Vessel Insurance Type:</label>
          <input type="text" name="vesselInsuranceType" onChange={handleChange("vesselInsuranceType")} value={props.vesselInsuranceType} />
        </div>

        <div className="set">
          <label>Vessel Insurance Notes:</label>
          <input type="text" name="vesselInsuranceNotes" onChange={handleChange("vesselInsuranceNotes")} value={props.vesselInsuranceNotes} />
        </div>

        <div className="set">
          <label>Boat Details:</label>
          <input type="text" name="boatDetails" onChange={handleChange("boatDetails")} value={props.boatDetails} />
        </div>
      </form>
    </div>
  );
}

function CustomerContactDetails({ props, setProps, errors = {} }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  const errorInputStyle = { borderColor: "#dc3545" };
  const errorTextStyle = { color: "#dc3545", fontSize: 12, marginTop: 4 };
  return (
    <div>
      <h2>Customer Contact Details</h2>
      <form className="form">
        <div className="set">
          <label>Customer Type:</label>
          <input type="text" name="customerType" onChange={handleChange("customerType")} value={props.customerType} />
        </div>

        <div className="set">
          <label>Customer ID:</label>
          <input type="text" name="customerID" onChange={handleChange("customerID")} value={props.customerID}
            aria-invalid={!!errors.customerID}
            style={errors.customerID ? errorInputStyle : undefined}
          />
          {errors.customerID && <div style={errorTextStyle}>{errors.customerID}</div>}
        </div>

        <div className="set">
          <label>Customer Name:</label>
          <input type="text" name="customerName" onChange={handleChange("customerName")} value={props.customerName}
            aria-invalid={!!errors.customerName}
            style={errors.customerName ? errorInputStyle : undefined}
          />
          {errors.customerName && <div style={errorTextStyle}>{errors.customerName}</div>}
        </div>

        <div className="set">
          <label>Customer Company Name:</label>
          <input type="text" name="customerCompanyName" onChange={handleChange("customerCompanyName")} value={props.customerCompanyName} />
        </div>

        <div className="set">
          <label>Collection Named Contact Departure:</label>
          <input type="text" name="collectionNamedContactDeparture" onChange={handleChange("collectionNamedContactDeparture")} value={props.collectionNamedContactDeparture} />
        </div>

        <div className="set">
          <label>Collection Mobile Departure:</label>
          <input type="text" name="collectionMobileDeparture" onChange={handleChange("collectionMobileDeparture")} value={props.collectionMobileDeparture} />
        </div>

        <div className="set">
          <label>Collection Address Departure:</label>
          <input type="text" name="collectionAddressDeparture" onChange={handleChange("collectionAddressDeparture")} value={props.collectionAddressDeparture}
            aria-invalid={!!errors.collectionAddressDeparture}
            style={errors.collectionAddressDeparture ? errorInputStyle : undefined}
          />
          {errors.collectionAddressDeparture && <div style={errorTextStyle}>{errors.collectionAddressDeparture}</div>}
        </div>

        <div className="set">
          <label>Delivery Named Contact Destination:</label>
          <input type="text" name="deliveryNamedContactDestination" onChange={handleChange("deliveryNamedContactDestination")} value={props.deliveryNamedContactDestination} />
        </div>

        <div className="set">
          <label>Delivery Mobile Destination:</label>
          <input type="text" name="deliveryMobileDestination" onChange={handleChange("deliveryMobileDestination")} value={props.deliveryMobileDestination} />
        </div>

        <div className="set">
          <label>Delivery Address Destination:</label>
          <input type="text" name="deliveryAddressDestination" onChange={handleChange("deliveryAddressDestination")} value={props.deliveryAddressDestination}
            aria-invalid={!!errors.deliveryAddressDestination}
            style={errors.deliveryAddressDestination ? errorInputStyle : undefined}
          />
          {errors.deliveryAddressDestination && <div style={errorTextStyle}>{errors.deliveryAddressDestination}</div>}
        </div>

        <div className="set">
          <label>Emergency Contact Information:</label>
          <input type="text" name="emergencyContactInformation" onChange={handleChange("emergencyContactInformation")} value={props.emergencyContactInformation} />
        </div>

        <div className="set">
          <label>Preferred Communication Method:</label>
          <input type="text" name="preferredCommunicationMethod" onChange={handleChange("preferredCommunicationMethod")} value={props.preferredCommunicationMethod} />
        </div>
      </form>
    </div>
  );
}

function TransportQuotes({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };

  return (
    <div>
      <h2>Transport Quotes</h2>
      <form className='form'>
        <div className="set">
          <label>Quote:</label>
          <input type="text" name="quote" onChange={handleChange("quote")} value={props.quote} />
        </div>

        <div className="set">
          <label>Quote Description:</label>
          <input type="text" name="quoteDescription" onChange={handleChange("quoteDescription")} value={props.quoteDescription} />
        </div>

        <div className="set">
          <label>Quote Date:</label>
          <input type="text" name="quoteDate" onChange={handleChange("quoteDate")} value={props.quoteDate} />
        </div>

        <div className="set">
          <label>Decline Date:</label>
          <input type="text" name="declineDate" onChange={handleChange("declineDate")} value={props.declineDate} />
        </div>

        <div className="set">
          <label>Withdraw Date:</label>
          <input type="text" name="withdrawDate" onChange={handleChange("withdrawDate")} value={props.withdrawDate} />
        </div>

        <div className="set">
          <label>Withdrawn:</label>
          <input type="text" name="withdrawn" onChange={handleChange("withdrawn")} value={props.withdrawn} />
        </div>

        <div className="set">
          <label>Decline Quote:</label>
          <input type="text" name="declineQuote" onChange={handleChange("declineQuote")} value={props.declineQuote} />
        </div>

        <div className="set">
          <label>Withdraw Quote:</label>
          <input type="text" name="withdrawQuote" onChange={handleChange("withdrawQuote")} value={props.withdrawQuote} />
        </div>
      </form>
    </div>
  );
}

function QueAns({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  return (
    <div>
      <h2>Question and Answers</h2>
      <form className="form">
        <div className="set">
          <label>Question Date:</label>
          <input type="text" name="questionDate" onChange={handleChange("questionDate")} value={props.questionDate} />
        </div>

        <div className="set">
          <label>Answer Date:</label>
          <input type="text" name="answerDate" onChange={handleChange("answerDate")} value={props.answerDate} />
        </div>

        <div className="set">
          <label>Transport Provider Questions:</label>
          <input type="text" name="transportProviderQuestions" onChange={handleChange("transportProviderQuestions")} value={props.transportProviderQuestions} />
        </div>

        <div className="set">
          <label>Customer Answers:</label>
          <input type="text" name="customerAnswers" onChange={handleChange("customerAnswers")} value={props.customerAnswers} />
        </div>

        <div className="set">
          <label>Write Question:</label>
          <input type="text" name="writeQuestion" onChange={handleChange("writeQuestion")} value={props.writeQuestion} />
        </div>

        <div className="set">
          <label>Answer Question:</label>
          <input type="text" name="answerQuestion" onChange={handleChange("answerQuestion")} value={props.answerQuestion} />
        </div>

        <div className="set">
          <label>Customer Confirms Completion:</label>
          <input type="text" name="customerConfirmsCompletion" onChange={handleChange("customerConfirmsCompletion")} value={props.customerConfirmsCompletion} />
        </div>

        <div className="set">
          <label>Add Item:</label>
          <input type="text" name="addItem" onChange={handleChange("addItem")} value={props.addItem} />
        </div>
      </form>
    </div>
  );
}

function PaymentInsurance({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  return (
    <div>
      <h2>Payment and Insurance</h2>
      <form className="form">
        <div className="set">
          <label>Payment Terms:</label>
          <input type="text" name="paymentTerms" onChange={handleChange("paymentTerms")} value={props.paymentTerms} />
        </div>

        <div className="set">
          <label>Service Legal Agreement:</label>
          <input type="text" name="serviceLegalAgreement" onChange={handleChange("serviceLegalAgreement")} value={props.serviceLegalAgreement} />
        </div>

        <div className="set">
          <label>Accepted Payment Methods:</label>
          <input type="text" name="acceptedPaymentMethods" onChange={handleChange("acceptedPaymentMethods")} value={props.acceptedPaymentMethods} />
        </div>

        <div className="set">
          <label>Cancellation Policy:</label>
          <input type="text" name="cancellationPolicy" onChange={handleChange("cancellationPolicy")} value={props.cancellationPolicy} />
        </div>

        <div className="set">
          <label>Currency:</label>
          <input type="text" name="currency" onChange={handleChange("currency")} value={props.currency} />
        </div>

        <div className="set">
          <label>Invoice Time:</label>
          <input type="text" name="invoiceTime" onChange={handleChange("invoiceTime")} value={props.invoiceTime} />
        </div>

        <div className="set">
          <label>Late Payment Fee:</label>
          <input type="text" name="latePaymentFee" onChange={handleChange("latePaymentFee")} value={props.latePaymentFee} />
        </div>

        <div className="set">
          <label>Billing Contact Information:</label>
          <input type="text" name="billingContactInformation" onChange={handleChange("billingContactInformation")} value={props.billingContactInformation} />
        </div>

        <div className="set">
          <label>Dispute Resolution Terms:</label>
          <input type="text" name="disputeResolutionTerms" onChange={handleChange("disputeResolutionTerms")} value={props.disputeResolutionTerms} />
        </div>

        <div className="set">
          <label>Liability Coverage:</label>
          <input type="text" name="liabilityCoverage" onChange={handleChange("liabilityCoverage")} value={props.liabilityCoverage} />
        </div>

        <div className="set">
          <label>Insurance Policy:</label>
          <input type="text" name="insurancePolicy" onChange={handleChange("insurancePolicy")} value={props.insurancePolicy} />
        </div>

        <div className="set">
          <label>Insurance Coverage:</label>
          <input type="text" name="insuranceCoverage" onChange={handleChange("insuranceCoverage")} value={props.insuranceCoverage} />
        </div>

        <div className="set">
          <label>Insurance Provider:</label>
          <input type="text" name="insuranceProvider" onChange={handleChange("insuranceProvider")} value={props.insuranceProvider} />
        </div>

        <div className="set">
          <label>Insurance Claim Process:</label>
          <input type="text" name="insuranceClaimProcess" onChange={handleChange("insuranceClaimProcess")} value={props.insuranceClaimProcess} />
        </div>
      </form>
    </div>
  );
}

function Feedback({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  return (
    <div>
      <h2>Feedback</h2>
      <form className="form">
        <div className="set">
          <label>Customer Feedback Notes:</label>
          <input type="text" name="customerFeedbackNotes" onChange={handleChange("customerFeedbackNotes")} value={props.customerFeedbackNotes} />
        </div>

        <div className="set">
          <label>Customer Feedback Score:</label>
          <input type="text" name="customerFeedbackScore" onChange={handleChange("customerFeedbackScore")} value={props.customerFeedbackScore} />
        </div>

        <div className="set">
          <label>Positive:</label>
          <input type="text" name="positive" onChange={handleChange("positive")} value={props.positive} />
        </div>

        <div className="set">
          <label>Neutral:</label>
          <input type="text" name="neutral" onChange={handleChange("neutral")} value={props.neutral} />
        </div>

        <div className="set">
          <label>Negative:</label>
          <input type="text" name="negative" onChange={handleChange("negative")} value={props.negative} />
        </div>

        <div className="set">
          <label>Reviews:</label>
          <input type="text" name="reviews" onChange={handleChange("reviews")} value={props.reviews} />
        </div>

        <div className="set">
          <label>Rating:</label>
          <input type="text" name="rating" onChange={handleChange("rating")} value={props.rating} />
        </div>

        <div className="set">
          <label>Item Title:</label>
          <input type="text" name="itemTitle" onChange={handleChange("itemTitle")} value={props.itemTitle} />
        </div>

        <div className="set">
          <label>Left By:</label>
          <input type="text" name="leftBy" onChange={handleChange("leftBy")} value={props.leftBy} />
        </div>

        <div className="set">
          <label>Comments:</label>
          <input type="text" name="comments" onChange={handleChange("comments")} value={props.comments} />
        </div>

        <div className="set">
          <label>Date:</label>
          <input type="text" name="date" onChange={handleChange("date")} value={props.date} />
        </div>

        <div className="set">
          <label>Customer Gives Feedback Notes:</label>
          <input type="text" name="customerGivesFeedbackNotes" onChange={handleChange("customerGivesFeedbackNotes")} value={props.customerGivesFeedbackNotes} />
        </div>

        <div className="set">
          <label>Customer Gives Feedback Score:</label>
          <input type="text" name="customerGivesFeedbackScore" onChange={handleChange("customerGivesFeedbackScore")} value={props.customerGivesFeedbackScore} />
        </div>

        <div className="set">
          <label>See My Quotes:</label>
          <input type="text" name="seeMyQuotes" onChange={handleChange("seeMyQuotes")} value={props.seeMyQuotes} />
        </div>
      </form>
    </div>
  );
}

function HaulierDetails({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  return (
    <div>
      <h2>Haulier Details</h2>
      <form className="form">
        <div className="set">
          <label>Haulier ID:</label>
          <input type="text" name="haulierID" onChange={handleChange("haulierID")} value={props.haulierID} />
        </div>

        <div className="set">
          <label>Haulier Address:</label>
          <input type="text" name="haulierAddress" onChange={handleChange("haulierAddress")} value={props.haulierAddress} />
        </div>

        <div className="set">
          <label>Haulier Name:</label>
          <input type="text" name="haulierName" onChange={handleChange("haulierName")} value={props.haulierName} />
        </div>

        <div className="set">
          <label>Haulier Number Jobs:</label>
          <input type="text" name="haulierNumberJobs" onChange={handleChange("haulierNumberJobs")} value={props.haulierNumberJobs} />
        </div>

        <div className="set">
          <label>Haulier Total Customer Score:</label>
          <input type="text" name="haulierTotalCustomerScore" onChange={handleChange("haulierTotalCustomerScore")} value={props.haulierTotalCustomerScore} />
        </div>

        <div className="set">
          <label>Registered Since:</label>
          <input type="text" name="registeredSince" onChange={handleChange("registeredSince")} value={props.registeredSince} />
        </div>

        <div className="set">
          <label>Number Vehicles:</label>
          <input type="text" name="numberVehicles" onChange={handleChange("numberVehicles")} value={props.numberVehicles} />
        </div>

        <div className="set">
          <label>Number Drivers:</label>
          <input type="text" name="numberDrivers" onChange={handleChange("numberDrivers")} value={props.numberDrivers} />
        </div>

        <div className="set">
          <label>Verified:</label>
          <input type="text" name="verified" onChange={handleChange("verified")} value={props.verified} />
        </div>

        <div className="set">
          <label>Vehicle Type:</label>
          <input type="text" name="vehicleType" onChange={handleChange("vehicleType")} value={props.vehicleType} />
        </div>

        <div className="set">
          <label>Vehicle Capacity:</label>
          <input type="text" name="vehicleCapacity" onChange={handleChange("vehicleCapacity")} value={props.vehicleCapacity} />
        </div>
      </form>
    </div>
  );
}

function HaulierCommunications({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  return (
    <div>
      <h2>Haulier Communications</h2>
      <form className="form">
        <div className="set">
          <label>Customer Service Contact Information:</label>
          <input type="text" name="customerServiceContactInformation" onChange={handleChange("customerServiceContactInformation")} value={props.customerServiceContactInformation} />
        </div>

        <div className="set">
          <label>Real Time Tracking:</label>
          <input type="text" name="realTimeTracking" onChange={handleChange("realTimeTracking")} value={props.realTimeTracking} />
        </div>

        <div className="set">
          <label>Electronic Proof Of Delivery:</label>
          <input type="text" name="electronicProofOfDelivery" onChange={handleChange("electronicProofOfDelivery")} value={props.electronicProofOfDelivery} />
        </div>

        <div className="set">
          <label>Automated Alerts And Notifications:</label>
          <input type="text" name="automatedAlertsAndNotifications" onChange={handleChange("automatedAlertsAndNotifications")} value={props.automatedAlertsAndNotifications} />
        </div>

        <div className="set">
          <label>Tracking System:</label>
          <input type="text" name="trackingSystem" onChange={handleChange("trackingSystem")} value={props.trackingSystem} />
        </div>

        <div className="set">
          <label>Delivery Window:</label>
          <input type="text" name="deliveryWindow" onChange={handleChange("deliveryWindow")} value={props.deliveryWindow} />
        </div>

        <div className="set">
          <label>Delivery Confirmation:</label>
          <input type="text" name="deliveryConfirmation" onChange={handleChange("deliveryConfirmation")} value={props.deliveryConfirmation} />
        </div>
      </form>
    </div>
  );
}

function HaulierSafetyCompliance({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  return (
    <div>
      <h2>Haulier Safety and Compliance</h2>
      <form className="form">
        <div className="set">
          <label>Safety Certifications:</label>
          <input type="text" name="safetyCertifications" onChange={handleChange("safetyCertifications")} value={props.safetyCertifications} />
        </div>

        <div className="set">
          <label>Environmental Regulations Compliance:</label>
          <input type="text" name="environmentalRegulationsCompliance" onChange={handleChange("environmentalRegulationsCompliance")} value={props.environmentalRegulationsCompliance} />
        </div>

        <div className="set">
          <label>Hazardous Materials Handling:</label>
          <input type="text" name="hazardousMaterialsHandling" onChange={handleChange("hazardousMaterialsHandling")} value={props.hazardousMaterialsHandling} />
        </div>

        <div className="set">
          <label>Safety Training Programs:</label>
          <input type="text" name="safetyTrainingPrograms" onChange={handleChange("safetyTrainingPrograms")} value={props.safetyTrainingPrograms} />
        </div>

        <div className="set">
          <label>Accident Reporting Procedure:</label>
          <input type="text" name="accidentReportingProcedure" onChange={handleChange("accidentReportingProcedure")} value={props.accidentReportingProcedure} />
        </div>

        <div className="set">
          <label>Health And Safety Policy:</label>
          <input type="text" name="healthAndSafetyPolicy" onChange={handleChange("healthAndSafetyPolicy")} value={props.healthAndSafetyPolicy} />
        </div>

        <div className="set">
          <label>Safety Audits:</label>
          <input type="text" name="safetyAudits" onChange={handleChange("safetyAudits")} value={props.safetyAudits} />
        </div>

        <div className="set">
          <label>Risk Assessments:</label>
          <input type="text" name="riskAssessments" onChange={handleChange("riskAssessments")} value={props.riskAssessments} />
        </div>

        <div className="set">
          <label>Incident Management:</label>
          <input type="text" name="incidentManagement" onChange={handleChange("incidentManagement")} value={props.incidentManagement} />
        </div>

        <div className="set">
          <label>Compliance Records:</label>
          <input type="text" name="complianceRecords" onChange={handleChange("complianceRecords")} value={props.complianceRecords} />
        </div>

        <div className="set">
          <label>Permits And Licenses:</label>
          <input type="text" name="permitsAndLicenses" onChange={handleChange("permitsAndLicenses")} value={props.permitsAndLicenses} />
        </div>

        <div className="set">
          <label>Transport Regulations Compliance:</label>
          <input type="text" name="transportRegulationsCompliance" onChange={handleChange("transportRegulationsCompliance")} value={props.transportRegulationsCompliance} />
        </div>
      </form>
    </div>
  );
}

function CalculatePriceAndPay({ props, setProps }) {
  const handleChange = (input) => (e) => {
    setProps({ ...props, [input]: e.target.value });
  };
  return (
    <div>
      <h2>Calculate Price and Pay</h2>
      <form className="form">
        <div className="set">
          <label>Price Label:</label>
          <input type="text" name="priceLabel" onChange={handleChange("priceLabel")} value={props.priceLabel} />
        </div>

        <div className="set">
          <label>Price Drop:</label>
          <input type="text" name="priceDrop" onChange={handleChange("priceDrop")} value={props.priceDrop} />
        </div>

        <div className="set">
          <label>Currency:</label>
          <input type="text" name="currency" onChange={handleChange("currency")} value={props.currency} />
        </div>

        <div className="set">
          <label>VAT:</label>
          <input type="text" name="VAT" onChange={handleChange("VAT")} value={props.VAT} />
        </div>

        <div className="set">
          <label>Total Price:</label>
          <input type="text" name="totalPrice" onChange={handleChange("totalPrice")} value={props.totalPrice} />
        </div>
      </form>
    </div>
  );
}

export default function Form() {
  const [page, setPage] = useState(0);
  const [submit, setSubmit] = useState(false);
  const [jobDes, setJobDes] = useState({
    transportItemID: "",
    category: "",
    title: "",
    description: "",
    postedDate: "",
    deadlineDate: "",
    timeScale: "",
    preferredDate: "",
    haulierToDepartureDistance: "",
    departureToDestinationDistance: "",
    returnJourney: "",
    roundTripDistance: "",
    international: "",
    ferryRequired: "",
    speacialHandlingRequirements: "",
    departureLoadingEquipmentNeeded: "",
    destinationUnloadingEquipmentNeeded: "",
    freightClass: "",
    overweightPermitNeeded: "",
    oversizePermitNeeded: "",
    numberQuotes: "",
    map: "",
    jobDone: "",
    jobDoneDate: "",
  });

  const [vesselDetails, setVesselDetails] = useState({
    itemNumber: "",
    totalNumberOfItems: "",
    photos: "",
    previousInsuranceClaims: "",
    existingDamage: "",
    damageDescription: "",
    vesselInsuranceType: "",
    vesselInsuranceNotes: "",
    boatDetails: "",
  });

  const [customerContactDetails, setCustomerContactDetails] = useState({
    customerType: "",
    customerID: "",
    customerName: "",
    customerCompanyName: "",
    collectionNamedContactDeparture: "",
    collectionMobileDeparture: "",
    collectionAddressDeparture: "",
    deliveryNamedContactDestination: "",
    deliveryMobileDestination: "",
    deliveryAddressDestination: "",
    emergencyContactInformation: "",
    preferredCommunicationMethod: "",
  });

  const [transportQuotes, setTransportQuotes] = useState({
    quote: "",
    quoteDescription: "",
    quoteDate: "",
    declineDate: "",
    withdrawDate: "",
    withdrwan: "", // Sarthak excel m dekh yaha prr problem h kuch
    declineQuote: "",
    withdrawQuote: "",
  });

  const [queAns, setQueAns] = useState({
    questionDate: "",
    answerDate: "",
    transportProviderQuestions: "",
    customerAnswers: "",
    writeQuestion: "",
    answerQuestion: "",
    customeConfirmsCompletion: "",
    addItem: "",
  });

  const [feedback, setFeedback] = useState({
    customerFeedbackNotes: "",
    customerFeedbackScore: "",
    positive: "",
    neutral: "",
    negative: "",
    reviews: "",
    rating: "",
    itemTitle: "",
    leftBy: "",
    comments: "",
    date: "",
    customerGivesFeedbackNotes: "",
    customerGivesFeedbackScore: "",
    seeMyQuotes: "",
  });

  const [haulierDetails, setHaulierDetails] = useState({
    haulierID: "",
    haulierAddress: "",
    haulierName: "",
    haulierNumberJobs: "",
    haulierTotalCustomerScore: "",
    resgisteredSince: "",
    numberVehicles: "",
    numberDrivers: "",
    verified: "",
    vehicleType: "",
    vehicleCapacity: "",
  });

  const [haulierCommunications, setHaulierCommunications] = useState({
    customerServiceContactInformation: "",
    realTimeTracking: "",
    electronicProofOfDelivery: "",
    automatedAlertsAndNotifications: "",
    trackingSystem: "",
    deliveryWindow: "",
    deliveryConfirmation: "",
  });

  const [haulierSafetyCompliance, setHaulierSafetyCompliance] = useState({
    safetyCertifications: "",
    environmentalRegulationsCompliance: "",
    hazardousMaterialsHandling: "",
    safetyTrainingPrograms: "",
    accidentReportingProcedure: "",
    healthAndSafetyPolicy: "",
    safetyAudits: "",
    riskAssessments: "",
    incidentManagement: "",
    complianceRecords: "",
    permitsAndLicenses: "",
    transportRegulationsCompliance: "",
  });

  const [paymentInsurance, setPaymentInsurance] = useState({
    paymentTerms: "",
    serviceLegalAgreement: "",
    acceptedPaymentMethods: "",
    cancellationPolicy: "",
    currency: "",
    invoiceTime: "",
    latePaymentFee: "",
    billingContactInformation: "",
    disputeResolutionTerms: "",
    liabilityCoverage: "",
    insurancePolicy: "",
    insuranceCoverage: "",
    insuranceProvider: "",
    insuranceClaimProcess: "",
  });

  const [calculatePriceAndPay, setCalculatePriceAndPay] = useState({
    priceLabel: "",
    priceDrop: "",
    currency: "",
    VAT: "",
    totalPrice: "",
  });

  // Validation state
  const [errors, setErrors] = useState({ jobDes: {}, customerContactDetails: {} });
  const [errorSummary, setErrorSummary] = useState([]);

  const validateAll = () => {
    const jobErrors = {};
    if (!jobDes.category?.trim()) jobErrors.category = "Category is required";
    if (!jobDes.title?.trim()) jobErrors.title = "Title is required";
    if (!jobDes.description?.trim()) jobErrors.description = "Description is required";

    const contactErrors = {};
    if (!customerContactDetails.customerID?.trim()) contactErrors.customerID = "Customer ID is required";
    if (!customerContactDetails.customerName?.trim()) contactErrors.customerName = "Customer Name is required";
    if (!customerContactDetails.collectionAddressDeparture?.trim()) contactErrors.collectionAddressDeparture = "Collection address is required";
    if (!customerContactDetails.deliveryAddressDestination?.trim()) contactErrors.deliveryAddressDestination = "Delivery address is required";

    const newErrors = { jobDes: jobErrors, customerContactDetails: contactErrors };
    setErrors(newErrors);

    const summary = [];
    Object.values(jobErrors).forEach((msg) => summary.push(`Job Description: ${msg}`));
    Object.values(contactErrors).forEach((msg) => summary.push(`Customer Contact Details: ${msg}`));
    setErrorSummary(summary);

    return summary.length === 0;
  };

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const ok = validateAll();
    if (!ok) {
      setSubmit(false);
      setPage(0);
      return;
    }
    setSubmit(true);
    // TODO: implement actual submit to backend
  };

  if (submit) {
    console.log("OOOO");
  }

  // go back to previous page
  const prevStep = () => {
    setPage(page - 1);
  };

  // go to next page
  const nextStep = () => {
    setPage(page + 1);
  };

  const pages = [
    <JobDescription props={jobDes} setProps={setJobDes} errors={errors.jobDes} />,
    <VesselDetails props={vesselDetails} setProps={setVesselDetails} />,
    <CustomerContactDetails
      props={customerContactDetails}
      setProps={setCustomerContactDetails}
      errors={errors.customerContactDetails}
    />,
    <TransportQuotes props={transportQuotes} setProps={setTransportQuotes} />,
    <QueAns props={queAns} setProps={setQueAns} />,
    <Feedback props={feedback} setProps={setFeedback} />,
    <HaulierDetails props={haulierDetails} setProps={setHaulierDetails} />,
    <HaulierCommunications
      props={haulierCommunications}
      setProps={setHaulierCommunications}
    />,
    <HaulierSafetyCompliance
      props={haulierSafetyCompliance}
      setProps={setHaulierSafetyCompliance}
    />,
    <PaymentInsurance
      props={paymentInsurance}
      setProps={setPaymentInsurance}
    />,
    <CalculatePriceAndPay
      props={calculatePriceAndPay}
      setProps={setCalculatePriceAndPay}
    />,
  ];

  return (
    <div>
      <p>Fill the below info</p>
      {errorSummary.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <strong>Please correct the following:</strong>
          <ul style={{ margin: '8px 0 0 16px' }}>
            {errorSummary.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
      {pages.map((item, index) => {
        if (index === page) return item;

        return null;
      })}

      <br />
      <div className="buttons">
        {/* <button onClick={() => setSubmit(true)}>Submit</button> */}
        {page === 0 ? null : <button onClick={prevStep}>Previous</button>}
        {page === pages.length - 1 ? (
          <button onClick={handleSubmit}>Submit</button>
        ) : (
          <button onClick={nextStep}>Next</button>
        )}
      </div>
    </div>
  );
}
