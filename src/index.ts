import { createServer } from 'http';
import { readFile } from 'fs/promises';
import path from 'path';
import IngaussCanisterService from './backend/service';

const IngaussCanisterServiceInstance = new IngaussCanisterService();

const STATIC_DIR = path.join(process.cwd(), 'dist');

const server = createServer(async (req, res) => 
{
    try 
    {
        let requestUrl = req?.url?.trim();
        // Default to index.html if the root is requested.
        const requestedPath: string  = (requestUrl === '/' || requestUrl === '' || undefined === requestUrl || null === requestUrl) ? '/index.html' : requestUrl;

        // Create a safe, absolute path to the requested file.
        const filePath = path.join(STATIC_DIR, requestedPath);

        // Prevent directory traversal attacks.
        if (!filePath.startsWith(STATIC_DIR)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }

        // Read the file from the disk.
        const fileContent = await readFile(filePath);

        // Determine the content type based on file extension.
        let contentType = 'text/plain';
        if (filePath.endsWith('.html')) contentType = 'text/html';
        if (filePath.endsWith('.css')) contentType = 'text/css';
        if (filePath.endsWith('.js')) contentType = 'application/javascript';
        // Add more MIME types as needed
        
        // Send the response with the file content.
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fileContent);

    } catch (error) 
        {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
});

server.listen();