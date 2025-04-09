app.get('/buffered-json', async (req, res) => {
    const bigDataArray = await fetchSomeBigData()
    const jsonResponse = JSON.stringify(bigDataArray)
    res.setHeader('Content-Type', 'application/json')
    res.send(jsonResponse)
})
