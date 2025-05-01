async function getLatestCPIByState() {
    const baseUrl = 'https://api.data.gov.my/data-catalogue';
    const dataId  = 'cpi_state';
  
    // 1) Fetch the single most recent date
    const latestResp = await fetch(
      `${baseUrl}?id=${dataId}&sort=-date&limit=1`
    );
    const latestJson = await latestResp.json();
    const latestDate = latestJson[0]['date']; 
    // e.g. "2025-03-01"
  
    // 2) Fetch all records for that date
    //    (we pick a high limit to ensure we grab all divisions)
    const allResp = await fetch(
      `${baseUrl}`
      + `?id=${dataId}`
      + `&date_start=${latestDate}@date`
      + `&date_end=${latestDate}@date`
      + `&limit=1000`
    );
    const allJson = await allResp.json();
    //const allRecords = allJson;
  
    // 3) Client-side filter for your five divisions
    const wanted = new Set(['overall','01','04','07','11']);
    const filtered = allJson.filter(r => wanted.has(r.division));
  
    return filtered;
  }
  
  // Example usage:
  getLatestCPIByState()
    .then(records => {
      console.log('Latest CPI records for divisions overall,01,04,07,11:');
      console.table(records);
    })
    .catch(err => console.error('API error:', err));