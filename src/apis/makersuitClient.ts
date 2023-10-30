import axios from 'axios';


const API_KEY = 'AIzaSyAltfeKzYT3Fx7QpIK0yQiztLy1qtvDD64';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText';

export async function chat(content: string): Promise<string> {
    
    try {
      const response = await axios.post(
        `${API_ENDPOINT}?key=${API_KEY}`,
        { prompt: { text: content } },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      // Adjust according to the actual response structure
      return response.data.candidates[0].output;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error('API call failed:', error.response.data);
        throw new Error(`API call failed with status ${error.response.status}: ${error.response.data}`);
      } else {
        // The request was made but no response was received or an error occurred in setting up the request
        console.error('Error calling the API:', error);
        throw new Error('Error calling the API');
      }
    }
}