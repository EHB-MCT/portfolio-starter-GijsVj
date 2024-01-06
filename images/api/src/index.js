const app = require('./app');
const port = process.env.PORT || 3000;

/**
 * Start Server
 *
 * Initiates the server and listens on the specified port. Upon successful startup,
 * a log message is displayed indicating the server is running.
 *
 * @function
 * @name startServer
 *
 * @param {number} port - The port number on which the server will listen for incoming requests.
 * 
 * @callback successCallback - A callback function executed when the server successfully starts.
 * @param {number} port - The port on which the server is running.
 *
 * @returns {void}
 */

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});