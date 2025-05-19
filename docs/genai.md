Okay, here is the comprehensive documentation incorporating the sections on Structured Output (JSON) and Document Understanding (PDF), integrated into the previous structure.

---

# @google/genai SDK Documentation

This document provides a detailed reference for the `@google/genai` SDK, which allows you to interact with Google's generative AI models via the Gemini API or the Vertex AI API.

**Key Features:**

*   Access to powerful generative models (Gemini family, Imagen, Veo, etc.).
*   Support for both the public Gemini API (using API keys) and Google Cloud Vertex AI (using Cloud project credentials).
*   Methods for:
    *   Text generation (including streaming).
    *   **Structured output generation (JSON).**
    *   Chat sessions with history management.
    *   **Document understanding (native PDF processing).**
    *   Image understanding and generation.
    *   Video understanding and generation (via operations).
    *   Audio understanding.
    *   Content embedding.
    *   Token counting.
    *   File management (for large inputs).
    *   Context caching.
    *   Function calling.
*   Utilities for schema conversion and handling file URIs.

## Table of Contents

1.  [Core Client (`GoogleGenAI`)](#1-core-client-googlegenai)
2.  [Configuration (`GoogleGenAIOptions`)](#2-configuration-googlegenaicoptions)
3.  [Model Interactions (`Models`)](#3-model-interactions-models)
    *   [3.1 Document Understanding (PDF Input)](#31-document-understanding-pdf-input)
    *   [3.2 Generating Structured JSON Output](#32-generating-structured-json-output)
4.  [File Management (`Files`)](#4-file-management-files)
5.  [Chat Sessions (`Chats` & `Chat`)](#5-chat-sessions-chats--chat)
6.  [Content Caching (`Caches`)](#6-content-caching-caches)
7.  [Long-Running Operations (`Operations`)](#7-long-running-operations-operations)
8.  [Live Sessions (`Live`)](#8-live-sessions-live) - *(Briefly mentioned)*
9.  [JSON Schema Details](#9-json-schema-details)
10. [Schema Helper (`zodToGoogleGenAISchema`)](#10-schema-helper-zodtogooglegenaischema)

---

## 1. Core Client (`GoogleGenAI`)

The main entry point for using the Google GenAI SDK.

**Remarks:**

*   Provides access to the GenAI features through either the Gemini API or the Vertex AI API.
*   The `GoogleGenAIOptions.vertexai` value determines which API service to use.
    *   When using the Gemini API (`vertexai: false` or omitted), a `GoogleGenAIOptions.apiKey` must be set.
    *   When using Vertex AI (`vertexai: true`), `GoogleGenAIOptions.project` and `GoogleGenAIOptions.location` must be set (typically on Node.js runtimes with appropriate Cloud authentication).

### Initialization Examples

**Initializing for Gemini API:**

```javascript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'YOUR_GEMINI_API_KEY' });
```

**Initializing for Vertex AI API:**

```javascript
import { GoogleGenAI } from '@google/genai';

// Ensure appropriate authentication is set up for your environment
// (e.g., gcloud auth application-default login, or service account keys)
const ai = new GoogleGenAI({
  vertexai: true,
  project: 'YOUR_PROJECT_ID',
  location: 'YOUR_PROJECT_LOCATION', // e.g., 'us-central1'
});
```

### Constructor

*   `new GoogleGenAI(options: GoogleGenAIOptions): GoogleGenAI`
    *   **Parameters:**
        *   `options` (`GoogleGenAIOptions`): Configuration options for the SDK client. See [Configuration (`GoogleGenAIOptions`)](#2-configuration-googlegenaicoptions).
    *   **Returns:** A new `GoogleGenAI` instance.

### Properties

These properties provide access to different functionalities of the SDK:

*   `models: Models` (Readonly)
    *   Access methods for interacting with generative models (generate content, count tokens, embed, handle documents, generate structured output, etc.). See [Model Interactions (`Models`)](#3-model-interactions-models).
*   `chats: Chats` (Readonly)
    *   Factory for creating stateful chat sessions. See [Chat Sessions (`Chats` & `Chat`)](#5-chat-sessions-chats--chat).
*   `files: Files` (Readonly)
    *   Access methods for managing uploaded files, especially for large inputs like PDFs. See [File Management (`Files`)](#4-file-management-files).
*   `caches: Caches` (Readonly)
    *   Access methods for managing cached content. See [Content Caching (`Caches`)](#6-content-caching-caches).
*   `operations: Operations` (Readonly)
    *   Access methods for managing long-running operations (like video generation). See [Long-Running Operations (`Operations`)](#7-long-running-operations-operations).
*   `live: Live` (Readonly)
    *   Provides access to live, interactive session features. See [Live Sessions (`Live`)](#8-live-sessions-live).
*   `vertexai: boolean` (Readonly)
    *   Indicates whether the client is configured to use the Vertex AI API (`true`) or the Gemini API (`false`).

---

## 2. Configuration (`GoogleGenAIOptions`)

Interface defining the configuration options for the `GoogleGenAI` client.

### Properties

*   `apiKey?: string`
    *   The API Key. Required when using the Gemini API (`vertexai` is `false` or omitted). Required on browser runtimes.
*   `vertexai?: boolean`
    *   Determines whether to use the Vertex AI (`true`) or the Gemini API (`false`). Defaults to `false` (Gemini API).
*   `project?: string`
    *   The Google Cloud project ID. Required when using Vertex AI (`vertexai: true`). Only supported on Node runtimes.
*   `location?: string`
    *   The Google Cloud project region (e.g., `us-central1`). Required when using Vertex AI (`vertexai: true`). Only supported on Node runtimes.
*   `apiVersion?: string`
    *   Optional. The API version to use (e.g., `v1beta`). If unset, the default version is used.
*   `googleAuthOptions?: GoogleAuthOptions<JSONClient>`
    *   Optional. Authentication options from `google-auth-library` for Vertex AI clients. See [GoogleAuthOptions](https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts) interface. Only supported on Node runtimes.
*   `httpOptions?: HttpOptions`
    *   Optional. Customizable configuration for underlying HTTP requests (e.g., timeouts, headers).

---

## 3. Model Interactions (`Models`)

Provides methods for interacting with generative models. Access via `ai.models`. Supports text, image, audio, video, and **document (PDF)** inputs, and can generate text, images, video, embeddings, and **structured JSON output**.

### Methods

*   `generateContent(params: GenerateContentParameters): Promise<GenerateContentResponse>`
*   `generateContentStream(params: GenerateContentParameters): Promise<AsyncGenerator<GenerateContentResponse>>`

    *   Makes an API request to generate content from the model. `generateContent` returns the full response, while `generateContentStream` yields the response in chunks.
    *   **Parameters:** `params` (`GenerateContentParameters`):
        *   `model`: The model name or path.
            *   **Vertex AI:** `gemini-1.5-flash`, `projects/my-proj/locations/loc/publishers/google/models/gemini-1.5-pro`, `publishers/google/models/gemini-1.5-flash`, `google/gemini-1.5-pro`, `meta/llama-3.1-405b-instruct-maas`, etc.
            *   **Gemini API:** `gemini-1.5-flash`, `models/gemini-1.5-pro`, `tunedModels/12345...`.
        *   `contents`: An array (`Content[]`) representing the multimodal input prompt. Each `Content` object has a `role` (`user` or `model`) and `parts`. Parts can be `{text: string}`, `{inlineData: {mimeType: string, data: string}}` (for images, audio, **PDFs < 20MB**), or `{fileData: {mimeType: string, fileUri: string}}` (using URIs from the **File API** for large files). See [Document Understanding (PDF Input)](#31-document-understanding-pdf-input).
        *   `config?`: Optional `GenerateContentConfig` object:
            *   `candidateCount?: number`
            *   `stopSequences?: string[]`
            *   `maxOutputTokens?: number`
            *   `temperature?: number`
            *   `topP?: number`
            *   `topK?: number`
            *   `responseMimeType?: string`: Set to `'application/json'` to request structured JSON output. See [Generating Structured JSON Output](#32-generating-structured-json-output).
            *   `responseSchema?: Schema`: Provide a schema definition when `responseMimeType` is `'application/json'`. See [Generating Structured JSON Output](#32-generating-structured-json-output) and [JSON Schema Details](#9-json-schema-details).
        *   `tools?`: Define functions the model can call.
        *   `tool_config?`: Configuration for tool use.
        *   `systemInstruction?`: Instructions to guide model behavior.
        *   `cachedContent?`: Name of a cached content resource to use. See [Content Caching (`Caches`)](#6-content-caching-caches).
    *   **Returns:**
        *   `generateContent`: `Promise<GenerateContentResponse>` containing the full response.
        *   `generateContentStream`: `Promise<AsyncGenerator<GenerateContentResponse>>` yielding response chunks.
    *   **Example (Simple Text):**
        ```javascript
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: 'Why is the sky blue?' }] }],
        });
        console.log(response.candidates[0].content.parts[0].text);
        ```
    *   **Example (Streaming):**
        ```javascript
        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: 'Explain quantum physics simply.' }] }],
        });
        for await (const chunk of responseStream) {
          if (chunk.candidates?.[0]?.content?.parts?.[0]?.text) {
             process.stdout.write(chunk.candidates[0].content.parts[0].text);
          }
        }
        console.log();
        ```

*   `countTokens(params: CountTokensParameters): Promise<CountTokensResponse>`
    *   Counts the tokens in the provided content for a specific model.
    *   **Parameters:** `params` (`CountTokensParameters`): Includes `model` and `contents`.
    *   **Returns:** `Promise<CountTokensResponse>` containing `totalTokens`.
    *   **Example:**
        ```javascript
        const response = await ai.models.countTokens({
          model: 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: 'Count these tokens.' }] }]
        });
        console.log(`Total tokens: ${response.totalTokens}`);
        ```

*   `embedContent(params: EmbedContentParameters): Promise<EmbedContentResponse>`
    *   Generates embeddings (vector representations) for content.
    *   **Parameters:** `params` (`EmbedContentParameters`): Includes `model` (e.g., `text-embedding-004`), `contents`, optional `config`, `taskType`.
    *   **Returns:** `Promise<EmbedContentResponse>` containing the `embedding`.
    *   **Example:**
        ```javascript
        const response = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: [
            { role: 'user', parts: [{ text: 'Sentence 1' }] },
            { role: 'user', parts: [{ text: 'Sentence 2' }] },
          ],
        });
        console.log('Embeddings:', response.embedding);
        ```

*   `get(params: GetModelParameters): Promise<Model>`
    *   Fetches detailed information about a specific model.
    *   **Parameters:** `params` (`GetModelParameters`): Includes `model` name/path.
    *   **Returns:** `Promise<Model>` containing model details.
    *   **Example:**
        ```javascript
        const modelInfo = await ai.models.get({ model: 'gemini-1.5-pro' });
        console.log(modelInfo);
        ```

*   `generateImages(params: GenerateImagesParameters): Promise<GenerateImagesResponse>`
    *   Generates images based on a text prompt.
    *   **Parameters:** `params` (`GenerateImagesParameters`): Includes `model` (e.g., `imagen-3.0-generate-002`), `prompt`, optional `config`.
    *   **Returns:** `Promise<GenerateImagesResponse>`.
    *   **Example:**
        ```javascript
        const response = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: 'Astronaut riding a bicycle on the moon, photorealistic.',
          config: { numberOfImages: 1 },
        });
        // Process response.generatedImages[0].image.imageBytes or .uri
        ```

*   `generateVideos(params: GenerateVideosParameters): Promise<GenerateVideosOperation>`
    *   Initiates a long-running operation to generate videos.
    *   **Parameters:** `params` (`GenerateVideosParameters`): Includes `model` (e.g., `veo-2.0-generate-001`), `prompt`, optional `config`.
    *   **Returns:** `Promise<GenerateVideosOperation>`: An operation object to track progress via `ai.operations.get`. See [Long-Running Operations (`Operations`)](#7-long-running-operations-operations).
    *   **Example:** See Section 7.

*   `computeTokens(params: ComputeTokensParameters): Promise<ComputeTokensResponse>`
    *   **(Vertex AI Only)** Computes detailed token information (strings and IDs).
    *   **Parameters:** `params` (`ComputeTokensParameters`): Includes `model` and `contents`.
    *   **Returns:** `Promise<ComputeTokensResponse>`.
    *   **Example (Vertex AI):**
        ```javascript
        // Assuming 'ai' is configured for Vertex AI
        const response = await ai.models.computeTokens({
          model: 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: 'Tokenize this.' }] }]
        });
        console.log(response.tokensInfo);
        ```

---

### 3.1 Document Understanding (PDF Input)

Gemini models can natively process PDF documents, understanding both text and visual elements like diagrams, charts, and tables. This allows for tasks like summarization, information extraction, Q&A directly on documents.

**Supported Input:** Up to 3600 pages per PDF (Gemini 1.5 models). Supported MIME types include `application/pdf`, various code formats (`text/javascript`, `text/x-python`), text formats (`text/plain`, `text/html`, `text/css`, `text/md`, `text/csv`, `text/xml`, `text/rtf`).

**Input Methods:**

1.  **Inline Data (Files < 20MB):** For smaller PDFs, you can read the file content, Base64 encode it, and include it directly in the `contents` array.

    *   **Structure:**
        ```json
        {
          "inlineData": {
            "mimeType": "application/pdf",
            "data": "BASE64_ENCODED_PDF_STRING"
          }
        }
        ```
    *   **Example (Fetching from URL):**
        ```javascript
        import { GoogleGenAI } from "@google/genai";
        import fetch from 'node-fetch'; // Or use browser fetch

        const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

        async function summarizePdfFromUrl(pdfUrl) {
            const pdfResp = await fetch(pdfUrl).then((response) => response.arrayBuffer());
            const base64Pdf = Buffer.from(pdfResp).toString("base64");

            const contents = [
                { text: "Summarize the key findings in this document." },
                {
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: base64Pdf
                    }
                }
            ];

            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash", // Or 1.5 Pro
                contents: contents
            });
            console.log(response.candidates[0].content.parts[0].text);
        }

        summarizePdfFromUrl('https://arxiv.org/pdf/2312.11805'); // Example PDF URL
        ```
    *   **Example (Reading Local File - Node.js):**
        ```javascript
        import { GoogleGenAI } from "@google/genai";
        import * as fs from 'fs';

        const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

        async function summarizeLocalPdf(filePath) {
            const base64Pdf = Buffer.from(fs.readFileSync(filePath)).toString("base64");

            const contents = [
                { text: "What is the main topic of this PDF?" },
                {
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: base64Pdf
                    }
                }
            ];
            // ... rest is same as above: call generateContent ...
            const response = await ai.models.generateContent({ /* ... */ });
            console.log(response.candidates[0].content.parts[0].text);
        }

        summarizeLocalPdf('./path/to/your/document.pdf');
        ```

2.  **File API (Files > 20MB or Preferred Method):** For larger PDFs, multiple PDFs, or when managing files separately is desired, use the File API. This involves uploading the file first, then referencing its URI in the `generateContent` call. See [File Management (`Files`)](#4-file-management-files) for full API details.

    *   **Steps:**
        1.  Upload the PDF using `ai.files.upload()`. This accepts a file path (Node.js), `Blob` (Browser/Node.js), or `File` (Browser).
        2.  Poll `ai.files.get()` until the file `state` is `ACTIVE` (not `PROCESSING`).
        3.  Use the `createPartFromUri()` helper (from `@google/genai`) or manually create a part `{ fileData: { mimeType: file.mimeType, fileUri: file.uri } }`.
        4.  Include this part in the `contents` array passed to `generateContent`.
    *   **Example (Uploading Local PDF & Summarizing - Node.js):**
        ```javascript
        import { GoogleGenAI, createPartFromUri } from "@google/genai";
        import * as fs from 'fs';

        const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

        async function uploadAndSummarizeLocalPdf(filePath) {
            console.log(`Uploading file: ${filePath}`);
            // Upload the file (Node.js example)
            const uploadResult = await ai.files.upload({
                file: filePath, // Provide the path directly
                config: {
                    // Optional: provide mimeType if not inferrable, or a displayName
                    // mimeType: 'application/pdf',
                    displayName: filePath.split('/').pop() // Use filename as display name
                }
            });
            console.log(`Uploaded file: ${uploadResult.name}, URI: ${uploadResult.uri}`);

            // Wait for the file to be processed
            let file = await ai.files.get({ name: uploadResult.name });
            while (file.state === 'PROCESSING') {
                process.stdout.write('.'); // Show progress
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
                file = await ai.files.get({ name: uploadResult.name });
            }
            console.log(`\nFile processing state: ${file.state}`);

            if (file.state === 'FAILED') {
                throw new Error('File processing failed.');
            }
            if (file.state !== 'ACTIVE') {
                throw new Error(`File state is not ACTIVE: ${file.state}`);
            }

            // Create the prompt with the file part
            const contents = [
                { text: "Provide a 3-sentence summary of this document." },
                createPartFromUri(file.uri, file.mimeType) // Use the helper
                // Or manually: { fileData: { mimeType: file.mimeType, fileUri: file.uri } }
            ];

            console.log('Generating content...');
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: contents,
            });

            console.log('\nSummary:');
            console.log(response.candidates[0].content.parts[0].text);

            // Optional: Delete the file after use
            // await ai.files.delete({ name: file.name });
            // console.log(`Deleted file: ${file.name}`);
        }

        uploadAndSummarizeLocalPdf('./path/to/your/large_document.pdf');
        ```
    *   **Example (Multiple PDFs via File API):** Upload each PDF as shown above, then include multiple `fileData` parts in the `contents` array.
        ```javascript
        async function comparePdfs(fileUri1, mimeType1, fileUri2, mimeType2) {
            const contents = [
                { text: 'Compare and contrast the main arguments of these two documents.' },
                createPartFromUri(fileUri1, mimeType1),
                createPartFromUri(fileUri2, mimeType2),
            ];

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-pro', // Use Pro for potentially complex comparison
                contents: contents,
            });
            console.log(response.candidates[0].content.parts[0].text);
        }
        // Assume file1.uri, file1.mimeType, file2.uri, file2.mimeType obtained from uploads
        // comparePdfs(file1.uri, file1.mimeType, file2.uri, file2.mimeType);
        ```

**Technical Details & Best Practices:**

*   Each document page roughly equates to 258 tokens.
*   Large pages are downscaled (max 3072x3072), smaller pages are upscaled (min 768x768). Resolution doesn't affect cost beyond context window usage.
*   Ensure pages have correct orientation. Avoid blurry pages.
*   For single-page PDFs, place the text prompt *after* the PDF part in the `contents` array.
*   The File API stores files for 48 hours (free tier limits may apply). Project storage limit is 20GB, file size limit is 2GB.

---

### 3.2 Generating Structured JSON Output

Instead of unstructured text, you can configure Gemini models to respond strictly in JSON format, optionally conforming to a specific schema. This is useful for extracting structured data, populating databases, or interacting with other systems programmatically.

**Methods:**

1.  **Prompting (Less Reliable):** You can simply ask the model to output JSON in your text prompt, describing the desired format. However, the model isn't guaranteed to adhere strictly to this request.

    *   **Example:**
        ```javascript
        const prompt = `List three popular cookie recipes using this JSON schema:
        Recipe = {'recipeName': string}
        Return: Array<Recipe>`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        console.log(response.candidates[0].content.parts[0].text);
        // Output might be: [{"recipeName": "Chocolate Chip"}, {"recipeName": "Oatmeal Raisin"}, {"recipeName": "Sugar Cookie"}]
        // But could also include extra text or formatting issues.
        ```

2.  **Model Configuration (Recommended):** Use the `config` parameter in `generateContent` or `generateContentStream` to enforce JSON output and define a schema.

    *   Set `responseMimeType: 'application/json'`.
    *   Provide a `responseSchema` object defining the expected JSON structure. The schema definition uses a subset of OpenAPI 3.0 specification. See [JSON Schema Details](#9-json-schema-details) for valid fields and types. The SDK provides a `Type` enum (`Type.STRING`, `Type.OBJECT`, `Type.ARRAY`, `Type.NUMBER`, `Type.INTEGER`, `Type.BOOLEAN`) for convenience.
    *   **Important:** Property ordering matters for consistency. Use the `propertyOrdering` field within object schemas if specific order is needed. See [Property Ordering](#property-ordering).

    *   **Example:**
        ```javascript
        import { GoogleGenAI, Type } from "@google/genai"; // Import Type enum

        const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

        async function getRecipesAsJson() {
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: [{ role: 'user', parts: [{ text: 'List 3 popular cookie recipes and their main ingredient.' }] }],
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY, // Expect an array
                        description: "List of cookie recipes",
                        items: { // Define the structure of each item in the array
                            type: Type.OBJECT,
                            properties: {
                                'recipeName': {
                                    type: Type.STRING,
                                    description: 'Name of the cookie recipe'
                                },
                                'mainIngredient': {
                                    type: Type.STRING,
                                    description: 'Primary ingredient for the cookie'
                                },
                            },
                            required: ['recipeName', 'mainIngredient'] // Both fields must be present
                        }
                    },
                },
            });

            // The response text will be a valid JSON string conforming to the schema
            console.log('Raw JSON Response Text:');
            const jsonText = response.candidates[0].content.parts[0].text;
            console.log(jsonText);

            // You can parse it directly
            try {
                const recipes = JSON.parse(jsonText);
                console.log('\nParsed Recipes:');
                console.log(recipes);
                // Example parsed output:
                // [
                //   { recipeName: 'Chocolate Chip Cookies', mainIngredient: 'Chocolate Chips' },
                //   { recipeName: 'Oatmeal Raisin Cookies', mainIngredient: 'Oats' },
                //   { recipeName: 'Peanut Butter Cookies', mainIngredient: 'Peanut Butter' }
                // ]
            } catch (e) {
                console.error("Failed to parse JSON response:", e);
            }
        }

        getRecipesAsJson();
        ```

---

## 4. File Management (`Files`)

Provides methods for managing files uploaded to the service, primarily used for providing large inputs (like PDFs, videos, audio > 20MB) to `generateContent` or other model interactions. Access via `ai.files`.

**Note:** While `upload` works for the Gemini API, Vertex AI typically relies on Google Cloud Storage buckets for persistent file storage, although the File API might still be used for temporary uploads within the 48-hour limit depending on the specific Vertex endpoint/model feature. The primary use case described here (uploading for immediate use in `generateContent`) is well-supported by the Gemini API.

### Methods

*   `upload(params: UploadFileParameters): Promise<File>`
    *   Uploads a file for temporary (48hr) use with the API. Essential for large inputs (> 20MB) like PDFs, videos, or audio files intended for model processing.
    *   **Parameters:** `params` (`UploadFileParameters`): Includes `file` (Node.js: file path string or `Blob`; Browser: `Blob` or `File`) and optional `config` (like `mimeType`, `displayName`).
    *   **Returns:** `Promise<File>` object with metadata (`name`, `uri`, `mimeType`, `state`, etc.). The `uri` is used with `createPartFromUri` or in a `fileData` part for `generateContent`.
    *   **Remarks:** Crucial for [Document Understanding (PDF Input)](#31-document-understanding-pdf-input) with large files. Poll `get()` until `state` is `ACTIVE` before using the `uri`.
    *   **Example:** See the example in [Document Understanding (PDF Input)](#31-document-understanding-pdf-input).

*   `get(params: GetFileParameters): Promise<File>`
    *   Retrieves metadata and status (`state`) for a specific uploaded file. Used for polling after `upload`.
    *   **Parameters:** `params` (`GetFileParameters`): Includes `name` (the file resource name, e.g., `files/abc123xyz`).
    *   **Returns:** `Promise<File>` object.
    *   **Example (Polling):**
        ```javascript
        async function pollFileStatus(fileName) {
          let file = await ai.files.get({ name: fileName });
          while (file.state === 'PROCESSING') {
            console.log(`File ${fileName} is processing...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            file = await ai.files.get({ name: fileName });
          }
          console.log(`File ${fileName} final state: ${file.state}`);
          return file;
        }
        // const uploadedFile = await ai.files.upload(...);
        // const activeFile = await pollFileStatus(uploadedFile.name);
        ```

*   `list(params?: ListFilesParameters): Promise<Pager<File>>`
    *   Lists files previously uploaded (within the 48hr window), returning a pager.
    *   **Parameters:** `params?` (`ListFilesParameters`): Optional, can include `config` like `pageSize`.
    *   **Returns:** `Promise<Pager<File>>`: An async iterator (`Pager`) for `File` objects.
    *   **Example:**
        ```javascript
        const listResponse = await ai.files.list({ config: { pageSize: 10 } });
        for await (const file of listResponse) {
          console.log(` - ${file.name} (${file.state})`);
        }
        ```

*   `delete(params: DeleteFileParameters): Promise<DeleteFileResponse>`
    *   Deletes an uploaded file before its 48hr expiry.
    *   **Parameters:** `params` (`DeleteFileParameters`): Includes `name`.
    *   **Returns:** `Promise<DeleteFileResponse>`.
    *   **Example:**
        ```javascript
        // await ai.files.delete({ name: 'files/your-file-id-to-delete' });
        ```

---

## 5. Chat Sessions (`Chats` & `Chat`)

Provides stateful conversational interactions, automatically managing history.

### `Chats` Class

Factory class. Access via `ai.chats`.

*   **`create(params: CreateChatParameters): Chat`**
    *   Creates a new `Chat` session instance.
    *   **Parameters:** `params` (`CreateChatParameters`): Includes `model`, optional `history` (`Content[]`), optional default `config` (`GenerateContentConfig`).
    *   **Returns:** A new `Chat` object.
    *   **Example:**
        ```javascript
        const chat = ai.chats.create({
          model: 'gemini-1.5-flash',
          config: { temperature: 0.8 },
          history: [
             { role: 'user', parts: [{ text: 'Hello!' }] },
             { role: 'model', parts: [{ text: 'Hi there!' }] }
          ]
        });
        ```

### `Chat` Class

Represents an ongoing chat session.

*   **`sendMessage(params: SendMessageParameters): Promise<GenerateContentResponse>`**
*   **`sendMessageStream(params: SendMessageParameters): Promise<AsyncGenerator<GenerateContentResponse>>`**
    *   Sends a message within the chat, including history. `sendMessage` waits for the full response, `sendMessageStream` streams it.
    *   **Parameters:** `params` (`SendMessageParameters`): Includes `message` (string or `Part[]` or `Content`), optional `config` (overrides session defaults), `tools`, `tool_config`. The `message` can include `inlineData` or `fileData` parts just like `generateContent`.
    *   **Returns:** Full response promise or async generator for chunks.
    *   **Remarks:** Waits for the previous message *in this chat instance* to complete. History is updated after the *full* response (or last chunk) is received.
    *   **Example:**
        ```javascript
        // Assuming 'chat' is an instance from ai.chats.create()
        const response = await chat.sendMessage({
          message: 'Based on our chat, what was my first question?'
        });
        console.log(response.candidates[0].content.parts[0].text);
        ```

*   **`getHistory(curated?: boolean): Content[]`**
    *   Retrieves the chat history (`Content[]`).
    *   **Parameters:** `curated` (boolean, default `false`): `true` returns only valid turns sent to the model; `false` returns all turns, including potentially empty/error ones.
    *   **Returns:** The history array.

---

## 6. Content Caching (`Caches`)

Manages cached content (e.g., large context) to reuse across requests, reducing cost and latency for compatible models (like Gemini 1.5). Access via `ai.caches`.

### Methods

*   `create(params: CreateCachedContentParameters): Promise<CachedContent>`: Creates a cache.
*   `get(params: GetCachedContentParameters): Promise<CachedContent>`: Retrieves cache info.
*   `list(params?: ListCachedContentsParameters): Promise<Pager<CachedContent>>`: Lists caches.
*   `update(params: UpdateCachedContentParameters): Promise<CachedContent>`: Updates cache (e.g., TTL).
*   `delete(params: DeleteCachedContentParameters): Promise<DeleteCachedContentResponse>`: Deletes a cache.

*(Refer to initial documentation for detailed examples)*

---

## 7. Long-Running Operations (`Operations`)

Manages asynchronous operations, like video generation. Access via `ai.operations`.

*(Specific methods like `get`, `list`, `cancel`, `wait` exist, often typed for the operation, e.g., `getVideosOperation`).*

**Example (Polling Video Generation):**

```javascript
// 1. Start generation (returns an operation object)
let operation = await ai.models.generateVideos({
  model: 'veo-2.0-generate-001',
  prompt: 'Timelapse of a flower blooming',
  config: { numberOfVideos: 1 }
});
console.log(`Video generation started. Operation name: ${operation.name}`);

// 2. Poll using ai.operations.get (or specific typed getter if available)
while (!operation.done) {
  console.log('Waiting for video generation...');
  await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15s
  try {
     // Use a generic get or a specific one if SDK provides it
     // Note: Type casting might be needed if using a generic get
     operation = await ai.operations.get({ name: operation.name });
     // Or potentially: operation = await ai.operations.getVideosOperation({ operation });
  } catch (error) {
    console.error("Error polling operation:", error);
    break;
  }
}

// 3. Check result
if (operation.done && !operation.error) {
  console.log('Video generation complete!');
  // Access results from operation.response (structure depends on operation type)
  console.log(operation.response?.generatedVideos?.[0]?.video?.uri);
} else if (operation.error) {
   console.error('Video generation failed:', operation.error);
}
```

---

## 8. Live Sessions (`Live`) - *(Briefly mentioned)*

Provides access to features for live, interactive sessions. Access via `ai.live`. *(Details depend on specific SDK features).*

---

## 9. JSON Schema Details

When using `responseMimeType: 'application/json'` with `generateContent` or `sendMessage`, you can provide a `responseSchema` to define the expected JSON structure. This schema uses a subset of the [OpenAPI 3.0 Schema Object](https://swagger.io/specification/#schema-object).

**Supported Fields per Type:**

The `type` field determines which other fields are valid. Use the `Type` enum provided by the SDK (`Type.STRING`, `Type.OBJECT`, etc.).

*   `Type.STRING`: `enum` (array of allowed strings), `format` (e.g., "date-time"), `description`, `nullable`.
*   `Type.INTEGER`: `format` (e.g., "int64", "int32"), `description`, `nullable`.
*   `Type.NUMBER`: `format` (e.g., "float", "double"), `description`, `nullable`.
*   `Type.BOOLEAN`: `description`, `nullable`.
*   `Type.ARRAY`: `items` (a Schema object defining the array elements), `minItems`, `maxItems`, `description`, `nullable`.
*   `Type.OBJECT`: `properties` (an object where keys are property names and values are Schema objects), `required` (array of required property names), `propertyOrdering` (array of property names for specific output order), `description`, `nullable`.

**General Fields:**

*   `description: string`: Explains the field's purpose.
*   `nullable: boolean`: Whether the field can be `null`.

**Example Schemas:**

```javascript
import { Type } from "@google/genai";

// Simple string enum
const statusSchema = { type: Type.STRING, enum: ["PENDING", "COMPLETE", "FAILED"] };

// Array of objects
const userListSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.INTEGER, format: "int64", description: "User ID" },
            name: { type: Type.STRING, description: "User's full name" },
            isActive: { type: Type.BOOLEAN, nullable: true }
        },
        required: ["id", "name"],
        propertyOrdering: ["id", "name", "isActive"] // Specify order
    }
};
```

<a name="property-ordering"></a>**Property Ordering:**

*   When defining an `OBJECT` schema, the order of properties in the generated JSON might vary by default.
*   To ensure consistent output order (which can improve model reliability, especially when providing few-shot examples), use the `propertyOrdering: string[]` field within the object schema.
*   List the property names in the desired output sequence. If you provide examples (`history` or few-shot prompts), ensure their property order matches the `propertyOrdering` definition.

---

## 10. Schema Helper (`zodToGoogleGenAISchema`)

A utility function to convert Zod schema objects into the `Schema` format expected by the SDK for JSON output or function calling.

*   `zodToGoogleGenAISchema(isVertexAI: boolean, schema: ZodObject<ZodRawShape>): Schema`
    *   **Parameters:**
        *   `isVertexAI: boolean`: Indicates if the target is Vertex AI (may affect output).
        *   `schema: ZodObject<ZodRawShape>`: The Zod schema.
    *   **Returns:** `Schema`: The Google GenAI compatible schema.

---