const validData = function(firstName, lastName, phone) {
    let isValid = true;
    if(firstName.length > 16 || lastName.length > 24 || phone.length > 12){
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
    const phone = document.querySelector('#phone').value;
    const valid = validData(firstName, lastName, phone);
    if (valid) {
        try {
            document.querySelector('#success').style.display = 'none';
            document.querySelector('#failure').style.display = 'none';
            const data = await postData('/customers/save', {firstName, lastName, phone})
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
        document.querySelector('#phone').value = data.Phone;
    }
    else {
        document.querySelector('#heading-section h1').innerHTML = 'Create Customer Record'
        document.querySelector('#save-changes').innerHTML = 'Create Record'
    }
}
catch{
    location.href='/customers'
}
