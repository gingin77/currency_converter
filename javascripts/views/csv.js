function success(fileName, directoryName, path) {
  console.log(`File saved!\n
    You backup is stored as ${fileName} at ${directoryName}\n
    The full path is: ${path} `);
}

module.exports = { success }