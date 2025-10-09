import React, { useEffect, useState, useCallback } from "react";
import { Loader } from "../components/Common_Utils";
import { 
  DropdownWithCheckBoxes, 
  InputComponent, 
  DatePickerField, 
  DateTimePickerField, 
  RangeInput 
} from "../components/Generic_Components";
import axios from "axios";
import FormUtilities from "../utils/Form_Utilities";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// Yes/No radio component
const YesNoField = ({ label, value, onChange, required }) => (
  <div className="mb-4">
    <span className="block text-sm font-medium text-gray-700 mb-2">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </span>
    <div className="flex gap-6">
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          value="Yes"
          checked={value === 'Yes'}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>Yes</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          value="No"
          checked={value === 'No'}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>No</span>
      </label>
    </div>
  </div>
);

export default function TransportAdvert() {
  const serviceName = 'transport';

  // Created/Posted at default: compute once
  const [createdAt] = useState(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  });

  const [loading, setLoading] = useState(true);
  const [fetchingOptions, setFetchingOptions] = useState({});
  const [serviceConfig, setServiceConfig] = useState(null);
  const [serviceMappings, setServiceMappings] = useState(null);
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [filtersData, setFiltersData] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fields to hide for advert (post-job or analytics)
  const IRRELEVANT_FIELDS = new Set([
    'Job_Done_Haulier','Job_Done_Date_Haulier','Job_Done_Customer',
    'Number_Jobs','Haulier_Total_Customer_Score','Decline_Date','Withdraw_Date','Quote_Status',
    'Customer_Feedback_Notes','Customer_Feedback_Score','Rating','Reviews','Total_Reviews',
    'Active_Quotes','Avg_Rating','Response_Time'
  ]);

  // Auto-detect Yes/No fields by name
  const YES_NO_FIELDS = new Set([
    'Verified','International','Real_Time_Tracking','Electronic_POD','Delivery_Confirmation',
    'Insurance','Cancellation_Policy_Required','Hazardous_Materials','Compliance_Required'
  ]);

  const UI_KEY_SEP = "||";
  const buildUiKey = (tableName, fieldKey) => `${tableName}${UI_KEY_SEP}${fieldKey}`;

  const filterRelevantConfig = (config) => {
    if (!config?.tables) return config;
    const tables = (config.tables || []).map((table) => {
      const filteredCols = Object.fromEntries(
        Object.entries(table.columns || {}).filter(([key]) => !IRRELEVANT_FIELDS.has(key))
      );
      return { ...table, columns: filteredCols };
    }).filter(t => Object.keys(t.columns || {}).length > 0);
    return { ...config, tables };
  };

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/advert/${serviceName}/search-options`);
      if (res.data?.ok) {
        const filtered = filterRelevantConfig(res.data.data);
        setServiceConfig(filtered);
        setServiceMappings(res.data.service_mappings);

        // Initialize form state
        const initial = {};
        (filtered.tables || []).forEach((table) => {
          Object.entries(table.columns || {}).forEach(([fieldKey, fieldConfig]) => {
            if (fieldConfig.type === 'dual') initial[fieldKey] = { from: '', to: '' };
            else if (fieldConfig.type === 'radio' && fieldConfig.radio_Options) initial[fieldKey] = '';
            else initial[fieldKey] = '';
          });
        });
        // Default created/posted time if field exists in config
        if ('Posted_Date' in initial) initial.Posted_Date = createdAt;
        if ('Created_At' in initial) initial.Created_At = createdAt;
        setFormState(initial);
      }
    } catch (e) {
      console.error('Init error', e);
    } finally { setLoading(false); }
  }, [serviceName, createdAt]);

  useEffect(() => { initialize(); }, [initialize]);

  const fetchDropdownData = async (uiKey, fieldKey) => {
    if (!serviceName || !fieldKey) return;
    setFetchingOptions(prev => ({ ...prev, [uiKey]: true }));
    try {
      const res = await axios.get(`${API_BASE}/search/${serviceName}/facets/${fieldKey}`);
      const list = (res.data?.ok ? (res.data.facets || []) : []).map(opt => (
        typeof opt === 'string' ? { value: opt, label: opt } : opt
      ));
      setFiltersData(prev => ({ ...prev, [uiKey]: list }));
    } catch (e) {
      console.error('facets error', fieldKey, e);
      setFiltersData(prev => ({ ...prev, [uiKey]: [] }));
    } finally {
      setFetchingOptions(prev => ({ ...prev, [uiKey]: false }));
    }
  };

  const clearError = (key) => setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });

  const handleInputChange = (key, value) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    if (errors[key]) clearError(key);
  };

  const validate = () => {
    const errs = {};
    (serviceConfig?.tables || []).forEach((table) => {
      Object.entries(table.columns || {}).forEach(([key, col]) => {
        const v = formState[key];
        if (col.mandatory) {
          const empty = (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) || (typeof v === 'object' && v && 'from' in v && 'to' in v && !v.from && !v.to));
          if (empty) errs[key] = `${col.display_Text} is required`;
        }
      });
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setLoading(true);
    try {
      const payload = FormUtilities.normalizeFormForSubmit(formState, serviceMappings);
      const res = await fetch(`${API_BASE}/advert/${serviceName}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Submit failed');
      const id = json.new_Id || json.new_id || json.data?.new_Id;
      alert('Transport job posted successfully!');
      window.location.href = `/detail/${serviceName}/${id}`;
    } catch (err) {
      console.error('submit error', err);
      alert(`Submit failed: ${err.message}`);
    } finally { setLoading(false); }
  };

  const renderField = (table, fieldKey, fieldConfig) => {
    const uiKey = buildUiKey(table.table_Name, fieldKey);
    const val = formState[fieldKey];
    const err = errors[fieldKey];

    // Yes/No radios by name or two-option radios
    const isYesNoByName = YES_NO_FIELDS.has(fieldKey);
    const isYesNoByOptions = Array.isArray(fieldConfig.radio_Options) && fieldConfig.radio_Options.length === 2 && fieldConfig.radio_Options.every(o => (typeof o === 'string' ? ['yes','no'].includes(o.toLowerCase()) : ['yes','no'].includes(String(o.value).toLowerCase())));

    if (isYesNoByName || isYesNoByOptions) {
      return (
        <div key={fieldKey} className="mb-6">
          <YesNoField
            label={fieldConfig.display_Text}
            value={val || ''}
            onChange={(v) => handleInputChange(fieldKey, v)}
            required={!!fieldConfig.mandatory}
          />
          {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
        </div>
      );
    }

    switch (fieldConfig.type) {
      case 'date':
        return (
          <div key={fieldKey} className="mb-6">
            <DatePickerField
              title={fieldConfig.display_Text}
              value={val || ''}
              onChange={(d) => handleInputChange(fieldKey, d)}
              mandatory={fieldConfig.mandatory}
            />
            {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
          </div>
        );
      case 'datetime':
        return (
          <div key={fieldKey} className="mb-6">
            <DateTimePickerField
              title={fieldConfig.display_Text}
              value={val || ''}
              onChange={(dt) => handleInputChange(fieldKey, dt)}
              mandatory={fieldConfig.mandatory}
            />
            {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
          </div>
        );
      case 'dual':
        return (
          <div key={fieldKey} className="mb-6">
            <RangeInput
              title={fieldConfig.display_Text}
              valueFrom={val?.from || ''}
              valueTo={val?.to || ''}
              onChange={(from, to) => handleInputChange(fieldKey, { from, to })}
              radioOptions={fieldConfig.radio_Options || []}
              mandatory={fieldConfig.mandatory}
            />
            {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
          </div>
        );
      case 'number':
        return (
          <div key={fieldKey} className="mb-6">
            <InputComponent
              title={fieldConfig.display_Text}
              value={val || ''}
              onChange={(v) => handleInputChange(fieldKey, v)}
              radioOptions={fieldConfig.radio_Options || []}
              mandatory={fieldConfig.mandatory}
            />
            {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
          </div>
        );
      case 'radio':
        if (Array.isArray(fieldConfig.radio_Options) && fieldConfig.radio_Options.length > 0) {
          return (
            <div key={fieldKey} className="mb-6">
              <DropdownWithCheckBoxes
                title={fieldConfig.display_Text}
                options={fieldConfig.radio_Options.map(o => (typeof o === 'string' ? { value: o, label: o } : o))}
                selected={val ? [val] : []}
                onChange={(selected) => handleInputChange(fieldKey, selected[0] || '')}
                open={openDropdown === uiKey}
                onOpen={() => { setOpenDropdown(uiKey); fetchDropdownData(uiKey, fieldKey); }}
                fetching={fetchingOptions[uiKey] || false}
                advert={true}
                mandatory={fieldConfig.mandatory}
              />
              {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
            </div>
          );
        }
        // fallthrough to default
      default:
        return (
          <div key={fieldKey} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {fieldConfig.display_Text}{fieldConfig.mandatory && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={val || ''}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${err ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder={`Enter ${fieldConfig.display_Text}`}
            />
            {err && <p className="text-red-500 text-sm mt-1">{err}</p>}
          </div>
        );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Post a Transport Job</h1>
          <p className="text-lg text-gray-600">Create a new transport job listing to receive competitive quotes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hidden created/posted time if field absent visually */}
          <input type="hidden" name="Created_At" value={createdAt} />

          {(serviceConfig?.tables || []).map((table, idx) => (
            <div key={table.table_Name || idx} className="bg-white rounded-xl shadow-lg p-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {table.section_Heading || table.table_Name?.replace(/_/g,' ') || `Section ${idx+1}`}
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(table.columns || {}).map(([key, col]) => renderField(table, key, col))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button type="button" className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => window.history.back()}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Posting...' : 'Post Transport Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
