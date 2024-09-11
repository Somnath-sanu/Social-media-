import ky from "ky";

const kyInstance = ky.create({
  parseJson: (text) => {
    return JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value); // Convert date strings to Date objects
      return value; // Return other values unchanged
    });
  },
});

export default kyInstance;

/**
 * ky is a modern, lightweight HTTP client for making HTTP requests. It is built on top of the fetch API and provides a simpler, more powerful API for handling HTTP requests and responses.
 * 
 * ky.create is a method to create a new ky instance with custom configuration. This instance can be used to make HTTP requests with the specified settings.
 * 
 * parseJson is a custom function provided to ky that uses JSON.parse with a reviver function.
 * 
 * The parseJson method in the configuration is a way to customize how the response body is parsed when the HTTP response is in JSON format.
 * 
 * JSON.parse is a method used to parse a JSON string into a JavaScript object.
 * The second argument to JSON.parse is a "reviver" function. This function allows you to transform the parsed values before they are returned.
 * 
 * This function takes two parameters: key and value
 * key: The key of the current property being processed.
 * value: The value of the current property being processed.
 * 
 * if (key.endsWith("At")) return new Date(value);-> This line checks if the key ends with "At". If it does, it converts the value from a string (which is assumed to be a date string) into a Date object.
 * {
   "createdAt": "2023-07-29T12:34:56Z", // string
   "name": "Sample Post"
   }

  {
   createdAt: new Date("2023-07-29T12:34:56Z"), //DATE object
    name: "Sample Post"
  }
 * 
 */
