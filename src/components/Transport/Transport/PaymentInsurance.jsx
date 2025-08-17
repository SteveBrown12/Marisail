import React from "react";

export default function PaymentInsurance({props, setProps}) {
    const handleChange = input => e => {
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

