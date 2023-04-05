import Image from 'next/image';
import config from '@/config';
import { FormEvent, useState } from 'react';
import { setInitialFormData } from '@/utils';
import { Invoice } from '@prisma/client';
import Error from './Error';

const Form = () => {
  const initialFormData = setInitialFormData();
  const formFields = config.bitpay.design.posData.fields;
  const [formData, setFormData] = useState<any>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createInvoice = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-invoice`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data);
        return;
      }

      const data: Invoice = await res.json();
      const { bitpay_url } = data;

      if (bitpay_url) {
        window.location.href = bitpay_url;
      }
    } catch (e: any) {
      setError(e);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await createInvoice();
    setLoading(false);
  };

  return (
    <>
      {error && <Error>{JSON.stringify(error)}</Error>}
      <form onSubmit={handleFormSubmit}>
        <div>
          {formFields.map((field) => {
            switch (field.type) {
              case 'select':
                return (
                  <div className="mt-4" key={field.id}>
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <select
                      onChange={(e) =>
                        setFormData({ ...formData, [field.id]: e.target.value })
                      }
                      id={field.id}
                      name={field.name}
                      required={field.required}
                      value={(formData && formData[field.id]) || ''}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="" hidden></option>
                      {field.options.map((option) => {
                        return (
                          <option key={option.id} value={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              case 'fieldset':
                return (
                  <div className="mt-4" key={field.id}>
                    <fieldset>
                      <legend>{field.label}</legend>
                      {field.options.map((option) => {
                        return (
                          <div key={option.id}>
                            <input
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [field.id]: e.target.value,
                                })
                              }
                              type="radio"
                              value={option.value}
                              checked={
                                (formData &&
                                  formData[field.id] === option.value) ||
                                false
                              }
                              id={option.id}
                              name={field.name}
                              required={field.required}
                              className="mr-2"
                            />
                            <label htmlFor={option.id}>{option.label}</label>
                          </div>
                        );
                      })}
                    </fieldset>
                  </div>
                );
              case 'text':
                return (
                  <div className="mt-4" key={field.id}>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    <div className="mt-1">
                      <input
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.id]: e.target.value,
                          })
                        }
                        value={(formData && formData[field.id]) || ''}
                        type="text"
                        name={field.name}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        id={field.id}
                        required={field.required}
                      />
                    </div>
                  </div>
                );
              case 'price':
                return (
                  <div className="mt-4" key={field.id}>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm"> $ </span>
                      </div>
                      <input
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.id]: e.target.value,
                          })
                        }
                        type="number"
                        id={field.id}
                        value={(formData && formData[field.id]) || ''}
                        name={field.name}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        required={field.required}
                        step="any"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span
                          className="text-gray-500 sm:text-sm"
                          id={field.id + '-currency'}
                        >
                          {field.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              default:
                return (
                  <div className="mt-4" key={field.id}>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    <div className="mt-1">
                      <input
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.id]: e.target.value,
                          })
                        }
                        type="text"
                        name={field.name}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        id={field.id}
                        required={field.required}
                      />
                    </div>
                  </div>
                );
            }
          })}
        </div>

        <div className="mt-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className={loading ? 'opacity-70' : ''}
          >
            <Image
              width={188}
              height={80}
              src="https://test.bitpay.com/cdn/en_US/bp-btn-pay-currencies.svg"
              alt="Pay with bitpay"
            />
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
