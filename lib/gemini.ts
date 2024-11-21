import { GoogleGenerativeAI } from "@google/generative-ai";

const initializeAI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function identifyInsect(base64Image: string): Promise<string> {
  try {
    const genAI = initializeAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Clean the base64 string and validate
    const base64Regex = /^data:image\/(jpeg|png|gif);base64,/;
    if (!base64Regex.test(base64Image)) {
      throw new Error('Invalid image format. Image must be JPEG, PNG, or GIF.');
    }
    
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    // Validate image data
    if (!imageData || imageData.length === 0) {
      throw new Error('Invalid image data');
    }

    // Calculate image size (rough estimate)
    const sizeInBytes = (imageData.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 4) {
      throw new Error('Image size must be less than 4MB');
    }

    const prompt = `Analyze this image of an insect and provide the following information in a structured format:

    Please format your response exactly like this example:
    <h3>Common Name</h3>
    <p><em>Scientific name</em></p>
    
    <h3>Description</h3>
    <p>Brief physical description and characteristics.</p>
    
    <h3>Habitat and Distribution</h3>
    <p>Where the insect lives and can be found.</p>
    
    <h3>Interesting Facts</h3>
    <ul>
      <li>Fact 1</li>
      <li>Fact 2</li>
      <li>Fact 3</li>
    </ul>

    If you're not completely certain about the identification, please indicate this at the beginning of the description.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No identification results received');
    }

    // Clean up any potential markdown or code block markers
    const cleanedText = text.replace(/```html\n?|\n?```/g, '').trim();

    return cleanedText;
  } catch (error: any) {
    console.error('Full error object:', error);
    
    // More specific error handling
    if (error?.message?.includes('PERMISSION_DENIED')) {
      throw new Error('API key does not have permission to access the Gemini API. Please check your API key settings.');
    }
    if (error?.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    if (error?.message?.includes('INVALID_ARGUMENT')) {
      throw new Error('Invalid image format or size. Please try a different image (JPEG/PNG/GIF, <4MB).');
    }
    if (error?.message?.includes('blocked')) {
      throw new Error('The content was blocked by safety settings. Please try a different image.');
    }
    if (error?.message?.includes('size')) {
      throw new Error('Image size too large. Please use an image smaller than 4MB.');
    }
    if (error?.message?.includes('not found')) {
      throw new Error('The model is not available. Please try again later.');
    }
    
    // Generic error message for other cases
    throw new Error(error?.message || 'Failed to identify insect. Please try again with a different image.');
  }
}

export async function testGeminiAPI(): Promise<string> {
  try {
    const genAI = initializeAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Test API Error:', error);
    throw error;
  }
}