import React from "react";

export default function CalculatePriceAndPay({props, setProps}) {
    const handleChange = input => e => {
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