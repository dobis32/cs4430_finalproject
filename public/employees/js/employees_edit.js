const validData = function(firstName, lastName, hireDate, salesToDate, phone, commission) {
    let isValid = true;
    if(firstName.length > 16 || lastName.length > 24 || phone.length > 12){
        isValid = false;
    }
    try {
        let dateBuffer = new Date(`${hireDate} 00:00:00`);
        let salesBuffer = parseFloat(salesToDate).toFixed(2);
        let commissionBuffer = parseFloat(commission).toFixed(2);
        if(!dateBuffer || salesBuffer < 0 || commissionBuffer > 1 || commissionBuffer < 0){
            isValid = false;
        }
        let dateTokens = hireDate.split('-');
        if (dateTokens.length != 3){
            isValid = false;
        }
        let tokenBuffer = parseInt(dateTokens[0]);
        tokenBuffer = parseInt(dateTokens[1]);
        tokenBuffer = parseInt(dateTokens[2]);
    } catch(error) {
        isValid = false;
    }
    const phoneTokens = phone.split('-');
    if (phoneTokens.length != 3){
        isValid = false;
    }
    else if(phoneTokens[0].length != 3 || phoneTokens[1].length != 3 || phoneTokens[2].length != 4) {
        isValid = false;
    }
    else{
        try{
            let buffer = 0;
            phoneTokens.forEach(token => {
                for(let i = 0; i < token.length; i++){
                    buffer = parseInt(token[i])
                }
            });
        }
        catch(error){
            isValid = false;
        }
    }
    return isValid;
}

async function postData(url, data) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', 
      referrer: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return await response.json();
  }

const saveChanges = async function() {
    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;
    const hireDateTokenBuffer = document.querySelector('#hire-date').value.split('-')
    const hireDateBuffer = JSON.stringify(new Date(hireDateTokenBuffer[2], parseInt(hireDateTokenBuffer[0]) - 1, hireDateTokenBuffer[1])).replace('"', '').replace('"', '');
    const hireDate = `${hireDateBuffer.split('T')[0]} ${hireDateBuffer.split('T')[1].replace('Z', '')}`
    const salesToDate = parseFloat(document.querySelector('#sales').value).toFixed(2);
    const phone = document.querySelector('#phone').value;
    const commission = parseFloat(document.querySelector('#commission').value).toFixed(2);
    const valid = validData(firstName, lastName, hireDate, salesToDate, phone, commission);
    if (valid) {
        try {
            document.querySelector('#success').style.display = 'none';
            document.querySelector('#failure').style.display = 'none';
            const data = await postData('/employees/save', {firstName, lastName, hireDate, salesToDate, phone, commission})
            if(data.status){
                document.querySelector('#success').style.display = 'block'
            }
            else {
                document.querySelector('#failure').style.display = 'block'
            }
        }
        catch (error) {
            console.log('[ERROR]', error);
        }
    }
    else {
        alert('Invalid data entered. Please check fields before trying to submit again.')
    }
}
try{
    const id = parseInt(document.querySelector('#id-buffer').value);
    if (id > 0) {
        document.querySelector('#heading-section h1').innerHTML = 'Edit Customer Info'
        const data = JSON.parse(document.querySelector('#hidden-buffer').value);
        document.querySelector('#first-name').value = data.FirstName;
        document.querySelector('#last-name').value = data.LastName;
        document.querySelector('#hire-date').value = data.HireDate
        document.querySelector('#sales').value = data.SalesToDate.toFied(2)
        document.querySelector('#phone').value = data.Phone;
        document.querySelector('#commision').value = data.hireDate.toFixed(2)
    }
    else {
        document.querySelector('#heading-section h1').innerHTML = 'Create Employee Record'
        document.querySelector('#save-changes').innerHTML = 'Create Record'
    }
}
catch{
    location.href='/employyes'
}
