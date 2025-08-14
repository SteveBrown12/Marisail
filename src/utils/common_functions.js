//This function generates Text from camelCase or any other case
//Eg. Input: "engineBlock", Output: "Engine Block"

export const makeString = (str, keyToExpectedValueMap) => {
  if (str in keyToExpectedValueMap) {
    return keyToExpectedValueMap[str];
  }

  let parts = str.split("_");
  if (parts.length === 2) {
    let leftPart = parts[0].toUpperCase();
    let rightPart = parts[1]
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase())
      .trim();

    // Replace 'and' with '&' in the right part
    rightPart = rightPart.replace(/\b[Aa]nd\b/g, "&");
    return `${leftPart} ${rightPart}`;
  }
  let newStr = str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
  newStr = newStr.replace(/\b[Aa]nd\b/g, "&");
  return newStr;
};

export const conversions = {
  ft: { defaultUnit: "mtrs", factor: 0.3048 },
  mtrs: { defaultUnit: "mtrs", factor: 1 },

  hp: { defaultUnit: "kw", factor: 0.7456 },
  kw: { defaultUnit: "kw", factor: 1 },

  cm: { defaultUnit: "cm", factor: 1 },
  mm: { defaultUnit: "cm", factor: 0.1 },

  gallonsmin: { defaultUnit: "ltrs/min", factor: 4.546 },
  ltrsmin: { defaultUnit: "ltrs/min", factor: 1 },

  cuft: { defaultUnit: "cu mtrs", factor: 0.0283 },
  cumtrs: { defaultUnit: "cu mtrs", factor: 1 },

  gallons: { defaultUnit: "ltrs", factor: 4.546 },
  ltrs: { defaultUnit: "ltrs", factor: 1 },

  lbs: { defaultUnit: "kgs", factor: 0.4535 },
  kgs: { defaultUnit: "kgs", factor: 1 },

  kg: { defaultUnit: "ton", factor: 0.00098 },
  ton: { defaultUnit: "ton", factor: 1 },
};

export const convertUnit = (value, fromUnit, toUnit) => {
  if (value === "" || isNaN(value)) return "";
  if (!fromUnit || !toUnit) throw new Error("Both fromUnit and toUnit are required.");

  const fromKey = fromUnit.toLowerCase();
  const toKey = toUnit.toLowerCase();

  const fromConv = conversions[fromKey];
  const toConv = conversions[toKey];

  if (!fromConv) throw new Error(`Invalid fromUnit: ${fromUnit}`);
  if (!toConv) throw new Error(`Invalid toUnit: ${toUnit}`);

  // Step 1: Convert from 'fromUnit' → default unit
  const valueInDefault = value * fromConv.factor;

  // Step 2: If default units match, no change needed, else divide by target factor
  if (fromConv.defaultUnit === toConv.defaultUnit) {
    return Math.max(0, valueInDefault / toConv.factor);
  }

  throw new Error(`Cannot convert from ${fromUnit} to ${toUnit}: different default units`);
};

export const convertToDefaultUnit = (selectedUnit, selectedValue) => {
  const conversion = conversions[selectedUnit.toLowerCase()];
  if (!conversion) {
    throw new Error("Invalid unit provided.");
  }

  if (selectedUnit.toLowerCase() === conversion.defaultUnit) {
    return selectedValue;
  } else {
    return selectedValue * conversion.factor;
  }
};

export const convertUnitsInFormData = (formData) => {
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const nestedObject = formData[key];
        for (const innerKey in nestedObject) {
          if (Object.prototype.hasOwnProperty.call(nestedObject, innerKey)) {
            const { value, unit } = nestedObject[innerKey];
            if (unit) {
              try {
                const convertedValue = convertToDefaultUnit(unit, value);
                nestedObject[innerKey].value = convertedValue;
              } catch (error) {
                console.error(`Error converting unit for ${innerKey}:`, error);
              }
            }
          }
        }
      }
    }
  }
