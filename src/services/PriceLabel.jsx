import { useEffect, useState } from "react";
import "./MediaUpload.scss"

export default function PriceLabel() {
  const [value, setValue] = useState('');
  const [good, setGood] = useState(false);
  const [high, setHigh] = useState(false);
  const [VeryHigh, setVeryHigh] = useState(false);
  const [great, setGreat] = useState(false);
  const [best, setBest] = useState(false);

  const allPriceStatusFalse = () => {
    setHigh(false);
    setGood(false);
    setVeryHigh(false);
    setGreat(false);
    setBest(false);
  };

  // thousand comma pattern regex logic
  const formatNumber = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };


  const handleOnchange = (e) => {
    let rawValue = e.target.value;
    const formattedValue = formatNumber(rawValue);
    setValue(formattedValue)
  };

  // average calculation of previous prices

  const prevPrice = [10000, 89000, 50000, 110000, 90000, 114000, 120000];
  const mean = prevPrice.reduce((acc, curr) => acc + curr, 0) / prevPrice.length;
  console.log(mean.toFixed(2));
  const tenP = mean * 0.1; // 10 percent of the average
  const thirtyP = mean * 0.3; // 30 percent of the average


  const priceLabel = (price) => {
    if (mean + tenP < price && price < mean + thirtyP) {
      allPriceStatusFalse();
      setHigh(true);
    } else if (mean + thirtyP < price) {
      allPriceStatusFalse();
      setVeryHigh(true);
    } else if (mean - tenP > price && price > mean - thirtyP) {
      allPriceStatusFalse();
      setGreat(true);
    } else if (mean - thirtyP > price && price > 0) {
      allPriceStatusFalse();
      setBest(true);
    } else if (price > 0) {
      allPriceStatusFalse();
      setGood(true);
    }
  };
  useEffect(() => {
    if (value) {
      // Converting the string value back to a number, removing the commas (priceLabel fn only takes nums)
      const num = parseFloat(value.replace(/,/g, ""));
       // console.log('type: ', typeof num);
      if (num > 0) {
        priceLabel(num);
      } else {
        allPriceStatusFalse();
      }
    } else {
      allPriceStatusFalse();
    }
  }, [value]);

  return (
    <div className='label-container'>
      <input type="text" value={value} onChange={handleOnchange} placeholder="Enter your Price" required />
      <br />
      { best && <div className="price-label visible">
        <img src={'/svg/best-price.svg'} alt="Best Price" width={100} height={50} />
        <span style={{background:'#a9dfbf', color:'black'}}>Best Price</span>
        </div> }
      { great && <div className="price-label">
        <img src={'/svg/great-price.svg'} alt="Great Price" width={100} height={50} />
        <span style={{background:'#229954'}}>Great Price</span>
        </div>}
      { good && <div className="price-label">
        <img src={'/svg/good-price.svg'} alt="Good Price" width={100} height={50} />
        <span style={{background:'#196f3d'}}>Good Price</span>
        </div> }
      { high && <div className="price-label">
        <img src={'/svg/high-price.svg'} alt="High Price" width={100} height={50} />
        <span style={{background:'#FBBA00'}}>High Price</span>
        </div> }
      { VeryHigh && <div className="price-label">
        <img src={'/svg/very-high-price.svg'} alt="Very High Price" width={100} height={50} />
        <span style={{background:'#FF9A7A'}}>Very High Price</span>
        </div> }
    </div>
  );
}