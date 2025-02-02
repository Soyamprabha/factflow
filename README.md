# Factflow
 Tackles the pervasive issue of online misinformation by providing an automated, real-time detection and verification system. Leveraging cutting-edge AI, we analyze text to identify potentially false content, significantly reducing the manual effort required for fact-checking.
## LLM Setup
1. The service uses llama-vision:3.1 and deepseek-r1 models hosted on ollama.
2. Install ollama from [Ollama](https://ollama.com/)
    - Install necessary models
    - Run ollama by running 
        ```sh
        ollama serve 
        ```
3. Ollama should be ready to use on localhost:11434 
## Backend Setup

1. **Navigate to the Backend Directory**
   ```sh
   cd ./backend/
   ```

2. **Set Up Environment Variables**
   - Create a `.env` file in the `backend` directory.
   - Add the following lines:
     ```env
     SEARCH_API_KEY=<your-scrapingdog-api-key>
     SEARCH_URL=<your-scrapingdog-api-url>
     ```

3. **Install Dependencies**
   ```sh
   npm install
   ```

4. **Run the Backend Server**
   ```sh
   npm run dev
   ```

The backend should be running on localhost:3000 by default.

## Frontend Setup

1. **Navigate to the Root Directory**
   ```sh
   cd ../
   ```

2. **Set Up Environment Variables**
   - Create a `.env` file in the root folder.
   - Add the following line:
     ```env
     VITE_BASE_URL=<backend-url>
     ```

3. **Install Dependencies**
   ```sh
   npm install
   ```

4. **Run the Frontend**
   ```sh
   npm run dev
   ```

Now, you can access the service running on localhost:5173 successfully! 🎉
